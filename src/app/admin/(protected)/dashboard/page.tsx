"use client";

import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { DashboardStats } from "@/components/admin/ui/DashboardStats";
import { useToast } from "@/components/shared/Toast";
import { apiCall } from "@/hooks/useApi";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Stats {
    label: string;
    value: string;
    change: string;
    icon: string;
    color: string;
}

interface DashboardData {
    stats: Stats[];
    projectsCount: number;
    blogsCount: number;
    experiencesCount: number;
}

export default function AdminDashboardPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<DashboardData | null>(null);
    const { showToast } = useToast();

    // Fetch dashboard data from stats API
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        const result = await apiCall<DashboardData>('/api/v1/stats');

        if (result.success && result.data) {
            setData(result.data);
        } else {
            showToast(result.error || 'Failed to load dashboard data', 'error');
            // Fallback to default stats
            setData({
                stats: [
                    { label: "Total Projects", value: "0", change: "Total", icon: "folder_open", color: "blue" },
                    { label: "Blog Posts", value: "0", change: "Total", icon: "article", color: "purple" },
                    { label: "Total Views", value: "0", change: "This month", icon: "visibility", color: "green" },
                    { label: "Tech Stack", value: "0", change: "Tools", icon: "code", color: "orange" },
                ],
                projectsCount: 0,
                blogsCount: 0,
                experiencesCount: 0,
            });
        }
        setIsLoading(false);
    }, [showToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRefresh = () => {
        fetchData();
        showToast('Dashboard data refreshed', 'success');
    };

    const RightAction = (
        <div className="flex gap-3">
            <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium text-text-main dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50"
            >
                <span className={`material-symbols-outlined text-sm ${isLoading ? 'animate-spin' : ''}`}>
                    refresh
                </span>
                Refresh Data
            </button>
        </div>
    );

    return (
        <div className="flex flex-col gap-6">
            <AdminPageHeader
                title="Dashboard Overview"
                description="Here's what's happening with your portfolio today."
                rightAction={RightAction}
            />

            <div className="max-w-[1400px] w-full mx-auto px-8 flex flex-col gap-6 pb-8">

                {/* Stats */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-[#1e1e1e] rounded-xl p-6 border border-gray-100 dark:border-gray-800 animate-pulse">
                                <div className="flex items-center gap-4">
                                    <div className="size-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                                    <div className="flex-1">
                                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
                                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <DashboardStats stats={data?.stats || []} />
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* System Status Card */}
                        <div className="bento-card bg-white dark:bg-[#1e1e1e] rounded-xl p-6 border border-gray-100 dark:border-gray-800 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-sage-light/50 to-transparent dark:from-sage-green/10 pointer-events-none"></div>
                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="size-3 bg-green-500 rounded-full"></div>
                                        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-text-main dark:text-white">
                                            Website System Status: Online
                                        </h3>
                                        <p className="text-sm text-text-muted dark:text-gray-400">
                                            All systems operational
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    href="/"
                                    target="_blank"
                                    className="px-4 py-2 text-sm font-medium text-sage-green border border-sage-green/30 rounded-full hover:bg-sage-light dark:hover:bg-sage-green/20 transition-colors"
                                >
                                    View Live Site
                                </Link>
                            </div>
                        </div>

                        {/* Quick Action Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Link href="/admin/projects" className="bento-card bg-white dark:bg-[#1e1e1e] rounded-xl p-6 border border-gray-100 dark:border-gray-800 hover:border-primary/50 cursor-pointer group transition-all">
                                <div className="size-12 rounded-xl bg-sage-light dark:bg-sage-green/20 flex items-center justify-center text-sage-green dark:text-sage-light mb-4 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">add_box</span>
                                </div>
                                <h4 className="text-lg font-bold text-text-main dark:text-white mb-1">
                                    Manage Projects
                                </h4>
                                <p className="text-sm text-text-muted dark:text-gray-400 mb-4">
                                    Create and edit your portfolio case studies.
                                </p>
                                <span className="text-xs font-semibold text-sage-green dark:text-sage-light flex items-center gap-1 group-hover:gap-2 transition-all">
                                    Go to Projects
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </span>
                            </Link>
                            <Link href="/admin/blogs" className="bento-card bg-white dark:bg-[#1e1e1e] rounded-xl p-6 border border-gray-100 dark:border-gray-800 hover:border-primary/50 cursor-pointer group transition-all">
                                <div className="size-12 rounded-xl bg-accent-purple/50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-300 mb-4 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">edit_document</span>
                                </div>
                                <h4 className="text-lg font-bold text-text-main dark:text-white mb-1">
                                    Write New Article
                                </h4>
                                <p className="text-sm text-text-muted dark:text-gray-400 mb-4">
                                    Draft a new blog post or industry insight.
                                </p>
                                <span className="text-xs font-semibold text-purple-600 dark:text-purple-300 flex items-center gap-1 group-hover:gap-2 transition-all">
                                    Go to Blog
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </span>
                            </Link>
                        </div>

                        {/* Content Summary */}
                        <div className="bento-card bg-white dark:bg-[#1e1e1e] rounded-xl p-6 border border-gray-100 dark:border-gray-800">
                            <h3 className="text-lg font-bold text-text-main dark:text-white mb-4">Content Summary</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                                    <span className="text-3xl font-bold text-text-main dark:text-white">{data?.projectsCount || 0}</span>
                                    <p className="text-xs text-text-muted mt-1">Projects</p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                                    <span className="text-3xl font-bold text-text-main dark:text-white">{data?.blogsCount || 0}</span>
                                    <p className="text-xs text-text-muted mt-1">Blog Posts</p>
                                </div>
                                <div className="text-center p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                                    <span className="text-3xl font-bold text-text-main dark:text-white">{data?.experiencesCount || 0}</span>
                                    <p className="text-xs text-text-muted mt-1">Experiences</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:col-span-1">
                        <div className="bento-card bg-white dark:bg-[#1e1e1e] rounded-xl p-6 border border-gray-100 dark:border-gray-800 h-full">
                            <h3 className="text-lg font-bold text-text-main dark:text-white mb-4">Quick Links</h3>
                            <div className="space-y-2">
                                <Link href="/admin/tech-stack" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <span className="material-symbols-outlined text-blue-500">code</span>
                                    <span className="text-sm font-medium text-text-main dark:text-white">Tech Stack</span>
                                </Link>
                                <Link href="/admin/experiences" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <span className="material-symbols-outlined text-purple-500">work</span>
                                    <span className="text-sm font-medium text-text-main dark:text-white">Experiences</span>
                                </Link>
                                <Link href="/admin/settings" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <span className="material-symbols-outlined text-gray-500">settings</span>
                                    <span className="text-sm font-medium text-text-main dark:text-white">Settings</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
