<?php

use App\Enums\AssetStatus;
use App\Enums\AssetType;
use App\Enums\UserRole;
use App\Models\Asset;
use App\Models\Company;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

function makeAsset(Company $company, string $tag): Asset
{
    return Asset::create([
        'company_id' => $company->id,
        'asset_type' => AssetType::Other,
        'make' => 'Makita',
        'model' => 'DHP484',
        'asset_tag' => $tag,
        'status' => AssetStatus::Active,
    ]);
}

test('asset list only shows the users own company', function () {
    $companyA = Company::create(['name' => 'Company A']);
    $companyB = Company::create(['name' => 'Company B']);

    makeAsset($companyA, 'A-001');
    makeAsset($companyB, 'B-001');

    $user = User::factory()->create([
        'company_id' => $companyA->id,
        'role' => UserRole::Owner,
    ]);

    $this->actingAs($user)
        ->get(route('client.assets.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('client/assets/index')
            ->has('assets', 1)
            ->where('assets.0.asset_tag', 'A-001'),
        );
});

test('a user can open the edit page for their own asset', function () {
    $company = Company::create(['name' => 'Company A']);
    $asset = makeAsset($company, 'A-001');

    $user = User::factory()->create([
        'company_id' => $company->id,
        'role' => UserRole::Owner,
    ]);

    $this->actingAs($user)
        ->get(route('client.assets.edit', $asset))
        ->assertOk();
});

test('a user cannot open the edit page for another companys asset', function () {
    $companyA = Company::create(['name' => 'Company A']);
    $companyB = Company::create(['name' => 'Company B']);
    $otherAsset = makeAsset($companyB, 'B-001');

    $user = User::factory()->create([
        'company_id' => $companyA->id,
        'role' => UserRole::Owner,
    ]);

    $this->actingAs($user)
        ->get(route('client.assets.edit', $otherAsset))
        ->assertNotFound();
});
