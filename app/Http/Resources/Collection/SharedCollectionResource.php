<?php

namespace App\Http\Resources\Collection;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

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
            'id' => $this->id,
            'created_at' => $this->created_at,
            'description' => $this->description ?? '',
            'image' => $this->cover_image ? asset(Storage::url(str_replace('public/', '', $this->cover_image))) : '',
            'title' => $this->title,
            'user' => $this->user,
            'diary_count' => $this->diaries->count(),
        ];
    }
}
