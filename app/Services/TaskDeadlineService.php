<?php

namespace App\Services;

use App\Enums\TaskStatus;
use App\Models\Task;
use App\Models\User;
use App\Notifications\TaskStatusNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class TaskDeadlineService
{
    /**
     * Check and dispatch overdue notifications for tasks associated with a specific user.
     * Cached briefly to avoid redundant database roundtrips per page refresh.
     */
    public static function checkAndNotifyForUser(?User $user): void
    {
        if (! $user) {
            return;
        }

        $cacheKey = "user_overdue_check_{$user->id}";
        if (Cache::has($cacheKey)) {
            return;
        }

        try {
            $now = Carbon::now();
            $employeeId = $user->employee?->id;

            $tasks = Task::with(['assignees.user', 'creator', 'project:id,name'])
                ->where('deadline', '<', $now)
                ->whereNotIn('status', [TaskStatus::Approved->value, TaskStatus::Cancelled->value])
                ->where(function ($q) use ($user, $employeeId) {
                    $q->where('created_by', $user->id);
                    if ($employeeId) {
                        $q->orWhereHas('assignees', fn ($sq) => $sq->where('employee_id', $employeeId));
                    }
                })
                ->get();

            foreach ($tasks as $task) {
                self::notifyRecipientsForTask($task, $user);
            }

            // Cache check for 3 minutes to avoid re-querying every click
            Cache::put($cacheKey, true, now()->addMinutes(3));
        } catch (\Throwable $e) {
            Log::warning('TaskDeadlineService user check failed: '.$e->getMessage());
        }
    }

    /**
     * Check and dispatch overdue notifications globally (used in artisan command or worker).
     */
    public static function checkAndNotifyAll(): int
    {
        $now = Carbon::now();
        $tasks = Task::with(['assignees.user', 'creator', 'project:id,name'])
            ->where('deadline', '<', $now)
            ->whereNotIn('status', [TaskStatus::Approved->value, TaskStatus::Cancelled->value])
            ->get();

        $notifiedCount = 0;

        foreach ($tasks as $task) {
            $notifiedCount += self::notifyRecipientsForTask($task);
        }

        return $notifiedCount;
    }

    /**
     * Notify eligible recipients for a specific overdue task, deduplicating notifications.
     */
    protected static function notifyRecipientsForTask(Task $task, ?User $limitToUser = null): int
    {
        $recipients = collect();

        // 1. Assignees
        foreach ($task->assignees as $assignee) {
            if ($assignee->user) {
                $recipients->push($assignee->user);
            }
        }

        // 2. Creator
        if ($task->creator) {
            $recipients->push($task->creator);
        }

        $recipients = $recipients->unique('id');

        if ($limitToUser) {
            $recipients = $recipients->filter(fn ($u) => $u->id === $limitToUser->id);
        }

        $sent = 0;

        foreach ($recipients as $recipient) {
            // Check if notification already exists for this task as overdue
            $alreadyNotified = $recipient->notifications()
                ->where('type', TaskStatusNotification::class)
                ->whereJsonContains('data->task_id', $task->id)
                ->whereJsonContains('data->status_type', 'overdue')
                ->exists();

            if (! $alreadyNotified) {
                $message = "Task '{$task->title}' telah melewati batas waktu deadline.";
                $recipient->notify(new TaskStatusNotification($task, $message, 'overdue'));
                $sent++;
            }
        }

        return $sent;
    }
}
