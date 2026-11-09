<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\DocumentTemplate;
use App\Models\User;

class DocumentTemplatePolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, DocumentTemplate $template): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $this->canManage($user);
    }

    public function update(User $user, DocumentTemplate $template): bool
    {
        return $this->canManage($user);
    }

    public function delete(User $user, DocumentTemplate $template): bool
    {
        return $this->canManage($user);
    }

    private function canManage(User $user): bool
    {
        return in_array($user->role, [UserRole::Owner, UserRole::Admin], true);
    }
}
