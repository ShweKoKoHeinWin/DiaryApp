<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index() {
        return Inertia::render('home');
    }

    public function calendar() {
        return Inertia::render('calendar');
    }
}
