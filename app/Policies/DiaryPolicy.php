<?php

namespace App\Policies;

use App\Models\Collection;
use App\Models\Diary;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class DiaryPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Diary $diary): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Diary $diary): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */

    public function updateAndEdit(User $user, Diary $diary)
    {
        return $this->isOwner($user, $diary);
    }

    public function show(User $user, Diary $diary)
    {

        return $this->isOwner($user, $diary) || $this->isReceiver($user, $diary);
    }

    public function isOwner(User $user, Diary $diary)
    {
        return $user->id === $diary->user_id;
    }

    public function isReceiver(User $user, Diary $diary)
    {
        if ($user->receivedDiaries()->where('shareable_type', Diary::class)->where('shareable_id', $diary->id)->exists()) {
            return true;
        }
        if ($user->receivedCollections()->where('shareable_type', Collection::class)->whereIn('shareable_id', $diary->collections->pluck('id'))->exists()) {
            return true;
        }
        return false;
    }

    public function delete(User $user, Diary $diary)
    {
        return $user->id === $diary->user_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Diary $diary): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Diary $diary): bool
    {
        return false;
    }
}
