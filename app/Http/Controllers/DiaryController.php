<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DiaryController extends Controller
{
    public function index() {
        return Inertia::render('diary/index');
    }

    public function create() {
        return Inertia::render('diary/create');
    }

    public function store(Request $request) {

    }

    public function edit() {

    }

    public function update(Request $request) {

    }

    public function destroy() {
        
    }
}
