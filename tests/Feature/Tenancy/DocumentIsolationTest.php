<?php

use App\Enums\DocumentType;
use App\Models\Company;
use App\Models\Document;
use App\Models\DocumentTemplate;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    Storage::fake();
});

function makeDocument(Company $company, string $title, string $name): Document
{
    $template = (new DocumentTemplate)->forceFill([
        'company_id' => $company->id,
        'name' => "{$title} template",
        'document_type' => DocumentType::Other,
        'file_path' => "templates/{$name}.docx",
        'original_filename' => "{$name}.docx",
    ]);
    $template->save();

    $document = (new Document)->forceFill([
        'company_id' => $company->id,
        'document_template_id' => $template->id,
        'title' => $title,
        'values' => [],
        'file_path' => "documents/{$name}.docx",
    ]);
    $document->save();

    Storage::put("documents/{$name}.docx", 'fake docx contents');

    return $document;
}

test('document list only shows the users own company', function () {
    $companyA = Company::create(['name' => 'Company A']);
    $companyB = Company::create(['name' => 'Company B']);

    makeDocument($companyA, 'Doc A', 'doc-a');
    makeDocument($companyB, 'Doc B', 'doc-b');

    $user = User::factory()->create(['company_id' => $companyA->id]);

    $this->actingAs($user)
        ->get(route('client.documents.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('client/documents/index')
            ->has('documents', 1)
            ->where('documents.0.title', 'Doc A'),
        );
});

test('a user can download their own companys document', function () {
    $company = Company::create(['name' => 'Company A']);
    $document = makeDocument($company, 'Doc A', 'doc-a');

    $user = User::factory()->create(['company_id' => $company->id]);

    $this->actingAs($user)
        ->get(route('client.documents.download', $document))
        ->assertOk()
        ->assertDownload('doc-a.docx');
});

test('a user cannot download another companys document', function () {
    $companyA = Company::create(['name' => 'Company A']);
    $companyB = Company::create(['name' => 'Company B']);
    $otherDocument = makeDocument($companyB, 'Doc B', 'doc-b');

    $user = User::factory()->create(['company_id' => $companyA->id]);

    $this->actingAs($user)
        ->get(route('client.documents.download', $otherDocument))
        ->assertNotFound();
});

test('a user can preview their own companys document', function () {
    $company = Company::create(['name' => 'Company A']);
    $document = makeDocument($company, 'Doc A', 'doc-a');

    // Pre-place the cached PDF so the converter returns it
    // instead of launching LibreOffice.
    Storage::put('pdf-cache/doc-a.pdf', 'fake pdf contents');

    $user = User::factory()->create(['company_id' => $company->id]);

    $this->actingAs($user)
        ->get(route('client.documents.preview', $document))
        ->assertOk();
});

test('a user cannot preview another companys document', function () {
    $companyA = Company::create(['name' => 'Company A']);
    $companyB = Company::create(['name' => 'Company B']);
    $otherDocument = makeDocument($companyB, 'Doc B', 'doc-b');

    $user = User::factory()->create(['company_id' => $companyA->id]);

    $this->actingAs($user)
        ->get(route('client.documents.preview', $otherDocument))
        ->assertNotFound();
});
