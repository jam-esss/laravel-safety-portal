<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Document;
use App\Models\User;

class DocumentPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Document $document): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $this->canManage($user);
    }

    public function update(User $user, Document $document): bool
    {
        return $this->canManage($user);
    }

    public function delete(User $user, Document $document): bool
    {
        return $this->canManage($user);
    }

    private function canManage(User $user): bool
    {
        return in_array($user->role, [UserRole::Owner, UserRole::Admin], true);
    }
}
