<?php

namespace App\Models;

use App\Concerns\BelongsToCompany;
use App\Enums\DocumentType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class DocumentTemplate extends Model
{
    use SoftDeletes, BelongsToCompany;

    protected $fillable = [
        'name',
        'description',
        'document_type',
        'file_path',
        'original_filename',
    ];

    protected function casts(): array
    {
        return [
            'document_type' => DocumentType::class,
        ];
    }

    public function variables(): HasMany
    {
        return $this->hasMany(DocumentTemplateVariable::class)->orderBy('id');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }
}
