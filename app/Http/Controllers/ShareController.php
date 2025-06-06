<?php

namespace App\Http\Controllers;

use App\Http\Resources\ReceivedItemsResource;
use App\Http\Resources\SharedItemsResource;
use App\Http\Resources\UserResource;
use App\Models\Collection;
use App\Models\Diary;
use App\Models\SharedItem;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ShareController extends Controller
{
    public function sharedItems()
    {
        $filterSort = [];
        $user = User::find(Auth::user()->id);
        $user->load('sentShares.collection', 'sentShares.diary', 'sentShares.receiver');
        $items = SharedItemsResource::collection($user->sentShares);

        return Inertia::render('share/outbox', compact('filterSort', 'items'));
    }

    public function inboxItems()
    {
        $filterSort = [];
        $user = User::find(Auth::user()->id);
        $user->load('receivedShares.collection', 'receivedShares.diary', 'receivedShares.sharer');
        $items = ReceivedItemsResource::collection($user->receivedShares);

        return Inertia::render('share/inbox', compact('filterSort', 'items'));
    }

    public function users()
    {
        $filterSort = [];
        $user = User::find(Auth::user()->id);
        $sharedItems = SharedItem::where('owner_id', $user->id)
            ->orWhere('receiver_id', $user->id)
            ->orWhere('email', $user->email)
            ->get();
        $users = [];
        foreach ($sharedItems as $item) {
            $isSharing = $item->owner_id === $user->id;
            if ($isSharing) {
                if ($item->receiver_id === $user->id) continue;  // if user receive from himself skip
                // if user relation exist
                if ($item->receiver_id) {
                    $userKey = 'id:' . $item->receiver_id;
                    if (!isset($users[$userKey])) {
                        $receiver = $item->receiver()->with('receivedDiaries', 'receivedCollections')->first();
                        $users[$userKey] = [
                            'id' => $receiver->id,
                            'name' => $receiver->name,
                            'email' => $receiver->email,
                            'counts' => [
                                'diary' => $receiver->receivedDiaries->count(),
                                'collection' => $receiver->receivedCollections->count(),
                            ]
                        ];
                    }
                } else {
                    $emailKey = 'email:' . $item->email;
                    if (!isset($users[$emailKey])) {
                        $users[$emailKey] = [
                            'id' => null,
                            'name' => null,
                            'email' => $item->email,
                            'counts' => [
                                'diary' => SharedItem::where('email', $item->email)->where('shareable_type', Diary::class)->count(),
                                'collection' => SharedItem::where('email', $item->email)->where('shareable_type', Collection::class)->count(),
                            ]
                        ];
                    }
                }
            } else {
                if ($item->owner_id === $user->id) continue; // if user share to himself skip
                $userKey = 'id:' . $item->owner_id;
                if (!isset($users[$userKey])) {
                    $owner = $item->sharer()->with('sharedDiaries', 'sharedCollections')->first();
                    $users[$userKey] = [
                        'id' => $owner->id,
                        'name' => $owner->name,
                        'email' => $owner->email,
                        'counts' => [
                            'diary' => $owner->sharedDiaries->count(),
                            'collection' => $owner->sharedCollections->count(),
                        ]
                    ];
                }
            }
        }
        $users = array_values($users);
        return Inertia::render('share/users', compact('filterSort', 'users'));
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
