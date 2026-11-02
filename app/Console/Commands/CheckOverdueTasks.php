<?php

namespace App\Console\Commands;

use App\Services\TaskDeadlineService;
use Illuminate\Console\Command;

class CheckOverdueTasks extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tasks:check-overdue';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check for tasks that passed their deadline and dispatch deduplicated in-app notifications';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Checking for newly overdue tasks...');
        $count = TaskDeadlineService::checkAndNotifyAll();
        $this->info("Completed. Dispatched {$count} overdue notification(s).");

        return self::SUCCESS;
    }
}
