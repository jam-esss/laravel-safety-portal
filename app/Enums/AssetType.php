<?php

namespace App\Enums;

enum AssetType: string
{
    case Equipment = 'equipment';
    case Vehicle = 'vehicle';

    public function label(): string
    {
        return match ($this) {
            self::Equipment => 'Equipment',
            self::Vehicle => 'Vehicle',
        };
    }
}
