<?php

namespace App\Http\Resources;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Resources\Json\JsonResource;

class DiaryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $totalFiles = $this->files->count();
        $fileTypesCount = $this->files()->select('type', DB::raw('count(*) as count'))
            ->groupBy('type')
            ->pluck('count', 'type');
        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->content ?? '',
            'list_content' => strip_tags($this->content),
            'emotion' => $this->emotion,
            'files' => $this->files?->map(function ($file) {
                $filePath = $file->path;
                return [
                    'id' => $file->id,
                    'caption' => $file->caption,
                    'type' => $file->type,
                    'path' => asset(Storage::url(str_replace('public/', '', $filePath))),
                ];
            }),
            'categories' => $this->categories,
            'user' => $this->user,
            'collections' => $this->collections?->map(function($collection) {
                return [
                    'id' => $collection->id,
                    'title' => $collection->title,
                    'description' => $collection->description,
                    'image' => asset(Storage::url($this->image)),
                ];
            }),
            'createdAt' => $this->created_at,
            'shareCount' => $this->sharedItems->count(),
            'fileCount' => [
                'total' => $totalFiles,
                'types' => $fileTypesCount ?? []
            ],
            'receivers' => $this->sharedItems,
        ];
    }
}
