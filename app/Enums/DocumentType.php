<?php

namespace App\Enums;

enum DocumentType: string
{
    case RiskAssessment = 'risk_assessment';
    case Coshh = 'coshh';

    public function label(): string
    {
        return match ($this) {
            self::RiskAssessment => 'Risk Assessment',
            self::Coshh => 'COSHH Assessment',
        };
    }

    public static function options(): array
    {
        return array_map(
            fn (self $case) => ['value' => $case->value, 'label' => $case->label()],
            self::cases(),
        );
    }
}
