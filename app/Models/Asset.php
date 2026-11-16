<?php

namespace App\Models;

use App\Concerns\BelongsToCompany;
use App\Enums\AssetStatus;
use App\Enums\AssetType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Str;

class Asset extends Model
{
    use BelongsToCompany;

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
        'company_id',
        'asset_type'
    ];

    protected static function booted(): void
    {
        static::creating(function ($asset) {
            $asset->tkn = Str::random(40);
        });
    }

    protected function casts(): array
    {
        return [
            'asset_type' => AssetType::class,
            'status' => AssetStatus::class,
            'purchase_date' => 'date',
            'purchase_price' => 'decimal:2',
        ];
    }

    public function files(): MorphMany
    {
        return $this->morphMany(File::class, 'fileable');
    }
}
