<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $company = $request->user()
            ->company()
            ->withCount('users')
            ->first();

        return Inertia::render('client/dashboard', [
            'company' => $company ? [
                'name'        => $company->name,
                'logo'        => $company->logo,
                'colour'      => $company->colour,
                'users_count' => $company->users_count,
            ] : null,
        ]);
    }
}
