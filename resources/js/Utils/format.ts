/**
 * Text formatting, pluralization, and activity formatting utilities
 * for SIPU Swiss-Belinn SKA Pekanbaru
 */

/**
 * Format a number and label with neutral, singular/plural grammar
 * Examples:
 * pluralize(1, 'Asset', 'Assets') => '1 Asset'
 * pluralize(2, 'Asset', 'Assets') => '2 Assets'
 * pluralize(1, 'Pending', 'Pending') => '1 Pending'
 */
export function pluralize(count: number, singular: string, plural?: string): string {
    const pluralForm = plural || `${singular}s`;
    return `${count} ${count === 1 ? singular : pluralForm}`;
}

/**
 * Format activity log into a natural Indonesian sentence with an active verb
 * Example: "Albert Christian memperbarui task 'Perbaikan AC Ballroom'"
 */
export function formatActivitySentence(activity: any): {
    userName: string;
    verb: string;
    taskTitle: string;
    fullSentence: string;
} {
    const userName = activity.employee?.user?.name || activity.user?.name || 'User';
    const taskTitle = activity.task?.title || activity.title || 'Task';
    const type = String(activity.activity_type || activity.type || '').toLowerCase();

    let verb = 'memperbarui';

    if (type.includes('create')) {
        verb = 'membuat';
    } else if (type.includes('status') || type.includes('move')) {
        verb = 'mengubah status';
    } else if (type.includes('assign')) {
        verb = 'menugaskan';
    } else if (type.includes('comment')) {
        verb = 'mengomentari';
    } else if (type.includes('attach') || type.includes('file')) {
        verb = 'mengunggah lampiran pada';
    } else if (type.includes('check') || type.includes('item')) {
        verb = 'memperbarui checklist pada';
    } else if (type.includes('approve')) {
        verb = 'menyetujui (approve)';
    } else if (type.includes('revis')) {
        verb = 'meminta revisi pada';
    }

    return {
        userName,
        verb,
        taskTitle,
        fullSentence: `${userName} ${verb} task ${taskTitle}`,
    };
}
