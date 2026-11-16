<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Asset;
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
}
