<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Document extends Model
{
    protected $fillable = [
        'document_template_id',
        'title',
        'values',
        'file_path',
    ];

    protected function casts(): array
    {
        return [
            'values' => 'array',
        ];
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(DocumentTemplate::class, 'document_template_id')->withTrashed();
    }
}
