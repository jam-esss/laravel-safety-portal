<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DocumentTemplate extends Model
{
    protected $fillable = [
        'name',
        'description',
        'document_type',
        'file_path',
        'original_filename',
    ];

    public function variables(): HasMany
    {
        return $this->hasMany(DocumentTemplateVariable::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }
}
