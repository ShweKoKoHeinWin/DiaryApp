<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'cv_image',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function diaries(): HasMany
    {
        return $this->hasMany(Diary::class);
    }

    public function collections(): HasMany
    {
        return $this->hasMany(Collection::class);
    }

    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }

    public function emotions(): HasMany
    {
        return $this->hasMany(Emotion::class);
    }

    public function files(): HasMany
    {
        return $this->hasMany(Files::class);
    }

    public function sentShares(): HasMany
    {
        return $this->hasMany(SharedItem::class, 'owner_id');
    }

    public function getUniqueSentItems()
    {
        return $this->sentShares()
            ->with('shareable') // Make sure you have this in SharedItem model
            ->groupBy('shareable_type', 'shareable_id');
    }

    // As receiver
    public function receivedShares(): HasMany
    {
        return $this->hasMany(SharedItem::class, 'receiver_id');
    }

    // Get all shared diaries user has sent
    public function sharedDiaries(): HasMany
    {
        return $this->sentShares()->where('shareable_type', Diary::class);
    }

    // Get all shared collections user has sent
    public function sharedCollections(): HasMany
    {
        return $this->sentShares()->where('shareable_type', Collection::class);
    }

    // Get received diaries
    public function receivedDiaries(): HasMany
    {
        return $this->receivedShares()->where('shareable_type', Diary::class);
    }

    // Get received collections
    public function receivedCollections(): HasMany
    {
        return $this->receivedShares()->where('shareable_type', Collection::class);
    }

    protected static function booted()
    {
        static::created(function ($user) {
            // Update SharedItems where email matches this user's email
            \App\Models\SharedItem::where('email', $user->email)
                ->update([
                    'receiver_id' => $user->id,
                ]);
        });
    }
}
