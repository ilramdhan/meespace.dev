"use client";

import blogData from "@/data/admin-blog.json";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { BlogModal } from "@/components/admin/ui/BlogModal";
import { useState } from "react";
import { DashboardStats } from "@/components/admin/ui/DashboardStats";

export default function AdminBlogPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mock stats
    const stats = [
        {
            label: "Total Articles",
            value: "24",
            change: "Total Articles",
            icon: "article",
            color: "blue",
        },
        {
            label: "Total Views",
            value: "45.2k",
            change: "Total Views",
            icon: "visibility",
            color: "purple",
        },
        {
            label: "Drafts",
            value: "3",
            change: "Drafts",
            icon: "edit_note",
            color: "orange",
        },
    ];

    const getCategoryBadgeClasses = (category: string) => {
        const map: Record<string, string> = {
            "Product Mgmt": "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800",
            "Engineering": "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-100 dark:border-purple-800",
            "Process": "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border border-orange-100 dark:border-orange-800",
            "Soft Skills": "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-100 dark:border-green-800",
        };
        return map[category] || "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-100 dark:border-gray-700";
    };

    const getStatusDotColor = (status: string) => {
        switch (status) {
            case "Published":
                return "bg-green-500";
            case "Draft":
                return "bg-gray-300 dark:bg-gray-600";
            case "Scheduled":
                return "bg-yellow-400";
            default:
                return "bg-gray-400";
        }
    };

    const RightAction = (
        <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium text-text-main dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-sm">tune</span>
                Config
            </button>
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-text-main rounded-full text-sm font-bold shadow-sm transition-colors cursor-pointer"
            >
                <span className="material-symbols-outlined text-sm">add</span>
                Create New Post
            </button>
        </div>
    );

    return (
        <div className="flex flex-col gap-6">
            <AdminPageHeader
                title="Blog & Insights"
                description="Manage articles, case studies, and industry insights."
                rightAction={RightAction}
            />

            <div className="max-w-[1400px] w-full mx-auto px-8 pb-8 flex flex-col gap-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bento-card bg-white dark:bg-[#1e1e1e] rounded-xl p-5 border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                            <div className={`size-12 rounded-full flex items-center justify-center shrink-0 ${stat.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
                                stat.color === 'purple' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' :
                                    'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                                }`}>
                                <span className="material-symbols-outlined">{stat.icon}</span>
                            </div>
                            <div>
                                <span className="text-sm text-text-muted dark:text-gray-400 block">{stat.change}</span>
                                <span className="text-2xl font-bold text-text-main dark:text-white">{stat.value}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm flex flex-col">
                    <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#1e1e1e]">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="relative w-full sm:w-64">
                                <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-lg">search</span>
                                <input className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-white/5 border-none rounded-xl text-sm text-text-main dark:text-white focus:ring-2 focus:ring-sage-green/50 placeholder-gray-400" placeholder="Search by title, tag..." type="text" />
                            </div>
                            <div className="relative">
                                <select className="appearance-none bg-gray-50 dark:bg-white/5 border-none rounded-xl text-sm py-2 pl-4 pr-10 text-text-muted dark:text-gray-300 focus:ring-2 focus:ring-sage-green/50 cursor-pointer">
                                    <option>All Categories</option>
                                    <option>Product Mgmt</option>
                                    <option>Engineering</option>
                                    <option>Design</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-2.5 text-gray-400 pointer-events-none text-sm">expand_more</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            <span className="text-xs text-text-muted font-medium hidden sm:block">Bulk Actions:</span>
                            <button className="p-2 rounded-lg text-text-muted hover:bg-gray-100 dark:hover:bg-white/5 hover:text-red-500 transition-colors cursor-pointer" title="Delete Selected">
                                <span className="material-symbols-outlined">delete</span>
                            </button>
                            <button className="p-2 rounded-lg text-text-muted hover:bg-gray-100 dark:hover:bg-white/5 hover:text-sage-green transition-colors cursor-pointer" title="Archive Selected">
                                <span className="material-symbols-outlined">archive</span>
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-white/5">
                                <tr>
                                    <th className="px-6 py-4 text-left w-12">
                                        <input className="rounded border-gray-300 text-sage-green focus:ring-sage-green bg-white dark:bg-black/20 dark:border-gray-600 size-4 cursor-pointer" type="checkbox" />
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted dark:text-gray-400 uppercase tracking-wider">Article Title</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted dark:text-gray-400 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted dark:text-gray-400 uppercase tracking-wider">Views</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted dark:text-gray-400 uppercase tracking-wider">Published Date</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-text-muted dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-[#1e1e1e]">
                                {blogData.map((post) => (
                                    <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <input className="rounded border-gray-300 text-sage-green focus:ring-sage-green bg-white dark:bg-black/20 dark:border-gray-600 size-4 cursor-pointer" type="checkbox" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span
                                                    onClick={() => setIsModalOpen(true)}
                                                    className="text-sm font-semibold text-text-main dark:text-white group-hover:text-sage-green transition-colors cursor-pointer"
                                                >
                                                    {post.title}
                                                </span>
                                                <span className="text-xs text-text-muted dark:text-gray-500">Slug: {post.slug}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadgeClasses(post.category)}`}>
                                                {post.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`size-2 rounded-full ${getStatusDotColor(post.status)}`}></div>
                                                <span className="text-sm text-text-main dark:text-white">{post.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-text-muted dark:text-gray-400 font-medium">{post.views}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-text-muted dark:text-gray-400">{post.date}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => setIsModalOpen(true)}
                                                className="text-text-muted hover:text-sage-green transition-colors mx-1 cursor-pointer"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">edit</span>
                                            </button>
                                            <button className="text-text-muted hover:text-text-main transition-colors mx-1 cursor-pointer">
                                                <span className="material-symbols-outlined text-[20px]">visibility</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-[#1e1e1e]">
                        <span className="text-sm text-text-muted dark:text-gray-400">Showing <span className="font-medium text-text-main dark:text-white">1-5</span> of <span className="font-medium text-text-main dark:text-white">24</span> results</span>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-lg text-text-muted hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-50 transition-colors cursor-pointer" disabled>
                                Previous
                            </button>
                            <button className="px-3 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded-lg text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <BlogModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
