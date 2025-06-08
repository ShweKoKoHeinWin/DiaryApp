<?php

namespace App\Filter;

use App\Http\Resources\CollectionResource;
use App\Http\Resources\Diary\DiaryListItemResource;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class FilterService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public static function getDiariesByFilter(Request $request, $diaries, $perPage = 10) : array
    {
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
        $page = $request->input('page', 1);
        $paginated = $diaries->paginate($perPage, ['*'], 'page', $page);
        

        return [$paginated, $filterSort];
    }

    public static function getCollectionsByFilter(Request $request, $collections, $perPage = 10) : array
    {
        $filterSort = ['filters' => [], 'sorting' => []];
        if ($request->filled('startDate') && $request->filled('endDate')) {
            $start = Carbon::parse($request->input('startDate'))->startOfDay();
            $end = Carbon::parse($request->input('endDate'))->endOfDay();
            $collections->whereBetween('created_at', [$start, $end]);
            $filterSort['filters']['startDate'] = $request->input('startDate');
            $filterSort['filters']['endDate'] = $request->input('endDate');
        } else if ($request->filled('startDate')) {
            $start = Carbon::parse($request->input('startDate'))->startOfDay();
            $collections->where('created_at', '>=', $start);
            $filterSort['filters']['startDate'] = $request->input('startDate');
        } else if ($request->filled('endDate')) {
            $end = Carbon::parse($request->input('endDate'))->endOfDay();
            $collections->where('created_at', '<=', $end);
            $filterSort['filters']['endDate'] = $request->input('endDate');
        }

        if ($request->filled('query')) {
            $collections->where('title', 'LIKE', '%' . $request->input('query') . '%');
            $filterSort['filters']['query'] = $request->input('query');
        }

        switch ($request->input('sortBy', 'date')) {
            case 'date':
                $collections->orderBy('created_at', $request->input('sortOrder', 'desc'));
                $filterSort['sorting']['type'] = 'date';
                $filterSort['sorting']['order'] = $request->input('sortOrder', 'desc');
                break;

            case 'title':
                $collections->orderBy('title', $request->input('sortOrder', 'asc'));
                $filterSort['sorting']['type'] = 'title';
                $filterSort['sorting']['order'] = $request->input('sortOrder', 'asc');
                break;

            default:
                # code...
                break;
        }
        $page = $request->input('page', 1);
        $paginated = $collections->paginate($perPage, ['*'], 'page', $page);

        return [$paginated, $filterSort];
    }

    public static function getSharedOrReceivedItems(Request $request, $items, $perPage = 10) : array
    {
        $filterSort = ['filters' => [], 'sorting' => []];
        if ($request->filled('startDate') && $request->filled('endDate')) {
            $start = Carbon::parse($request->input('startDate'))->startOfDay();
            $end = Carbon::parse($request->input('endDate'))->endOfDay();
            $items->whereBetween('created_at', [$start, $end]);
            $filterSort['filters']['startDate'] = $request->input('startDate');
            $filterSort['filters']['endDate'] = $request->input('endDate');
        } else if ($request->filled('startDate')) {
            $start = Carbon::parse($request->input('startDate'))->startOfDay();
            $items->where('created_at', '>=', $start);
            $filterSort['filters']['startDate'] = $request->input('startDate');
        } else if ($request->filled('endDate')) {
            $end = Carbon::parse($request->input('endDate'))->endOfDay();
            $items->where('created_at', '<=', $end);
            $filterSort['filters']['endDate'] = $request->input('endDate');
        }

        if ($request->filled('query')) {
            $items->where('title', 'LIKE', '%' . $request->input('query') . '%');
            $filterSort['filters']['query'] = $request->input('query');
        }

        switch ($request->input('sortBy', 'date')) {
            case 'date':
                $items->orderBy('created_at', $request->input('sortOrder', 'desc'));
                $filterSort['sorting']['type'] = 'date';
                $filterSort['sorting']['order'] = $request->input('sortOrder', 'desc');
                break;

            case 'title':
                $items->orderBy('title', $request->input('sortOrder', 'asc'));
                $filterSort['sorting']['type'] = 'title';
                $filterSort['sorting']['order'] = $request->input('sortOrder', 'asc');
                break;

            default:
                # code...
                break;
        }
        $page = $request->input('page', 1);
        $paginated = $items->paginate($perPage, ['*'], 'page', $page);
        

        return [$paginated, $filterSort];
    }
}
