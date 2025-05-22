<?php

namespace App\Policies;

use App\Models\Emotion;
use App\Models\User;

class EmotionPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }

    public function update(User $user, Emotion $emotion) {
        return $user->id === $emotion->user_id;
    }

    public function delete(User $user, Emotion $emotion) {
        return $user->id === $emotion->user_id;
    }
}
