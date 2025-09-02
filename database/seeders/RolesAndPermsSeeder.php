<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RolesAndPermsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $perms = [
            'event.view','event.create','event.update','event.delete',
            'user.view','user.create','user.update','user.delete',
        ];
        foreach ($perms as $p) Permission::firstOrCreate(['name'=>$p]);

        $super = Role::firstOrCreate(['name'=>'super-admin']);
        $admin = Role::firstOrCreate(['name'=>'admin']);
        $user  = Role::firstOrCreate(['name'=>'user']);

        $admin->givePermissionTo($perms);

        $user->givePermissionTo(['event.view']);

        $root = User::firstOrCreate(
            ['email'=>'marcingodfryd@gmail.com'],
            ['name'=>'Marcin','password'=>Hash::make('test123')]
        );
        $root->syncRoles(['super-admin']);
    }
}
