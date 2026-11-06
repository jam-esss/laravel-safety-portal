<?php

namespace App\Enums;

enum DocumentType: string
{
    /*
     * IDEA: make subsections for documents so the user can filter down further.
     * E.g. proposal could be broken down into cdm, general, etc.
     */
    case RiskAssessment = 'risk_assessment';
    case Coshh = 'coshh';
    case MethodStatement = 'method_statement';
    case Proposal = 'proposal';
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::RiskAssessment => 'Risk Assessment',
            self::Coshh => 'COSHH Assessment',
            self::MethodStatement => 'Method Statement',
            self::Proposal => 'Proposal',
            self::Other => 'Other',
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
