<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Str;

class Asset extends Model
{
    protected $fillable = [
        'make',
        'model',
        'description',
        'asset_tag',
        'serial_number',
        'status',
        'purchase_date',
        'purchase_price',
        'location',
    ];

    protected static function booted(): void
    {
        static::creating(function ($asset) {
            $asset->tkn = Str::random(40);
        });
    }

    public function files(): MorphMany
    {
        return $this->morphMany(File::class, 'fileable');
    }
}
