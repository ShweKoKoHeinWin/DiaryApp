<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Files extends Model
{
    use HasFactory;

    protected $fillable = [
        'caption',
        'path',
        'type',
        'diary_id',
        'user_id',
    ];

    public function diary()
    {
        return $this->belongsTo(Diary::class);
    }

    public function user() : BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
