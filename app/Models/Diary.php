<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    public function category() : BelongsToMany
    {
        return $this->belongsToMany(Category::class);
    }

    public function emotion() : BelongsToMany
    {
        return $this->belongsToMany(Emotion::class);
    }

    public function collections()
    {
        return $this->belongsToMany(Collection::class);
    }

    public function files() : HasMany
    {
        return $this->hasMany(Files::class);
    }

}
