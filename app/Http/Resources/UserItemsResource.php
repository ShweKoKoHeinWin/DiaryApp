<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class UserItemsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $curUser = Auth::user();

        if ($this->owner_id === $curUser->id) {
            // Item is shared by the current user
            return array_merge(
                (new SharedItemsResource($this))->toArray($request),
                ['isShare' => true]
            );
        } else {
            // Item is received by the current user
            return array_merge(
                (new ReceivedItemsResource($this))->toArray($request),
                ['isShare' => false]
            );
        }
    }
}
