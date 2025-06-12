<?php

namespace App\Http\Controllers;

use App\Filter\FilterService;
use App\Http\Resources\ReceivedItemsResource;
use App\Http\Resources\SharedItemsResource;
use App\Http\Resources\UserItemsResource;
use App\Http\Resources\UserResource;
use App\Models\Collection;
use App\Models\Diary;
use App\Models\SharedItem;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ShareController extends Controller
{
    public function sharedItems(Request $request)
    {
        $filterSort = [];
        $user = User::find(Auth::user()->id);
        [$items, $filterSort] = FilterService::getSharedOrReceivedItems($request, $user->sentShares()->with(['collection', 'diary', 'receiver']));
        $items = SharedItemsResource::collection($items);
        $receivers = $user->sentShares()->groupBy('email')->get();

        return Inertia::render('share/outbox', compact('filterSort', 'items', 'receivers'));
    }

    public function inboxItems(Request $request)
    {
        $filterSort = [];
        $user = User::find(Auth::user()->id);
        [$items, $filterSort] = FilterService::getSharedOrReceivedItems($request, $user->receivedShares()->with(['collection', 'diary', 'sharer']));
        $sharers = $user->receivedShares()
            ->join('users', 'shared_items.owner_id', '=', 'users.id')
            ->select('users.*')
            ->distinct()
            ->get();
        $items = ReceivedItemsResource::collection($items);

        return Inertia::render('share/inbox', compact('filterSort', 'items', 'sharers'));
    }

    public function users(Request $request)
    {
        $user = User::find(Auth::user()->id);
        // get shared or received items of user
        $sharedItems = SharedItem::with(['sharer', 'sharer.sharedDiaries', 'sharer.sharedCollections', 'receiver', 'receiver.receivedDiaries', 'receiver.receivedCollections'])->where('owner_id', $user->id)
            ->orWhere('receiver_id', $user->id)
            ->orWhere('email', $user->email)
            ->orderBy('created_at')
            ->get();
        $users = [];

        foreach ($sharedItems as $key => $item) {
            //if item ower_id is current user it is item that user shared
            $isSharing = $item->owner_id === $user->id;
            if ($isSharing) { // case of user is sharer
                if ($item->receiver_id === $user->id) continue;  // if user receive from himself skip since user can't share to himself
                // if user relation exist
                if ($item->receiver_id) {
                    $userKey = 'id:' . $item->receiver_id;
                    $receiver = $item->receiver;
                    if (!isset($users[$userKey])) {
                        // Initialize user entry if not already present
                        $users[$userKey] = [
                            'id' => $receiver->id,
                            'name' => $receiver->name,
                            'email' => $receiver->email,
                            'diaries' => [
                                'received' => 0, // Initialize to 0, increment based on current item
                                'shared' => 0,
                            ],
                            'collections' => [
                                'received' => 0, // Initialize to 0, increment based on current item
                                'shared' => 0,
                            ],
                            'started_time' => $item->created_at // Assuming created_at of the first shared item for this user
                        ];
                    }

                    // Increment based on the type of the *current* shared item
                    if ($item->shareable_type === Diary::class) {
                        $users[$userKey]['diaries']['received']++; // Increment by 1 for this diary
                    } elseif ($item->shareable_type === Collection::class) {
                        $users[$userKey]['collections']['received']++; // Increment by 1 for this collection
                    }
                } else {
                    $emailKey = 'email:' . $item->email;
                    if (!isset($users[$emailKey])) {
                        // Initialize email entry if not already present
                        $users[$emailKey] = [
                            'id' => null, // No user ID for email shares
                            'name' => null, // No name for email shares
                            'email' => $item->email,
                            'diaries' => [
                                'received' => 0, // Initialize to 0, increment based on current item
                                'shared' => 0,
                            ],
                            'collections' => [
                                'received' => 0, // Initialize to 0, increment based on current item
                                'shared' => 0,
                            ],
                            'started_time' => $item->created_at
                        ];
                    }

                    // Increment based on the type of the *current* shared item
                    if ($item->shareable_type === Diary::class) {
                        $users[$emailKey]['diaries']['received']++; // Increment by 1 for this diary
                    } elseif ($item->shareable_type === Collection::class) {
                        $users[$emailKey]['collections']['received']++; // Increment by 1 for this collection
                    }
                }
            } else { // user is receiver
                if ($item->owner_id === $user->id) continue; // if user share to himself skip
                $userKey = 'id:' . $item->owner_id;
                $owner = $item->sharer;
                if (!isset($users[$userKey])) {
                    // Initialize user entry if not already present
                    $users[$userKey] = [
                        'id' => $owner->id,
                        'name' => $owner->name,
                        'email' => $owner->email,
                        'diaries' => [
                            'shared' => 0, // Initialize to 0, increment based on current item
                            'received' => 0,
                        ],
                        'collections' => [
                            'shared' => 0, // Initialize to 0, increment based on current item
                            'received' => 0,
                        ],
                        'started_time' => $item->created_at
                    ];
                }

                // Increment based on the type of the *current* shared item
                if ($item->shareable_type === Diary::class) {
                    $users[$userKey]['diaries']['shared']++; // Increment by 1 for this diary
                } elseif ($item->shareable_type === Collection::class) {
                    $users[$userKey]['collections']['shared']++; // Increment by 1 for this collection
                }
            }
        }

        $users = collect(array_values($users));

        [$users, $filterSort] = FilterService::getSharedOrReceivedUsers($request, $users);

        return Inertia::render('share/users', compact('filterSort', 'users'));
    }

    public function userShow(string $email, Request $request)
    {
        $curUser = Auth::user();
        // $items = SharedItem::where(function ($query) use ($curUser, $email) {
        //     // Case 1: Owner receives an item (owner_id = $curuser->id AND email = $email)
        //     $query->where('owner_id', $curUser->id)
        //         ->where('email', $email);
        // })->orWhere(function ($query) use ($curUser, $email) {
        //     // Case 2: Receiver shares  an item (receiver_id = $curuser->id AND owner has email $email)
        //     $query->where('receiver_id', $curUser->id)
        //         ->whereHas('sharer', function ($q) use ($email) {
        //             $q->where('email', $email);
        //         });
        // });
        $items = SharedItem::with('receiver', 'sharer')->where(function ($query) use ($curUser, $email) {
            $query->where(function ($q) use ($curUser, $email) {
                // Case 1: Owner receives an item (owner_id = $curUser->id AND email = $email)
                $q->where('owner_id', $curUser->id)
                    ->where('email', $email);
            })->orWhere(function ($q) use ($curUser, $email) {
                // Case 2: Receiver shares an item (receiver_id = $curUser->id AND owner has email $email)
                $q->where('receiver_id', $curUser->id)
                    ->whereHas('sharer', function ($q2) use ($email) {
                        $q2->where('email', $email);
                    });
            });
        });

        [$items, $filterSort] = FilterService::getSharedOrReceivedItems($request, $items);
        if (User::where('email', $email)->exists()) {
            $userDetail = User::where('email', $email)->first();
            $user = [
                'name' => $userDetail->name ?? '---',
                'email' => $email,
                'items' => UserItemsResource::collection($items),
                'counts' => [
                    'diary' => [
                        'shared' => SharedItem::where(function ($query) use ($curUser, $email) {
                            // Case 2: Receiver shares  an item (receiver_id = $curuser->id AND owner has email $email)
                            $query->where('receiver_id', $curUser->id)
                                ->whereHas('sharer', function ($q) use ($email) {
                                    $q->where('email', $email);
                                });
                        })->where('shareable_type', Diary::class)->count(),
                        'received' => SharedItem::where(function ($query) use ($curUser, $email) {
                            // Case 1: Owner shares an item (owner_id = $user->id AND email = $email)
                            $query->where('owner_id', $curUser->id)
                                ->where('email', $email);
                        })->where('shareable_type', Diary::class)->count(),
                    ],
                    'collection' => [
                        'shared' => SharedItem::where(function ($query) use ($curUser, $email) {
                            // Case 2: Receiver shares  an item (receiver_id = $curuser->id AND owner has email $email)
                            $query->where('receiver_id', $curUser->id)
                                ->whereHas('sharer', function ($q) use ($email) {
                                    $q->where('email', $email);
                                });
                        })->where('shareable_type', Collection::class)->count(),
                        'received' => SharedItem::where(function ($query) use ($curUser, $email) {
                            // Case 1: Owner shares an item (owner_id = $user->id AND email = $email)
                            $query->where('owner_id', $curUser->id)
                                ->where('email', $email);
                        })->where('shareable_type', Collection::class)->count(),
                    ],

                ],
                'since' => SharedItem::where(function ($query) use ($curUser, $email) {
                    $query->where('owner_id', $curUser->id)
                        ->where('email', $email);
                })->orWhere(function ($query) use ($curUser, $email) {
                    $query->where('receiver_id', $curUser->id)
                        ->whereHas('sharer', function ($q) use ($email) {
                            $q->where('email', $email);
                        });
                })->orderBy('created_at')->first()?->created_at
            ];
        } else {
            $user = [
                'name' => '---',
                'email' => $email,
                'items' => UserItemsResource::collection($items),
                'counts' => [
                    'diary' => [
                        'shared' => SharedItem::where(function ($query) use ($curUser, $email) {
                            // Case 2: Receiver shares  an item (receiver_id = $curuser->id AND owner has email $email)
                            $query->where('receiver_id', $curUser->id)
                                ->whereHas('sharer', function ($q) use ($email) {
                                    $q->where('email', $email);
                                });
                        })->where('shareable_type', Diary::class)->count(),
                        'received' => SharedItem::where(function ($query) use ($curUser, $email) {
                            // Case 1: Owner shares an item (owner_id = $user->id AND email = $email)
                            $query->where('owner_id', $curUser->id)
                                ->where('email', $email);
                        })->where('shareable_type', Diary::class)->count(),
                    ],
                    'collection' => [
                        'shared' => SharedItem::where(function ($query) use ($curUser, $email) {
                            // Case 2: Receiver shares  an item (receiver_id = $curuser->id AND owner has email $email)
                            $query->where('receiver_id', $curUser->id)
                                ->whereHas('sharer', function ($q) use ($email) {
                                    $q->where('email', $email);
                                });
                        })->where('shareable_type', Collection::class)->count(),
                        'received' => SharedItem::where(function ($query) use ($curUser, $email) {
                            // Case 1: Owner shares an item (owner_id = $user->id AND email = $email)
                            $query->where('owner_id', $curUser->id)
                                ->where('email', $email);
                        })->where('shareable_type', Collection::class)->count(),
                    ],

                ],
                'since' => null,
            ];
        }
        return Inertia::render('share/user-detail', compact('user', 'filterSort'));
    }

    public function multishare(Request $request)
    {

        $request->validate([
            'receivers' => ['required', 'array'],
            'receivers.*' => ['nullable', 'string'],
            'cardType' => ['required', Rule::in('diary', 'collection')],
            'selectedCards' => ['required', 'array'],
            'selectedCards.*' => ['nullable', 'integer'],
        ]);
        $user = Auth::user();
        $CardClass = $request->input('cardType') === 'diary' ? Diary::class : Collection::class;
        $count = 0;
        foreach ($request->input('selectedCards') as $id) {
            $card = $CardClass::where('user_id', $user->id)->where('id', $id)->first();
            if ($card) {
                $shared = false;
                foreach ($request->input('receivers') as $email) {
                    if ($email === $user->email) continue;
                    $exist = $card->sharedItems()->where('email', $email)->where('shareable_type', $CardClass)->where('shareable_id', $card->id)->exists();

                    if (!$exist && $email) {
                        $shared = true;
                        $card->sharedItems()->create([
                            'owner_id'       => $user->id,
                            'email'          => $email,
                            'shareable_type' => $CardClass,
                            'shareable_id'   => $card->id,
                        ]);
                    }
                }
                if ($shared) $count++;
            }
        }
        return redirect()->back()->with('success', "{$count} {$request->input('cardType')} shared.");
    }
}
