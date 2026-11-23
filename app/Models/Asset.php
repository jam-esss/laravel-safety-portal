<?php

namespace App\Models;

use App\Concerns\BelongsToCompany;
use App\Enums\AssetStatus;
use App\Enums\AssetType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Prunable;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Builder;
use Storage;

class Asset extends Model
{
    use BelongsToCompany, SoftDeletes, Prunable;

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
            'purchase_date' => 'date:Y-m-d',
            'purchase_price' => 'decimal:2',
        ];
    }

    public function files(): MorphMany
    {
        return $this->morphMany(File::class, 'fileable');
    }

    public function scopeFleet(Builder $query): Builder
    {
        return $query->whereIn('asset_type', AssetType::fleetValues());
    }

    public function scopeRegister(Builder $query): Builder
    {
        return $query->whereNotIn('asset_type', AssetType::fleetValues());
    }

    public function prunable(): Builder
    {
        return static::onlyTrashed()->where('deleted_at', '<=', now()->subDays(30));
    }

    protected function pruning(): void
    {
        foreach ($this->files as $file) {
            Storage::disk($file->disk)->delete($file->path);
            $file->delete();
        }
    }
}
