<?php

namespace App\Models;

use App\Enums\DocumentSystemVariable;
use App\Enums\DocumentVariable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DocumentTemplateVariable extends Model
{
    protected $fillable = [
        'document_template_id',
        'placeholder',
        'title',
        'description',
        'data_type',
        'is_required',
    ];

    protected $appends = ['is_system'];

    protected function casts(): array
    {
        return [
            'is_required' => 'boolean',
            'data_type' => DocumentVariable::class,
        ];
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(DocumentTemplate::class, 'document_template_id');
    }

    public function getIsSystemAttribute(): bool
    {
        return DocumentSystemVariable::tryFrom($this->placeholder) !== null;
    }
}
