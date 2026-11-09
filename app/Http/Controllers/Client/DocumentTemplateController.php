<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\DocumentTemplate;
use App\Enums\DocumentSystemVariable;
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
use Illuminate\Support\Facades\Gate;

class DocumentTemplateController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', DocumentTemplate::class);

        return Inertia::render('client/templates/index', [
            'templates' => DocumentTemplate::withCount('variables')->latest()->get(),
            'documentTypes' => DocumentType::options(),
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', DocumentTemplate::class);

        return Inertia::render('client/templates/create', [
            'documentTypes' => DocumentType::options(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('create', DocumentTemplate::class);

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
            $system = DocumentSystemVariable::tryFrom($placeholder);

            $template->variables()->create([
                'placeholder' => $placeholder,
                'title' => $system?->label() ?? $placeholder,
                'description' => $system?->description(),
                'data_type' => $system?->dataType()->value ?? DocumentVariable::Text->value,
                'is_required' => $system ? ! $system->isAutoFilled() : true,
            ]);
        }

        return redirect()
            ->route('client.templates.edit', $template)
            ->with('success', 'Template uploaded. Now check each variable below.');
    }

    public function edit(DocumentTemplate $documentTemplate): Response
    {
        Gate::authorize('update', $documentTemplate);

        return Inertia::render('client/templates/edit', [
            'template' => $documentTemplate->load('variables'),
            'dataTypes' => DocumentVariable::options(),
        ]);
    }

    public function update(Request $request, DocumentTemplate $documentTemplate): RedirectResponse
    {
        Gate::authorize('update', $documentTemplate);

        $validated = $request->validate([
            'variables' => ['required', 'array'],
            'variables.*.id' => ['required', 'integer'],
            'variables.*.title' => ['required', 'string', 'max:255'],
            'variables.*.description' => ['nullable', 'string'],
            'variables.*.data_type' => ['required', Rule::enum(DocumentVariable::class)],
            'variables.*.is_required' => ['required', 'boolean'],
        ]);

        foreach ($validated['variables'] as $item) {
            $variable = $documentTemplate->variables()->find($item['id']);

            if (! $variable) {
                continue;
            }

            $system = DocumentSystemVariable::tryFrom($variable->placeholder);

            $variable->update([
                'title' => $item['title'],
                'description' => $item['description'] ?? null,
                'data_type' => $system ? $system->dataType()->value : $item['data_type'],
                'is_required' => $system ? ! $system->isAutoFilled() : $item['is_required'],
            ]);
        }

        return redirect()
            ->route('client.templates.index')
            ->with('success', 'Template updated.');
    }

    public function destroy(DocumentTemplate $documentTemplate): RedirectResponse
    {
        Gate::authorize('delete', $documentTemplate);

        $documentTemplate->delete();

        return redirect()
            ->route('client.templates.index')
            ->with('success', 'Template deleted.');
    }

    public function download(DocumentTemplate $documentTemplate): StreamedResponse
    {
        Gate::authorize('view', $documentTemplate);

        return Storage::download(
            $documentTemplate->file_path,
            $documentTemplate->original_filename,
        );
    }
}
