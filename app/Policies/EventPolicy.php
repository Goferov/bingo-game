<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\User;

class EventPolicy
{
    public function viewAny(User $u): bool
    {
        return $u->can('event.view');
    }

    public function view(User $u, Event $e): bool
    {
        return $u->can('event.view');
    }

    public function create(User $u): bool
    {
        return $u->can('event.create');
    }

    public function update(User $u, Event $e): bool
    {
        return $u->can('event.update');
    }

    public function delete(User $u, Event $e): bool
    {
        return $u->can('event.delete');
    }
}
