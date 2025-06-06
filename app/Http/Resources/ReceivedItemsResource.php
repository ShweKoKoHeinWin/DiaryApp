<?php

namespace App\Http\Resources;

use App\Http\Resources\Diary\DiaryListItemResource;
use App\Models\Collection;
use App\Models\Diary;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReceivedItemsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        if ($this->shareable_type === Collection::class) {
            $item = new CollectionResource($this->collection);
        } else if ($this->shareable_type === Diary::class) {
            $item = new DiaryListItemResource($this->diary);
        } else {
            $item = null;
        }
        return [
            'id' => $this->id,
            'email' => $this->email,
            'sharer' => new UserResource($this->sharer),
            'item' => $item,
            'created_at' => $this->created_at,
        ];
    }
}
