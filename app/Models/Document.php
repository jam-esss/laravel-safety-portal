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
        'expiry_date',
        'review_date',
    ];

    protected function casts(): array
    {
        return [
            'values' => 'array',
            'expiry_date' => 'date',
            'review_date' => 'date',
        ];
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(DocumentTemplate::class, 'document_template_id')->withTrashed();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
