<?php

namespace App\Http\Resources\Collection;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Resources\Json\JsonResource;

class CollectionResource extends JsonResource
{
    public function __construct($resource,public $sharedUser = null,public bool $inbox = false,public bool $outbox = false)
    {
        parent::__construct($resource);
    }
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'href' => route('collections.show', [
                'collection' => $this->id,
                'inbox' => $this->inbox,
                'outbox' => $this->outbox,
                'sharedUser' => $this->sharedUser,
            ]),
            'deleteHref' => route('collections.delete', [
                'collection' => $this->id,
                'inbox' => $this->inbox,
                'outbox' => $this->outbox,
                'sharedUser' => $this->sharedUser,
            ]),
            'id' => $this->id,
            'created_at' => $this->created_at,
            'description' => $this->description ?? '',
            'image' =>  asset(Storage::url(str_replace('public/', '', $this->cover_image))),
            'shares' => $this->sharedItems()->with('receiver')->latest()->get()?->map(function ($share) {
                return [
                    'id' => $share->id,
                    'email' => $share->email,
                    'receiver' => $share->receiver ? $share->receiver : null,
                ];
            }),
            'title' => $this->title,
            'user' => $this->user,
            'diary_count' => $this->diaries->count(),
        ];
    }
}
