<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        return $this->belongsToMany(Diary::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
