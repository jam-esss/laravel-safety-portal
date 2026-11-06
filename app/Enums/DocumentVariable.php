<?php

namespace App\Enums;

enum DocumentVariable: string
{
    case Text = 'text';
    case Textarea = 'textarea';
    case Number = 'number';
    case Date = 'date';
    case Email = 'email';
    case Phone = 'phone';
    case YesNo = 'yes_no';

    /**
     * Returns the label for the variable.
     *
     * @return string
     */
    public function label(): string
    {
        return match ($this) {
            self::Text => 'Text',
            self::Textarea => 'Long Text',
            self::Number => 'Number',
            self::Date => 'Date',
            self::Email => 'Email',
            self::Phone => 'Phone',
            self::YesNo => 'Yes / No',
        };
    }

    /**
     * Corresponding HTML element for the variable.
     *
     * @return string
     */
    public function inputType(): string
    {
        return match ($this) {
            self::Text => 'text',
            self::Textarea => 'textarea',
            self::Number => 'number',
            self::Date => 'date',
            self::Email => 'email',
            self::Phone => 'tel',
            self::YesNo => 'checkbox',
        };
    }

    /**
     * Laravel validation rules for the variable.
     *
     * @return string[]
     */
    public function rules(): array
    {
        return match ($this) {
            self::Number => ['numeric'],
            self::Date => ['date'],
            self::Email => ['email', 'max:255'],
            self::Phone => ['string', 'regex:/^[0-9+()\s-]{7,20}$/'],
            self::YesNo => ['in:Yes,No'],
            default => ['string'],
        };
    }

    /**
     * Whether the variable is a date type.
     *
     * @return bool
     */
    public function isDate(): bool
    {
        return $this === self::Date;
    }

    /**
     * Returns the options for the variable.
     *
     * @return array
     */
    public static function options(): array
    {
        return array_map(
            fn (self $case) => ['value' => $case->value, 'label' => $case->label()],
            self::cases(),
        );
    }
}
