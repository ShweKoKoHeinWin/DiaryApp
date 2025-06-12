<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Collection;
use App\Models\Diary;
use App\Models\Emotion;
use App\Models\Files;
use App\Models\SharedItem;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $diaries = Diary::where('user_id', $user->id)->count();
        $collections = Collection::where('user_id', $user->id)->count();
        $emotions = Emotion::where('user_id', $user->id)->count();
        $categories = Category::where('user_id', $user->id)->count();
        $files = Files::where('user_id', $user->id)->count();

        $sentDiaries = $user->sharedDiaries()->count();
        $sentCollections = $user->sharedCollections()->count();
        $receivedDiaries = $user->receivedDiaries()->count();
        $receivedCollections = $user->receivedCollections()->count();
        return Inertia::render('home', compact('diaries', 'collections', 'emotions', 'categories', 'files', 'sentDiaries', 'sentCollections', 'receivedDiaries', 'receivedCollections'));
    }
    public function calendar(Request $request)
    {
        $user = Auth::user();
        $month = $request->input('month', now()->month);
        $year = $request->input('year', now()->year);
        $startDate = Carbon::create($year, $month)->startOfMonth()->toDateString();
        $endDate = Carbon::create($year, $month)->endOfMonth()->toDateString();
        $startWeekday = (int) Carbon::create($year, $month, 1)->format('w'); // 0 = Sunday
        $diaries = Diary::where('user_id', $user->id)->whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('DATE(created_at) as date, count(*) as count')
            ->groupBy('date')
            ->pluck('count', 'date');

        $collections = Collection::where('user_id', $user->id)->whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('DATE(created_at) as date, count(*) as count')
            ->groupBy('date')
            ->pluck('count', 'date');

        $sentDiaries = $user->sharedDiaries()->whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('DATE(created_at) as date, count(*) as count')
            ->groupBy('date')
            ->pluck('count', 'date');
        $sentCollections = $user->sharedCollections()->whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('DATE(created_at) as date, count(*) as count')
            ->groupBy('date')
            ->pluck('count', 'date');
        $receivedDiaries = $user->receivedDiaries()->whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('DATE(created_at) as date, count(*) as count')
            ->groupBy('date')
            ->pluck('count', 'date');
        $receivedCollections = $user->receivedCollections()->whereBetween('created_at', [$startDate, $endDate])
            ->selectRaw('DATE(created_at) as date, count(*) as count')
            ->groupBy('date')
            ->pluck('count', 'date');

        $days = []; // Add empty cells for days before the 1st
        for ($i = 0; $i < $startWeekday; $i++) {
            $days[] = null;
        }

        $current = Carbon::create($year, $month, 1);
        $lastDay = $current->copy()->endOfMonth();

        while ($current->lte($lastDay)) {
            $dateStr = $current->toDateString();

            $days[] = [
                'date' => $dateStr,
                'day' => $current->format('d'),
                'isToday' => $current->isToday(),
                'diaries' => $diaries[$dateStr] ?? 0,
                'collections' => $collections[$dateStr] ?? 0,
                'sentDiaries' => $sentDiaries[$dateStr] ?? 0,
                'sentCollections' => $sentCollections[$dateStr] ?? 0,
                'receivedDiaries' => $receivedDiaries[$dateStr] ?? 0,
                'receivedCollections' => $receivedCollections[$dateStr] ?? 0,
            ];

            $current->addDay();
        }

        return Inertia::render('calendar', compact('days', 'year', 'month'));
    }
}
