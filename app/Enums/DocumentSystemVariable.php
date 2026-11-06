<?php

namespace App\Enums;

enum DocumentSystemVariable: string
{
    case ExpiryDate = 'expiry_date';
    case ReviewDate = 'review_date';
    case Today = 'today';
    case CreatedBy = 'created_by';

    public function label(): string
    {
        return match ($this) {
            self::ExpiryDate => 'Expiry date',
            self::ReviewDate => 'Review date',
            self::Today => "Today's date",
            self::CreatedBy => 'Created by',
        };
    }

    public function description(): string
    {
        return match ($this) {
            self::ExpiryDate => 'Asks for a date when the document is created, and records it so expiring documents can be found.',
            self::ReviewDate => 'Asks for the date the document is next due for review.',
            self::Today => 'Filled in automatically with the date the document is created.',
            self::CreatedBy => 'Filled in automatically with the name of the person creating the document.',
        };
    }

    public function dataType(): DocumentVariable
    {
        return match ($this) {
            self::CreatedBy => DocumentVariable::Text,
            default => DocumentVariable::Date,
        };
    }

    public function isAutoFilled(): bool
    {
        return in_array($this, [self::Today, self::CreatedBy], true);
    }

    public static function options(): array
    {
        return array_map(fn (self $case) => [
            'placeholder' => $case->value,
            'label' => $case->label(),
            'description' => $case->description(),
            'auto_filled' => $case->isAutoFilled(),
        ], self::cases());
    }
}
