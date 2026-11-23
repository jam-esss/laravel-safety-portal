<?php

namespace App\Enums;

enum AssetType: string
{
    case Vehicle = 'vehicle';
    case LiftingTool = 'lifting_tool';
    case PowerTool = 'power_tool';
    case HandTool = 'hand_tool';
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::Vehicle => 'Vehicle',
            self::LiftingTool => 'Lifting tool',
            self::PowerTool => 'Power tool',
            self::HandTool => 'Hand tool',
            self::Other => 'Other',
        };
    }

    public function isFleet(): bool
    {
        return $this === self::Vehicle;
    }

    public static function fleetValues(): array
    {
        return collect(self::cases())
            ->filter(fn (self $type) => $type->isFleet())
            ->map(fn (self $type) => $type->value)
            ->values()
            ->all();
    }
}
