<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Asset;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class AssetPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Asset $asset): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $this->canManage($user);
    }

    public function update(User $user, Asset $asset): bool
    {
        return $this->canManage($user);
    }

    public function delete(User $user, Asset $asset): bool
    {
        return $this->canManage($user);
    }

    private function canManage(User $user): bool
    {
        return in_array($user->role, [UserRole::Owner, UserRole::Admin], true);
    }
}

