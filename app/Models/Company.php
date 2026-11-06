<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    protected $fillable = ['name', 'logo', 'colour', 'parent_company_id'];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Company::class, 'parent_company_id');
    }

    public function subsidiaries(): HasMany
    {
        return $this->hasMany(Company::class, 'parent_company_id');
    }
}
