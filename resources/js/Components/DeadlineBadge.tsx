import React from 'react';
import { getDeadlineStatus, DeadlineStatusResult } from '@/Utils/deadline';

interface DeadlineBadgeProps {
    dueDate?: string | Date | null;
    status?: string | null;
    completedAt?: string | Date | null;
    showIcon?: boolean;
    showDatePrefix?: boolean; // e.g. "Due 31/10/2026 · Terlambat 2 hari"
    size?: 'xs' | 'sm' | 'md';
    className?: string;
}

export default function DeadlineBadge({
    dueDate,
    status,
    completedAt,
    showIcon = true,
    showDatePrefix = false,
    size = 'xs',
    className = '',
}: DeadlineBadgeProps) {
    if (!dueDate) return null;

    const result = getDeadlineStatus(dueDate, status, completedAt);
    if (!result) return null;

    const sizeClasses = {
        xs: 'text-[11px] px-2 py-0.5',
        sm: 'text-xs px-2.5 py-1',
        md: 'text-sm px-3 py-1.5',
    }[size];

    const iconSizeClasses = {
        xs: 'w-3 h-3',
        sm: 'w-3.5 h-3.5',
        md: 'w-4 h-4',
    }[size];

    // Variant color tokens matching DESIGN.md and accessibility rules
    const variantStyles: Record<DeadlineStatusResult['variant'], { badge: string; icon: string }> = {
        // Red badge + warning icon for overdue
        danger: {
            badge: 'bg-red-50 text-red-700 border border-red-200 font-semibold ring-1 ring-red-100',
            icon: 'text-red-600',
        },
        // Orange badge for due today
        warning: {
            badge: 'bg-orange-50 text-orange-700 border border-orange-200 font-semibold ring-1 ring-orange-100',
            icon: 'text-orange-600',
        },
        // Yellow/Amber badge for due in 1-3 days
        soon: {
            badge: 'bg-amber-50 text-amber-800 border border-amber-200 font-medium',
            icon: 'text-amber-600',
        },
        // Neutral text for > 3 days
        neutral: {
            badge: 'bg-slate-50 text-slate-600 border border-slate-200 font-normal',
            icon: 'text-slate-400',
        },
        // Green badge for completed on time
        success: {
            badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold',
            icon: 'text-emerald-600',
        },
        // Gray-red badge for completed late
        late_done: {
            badge: 'bg-rose-50/80 text-rose-800 border border-rose-200 font-medium',
            icon: 'text-rose-500',
        },
    };

    const currentStyle = variantStyles[result.variant];

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-lg whitespace-nowrap transition-colors ${sizeClasses} ${currentStyle.badge} ${className}`}
            title={`Deadline: ${result.dueDateTimeFormatted}${result.explanation ? ` • ${result.explanation}` : ''}`}
            role="status"
            aria-label={`${result.label} (Due: ${result.dueDateFormatted})`}
        >
            {showIcon && (
                <>
                    {result.variant === 'danger' && (
                        <svg className={`${iconSizeClasses} ${currentStyle.icon} shrink-0 animate-pulse`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    )}
                    {result.variant === 'warning' && (
                        <svg className={`${iconSizeClasses} ${currentStyle.icon} shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                    {result.variant === 'soon' && (
                        <svg className={`${iconSizeClasses} ${currentStyle.icon} shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    )}
                    {result.variant === 'success' && (
                        <svg className={`${iconSizeClasses} ${currentStyle.icon} shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                    {result.variant === 'late_done' && (
                        <svg className={`${iconSizeClasses} ${currentStyle.icon} shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                    {result.variant === 'neutral' && (
                        <svg className={`${iconSizeClasses} ${currentStyle.icon} shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    )}
                </>
            )}

            {showDatePrefix && (
                <span className={result.isOverdue ? 'font-bold text-red-700' : 'text-slate-500'}>
                    Due {result.dueDateFormatted} ·{' '}
                </span>
            )}

            <span className={result.isOverdue ? 'font-bold' : ''}>
                {result.label}
            </span>
        </span>
    );
}
