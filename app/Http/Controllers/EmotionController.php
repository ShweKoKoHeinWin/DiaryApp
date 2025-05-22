<?php

namespace App\Http\Controllers;

use App\Models\Emotion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EmotionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $emotions = $user->emotions;
        return Inertia::render('emotions', compact('emotions'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'emoji' => 'required',
        ]);
        $emotion = Emotion::create(['name' => $request->name, 'emoji' => $request->emoji, 'user_id' => Auth::user()->id]);
        return redirect()->route('emotions.index')->with('success', 'Emotion (' . $emotion->name . ') is created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Emotion $emotion)
    {
        $request->validate([
            'name' => 'required',
            'emoji' => 'required',
        ]);
        $emotion->update(['name' => $request->name, 'emoji' => $request->emoji]);
        return redirect()->route('emotions.index')->with('success', 'Emotion is updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Emotion $emotion)
    {
        $emotion->delete();
        return redirect()->route('emotions.index')->with('success', 'Emotion (' . $emotion->name . ') is deleted successfully.');
    }
}
