<?php

namespace App\Http\Controllers;

use App\Filter\DiaryFilter;
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
        [$diaries, $filterSort] = DiaryFilter::getDiariesByFilter($request, $diaries);

        // if ($request->expectsJson()) {
        //     return DiaryListItemResource::collection($paginated)->response();
        // }

        return Inertia::render('diary/index', compact('filterSort', 'diaries', 'categories', 'emotions', 'collections'));
    }

    public function create(Request $request)
    {
        $user = Auth::user();
        $categories = Category::where('user_id', $user->id)->orderBy('name')->get();
        $emotions = Emotion::where('user_id', $user->id)->orderBy('name')->get();

        $collection = null;
        if ($request->filled('collection')) {
            $collection = Collection::select('id', 'title')->findOrFail($request->input('collection'));
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
        $collection = null;
        if ($request->filled('collection')) {
            $collection = Collection::where('user_id', $user->id)->where('id', $request->input('collection'))->first();
            if ($collection) {
                $diary->collections()->sync($collection->id);
                return redirect()->route('collections.show', ['collection' => $collection->id])->with('success', 'Diary is created successfully.');
            }
        }
        return redirect()->route('diaries.index', ['collection' => $collection?->id])->with('success', 'Diary is created successfully.');
    }

    public function edit(Diary $diary, Request $request)
    {
        $user = Auth::user();
        $categories = Category::where('user_id', $user->id)->orderBy('name')->get();
        $emotions = Emotion::where('user_id', $user->id)->orderBy('name')->get();
        $diary = new DiaryDetailResource($diary);
        $collection = null;
        if ($request->filled('collection')) {
            $collection = Collection::select('id', 'title')->findOrFail($request->input('collection'));
        }
        return Inertia::render('diary/edit', compact('diary', 'categories', 'emotions', 'collection'));
    }

    public function show(Diary $diary, Request $request)
    {
        $user = Auth::user();
        $collection = null;
        if ($request->filled('collection')) {
            $collection = Collection::select('id', 'title')->findOrFail($request->input('collection'));
        }
        $collections = Collection::select('id', 'title')->where('user_id', $user->id)->get();
        return Inertia::render('diary/show', [
            'diary' => new DiaryDetailResource($diary),
            'collection' => $collection,
            'collections' => $collections
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
            $collection = null;
            if ($request->filled('collection')) {
                $collection = Collection::select('id', 'title')->findOrFail($request->input('collection'));
            }
            return redirect()->route('diaries.show', ['diary' => $diary->id, 'collection' => $collection?->id])->with('success', 'Diary is updated successfully.');
        } catch (Exception $e) {
            DB::rollBack();
        }
    }

    public function destroy(Diary $diary, Request $request)
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
            return redirect()->back()->with('error', 'Something went wrong.');
        }
        foreach ($files as $file) {
            if (Storage::disk('public')->exists($file)) {
                Storage::disk('public')->delete($file);
            }
        }

        // Smart Redirect
        $callback = function ($request) {
            if ($request->filled('collection')) {
                $collection = Collection::select('id', 'title')->findOrFail($request->input('collection'));
                if ($collection) {
                    return redirect()->route('collections.show', $collection->id)->with('success', 'Diary deleted.');
                }
            }
            return null; // Ensure a return value to prevent errors
        };

        return smartRedirectAfterDelete(route('diaries.show', $diary->id, false), 'Diary deleted successfully.', 'diaries.index', $callback, $request);
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
