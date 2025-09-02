<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $actor): bool
    {
        return $actor->can('user.view');
    }

    public function view(User $actor, User $target): bool
    {
        return $actor->can('user.view');
    }

    public function create(User $actor): bool
    {
        return $actor->can('user.create');
    }

    public function update(User $actor, User $target): bool
    {
        return $actor->can('user.update');
    }

    public function delete(User $actor, User $target): bool
    {
        return $actor->can('user.delete') && !$target->hasRole('superadmin');
    }
}
