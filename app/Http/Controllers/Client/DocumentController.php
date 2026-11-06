<?php

namespace App\Http\Controllers\Client;

use App\Enums\DocumentSystemVariable;
use App\Http\Controllers\Controller;
use App\Models\DocumentTemplate;
use Inertia\Inertia;
use Inertia\Response;
use App\Enums\DocumentVariable;
use App\Models\Document;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use PhpOffice\PhpWord\Settings;
use PhpOffice\PhpWord\TemplateProcessor;
use Symfony\Component\HttpFoundation\StreamedResponse;
use App\Services\DocumentPdfConverter;

class DocumentController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('client/documents/index', [
            'documents' => Document::with('template')->latest()->get(),
        ]);
    }

    public function download(Document $document): StreamedResponse
    {
        return Storage::download(
            $document->file_path,
            Str::slug($document->title) . '.docx',
        );
    }

    public function preview(Document $document, DocumentPdfConverter $converter): StreamedResponse
    {
        return Storage::response(
            $converter->pathFor($document),
            Str::slug($document->title) . '.pdf',
        );
    }

    public function create(DocumentTemplate $documentTemplate): Response
    {
        $documentTemplate->load('variables');

        $documentTemplate->setRelation(
            'variables',
            $documentTemplate->variables
                ->reject(fn ($variable) => DocumentSystemVariable::tryFrom($variable->placeholder)?->isAutoFilled())
                ->values(),
        );

        return Inertia::render('client/documents/create', [
            'template' => $documentTemplate,
        ]);
    }

    public function store(Request $request, DocumentTemplate $documentTemplate): RedirectResponse
    {
        $variables = $documentTemplate->variables;

        $rules = ['title' => ['required', 'string', 'max:255']];
        $attributes = [];

        foreach ($variables as $variable) {
            if (DocumentSystemVariable::tryFrom($variable->placeholder)?->isAutoFilled()) {
                continue;
            }

            $key = "values.{$variable->id}";

            $rules[$key] = [
                $variable->is_required ? 'required' : 'nullable',
                ...$variable->data_type->rules(),
            ];

            $attributes[$key] = $variable->title;
        }

        $validated = $request->validate($rules, [], $attributes);

        Settings::setOutputEscapingEnabled(true);
        $processor = new TemplateProcessor(Storage::path($documentTemplate->file_path));

        $values = [];
        $columns = [];

        foreach ($variables as $variable) {
            $system = DocumentSystemVariable::tryFrom($variable->placeholder);

            $value = match ($system) {
                DocumentSystemVariable::Today => now()->toDateString(),
                DocumentSystemVariable::CreatedBy => $request->user()->name,
                default => $validated['values'][$variable->id] ?? '',
            };

            $values[$variable->placeholder] = $value;

            if (in_array($system, [DocumentSystemVariable::ExpiryDate, DocumentSystemVariable::ReviewDate], true)) {
                $columns[$system->value] = $value !== '' ? $value : null;
            }

            if ($variable->data_type->isDate() && $value !== '') {
                $value = Carbon::parse($value)->format('d/m/Y');
            }

            $processor->setValue($variable->placeholder, $value);
        }

        Storage::makeDirectory('documents');
        $path = 'documents/' . Str::uuid() . '.docx';
        $processor->saveAs(Storage::path($path));

        Document::create([
            'document_template_id' => $documentTemplate->id,
            'user_id' => $request->user()->id,
            'title' => $validated['title'],
            'values' => $values,
            'file_path' => $path,
            ...$columns,
        ]);

        return redirect()
            ->route('client.documents.index')
            ->with('success', 'Document created.');
    }}
