<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Emotion extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'emoji',
        'user_id',
    ];

    public function diaries() : BelongsToMany
    {
        return $this->belongsToMany(Diary::class);
    }
}
