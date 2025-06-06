<?php

namespace App\Http\Controllers;

use App\Filter\FilterService;
use App\Http\Resources\CollectionResource;
use App\Http\Resources\Diary\DiaryListItemResource;
use App\Models\Category;
use App\Models\Collection;
use App\Models\Diary;
use App\Models\Emotion;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CollectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $collections = Collection::where('user_id', $user->id);
        [$collections, $filterSort] = FilterService::getCollectionsByFilter($request, $collections);

        $collections = CollectionResource::collection($collections);
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
            if ($request->hasFile('image')) {
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
    public function show(Collection $collection, Request $request)
    {
        $user = Auth::user();
        $diaries = $collection->diaries()->with('categories', 'emotion', 'user', 'files');
        $categories = Category::where('user_id', $user->id)->select('id', 'name')->get();
        $emotions = Emotion::where('user_id', $user->id)->select('id', 'name', 'emoji')->get();
        $collections = Collection::where('user_id', $user->id)->select('id', 'title')->latest()->get();

        [$diaries, $filterSort] = FilterService::getDiariesByFilter($request, $diaries);
        $diaries = DiaryListItemResource::collection($diaries);
        $collection = new CollectionResource($collection);
        // if ($request->expectsJson()) {
        //     return DiaryListItemResource::collection($paginated)->response();
        // }
        return Inertia::render('collection/show', compact('filterSort', 'diaries', 'collection', 'collections', 'emotions', 'categories'));
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
    public function update(Request $request, Collection $collection)
    {
        $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string'
        ]);
        $collection->update([
            'title' => $request->input('title'),
            'description' => $request->input('description')
        ]);
        return redirect()->back()->with('success', 'Collection is updated Successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Collection $collection)
    {
        DB::beginTransaction();
        try {
            $collection->diaries()->detach();
            $collection->sharedItems()->delete();
            $collection->delete();
            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Something went wrong.');
        }

        return smartRedirectAfterDelete(route('collections.show', $collection->id, false), 'Collection deleted successfully.', 'collections.index');
    }

    // @ 
    public function shares(Collection $collection, Request $request)
    {
        DB::beginTransaction();
        $user = Auth::user();
        try {
            $collection->sharedItems()->delete();

            foreach ($request->input('receivers') as $receiver) {
                if ($receiver) {
                    if($receiver === $user->email) continue;
                    $collection->sharedItems()->create([
                        'owner_id' => Auth::user()->id,
                        'receiver_id' => User::where('email', $receiver)->first()?->id ?? null,
                        'email' => $receiver,
                    ]);
                }
            }
            DB::commit();
            return redirect()->back()->with('success', "Collection's shared users updated successfully.");
        } catch (Exception $e) {
            DB::rollBack();
        }
    }

    public function removeDiaries(Request $request, Collection $collection)
    {
        foreach ($request->input('diaries', []) as $diary) {
            $collection->diaries()->detach($diary);
        }
        return redirect()->back()->with('success', 'Diaris are removed successfully.');
    }

    public function addDiaries(Request $request)
    {
        $request->validate([
            'collections' => ['required', 'array'],
            'collections.*' => ['nullable', 'integer'],
            'diaries' => ['required', 'array'],
            'diaries.*' => ['required', 'integer'],
        ]);
        if (empty(array_filter($request->collections))) {
            return redirect()->back()->with('error', 'No Collections to add.');
        }
        $user = Auth::user();
        $diaryIdsToAdd = Diary::where('user_id', $user->id)
            ->whereIn('id', $request->diaries)
            ->pluck('id')
            ->toArray();

        $collections = Collection::where('user_id', $user->id)
            ->whereIn('id', array_filter($request->collections))
            ->get();

        foreach ($collections as $collection) {
            $collection->diaries()->syncWithoutDetaching($diaryIdsToAdd);
        }

        return redirect()->back()->with('success', 'Diaris are added successfully.');
    }
}
