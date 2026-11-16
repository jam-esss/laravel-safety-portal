<?php

namespace App\Http\Controllers\Client;

use App\Enums\AssetStatus;
use App\Http\Controllers\Controller;
use App\Models\Asset;
use App\Models\Company;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AssetController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('client/assets/index', [
            'assets' => Asset::with('company:id,name')->latest()->get(),
        ]);
    }

    public function create(Request $request): Response
    {
        return Inertia::render('client/assets/create', [
            'statuses' => collect(AssetStatus::cases())->map(fn ($status) => [
                'value' => $status->value,
                'label' => $status->label(),
            ]),
            'companies' => $request->user()->office_user
                ? Company::orderBy('name')->get(['id', 'name'])
                : null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        $companyId = $user->office_user
            ? $request->input('company_id')
            : $user->company_id;

        $rules = [
            'make' => ['required', 'string', 'max:255'],
            'model' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'asset_tag' => [
                'required',
                'string',
                'max:255',
                Rule::unique('assets', 'asset_tag')->where('company_id', $companyId),
            ],
            'serial_number' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::enum(AssetStatus::class)],
            'purchase_date' => ['nullable', 'date'],
            'purchase_price' => ['nullable', 'numeric', 'min:0'],
            'location' => ['nullable', 'string', 'max:255'],
        ];

        if ($user->office_user) {
            $rules['company_id'] = ['required', 'exists:companies,id'];
        }

        Asset::create($request->validate($rules));

        return redirect()
            ->route('client.assets.index')
            ->with('success', 'Asset created.');
    }
}
