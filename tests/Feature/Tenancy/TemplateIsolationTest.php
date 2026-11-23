<?php

use App\Enums\DocumentType;
use App\Enums\UserRole;
use App\Models\Company;
use App\Models\DocumentTemplate;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    Storage::fake();
});

function makeTemplate(Company $company, string $name, string $file): DocumentTemplate
{
    $template = (new DocumentTemplate)->forceFill([
        'company_id' => $company->id,
        'name' => $name,
        'document_type' => DocumentType::Other,
        'file_path' => "templates/{$file}.docx",
        'original_filename' => "{$file}.docx",
    ]);
    $template->save();

    Storage::put("templates/{$file}.docx", 'fake docx contents');

    return $template;
}

test('template list only shows the users own company', function () {
    $companyA = Company::create(['name' => 'Company A']);
    $companyB = Company::create(['name' => 'Company B']);

    makeTemplate($companyA, 'Template A', 'template-a');
    makeTemplate($companyB, 'Template B', 'template-b');

    $user = User::factory()->create([
        'company_id' => $companyA->id,
        'role' => UserRole::Owner,
    ]);

    $this->actingAs($user)
        ->get(route('client.templates.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('client/templates/index')
            ->has('templates', 1)
            ->where('templates.0.name', 'Template A'),
        );
});

test('a user can download their own companys template', function () {
    $company = Company::create(['name' => 'Company A']);
    $template = makeTemplate($company, 'Template A', 'template-a');

    $user = User::factory()->create([
        'company_id' => $company->id,
        'role' => UserRole::Owner,
    ]);

    $this->actingAs($user)
        ->get(route('client.templates.download', $template))
        ->assertOk()
        ->assertDownload('template-a.docx');
});

test('a user cannot download another companys template', function () {
    $companyA = Company::create(['name' => 'Company A']);
    $companyB = Company::create(['name' => 'Company B']);
    $otherTemplate = makeTemplate($companyB, 'Template B', 'template-b');

    $user = User::factory()->create([
        'company_id' => $companyA->id,
        'role' => UserRole::Owner,
    ]);

    $this->actingAs($user)
        ->get(route('client.templates.download', $otherTemplate))
        ->assertNotFound();
});

test('a user can open the edit page for their own companys template', function () {
    $company = Company::create(['name' => 'Company A']);
    $template = makeTemplate($company, 'Template A', 'template-a');

    $user = User::factory()->create([
        'company_id' => $company->id,
        'role' => UserRole::Owner,
    ]);

    $this->actingAs($user)
        ->get(route('client.templates.edit', $template))
        ->assertOk();
});

test('a user cannot open the edit page for another companys template', function () {
    $companyA = Company::create(['name' => 'Company A']);
    $companyB = Company::create(['name' => 'Company B']);
    $otherTemplate = makeTemplate($companyB, 'Template B', 'template-b');

    $user = User::factory()->create([
        'company_id' => $companyA->id,
        'role' => UserRole::Owner,
    ]);

    $this->actingAs($user)
        ->get(route('client.templates.edit', $otherTemplate))
        ->assertNotFound();
});

test('a user cannot delete another companys template', function () {
    $companyA = Company::create(['name' => 'Company A']);
    $companyB = Company::create(['name' => 'Company B']);
    $otherTemplate = makeTemplate($companyB, 'Template B', 'template-b');

    $user = User::factory()->create([
        'company_id' => $companyA->id,
        'role' => UserRole::Owner,
    ]);

    $this->actingAs($user)
        ->delete(route('client.templates.destroy', $otherTemplate))
        ->assertNotFound();

    expect(DocumentTemplate::withoutGlobalScopes()->find($otherTemplate->id))
        ->not->toBeNull()
        ->and(DocumentTemplate::withoutGlobalScopes()->find($otherTemplate->id)->deleted_at)
        ->toBeNull();
});
