<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Asset;
use Inertia\Inertia;
use Inertia\Response;

class FleetController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('client/fleet/index', [
            'vehicles' => Asset::fleet()->with('company:id,name')->latest()->get(),
        ]);
    }
}
