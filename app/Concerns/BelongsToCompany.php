<?php

namespace App\Concerns;

use App\Models\Company;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

trait BelongsToCompany
{
    protected static function bootBelongsToCompany(): void
    {
        static::addGlobalScope('company', function (Builder $builder) {
            $user = Auth::user();

            if ($user && ! $user->office_user) {
                $table = $builder->getModel()->getTable();
                $builder->where("{$table}.company_id", $user->company_id);
            }
        });

        static::creating(function ($model) {
            $user = Auth::user();

            if ($user && ! $user->office_user && ! $model->company_id) {
                $model->company_id = $user->company_id;
            }
        });
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }
}
