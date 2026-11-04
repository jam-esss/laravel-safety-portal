<?php

namespace App\Http\Controllers\Client;

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
        return Inertia::render('client/documents/create', [
            'template' => $documentTemplate->load('variables'),
        ]);
    }

    public function store(Request $request, DocumentTemplate $documentTemplate): RedirectResponse
    {
        $variables = $documentTemplate->variables;

        $rules = ['title' => ['required', 'string', 'max:255']];
        $attributes = [];

        foreach ($variables as $variable) {
            $key = "values.{$variable->id}";

            $rules[$key] = [
                $variable->is_required ? 'required' : 'nullable',
                match ($variable->data_type) {
                    DocumentVariable::Number => 'numeric',
                    DocumentVariable::Date => 'date',
                    default => 'string',
                },
            ];

            $attributes[$key] = $variable->title;
        }

        $validated = $request->validate($rules, [], $attributes);

        Settings::setOutputEscapingEnabled(true);
        $processor = new TemplateProcessor(Storage::path($documentTemplate->file_path));

        $values = [];

        foreach ($variables as $variable) {
            $value = $validated['values'][$variable->id] ?? '';

            $values[$variable->placeholder] = $value;

            if ($variable->data_type === DocumentVariable::Date && $value !== '') {
                $value = Carbon::parse($value)->format('d/m/Y');
            }

            $processor->setValue($variable->placeholder, $value);
        }

        Storage::makeDirectory('documents');
        $path = 'documents/' . Str::uuid() . '.docx';
        $processor->saveAs(Storage::path($path));

        Document::create([
            'document_template_id' => $documentTemplate->id,
            'title' => $validated['title'],
            'values' => $values,
            'file_path' => $path,
        ]);

        return redirect()
            ->route('client.documents.index')
            ->with('success', 'Document created.');
    }
}
