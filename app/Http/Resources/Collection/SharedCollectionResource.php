<?php

namespace App\Http\Resources\Collection;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SharedCollectionResource extends JsonResource
{
    public function __construct($resource, public $sharedUser = null, public bool $inbox = false, public bool $outbox = false)
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
            // 'image' =>  asset(Storage::url(str_replace('public/', '', $this->cover_image))),
            'title' => $this->title,
            'user' => $this->user,
            'diary_count' => $this->diaries->count(),
        ];
    }
}
