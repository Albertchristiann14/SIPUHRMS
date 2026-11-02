/**
 * Semantic status design tokens for SIPU Swiss-Belinn SKA Pekanbaru
 * Separates brand red (#E31B23) from danger status (#EF4444 / #DC2626)
 * and enforces colorblind-friendly text/border/icon semantics.
 */

export type SemanticStatus = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface SemanticToken {
    text: string;
    bg: string;
    border: string;
    ring: string;
    iconColor: string;
    dotColor: string;
    label: string;
}

export const SEMANTIC_TOKENS: Record<SemanticStatus, SemanticToken> = {
    // Brand primary is #E31B23 (Swiss-Belinn Signature Red)
    // Danger is Rose/Red-600 with distinct border and warning iconography
    danger: {
        text: 'text-red-700',
        bg: 'bg-red-50',
        border: 'border-red-200',
        ring: 'ring-red-100',
        iconColor: 'text-red-600',
        dotColor: 'bg-red-500',
        label: 'Bahaya / Terlambat',
    },
    // Warning: Amber/Orange for pending approvals and nearing deadlines
    warning: {
        text: 'text-amber-800',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        ring: 'ring-amber-100',
        iconColor: 'text-amber-600',
        dotColor: 'bg-amber-500',
        label: 'Perhatian / Menunggu',
    },
    // Success: Emerald for completed, approved, present, available
    success: {
        text: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        ring: 'ring-emerald-100',
        iconColor: 'text-emerald-600',
        dotColor: 'bg-emerald-500',
        label: 'Sukses / Selesai',
    },
    // Info: Sky / Blue for active, informational, in-progress
    info: {
        text: 'text-sky-700',
        bg: 'bg-sky-50',
        border: 'border-sky-200',
        ring: 'ring-sky-100',
        iconColor: 'text-sky-600',
        dotColor: 'bg-sky-500',
        label: 'Informasi / Dalam Proses',
    },
    // Neutral: Slate
    neutral: {
        text: 'text-slate-700',
        bg: 'bg-slate-50',
        border: 'border-slate-200',
        ring: 'ring-slate-100',
        iconColor: 'text-slate-500',
        dotColor: 'bg-slate-400',
        label: 'Netral',
    },
};
