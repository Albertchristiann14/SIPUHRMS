import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Unhandled React Error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-6 text-center">
                        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 mb-2">Terjadi Kesalahan Tampilan</h2>
                        <p className="text-xs text-slate-600 mb-4 break-words font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-left">
                            {this.state.error?.message || 'Halaman mengalami kesalahan saat memuat komponen.'}
                        </p>
                        <div className="flex items-center justify-center gap-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-[#E31B23] hover:bg-[#c4141b] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                            >
                                Muat Ulang Halaman
                            </button>
                            <a
                                href="/dashboard"
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                            >
                                Kembali ke Dashboard
                            </a>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
