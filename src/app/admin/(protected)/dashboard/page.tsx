import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { DashboardStats } from "@/components/admin/ui/DashboardStats";
import { RecentActivity } from "@/components/admin/ui/RecentActivity";
import { VisitorAnalytics } from "@/components/admin/ui/VisitorAnalytics";
import dashboardData from "@/data/admin-dashboard.json";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Dashboard - Sarah Jenkins",
};

export default function AdminDashboardPage() {
    const RightAction = (
        <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium text-text-main dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-sm">
                    refresh
                </span>
                Refresh Data
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-text-main rounded-full text-sm font-bold shadow-sm transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-sm">add</span>
                New Entry
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

                <DashboardStats stats={dashboardData.stats} />

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
                                            Last deployed: 2 hours ago via Vercel
                                        </p>
                                    </div>
                                </div>
                                <button className="px-4 py-2 text-sm font-medium text-sage-green border border-sage-green/30 rounded-full hover:bg-sage-light dark:hover:bg-sage-green/20 transition-colors cursor-pointer">
                                    View Live Site
                                </button>
                            </div>
                        </div>

                        {/* Action Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bento-card bg-white dark:bg-[#1e1e1e] rounded-xl p-6 border border-gray-100 dark:border-gray-800 hover:border-primary/50 cursor-pointer group transition-all">
                                <div className="size-12 rounded-xl bg-sage-light dark:bg-sage-green/20 flex items-center justify-center text-sage-green dark:text-sage-light mb-4 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">
                                        add_box
                                    </span>
                                </div>
                                <h4 className="text-lg font-bold text-text-main dark:text-white mb-1">
                                    Add New Project
                                </h4>
                                <p className="text-sm text-text-muted dark:text-gray-400 mb-4">
                                    Create a new case study entry for your portfolio.
                                </p>
                                <span className="text-xs font-semibold text-sage-green dark:text-sage-light flex items-center gap-1 group-hover:gap-2 transition-all">
                                    Create Now{" "}
                                    <span className="material-symbols-outlined text-sm">
                                        arrow_forward
                                    </span>
                                </span>
                            </div>
                            <div className="bento-card bg-white dark:bg-[#1e1e1e] rounded-xl p-6 border border-gray-100 dark:border-gray-800 hover:border-primary/50 cursor-pointer group transition-all">
                                <div className="size-12 rounded-xl bg-accent-purple/50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-300 mb-4 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined">
                                        edit_document
                                    </span>
                                </div>
                                <h4 className="text-lg font-bold text-text-main dark:text-white mb-1">
                                    Write New Article
                                </h4>
                                <p className="text-sm text-text-muted dark:text-gray-400 mb-4">
                                    Draft a new blog post or industry insight.
                                </p>
                                <span className="text-xs font-semibold text-purple-600 dark:text-purple-300 flex items-center gap-1 group-hover:gap-2 transition-all">
                                    Start Writing{" "}
                                    <span className="material-symbols-outlined text-sm">
                                        arrow_forward
                                    </span>
                                </span>
                            </div>
                        </div>

                        <VisitorAnalytics data={dashboardData.analytics} />
                    </div>

                    <div className="lg:col-span-1">
                        <RecentActivity activity={dashboardData.activity} />
                    </div>
                </div>
            </div>
        </div>
    );
}
