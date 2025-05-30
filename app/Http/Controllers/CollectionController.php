<?php

namespace App\Http\Controllers;

use App\Http\Resources\CollectionResource;
use App\Models\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CollectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $filterSort = [];
        $collections = CollectionResource::collection(Collection::where('user_id', $user->id)->paginate(20));
        
        return Inertia::render('collection/index', compact('collections', 'filterSort'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => ['required', 'string'],
            'description' => ['nullable'],
            'image' => ['nullable', 'image'],
        ]);
        $user = Auth::user();
        DB::beginTransaction();
        try {
            $path = '';
            if($request->hasFile('image')) {
                $path = $request->file('image')->store('collection', 'public');
            }
            $collection = Collection::create([
                'title' => $request->input('title'),
                'cover_image' => $path,
                'user_id' => $user->id,
                'description' => $request->input('description'),
            ]);
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
        }
        return redirect()->back()->with('success', 'Collection (' . $collection->title . ') is created Successfully');
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
