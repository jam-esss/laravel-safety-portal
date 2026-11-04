<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\DocumentTemplate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use PhpOffice\PhpWord\TemplateProcessor;
use App\Enums\DocumentType;
use App\Enums\DocumentVariable;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DocumentTemplateController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('client/templates/index', [
            'templates' => DocumentTemplate::withCount('variables')->latest()->get(),
            'documentTypes' => DocumentType::options(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('client/templates/create', [
            'documentTypes' => DocumentType::options(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'document_type' => ['required', Rule::enum(DocumentType::class)],
            'file' => ['required', 'file', 'mimes:docx', 'max:10240'],
        ]);

        $file = $request->file('file');
        $path = $file->store('templates');

        $processor = new TemplateProcessor(Storage::path($path));
        $placeholders = array_unique($processor->getVariables());

        $template = DocumentTemplate::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'document_type' => $validated['document_type'],
            'file_path' => $path,
            'original_filename' => $file->getClientOriginalName(),
        ]);

        foreach ($placeholders as $placeholder) {
            $template->variables()->create([
                'placeholder' => $placeholder,
                'title' => $placeholder,
                'data_type' => 'text',
                'is_required' => true,
            ]);
        }

        return redirect()
            ->route('client.templates.edit', $template)
            ->with('success', 'Template uploaded. Now check each variable below.');
    }

    public function edit(DocumentTemplate $documentTemplate): Response
    {
        return Inertia::render('client/templates/edit', [
            'template' => $documentTemplate->load('variables'),
            'dataTypes' => DocumentVariable::options(),
        ]);
    }

    public function update(Request $request, DocumentTemplate $documentTemplate): RedirectResponse
    {
        $validated = $request->validate([
            'variables' => ['required', 'array'],
            'variables.*.id' => ['required', 'integer'],
            'variables.*.title' => ['required', 'string', 'max:255'],
            'variables.*.description' => ['nullable', 'string'],
            'variables.*.data_type' => ['required', Rule::enum(DocumentVariable::class)],
            'variables.*.is_required' => ['required', 'boolean'],
        ]);

        foreach ($validated['variables'] as $item) {
            $documentTemplate->variables()
                ->where('id', $item['id'])
                ->update([
                    'title' => $item['title'],
                    'description' => $item['description'] ?? null,
                    'data_type' => $item['data_type'],
                    'is_required' => $item['is_required'],
                ]);
        }

        return redirect()
            ->route('client.templates.index')
            ->with('success', 'Template updated.');
    }

    public function destroy(DocumentTemplate $documentTemplate): RedirectResponse
    {
        $documentTemplate->delete();

        return redirect()
            ->route('client.templates.index')
            ->with('success', 'Template deleted.');
    }

    public function download(DocumentTemplate $documentTemplate): StreamedResponse
    {
        return Storage::download(
            $documentTemplate->file_path,
            $documentTemplate->original_filename,
        );
    }
}
