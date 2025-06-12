<?php

namespace App\Http\Resources;

use App\Http\Resources\Collection\SharedCollectionResource;
use App\Http\Resources\Diary\DiaryListItemResource;
use App\Http\Resources\Diary\SharedDiaryResource;
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
        $item = null;
        $type = null;
        
        if ($this->shareable_type === Collection::class) {
            $item = new SharedCollectionResource($this->collection);
            $type = 'collection';
        } else if ($this->shareable_type === Diary::class) {
            $item = new SharedDiaryResource($this->diary);
            $type = 'diary';
        }
        return [
            'id' => $this->id,
            'email' => $this->email,
            'sharer' => new UserResource($this->sharer),
            'item' => $item,
            'type' => $type,
            'created_at' => $this->created_at,
        ];
    }
}
