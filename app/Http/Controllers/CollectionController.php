<?php

namespace App\Http\Controllers;

use App\Filter\FilterService;
use App\Http\Resources\Collection\CollectionResource;
use App\Http\Resources\Diary\DiaryListItemResource;
use App\Models\Category;
use App\Models\Collection;
use App\Models\Diary;
use App\Models\Emotion;
use App\Models\User;
use App\Permissions\CollectionPermission;
use App\Permissions\DiaryPermission;
use App\Permissions\SelectModePermission;
use App\Services\BreadcrumbService;
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
        $collections = Collection::where('user_id', $user->id)->with('user');
        [$collections, $filterSort] = FilterService::getCollectionsByFilter($request, $collections);

        $breadcrumbItems = [];

        $breadcrumbs = BreadcrumbService::collection('list');

        $permissions = [CollectionPermission::edit->value, CollectionPermission::delete->value, CollectionPermission::share->value, SelectModePermission::share->value];

        $collections = CollectionResource::collection($collections);
        return Inertia::render('collection/index', compact('collections', 'filterSort', 'breadcrumbs', 'permissions'));
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
        $data = $request->input('data', []);
        $from = $request->input('from', '') ?? '';
        $permissions = [];
        if ($collection->user_id === $user->id) {
            $permissions = [...DiaryPermission::all(), ...SelectModePermission::all(), ...CollectionPermission::all()];
        }
        [$breadcrumbs, $back] = BreadcrumbService::collection('show', $from, [...$data, 'collection' => $collection]);

        return Inertia::render('collection/show', compact('filterSort', 'diaries', 'collection', 'collections', 'emotions', 'categories', 'breadcrumbs', 'back', 'from', 'permissions', 'data'));
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
    public function destroy(Collection $collection, Request $request)
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

        if ($request->input('back', null)) return redirect($request->input('back', '/collections'))->with('success', 'Collection deleted successfully.');

        return smartRedirectAfterDelete(route('collections.show', $collection->id, false), 'Collection deleted successfully.', route('collections.index'));
    }

    // @ 
    public function shares(Collection $collection, Request $request)
    {
        DB::beginTransaction();
        $user = Auth::user();
        try {
            $collection->sharedItems()->whereNotIn('email', $request->input('receivers', []))->delete();

            foreach ($request->input('receivers') as $receiver) {
                if ($receiver) {
                    // if user sent to himself skip
                    if ($receiver === $user->email) continue;
                    // if item is shared to received user skip
                    if ($collection->sharedItems()->where('email', $receiver)->where('owner_id', $user->id)->exists()) continue;
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
            dd($e);
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
        // if empty collection go back
        if (empty(array_filter($request->input('collections')))) {
            return redirect()->back()->with('error', 'No Collections to add.');
        }
        $user = Auth::user();
        // get exist diary ids that user select
        $diaryIdsToAdd = Diary::where('user_id', $user->id)
            ->whereIn('id', $request->input('diaries'))
            ->pluck('id')
            ->toArray();
        // get collection exit that user select
        $collections = Collection::where('user_id', $user->id)
            ->whereIn('id', array_filter($request->input('collections')))
            ->get();

        // add selected diaries to selection collections
        foreach ($collections as $collection) {
            $collection->diaries()->syncWithoutDetaching($diaryIdsToAdd);
        }

        return redirect()->back()->with('success', 'Diaris are added successfully.');
    }
}
