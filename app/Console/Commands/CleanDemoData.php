<?php

namespace App\Console\Commands;

use App\Models\Task;
use App\Models\User;
use Illuminate\Console\Command;

class CleanDemoData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:clean-demo-data {--dry-run : Only preview demo/test records without deleting} {--force : Perform deletion after confirmation}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Identify and safely clean dummy/test data (e.g., "tes", "test", "dummy", "jane doe")';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $isDryRun = $this->option('dry-run') || !$this->option('force');

        $this->info($isDryRun ? '=== PREVIEWING DEMO/TEST DATA (DRY RUN) ===' : '=== CLEANING DEMO/TEST DATA ===');

        // 1. Identify tasks with demo/test names
        $demoTasks = Task::query()
            ->where(function ($q) {
                $q->where('title', 'like', '%tes%')
                  ->orWhere('title', 'like', '%dummy%')
                  ->orWhere('title', 'like', '%sample%');
            })
            ->get(['id', 'title', 'status', 'created_at']);

        $this->line("Found {$demoTasks->count()} demo/test task(s):");
        foreach ($demoTasks as $t) {
            $this->line(" - [Task #{$t->id}] \"{$t->title}\" (Status: {$t->status}, Created: {$t->created_at})");
        }

        // 2. Identify dummy users
        $demoUsers = User::query()
            ->where(function ($q) {
                $q->where('name', 'like', '%jane doe%')
                  ->orWhere('name', 'like', '%dummy%')
                  ->orWhere('email', 'like', '%example.com%')
                  ->orWhere('email', 'like', '%test%');
            })
            ->where('id', '!=', 1) // Protect main admin
            ->get(['id', 'name', 'email', 'created_at']);

        $this->line("\nFound {$demoUsers->count()} demo/test user(s):");
        foreach ($demoUsers as $u) {
            $this->line(" - [User #{$u->id}] \"{$u->name}\" <{$u->email}>");
        }

        if ($isDryRun) {
            $this->newLine();
            $this->warn('Notice: This was a dry run. No database records were modified or deleted.');
            $this->info('To remove these records, confirm with the database administrator and run: php artisan app:clean-demo-data --force');
            return self::SUCCESS;
        }

        // Deletion with confirmation
        if (!$this->confirm('Are you ABSOLUTELY sure you want to permanently delete these demo records?', false)) {
            $this->info('Operation cancelled. No records were deleted.');
            return self::SUCCESS;
        }

        $taskIds = $demoTasks->pluck('id');
        Task::whereIn('id', $taskIds)->delete();
        $this->info("Deleted {$taskIds->count()} demo task(s).");

        $userIds = $demoUsers->pluck('id');
        User::whereIn('id', $userIds)->delete();
        $this->info("Deleted {$userIds->count()} demo user(s).");

        return self::SUCCESS;
    }
}
