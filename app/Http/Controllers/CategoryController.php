<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $categories = $user->categories;
        return Inertia::render('categories', compact('categories'));
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
            'categories' => ['array'],
            'categories.*' => ['nullable', 'string', 'min:4']
        ]);

        foreach($request->categories as $category) {
            Category::create([
                'name' => $category,
                'user_id' => Auth()->user()->id
            ]);
        }
        return redirect()->route('categories.index')->with('success', 'Categories (' . implode(', ',$request->categories) . ') created successfully!');
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
    public function update(Request $request, Category $category)
    {
        $old_name = $category->name;
        $category->update(['name' => $request->name]);   
        return redirect()->route('categories.index')->with('success', 'Category(' . $old_name . ') is changed to (' . $category->name . ') successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        $category->delete();
        return redirect()->route('categories.index')->with('success', 'Category(' . $category->name . ') is deleted successfully!');
    }
}
