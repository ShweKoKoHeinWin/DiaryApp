<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class SharedItem extends Model
{
    protected $table = 'shared_items';

    protected $fillable = [
        'owner_id',
        'receiver_id',
        'shareable_type',
        'shareable_id',
        'email',
    ];

    public function sharer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function receiver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    public function shareable(): MorphTo
    {
        return $this->morphTo();
    }

    public function diary(): BelongsTo
    {
        return $this->belongsTo(Diary::class, 'shareable_id');
    }

    public function collection(): BelongsTo
    {
        return $this->belongsTo(Collection::class, 'shareable_id');
    }
}
