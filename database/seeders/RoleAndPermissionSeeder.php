<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // create permissions
        $permissions = [
            'employee.view', 'employee.create', 'employee.update', 'employee.delete',
            'project.view', 'project.create', 'project.update', 'project.delete',
            'task.view', 'task.create', 'task.assign', 'task.update', 'task.delete', 'task.comment', 'task.review',
            'performance.view', 'performance.assess',
            'report.view',
            'system.manage',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // create roles and assign created permissions
        $roleSuperAdmin = Role::firstOrCreate(['name' => 'Super Admin']);
        $roleSuperAdmin->syncPermissions(Permission::all());

        $roleHRD = Role::firstOrCreate(['name' => 'HRD / Admin']);
        $roleHRD->syncPermissions([
            'employee.view', 'employee.create', 'employee.update', 'employee.delete',
            'performance.view', 'performance.assess',
            'report.view',
        ]);

        $roleGM = Role::firstOrCreate(['name' => 'General Manager']);
        $roleGM->syncPermissions([
            'project.view', 'task.view', 'performance.view', 'report.view',
        ]);

        $roleHoD = Role::firstOrCreate(['name' => 'Head of Department']);
        $roleHoD->syncPermissions([
            'project.view', 'project.create', 'project.update',
            'task.view', 'task.create', 'task.assign', 'task.update', 'task.comment', 'task.review',
            'performance.view', 'performance.assess',
        ]);

        $roleSupervisor = Role::firstOrCreate(['name' => 'Supervisor']);
        $roleSupervisor->syncPermissions([
            'task.view', 'task.create', 'task.assign', 'task.update', 'task.comment', 'task.review',
            'performance.view', 'performance.assess',
        ]);

        $roleStaff = Role::firstOrCreate(['name' => 'Staff / Employee']);
        $roleStaff->syncPermissions([
            'task.view', 'task.update', 'task.comment',
            'performance.view',
        ]);

        $roleTrainee = Role::firstOrCreate(['name' => 'OJT / Trainee']);
        $roleTrainee->syncPermissions([
            'task.view', 'task.update', 'task.comment',
            'performance.view',
        ]);

        // Security role
        $roleSecurity = Role::firstOrCreate(['name' => 'Security']);
        $roleSecurity->syncPermissions([
            'room.view', 'room.borrow', 'room.return.request', 'room.return.approve', 'room.manage',
            'task.view', 'task.update', 'task.comment', 'performance.view',
        ]);

        // Create a default super admin user
        $admin = User::firstOrCreate([
            'email' => 'admin@swissbelhotel.com',
        ], [
            'name' => 'Super Administrator',
            'password' => Hash::make('password'),
            'status' => 'approved',
        ]);

        if (!$admin->hasRole('Super Admin')) {
            $admin->assignRole($roleSuperAdmin);
        }

        $admin->ensureEmployeeProfile();
    }
}
