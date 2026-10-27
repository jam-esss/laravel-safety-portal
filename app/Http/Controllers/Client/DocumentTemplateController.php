<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DocumentTemplateController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('client/documents/index');
    }

    public function create(): Response
    {
        return Inertia::render('client/documents/create');
    }
}
