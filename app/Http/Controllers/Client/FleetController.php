<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Asset;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class FleetController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', Asset::class);

        return Inertia::render('client/fleet/index', [
            'vehicles' => Asset::fleet()->with('company:id,name')->latest()->get(),
        ]);
    }
}
