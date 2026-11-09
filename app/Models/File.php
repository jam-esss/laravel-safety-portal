<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Str;

class File extends Model
{
    protected $fillable = [
        'original_name',
        'path',
        'disk',
        'mime_type',
        'size',
    ];

    protected static function booted(): void
    {
        static::creating(function ($file) {
            $file->uuid = (string) Str::uuid();
        });
    }

    public function fileable(): MorphTo
    {
        return $this->morphTo();
    }
}
