import React, { useState, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';

export interface PageHeaderBreadcrumb {
    label: string;
    href?: string;
}

export interface MoreActionItem {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
    danger?: boolean;
}

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    breadcrumbs?: PageHeaderBreadcrumb[];
    moduleName?: string;
    primaryAction?: {
        label: string;
        href?: string;
        onClick?: () => void;
        icon?: React.ReactNode;
    };
    secondaryAction?: {
        label: string;
        href?: string;
        onClick?: () => void;
        icon?: React.ReactNode;
    };
    moreActions?: MoreActionItem[];
    actions?: React.ReactNode; // custom actions slot
    children?: React.ReactNode; // custom slot or view switchers
}

export default function PageHeader({
    title,
    subtitle,
    breadcrumbs,
    moduleName,
    primaryAction,
    secondaryAction,
    moreActions = [],
    actions,
    children,
}: PageHeaderProps) {
    const [isMoreOpen, setIsMoreOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsMoreOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Construct default breadcrumb if not explicitly provided
    const resolvedBreadcrumbs: PageHeaderBreadcrumb[] = breadcrumbs || [
        { label: 'Main Menu', href: route('dashboard') },
        ...(moduleName ? [{ label: moduleName }] : []),
        { label: title },
    ];

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-1 min-w-0 w-full">
            {/* Left: Breadcrumbs + Title + Subtitle */}
            <div className="min-w-0 flex-1">
                {/* Standardized Breadcrumb */}
                <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1 overflow-x-auto whitespace-nowrap">
                    {resolvedBreadcrumbs.map((crumb, idx) => {
                        const isLast = idx === resolvedBreadcrumbs.length - 1;

                        return (
                            <React.Fragment key={idx}>
                                {crumb.href && !isLast ? (
                                    <Link
                                        href={crumb.href}
                                        className="hover:text-[#E31B23] transition-colors flex items-center gap-1"
                                    >
                                        {idx === 0 && (
                                            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                            </svg>
                                        )}
                                        <span>{crumb.label}</span>
                                    </Link>
                                ) : (
                                    <span className={isLast ? 'text-slate-900 font-semibold truncate' : 'text-slate-500'}>
                                        {crumb.label}
                                    </span>
                                )}

                                {!isLast && (
                                    <span className="text-slate-300 select-none">/</span>
                                )}
                            </React.Fragment>
                        );
                    })}
                </nav>

                {/* H1 Uniform Page Title */}
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 truncate">
                    {title}
                </h1>

                {subtitle && (
                    <p className="mt-0.5 text-xs sm:text-sm text-slate-500 line-clamp-2">
                        {subtitle}
                    </p>
                )}
            </div>

            {/* Right: Actions Slot (max 1 primary + 1 secondary + More actions) */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 flex-wrap">
                {actions}
                {children}

                {/* Secondary Action */}
                {secondaryAction && (
                    secondaryAction.href ? (
                        <Link
                            href={secondaryAction.href}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs transition-all active:scale-95 whitespace-nowrap"
                        >
                            {secondaryAction.icon}
                            <span>{secondaryAction.label}</span>
                        </Link>
                    ) : (
                        <button
                            type="button"
                            onClick={secondaryAction.onClick}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                        >
                            {secondaryAction.icon}
                            <span>{secondaryAction.label}</span>
                        </button>
                    )
                )}

                {/* Primary Action */}
                {primaryAction && (
                    primaryAction.href ? (
                        <Link
                            href={primaryAction.href}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#E31B23] hover:bg-[#c4141b] active:bg-[#a30f15] shadow-xs transition-all hover:scale-102 active:scale-95 whitespace-nowrap"
                        >
                            {primaryAction.icon || (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            )}
                            <span>{primaryAction.label}</span>
                        </Link>
                    ) : (
                        <button
                            type="button"
                            onClick={primaryAction.onClick}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#E31B23] hover:bg-[#c4141b] active:bg-[#a30f15] shadow-xs transition-all hover:scale-102 active:scale-95 cursor-pointer whitespace-nowrap"
                        >
                            {primaryAction.icon || (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            )}
                            <span>{primaryAction.label}</span>
                        </button>
                    )
                )}

                {/* More Actions Dropdown */}
                {moreActions.length > 0 && (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setIsMoreOpen(!isMoreOpen)}
                            aria-expanded={isMoreOpen}
                            aria-label="More actions"
                            className="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs transition-all active:scale-95 cursor-pointer"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                        </button>

                        {isMoreOpen && (
                            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl py-1.5 z-40 animate-fadeIn">
                                <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    More Actions
                                </div>
                                {moreActions.map((item, idx) => (
                                    item.href ? (
                                        <Link
                                            key={idx}
                                            href={item.href}
                                            onClick={() => setIsMoreOpen(false)}
                                            className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors ${
                                                item.danger ? 'text-red-600 hover:bg-red-50' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                        >
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </Link>
                                    ) : (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => {
                                                setIsMoreOpen(false);
                                                item.onClick?.();
                                            }}
                                            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-left transition-colors cursor-pointer ${
                                                item.danger ? 'text-red-600 hover:bg-red-50' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                        >
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </button>
                                    )
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
