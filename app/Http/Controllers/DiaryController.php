<?php

namespace App\Http\Controllers;

use App\Http\Resources\Diary\DiaryDetailResource;
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
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DiaryController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $categories = Category::where('user_id', $user->id)->select('id', 'name')->get();
        $emotions = Emotion::where('user_id', $user->id)->select('id', 'name', 'emoji')->get();
        $diaries = Diary::query()->with('categories', 'emotion', 'user', 'files');
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
        $perPage = 1;
        $limit = $perPage;
        if($request->filled('page')) {
            $limit = $perPage * $request->input('page');
        }
        $paginated = $diaries->take($limit)->get();
        $diaries = DiaryListItemResource::collection($paginated);
        return Inertia::render('diary/index', compact('filterSort', 'diaries', 'categories', 'emotions', 'collections'));
    }

    public function create(Request $request)
    {
        $user = Auth::user();
        $categories = Category::where('user_id', $user->id)->orderBy('name')->get();
        $emotions = Emotion::where('user_id', $user->id)->orderBy('name')->get();

        $collection = null;
        if ($request->filled('collection')) {
            $collection = Collection::findOrFail($request->input('collection'));
        }
        return Inertia::render('diary/create', compact('categories', 'emotions', 'collection'));
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $request->validate([
            'emotion' => ['nullable', 'integer'],
            'categories' => ['nullable', 'array'],
            'categories.*' => ['nullable', 'integer'],
            'title' => ['required', 'string', 'max:255'],
            'content' => ['nullable', 'string', 'max:1000'],
            'files' => ['nullable', 'array'],
            'files.*' => ['file', 'mimes:jpg,jpeg,png,pdf', 'max:10240'],
        ]);
        DB::beginTransaction();
        try {
            $diary = Diary::create([
                'user_id' => $user->id,
                'emotion_id' => $request->input('emotion'),
                'title' => $request->input('title'),
                'content' => $request->input('content'),
            ]);
            $diary->categories()->sync($request->input('categories'));
            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $key => $file) {
                    $path = $file->store('diary_files', 'public');
                    $diary->files()->create([
                        'path' => $path,
                        // 'original_name' => $file->getClientOriginalName(),
                        'user_id' => $user->id,
                        'caption' => $request->input('captions')[$key],
                        'type' => explode('/', $file->getMimeType())[0],
                    ]);
                }
            }
            DB::commit();
        } catch (Exception $e) {
            dd($e);
            DB::rollBack();
        }
        return redirect()->route('diaries.index');
    }

    public function edit(Diary $diary)
    {
        $user = Auth::user();
        $categories = Category::where('user_id', $user->id)->orderBy('name')->get();
        $emotions = Emotion::where('user_id', $user->id)->orderBy('name')->get();
        $diary = new DiaryDetailResource($diary);
        return Inertia::render('diary/edit', compact('diary', 'categories', 'emotions'));
    }

    public function show(Diary $diary)
    {
        return Inertia::render('diary/show', [
            'diary' => new DiaryDetailResource($diary)
        ]);
    }

    public function update(Request $request, Diary $diary)
    {
        $user = Auth::user();
        $request->validate([
            'emotion' => ['nullable', 'integer'],
            'categories' => ['nullable', 'array'],
            'categories.*' => ['nullable', 'integer'],
            'title' => ['required', 'string', 'max:255'],
            'content' => ['nullable', 'string', 'max:1000'],
            'files' => ['nullable', 'array'],
            'files.*' => ['file', 'max:10240'],
            'existingFiles' => ['string']
        ]);
        DB::beginTransaction();
        try {
            $existing_files = json_decode($request->existingFiles, true);
            // delete removed old files
            $old_files_to_keep = collect($existing_files)->pluck('id');
            $diary->files()->whereNotIn('id', $old_files_to_keep)->get()->map(function ($file) {
                if (Storage::disk('public')->exists($file->path)) {
                    Storage::disk('public')->delete($file->path);
                    $file->delete();
                }
            });

            // Update old files' caption
            foreach ($existing_files as $key => $file) {
                $diary->files()->where('id', $file['id'])->update([
                    'caption' => $file['caption']
                ]);
            }

            // create new files
            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $key => $file) {
                    $path = $file->store('diary_files', 'public'); // Save to storage/app/public/diary_files
                    $diary->files()->create([
                        'path' => $path,
                        // 'original_name' => $file->getClientOriginalName(),
                        'user_id' => $user->id,
                        'caption' => $request->input('captions')[$key],
                        'type' => explode('/', $file->getMimeType())[0],
                    ]);
                }
            }

            // update categories
            $diary->categories()->sync($request->input('categories'));

            // update emotion, title, content
            $diary->update([
                'emotion_id' => $request->input('emotion'),
                'title' => $request->input('title'),
                'content' => $request->input('content'),
            ]);
            DB::commit();
            return redirect()->route('diaries.show', $diary->id)->with('success', 'Diary is updated successfully.');
        } catch (Exception $e) {
            DB::rollBack();
        }
    }

    public function destroy(Diary $diary)
    {
        DB::beginTransaction();
        $files = [];
        try {
            foreach ($diary->files as $file) {
                $files[] = $file->path;
            }
            $diary->categories()->detach();
            $diary->collections()->detach();
            $diary->sharedItems()->delete();
            $diary->files()->delete();

            $diary->delete();
            DB::commit();
        } catch (\Exception $e) {
            dd($e);
            DB::rollBack();
        }
        foreach ($files as $file) {
            if (Storage::disk('public')->exists($file)) {
                Storage::disk('public')->delete($file);
            }
        }
    }

    public function collections(Diary $diary, Request $request)
    {
        $diary->collections()->sync($request->collections);
        return redirect()->back()->with('success', "Diary's collections updated successfully.");
    }

    public function shares(Diary $diary, Request $request)
    {
        DB::beginTransaction();
        try {
            $diary->sharedItems()->delete();

            foreach ($request->input('receivers') as $receiver) {
                if ($receiver) {
                    $diary->sharedItems()->create([
                        'owner_id' => Auth::user()->id,
                        'receiver_id' => User::where('email', $receiver)->first()?->id ?? null,
                        'email' => $receiver,
                    ]);
                }
            }
            DB::commit();
            return redirect()->back()->with('success', "Diary's shared users updated successfully.");
        } catch (Exception $e) {
            DB::rollBack();
        }
    }
}
