import React from 'react';
import { Link } from '@inertiajs/react';

interface TextLinkProps {
    href?: string;
    onClick?: (e: React.MouseEvent) => void;
    children: React.ReactNode;
    className?: string;
    arrow?: boolean;
    variant?: 'brand' | 'muted' | 'danger';
    size?: 'xs' | 'sm' | 'base';
    title?: string;
}

export default function TextLink({
    href,
    onClick,
    children,
    className = '',
    arrow = false,
    variant = 'brand',
    size = 'xs',
    title,
}: TextLinkProps) {
    const sizeClasses = {
        xs: 'text-xs',
        sm: 'text-sm',
        base: 'text-base',
    }[size];

    const variantClasses = {
        brand: 'text-[#E31B23] hover:text-[#c4141b] font-semibold',
        muted: 'text-slate-500 hover:text-slate-800 font-medium',
        danger: 'text-red-600 hover:text-red-800 font-semibold',
    }[variant];

    const content = (
        <span className={`inline-flex items-center gap-1 group transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-[#E31B23]/20 rounded ${sizeClasses} ${variantClasses} ${className}`}>
            <span>{children}</span>
            {arrow && (
                <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">
                    →
                </span>
            )}
        </span>
    );

    if (href) {
        return (
            <Link href={href} title={title} className="inline-flex">
                {content}
            </Link>
        );
    }

    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className="inline-flex bg-transparent border-0 p-0 cursor-pointer"
        >
            {content}
        </button>
    );
}
