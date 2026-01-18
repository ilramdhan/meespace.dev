"use client";

import { useState, useRef, useEffect } from "react";
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from "next/navigation";
import Link from "next/link";

export function AdminHeader() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await supabase.auth.signOut();
            router.push('/admin/login?error=signout_success');
        } catch (error) {
            console.error('Logout error:', error);
            router.push('/admin/login');
        }
    };

    return (
        <header className="w-full h-16 bg-background-light dark:bg-background-dark flex items-center justify-between px-8 py-4 shrink-0">
            <div className="flex items-center text-sm text-text-muted dark:text-gray-400 font-medium">
                <Link href="/admin/dashboard" className="hover:text-primary-dark transition-colors">Admin</Link>
                <span className="material-symbols-outlined text-sm mx-2">
                    chevron_right
                </span>
                <span className="text-text-main dark:text-white font-semibold">
                    Dashboard
                </span>
            </div>
            <div className="flex items-center gap-4">
                {/* Notification Bell - Placeholder */}
                <button
                    className="p-2 text-text-muted hover:text-text-main relative cursor-pointer"
                    title="Notifications (coming soon)"
                >
                    <span className="material-symbols-outlined">
                        notifications
                    </span>
                    <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-background-light dark:border-background-dark"></span>
                </button>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 hover:bg-white dark:hover:bg-white/5 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                    >
                        <div className="size-8 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 bg-primary/20 text-primary-dark text-xs flex items-center justify-center font-bold">
                            A
                        </div>
                        <span className="text-sm font-medium text-text-main dark:text-white hidden md:block">
                            Admin
                        </span>
                        <span className={`material-symbols-outlined text-text-muted text-sm transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
                            expand_more
                        </span>
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1e1e1e] rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                            <Link
                                href="/admin/settings"
                                className="flex items-center gap-2 px-4 py-2 text-sm text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                <span className="material-symbols-outlined text-lg">settings</span>
                                Settings
                            </Link>
                            <hr className="my-2 border-gray-200 dark:border-gray-700" />
                            <button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                            >
                                {isLoggingOut ? (
                                    <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                                ) : (
                                    <span className="material-symbols-outlined text-lg">logout</span>
                                )}
                                {isLoggingOut ? 'Signing out...' : 'Sign out'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
