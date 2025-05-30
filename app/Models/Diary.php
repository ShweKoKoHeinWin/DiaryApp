<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Diary extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'content',
        'emotion_id',
    ];

    public function user() : BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function categories() : BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'diary_category');
    }

    public function emotion() : BelongsTo
    {
        return $this->belongsTo(Emotion::class);
    }

    public function collections()
    {
        return $this->belongsToMany(Collection::class, 'collection_diary');
    }

    public function files() : HasMany
    {
        return $this->hasMany(Files::class);
    }

    public function sharedItems(): MorphMany
    {
        return $this->morphMany(SharedItem::class, 'shareable');
    }
}
