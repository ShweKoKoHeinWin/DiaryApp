<?php

namespace App\Http\Resources\Diary;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;

class SharedDiaryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'categories' => $this->categories,
            'collections' => $this->collections?->map(function ($collection) {
                return [
                    'id' => $collection->id,
                    'title' => $collection->title,
                ];
            }),
            'content' => strip_tags($this->content),
            'created_at' => $this->created_at,
            'emotion' => $this->emotion,
            'files' => [
                'total' => $this->files->count(),
                'countsByTypes' => $this->files()->select('type', DB::raw('count(*) as count'))
                    ->groupBy('type')
                    ->pluck('count', 'type')
            ],
            'title' => $this->title,
        ];
    }
}
