<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Employee;
use App\Models\Position;
use App\Models\Shift;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class ProductionSeeder extends Seeder
{
    /**
     * Seeds essential master data for clean production/VPS environment.
     * Contains NO dummy tasks, fake transactions, or dummy employees.
     */
    public function run(): void
    {
        // 1. Roles & Permissions
        $this->call(RoleAndPermissionSeeder::class);
        $this->call(RoomAndSecuritySeeder::class);

        // 2. Hotel Departments
        $departments = [
            ['name' => 'Front Office', 'description' => 'Mengelola penerimaan tamu, reservasi, dan layanan concierge.'],
            ['name' => 'Housekeeping', 'description' => 'Bertanggung jawab atas kebersihan dan kenyamanan kamar serta area hotel.'],
            ['name' => 'Food & Beverage', 'description' => 'Mengelola restoran, bar, banquet, dan room service.'],
            ['name' => 'Engineering', 'description' => 'Pemeliharaan fasilitas, peralatan, dan infrastruktur hotel.'],
            ['name' => 'Accounting', 'description' => 'Mengelola keuangan, pembukuan, dan laporan keuangan hotel.'],
            ['name' => 'Sales & Marketing', 'description' => 'Pemasaran hotel, penjualan ruang meeting, dan kerja sama event.'],
            ['name' => 'IT', 'description' => 'Pengelolaan sistem teknologi informasi dan infrastruktur digital.'],
            ['name' => 'Security & Safety', 'description' => 'Keamanan dan pengawasan pos jaga hotel.'],
        ];

        $deptModels = [];
        foreach ($departments as $dept) {
            $deptModels[$dept['name']] = Department::firstOrCreate(['name' => $dept['name']], $dept);
        }

        // 3. Department Positions
        $positionMap = [
            'Front Office' => ['Front Office Manager', 'Supervisor Front Office', 'Receptionist', 'Bellboy'],
            'Housekeeping' => ['Executive Housekeeper', 'Housekeeping Supervisor', 'Room Attendant'],
            'Food & Beverage' => ['F&B Manager', 'F&B Supervisor', 'Waiter/Waitress', 'Cook'],
            'Engineering' => ['Chief Engineer', 'Engineering Supervisor', 'Technician'],
            'Accounting' => ['Accounting Manager', 'Accounting Supervisor', 'Accounting Staff'],
            'Sales & Marketing' => ['Sales & Marketing Manager', 'Sales Executive', 'Marketing Staff'],
            'IT' => ['IT Manager', 'IT Support Staff'],
            'Security & Safety' => ['Chief Security', 'Duty Security Officer', 'Security Guard'],
        ];

        foreach ($positionMap as $deptName => $positions) {
            $deptId = $deptModels[$deptName]->id ?? null;
            if ($deptId) {
                foreach ($positions as $posName) {
                    Position::firstOrCreate([
                        'name' => $posName,
                        'department_id' => $deptId,
                    ]);
                }
            }
        }

        // 4. Default Work Shifts (Essential for Scheduler & Attendance)
        $shifts = [
            [
                'name' => 'Morning Shift (Pagi)',
                'code' => 'MORN',
                'start_time' => '07:00',
                'end_time' => '15:00',
                'is_overnight' => false,
                'late_tolerance_minutes' => 15,
                'color' => '#10B981',
                'is_active' => true,
            ],
            [
                'name' => 'Afternoon Shift (Siang)',
                'code' => 'AFTN',
                'start_time' => '15:00',
                'end_time' => '23:00',
                'is_overnight' => false,
                'late_tolerance_minutes' => 15,
                'color' => '#3B82F6',
                'is_active' => true,
            ],
            [
                'name' => 'Night Shift (Malam)',
                'code' => 'NGHT',
                'start_time' => '23:00',
                'end_time' => '07:00',
                'is_overnight' => true,
                'late_tolerance_minutes' => 15,
                'color' => '#6366F1',
                'is_active' => true,
            ],
            [
                'name' => 'General Office (Normal)',
                'code' => 'NORM',
                'start_time' => '08:30',
                'end_time' => '17:30',
                'is_overnight' => false,
                'late_tolerance_minutes' => 15,
                'color' => '#E31B23',
                'is_active' => true,
            ],
        ];

        foreach ($shifts as $s) {
            Shift::firstOrCreate(['code' => $s['code']], $s);
        }

        // 5. Ensure Super Admin Account
        $admin = User::firstOrCreate(
            ['email' => 'admin@swissbelhotel.com'],
            [
                'name' => 'Super Administrator',
                'username' => 'superadmin',
                'password' => Hash::make('password'),
                'status' => 'approved',
                'phone_number' => '081234567890',
            ]
        );

        $superAdminRole = Role::firstOrCreate(['name' => 'Super Admin']);
        if (!$admin->hasRole('Super Admin')) {
            $admin->assignRole($superAdminRole);
        }

        $admin->ensureEmployeeProfile();
    }
}
