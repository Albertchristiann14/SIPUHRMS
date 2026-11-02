/**
 * Date formatting utilities for SIPU Swiss-Belinn SKA Pekanbaru
 * Standardized to locale 'id-ID' (dd/MM/yyyy, 24-hour time) with Asia/Jakarta (WIB) timezone
 */

export const TIMEZONE = 'Asia/Jakarta';

/**
 * Parse an ISO date or date string into a Date object
 */
export function parseDate(value: string | Date | null | undefined): Date | null {
    if (!value) return null;
    if (value instanceof Date) {
        return isNaN(value.getTime()) ? null : value;
    }
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Format a date to dd/MM/yyyy (e.g. "30/10/2026")
 */
export function formatDate(value: string | Date | null | undefined): string {
    const d = parseDate(value);
    if (!d) return '-';

    return new Intl.DateTimeFormat('id-ID', {
        timeZone: TIMEZONE,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(d);
}

/**
 * Format a date with time to dd/MM/yyyy HH:mm (e.g. "30/10/2026 13:24")
 */
export function formatDateTime(value: string | Date | null | undefined): string {
    const d = parseDate(value);
    if (!d) return '-';

    const dateStr = new Intl.DateTimeFormat('id-ID', {
        timeZone: TIMEZONE,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(d);

    const timeStr = new Intl.DateTimeFormat('id-ID', {
        timeZone: TIMEZONE,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(d);

    return `${dateStr} ${timeStr}`;
}

/**
 * Format time only (e.g. "13:24")
 */
export function formatTime(value: string | Date | null | undefined): string {
    const d = parseDate(value);
    if (!d) return '-';

    return new Intl.DateTimeFormat('id-ID', {
        timeZone: TIMEZONE,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(d);
}

/**
 * Format a date with Indonesian month name (e.g. "30 Okt 2026" or "30 Oktober 2026")
 */
export function formatDateHuman(
    value: string | Date | null | undefined, 
    options?: { withYear?: boolean; monthFormat?: 'short' | 'long' }
): string {
    const d = parseDate(value);
    if (!d) return '-';

    const monthFormat = options?.monthFormat || 'short';
    const withYear = options?.withYear !== undefined ? options.withYear : true;

    return new Intl.DateTimeFormat('id-ID', {
        timeZone: TIMEZONE,
        day: 'numeric',
        month: monthFormat,
        year: withYear ? 'numeric' : undefined,
    }).format(d);
}

/**
 * Format full date with day name (e.g. "Senin, 02 November 2026")
 */
export function formatDateFull(value: string | Date | null | undefined): string {
    const d = parseDate(value);
    if (!d) return '-';

    return new Intl.DateTimeFormat('id-ID', {
        timeZone: TIMEZONE,
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(d);
}
