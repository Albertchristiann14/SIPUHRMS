import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Badge from '@/Components/Badge';
import PageHeader from '@/Components/PageHeader';
import EmptyState from '@/Components/EmptyState';
import { formatDate } from '@/Utils/date';

export default function AnnouncementIndex({ announcements, auth, flash }: any) {
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        message: '',
        target_audience: 'All',
    });

    const isHR = auth.user.roles?.some((r: any) => r.name === 'Super Admin' || r.name === 'HRD / Admin' || r.name === 'General Manager');

    const submit = (e: any) => {
        e.preventDefault();
        post(route('announcements.store'), {
            onSuccess: () => {
                reset();
                setShowForm(false);
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <PageHeader
                    breadcrumbs={[
                        { label: 'Main Menu', href: route('dashboard') },
                        { label: 'Human Resources', href: route('dashboard', { view: 'hr' }) },
                        { label: 'Announcements' },
                    ]}
                    title="Internal Announcements"
                    subtitle="Pengumuman dan pemberitahuan resmi manajemen hotel untuk seluruh staf dan departemen."
                    primaryAction={isHR ? {
                        label: showForm ? 'Close Form' : 'New Announcement',
                        icon: (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        ),
                        onClick: () => setShowForm(!showForm),
                    } : undefined}
                />
            }
        >
            <Head title="Announcements" />

            <div className="py-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    
                    {flash?.success && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm shadow-xs">
                            <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>{flash.success}</span>
                        </div>
                    )}

                    {showForm && (
                        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
                            <h3 className="text-base font-semibold text-slate-900 mb-4">Post New Announcement</h3>
                            <form onSubmit={submit}>
                                <div className="mb-4">
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Announcement Title</label>
                                    <input 
                                        type="text" 
                                        value={data.title} 
                                        placeholder="Hotel announcement headline..."
                                        onChange={e => setData('title', e.target.value)}
                                        className="w-full rounded-xl border-slate-300 shadow-xs text-sm text-slate-900 focus:border-[#E31B23] focus:ring-1 focus:ring-[#E31B23] py-2.5 px-3"
                                    />
                                    {errors.title && <p className="text-rose-500 text-xs mt-1">{errors.title}</p>}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Message Content</label>
                                    <textarea 
                                        value={data.message} 
                                        onChange={e => setData('message', e.target.value)}
                                        placeholder="Write detailed announcement for staff members..."
                                        rows={4}
                                        className="w-full rounded-xl border-slate-300 shadow-xs text-sm text-slate-900 focus:border-[#E31B23] focus:ring-1 focus:ring-[#E31B23] py-2.5 px-3"
                                    />
                                    {errors.message && <p className="text-rose-500 text-xs mt-1">{errors.message}</p>}
                                </div>
                                <div className="mb-5">
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">Target Audience</label>
                                    <select 
                                        value={data.target_audience} 
                                        onChange={e => setData('target_audience', e.target.value)}
                                        className="w-full rounded-xl border-slate-300 shadow-xs text-sm text-slate-900 focus:border-[#E31B23] focus:ring-1 focus:ring-[#E31B23] py-2.5 px-3"
                                    >
                                        <option value="All">All Staff (All Employees)</option>
                                        <option value="Supervisors">HOD & Supervisors Only</option>
                                    </select>
                                    {errors.target_audience && <p className="text-rose-500 text-xs mt-1">{errors.target_audience}</p>}
                                </div>
                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                    <SecondaryButton onClick={() => setShowForm(false)}>
                                        Cancel
                                    </SecondaryButton>
                                    <PrimaryButton 
                                        type="submit" 
                                        disabled={processing}
                                    >
                                        {processing ? 'Publishing...' : 'Publish Announcement'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="space-y-4">
                        {announcements.length > 0 ? (
                            announcements.map((announcement: any) => (
                                <div key={announcement.id} className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 border-l-4 border-l-[#E31B23] hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2 gap-4">
                                        <h3 className="text-lg font-bold text-slate-900">{announcement.title}</h3>
                                        <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full font-medium shrink-0 tabular-nums">
                                            {formatDate(announcement.published_at)}
                                        </span>
                                    </div>
                                    <div className="text-xs text-slate-500 mb-4 flex items-center gap-2">
                                        <span className="font-semibold text-slate-700">{announcement.creator?.name || 'Admin'}</span>
                                        <span>&bull;</span>
                                        <Badge variant="brand">{announcement.target_audience}</Badge>
                                    </div>
                                    <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                        {announcement.message}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <EmptyState
                                title="Belum ada pengumuman"
                                description="Pengumuman resmi dari manajemen hotel akan ditampilkan di sini."
                                action={isHR ? {
                                    label: 'Buat Pengumuman',
                                    onClick: () => setShowForm(true),
                                } : undefined}
                            />
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
