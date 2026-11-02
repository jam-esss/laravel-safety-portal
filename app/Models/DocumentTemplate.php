<?php

namespace App\Models;

use App\Enums\DocumentType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class DocumentTemplate extends Model
{
    use SoftDeletes;

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
        return $this->hasMany(DocumentTemplateVariable::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }
}
