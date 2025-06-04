<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Collection extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'cover_image',
    ];

    public function diaries()
    {
        return $this->belongsToMany(Diary::class, 'collection_diary');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function sharedItems(): MorphMany
    {
        return $this->morphMany(SharedItem::class, 'shareable');
    }
}
