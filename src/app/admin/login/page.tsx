"use client";

import { AuthButton } from "@/components/admin/auth/AuthButton";
import { AuthCard } from "@/components/admin/auth/AuthCard";
import { AuthFooter } from "@/components/admin/auth/AuthFooter";
import { AuthHeader } from "@/components/admin/auth/AuthHeader";
import { SocialAuth } from "@/components/admin/auth/SocialAuth";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    const getErrorMessage = (errorCode: string | null) => {
        switch (errorCode) {
            case 'not_admin':
                return 'You are not authorized as an admin. Please contact the administrator to get access.';
            case 'callback_failed':
                return 'Authentication failed. Please try again.';
            case 'signout_success':
                return null; // This is a success message, not an error
            default:
                return errorCode ? 'An error occurred. Please try again.' : null;
        }
    };

    const errorMessage = getErrorMessage(error);
    const isSuccess = error === 'signout_success';

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-main transition-colors duration-200 min-h-screen flex flex-col">
            <AuthHeader />

            <main className="flex-grow flex items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
                <AuthCard
                    title="Welcome Back"
                    subtitle="Sign in to manage your portfolio"
                >
                    {/* Error/Success Messages */}
                    {errorMessage && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-lg mt-0.5">error</span>
                                <p>{errorMessage}</p>
                            </div>
                        </div>
                    )}
                    {isSuccess && (
                        <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-sm">
                            <div className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-lg mt-0.5">check_circle</span>
                                <p>You have been signed out successfully.</p>
                            </div>
                        </div>
                    )}

                    {/* Info about OAuth */}
                    <div className="mb-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-sm">
                        <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-lg mt-0.5">info</span>
                            <p>Please sign in with Google or GitHub. Email/password login is not available.</p>
                        </div>
                    </div>

                    {/* Disabled form - just for show */}
                    <form className="space-y-5 opacity-50 pointer-events-none">
                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2" htmlFor="email">
                                Email address
                            </label>
                            <input
                                className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm"
                                id="email"
                                name="email"
                                type="email"
                                placeholder="admin@example.com"
                                disabled
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm"
                                id="password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                disabled
                            />
                        </div>
                        <div>
                            <AuthButton type="button" disabled>Sign In</AuthButton>
                        </div>
                    </form>

                    <SocialAuth />

                    <p className="mt-8 text-center text-sm text-text-muted dark:text-gray-400">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/admin/register"
                            className="font-semibold text-text-main dark:text-white hover:text-primary-dark transition-colors"
                        >
                            Register
                        </Link>
                    </p>
                </AuthCard>
            </main>

            <AuthFooter />
        </div>
    );
}

export default function AdminLoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="animate-spin">
                    <span className="material-symbols-outlined text-4xl text-primary">progress_activity</span>
                </div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
