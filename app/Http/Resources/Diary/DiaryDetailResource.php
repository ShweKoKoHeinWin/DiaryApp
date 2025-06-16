<?php

namespace App\Http\Resources\Diary;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class DiaryDetailResource extends JsonResource
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
            'collections' => $this->collections?->map(function($collection) {
                return [
                    'id' => $collection->id,
                    'title' => $collection->title,
                ];
            }),
            'content' => $this->content,
            'created_at' => $this->created_at,
            'emotion' => $this->emotion,
            'files' => $this->files?->map(function ($file) {
                $filePath = $file->path;
                return [
                    'id' => $file->id,
                    'caption' => $file->caption,
                    'type' => $file->type,
                    'path' => $filePath ? asset(Storage::url(str_replace('public/', '', $filePath))) : '',
                ];
            }),
            'shares' => $this->sharedItems,
            'title' => $this->title,
        ];
    }
}
