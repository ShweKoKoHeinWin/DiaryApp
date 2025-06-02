<?php

namespace App\Http\Controllers;

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
        $filterSort = ['filters' => [], 'sorting' => []];
        if ($request->filled('startDate') && $request->filled('endDate')) {
            $start = Carbon::parse($request->input('startDate'))->startOfDay();
            $end = Carbon::parse($request->input('endDate'))->endOfDay();
            $diaries->whereBetween('diaries.created_at', [$start, $end]);
            $filterSort['filters']['startDate'] = $request->input('startDate');
            $filterSort['filters']['endDate'] = $request->input('endDate');
        } else if ($request->filled('startDate')) {
            $start = Carbon::parse($request->input('startDate'))->startOfDay();
            $diaries->where('diaries.created_at', '>=', $start);
            $filterSort['filters']['startDate'] = $request->input('startDate');
        } else if ($request->filled('endDate')) {
            $end = Carbon::parse($request->input('endDate'))->endOfDay();
            $diaries->where('diaries.created_at', '<=', $end);
            $filterSort['filters']['endDate'] = $request->input('endDate');
        }


        if ($request->filled('emotion') && $request->input('emotion') != 0) {
            $diaries->where('emotion_id', $request->input('emotion'));
            $filterSort['filters']['emotion'] = $request->input('emotion');
        }

        if ($request->filled('categories')) {
            $diaries->whereHas('categories', function ($q) use ($request) {
                $q->whereIn('categories.id', $request->input("categories"));
            });
            $filterSort['filters']['categories'] = $request->input('categories');
        }
        if ($request->filled('query')) {
            $diaries->where('title', 'LIKE', '%' . $request->input('query') . '%');
            $filterSort['filters']['query'] = $request->input('query');
        }

        switch ($request->input('sortBy', 'date')) {
            case 'date':
                $diaries->orderBy('created_at', $request->input('sortOrder', 'desc'));
                $filterSort['sorting']['type'] = 'date';
                $filterSort['sorting']['order'] = $request->input('sortOrder', 'desc');
                break;

            case 'title':
                $diaries->orderBy('title', $request->input('sortOrder', 'asc'));
                $filterSort['sorting']['type'] = 'title';
                $filterSort['sorting']['order'] = $request->input('sortOrder', 'asc');
                break;

            case 'category':
                $diaries->select('diaries.*')
                    ->leftJoin('diary_category', 'diaries.id', '=', 'diary_category.diary_id')
                    ->leftJoin('categories', 'categories.id', '=', 'diary_category.category_id')
                    ->orderBy('categories.name', $request->input('sortOrder', 'asc'));
                $filterSort['sorting']['type'] = 'category';
                $filterSort['sorting']['order'] = $request->input('sortOrder', 'asc');
                break;

            default:
                # code...
                break;
        }
        $collection = new CollectionResource($collection);
        $page = $request->input('page', 1);
        $paginated = $diaries->paginate(10, ['*'], 'page', $page);
        $diaries = DiaryListItemResource::collection($paginated);

        if ($request->expectsJson()) {
            return DiaryListItemResource::collection($paginated)->response();
        }
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

    public function shares(Collection $collection, Request $request)
    {
        DB::beginTransaction();
        try {
            $collection->sharedItems()->delete();

            foreach ($request->input('receivers') as $receiver) {
                if ($receiver) {
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
