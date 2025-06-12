<?php

namespace App\Filter;

use App\Http\Resources\Diary\DiaryListItemResource;
use App\Models\Collection;
use App\Models\Diary;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class FilterService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public static function getDiariesByFilter(Request $request, $diaries, $perPage = 10): array
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

    public static function getCollectionsByFilter(Request $request, $collections, $perPage = 10): array
    {
        $filterSort = ['filters' => [0 => 0], 'sorting' => []];
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

    public static function getSharedOrReceivedItems(Request $request, $items, $perPage = 10): array
    {
        $filterSort = ['filters' => [0 => 0], 'sorting' => []];
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
            $query = '%' . $request->input('query') . '%';
            $items->where(function ($q) use ($query) {
                $q->whereHas('sharer', function ($q) use ($query) {
                    $q->where('name', 'LIKE', $query)
                        ->orWhere('email', 'LIKE', $query);
                })->orWhereHas('receiver', function ($q) use ($query) {
                    $q->where('name', 'LIKE', $query)
                        ->orWhere('email', 'LIKE', $query);
                })
                    ->orWhere('email', 'LIKE', $query)
                    ->orWhereHas('diary', function ($q) use ($query) {
                        $q->where('title', 'LIKE', $query);
                    })->orWhereHas('collection', function ($q) use ($query) {
                        $q->where('title', 'LIKE', $query);
                    });
            });
            $filterSort['filters']['query'] = $request->input('query');
        }

        if ($request->filled('sharer')) {
            $items->whereHas('sharer', function ($q) use ($request) {
                $q->where('id', $request->input('sharer'));
            });
            $filterSort['filters']['sharer'] = $request->input('sharer');
        }

        if ($request->filled('receiver')) {
            $items->where('email', $request->input('receiver'));
            $filterSort['filters']['receiver'] = $request->input('receiver');
        }

        if ($request->filled('shareType')) {
            if ($request->input('shareType') === 'shared') {
                $items->where('owner_id', Auth::user()->id);
            } else if ($request->input('shareType') === 'received') {
                $items->where('email', Auth::user()->email);
            }
            $filterSort['filters']['shareType'] = $request->input('shareType');
        }

        if ($request->filled('type')) {
            if ($request->input('type') === 'diary') {
                $items->where('shareable_type', Diary::class);
            } else if ($request->input('type') === 'collection') {
                $items->where('shareable_type', Collection::class);
            }
            $filterSort['filters']['type'] = $request->input('type');
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
        $paginated = $items->distinct('shared_items.id')->paginate($perPage, ['*'], 'page', $page);

        return [$paginated, $filterSort];
    }

    public static function getSharedOrReceivedUsers(Request $request, $users, $perPage = 10): array
    {
        $filterSort = ['filters' => [], 'sorting' => []];
        if ($request->filled('startDate') && $request->filled('endDate')) {
            $start = Carbon::parse($request->input('startDate'))->startOfDay();
            $end = Carbon::parse($request->input('endDate'))->endOfDay();
            $users = $users->whereBetween('started_time', [$start, $end]);
            $filterSort['filters']['startDate'] = $request->input('startDate');
            $filterSort['filters']['endDate'] = $request->input('endDate');
        } else if ($request->filled('startDate')) {
            $start = Carbon::parse($request->input('startDate'))->startOfDay();
            $users = $users->filter(function ($user) use ($start) {
                return Carbon::parse($user['started_time'])->greaterThan($start);
            });
            $filterSort['filters']['startDate'] = $request->input('startDate');
        } else if ($request->filled('endDate')) {
            $end = Carbon::parse($request->input('endDate'))->endOfDay();
            $users = $users->filter(function ($user) use ($end) {
                return Carbon::parse($user['started_time'])->lessThan($end);
            });
            $filterSort['filters']['endDate'] = $request->input('endDate');
        }

        if ($request->filled('query')) {
            $query = strtolower($request->input('query'));

            $users = $users->filter(function ($u) use ($query) {
                return str_contains(strtolower($u['name']), $query) || str_contains(strtolower($u['email']), $query);
            });
            $filterSort['filters']['query'] = $request->input('query');
        }

        switch ($request->input('sortBy', 'date')) {
            case 'date':
                if ($request->input('sortOrder', 'desc') == 'desc') {
                    $users = $users->sortByDesc('started_time')->values();
                } else {
                    $users = $users->sortBy('started_time')->values();
                }
                $filterSort['sorting']['type'] = 'date';
                $filterSort['sorting']['order'] = $request->input('sortOrder', 'desc');
                break;

            case 'name':
                if ($request->input('sortOrder', 'asc') === 'asc') {
                    $users = $users->sortBy(function ($user) {
                        return strtolower($user['name']);
                    })->values();
                } else {
                    $users = $users->sortByDesc(function ($user) {
                        return strtolower($user['name']);
                    })->values();
                }
                $filterSort['sorting']['type'] = 'name';
                $filterSort['sorting']['order'] = $request->input('sortOrder', 'asc');
                break;

            default:
                # code...
                break;
        }
        // Pagination
        $page = $request->input('page', 1);
        $offset = $perPage * ($page - 1);
        $totalUsers = count($users);
        $lastPage = ceil($totalUsers / $perPage);
        $to = min($offset + $perPage, $totalUsers);
        $users = $users->slice($offset, $perPage)->toArray();
        $prevPage = max($page - 1, 1);
        $nextPage = min($page + 1, $lastPage);
        $links = [];
        if ($prevPage === 1) {
            $links[] = [
                'url' => null,
                'label' => '&laquo; Previous',
                'active' => false,
            ];
        } else {
            $links[] = [
                'url' => route('inbox-shares.users', ['page' => $prevPage]),
                'label' => '&laquo; Previous',
                'active' => false,
            ];
        }
        for ($x = 1; $x <= $lastPage; $x++) {
            $links[] = [
                'url' => route('inbox-shares.users', ['page' => $x]),
                'label' => (string)$x,
                'active' => $x === (int) $page
            ];
        }

        if ($nextPage === $lastPage) {
            $links[] = [
                'url' => null,
                'label' => "Next &raquo;",
                'active' => false,
            ];
        } else {
            $links[] = [
                'url' => route('inbox-shares.users', ['page' => $nextPage]),
                'label' => "Next &raquo;",
                'active' => false,
            ];
        }
        $meta = [
            'current_page' => $page,
            'from' => $offset + 1,
            'late_page' => $lastPage,
            'links' => $links,
            'path' => route('inbox-shares.users'),
            'per_page' => $perPage,
            'to' => $to,
            'total' => $totalUsers,
        ];
        $users = [
            'data' => $users,
            'meta' => $meta,
        ];

        return [$users, $filterSort];
    }
}
