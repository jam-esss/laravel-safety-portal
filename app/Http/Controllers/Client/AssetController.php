<?php

namespace App\Http\Controllers\Client;

use App\Enums\AssetStatus;
use App\Enums\AssetType;
use App\Http\Controllers\Controller;
use App\Models\Asset;
use App\Models\Company;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AssetController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', Asset::class);

        return Inertia::render('client/assets/index', [
            'assets' => Asset::register()->with('company:id,name')->latest()->get(),
        ]);
    }

    public function create(Request $request): Response
    {
        Gate::authorize('create', Asset::class);

        return Inertia::render('client/assets/create', [
            'statuses' => $this->options(AssetStatus::class),
            'types' => $this->options(AssetType::class),
            'defaultType' => AssetType::tryFrom($request->string('asset_type')->toString())?->value,
            'companies' => $request->user()->office_user
                ? Company::orderBy('name')->get(['id', 'name'])
                : null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('create', Asset::class);

        $asset = Asset::create($request->validate($this->rules($request)));

        return $this->redirectToList($asset, 'Asset created.');
    }

    public function edit(Asset $asset): Response
    {
        Gate::authorize('update', $asset);

        return Inertia::render('client/assets/edit', [
            'asset' => $asset,
            'statuses' => $this->options(AssetStatus::class),
            'types' => $this->options(AssetType::class),
        ]);
    }

    public function update(Request $request, Asset $asset): RedirectResponse
    {
        Gate::authorize('update', $asset);

        $asset->update($request->validate($this->rules($request, $asset)));

        return $this->redirectToList($asset, 'Asset updated.');
    }

    public function destroy(Asset $asset): RedirectResponse
    {
        Gate::authorize('delete', $asset);

        $asset->delete();

        return back()->with('success', 'Asset deleted.');
    }

    private function rules(Request $request, ?Asset $asset = null): array
    {
        $user = $request->user();

        $companyId = $asset
            ? $asset->company_id
            : ($user->office_user ? $request->input('company_id') : $user->company_id);

        $rules = [
            'asset_type' => ['required', Rule::enum(AssetType::class)],
            'make' => ['required', 'string', 'max:255'],
            'model' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'asset_tag' => [
                'required',
                'string',
                'max:255',
                Rule::unique('assets', 'asset_tag')
                    ->where('company_id', $companyId)
                    ->whereNull('deleted_at')
                    ->ignore($asset?->id),
            ],
            'serial_number' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::enum(AssetStatus::class)],
            'purchase_date' => ['nullable', 'date'],
            'purchase_price' => ['nullable', 'numeric', 'min:0'],
            'location' => ['nullable', 'string', 'max:255'],
        ];

        if (! $asset && $user->office_user) {
            $rules['company_id'] = ['required', 'exists:companies,id'];
        }

        return $rules;
    }

    private function options(string $enum): array
    {
        return collect($enum::cases())->map(fn ($case) => [
            'value' => $case->value,
            'label' => $case->label(),
        ])->all();
    }

    private function redirectToList(Asset $asset, string $message): RedirectResponse
    {
        return redirect()
            ->route($asset->asset_type->isFleet() ? 'client.fleet.index' : 'client.assets.index')
            ->with('success', $message);
    }
}
