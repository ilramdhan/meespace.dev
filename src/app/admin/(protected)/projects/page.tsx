"use client";

import projectsData from "@/data/admin-projects.json";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { ProjectModal } from "@/components/admin/ui/ProjectModal";
import { useState } from "react";

export default function AdminProjectsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getIconColorClasses = (color: string) => {
        const map: Record<string, string> = {
            blue: "bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/20 text-blue-500",
            purple: "bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/40 dark:to-purple-800/20 text-purple-500",
            orange: "bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/40 dark:to-orange-800/20 text-orange-500",
            gray: "bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 text-gray-500",
            teal: "bg-gradient-to-br from-teal-100 to-teal-50 dark:from-teal-900/40 dark:to-teal-800/20 text-teal-600",
        };
        return (
            map[color] ||
            "bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 text-gray-500"
        );
    };

    const getStatusBadgeClasses = (status: string) => {
        switch (status) {
            case "Published":
                return "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-100 dark:border-green-800";
            case "Draft":
                return "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-800";
            case "Archived":
                return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700";
            default:
                return "bg-gray-50 text-gray-600 border-gray-200";
        }
    };

    const getStatusDotColor = (status: string) => {
        switch (status) {
            case "Published":
                return "bg-green-500";
            case "Draft":
                return "bg-yellow-500";
            case "Archived":
                return "bg-gray-400";
            default:
                return "bg-gray-400";
        }
    };

    const RightAction = (
        <>
            <div className="relative flex-1 sm:flex-none">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                    search
                </span>
                <input
                    type="text"
                    placeholder="Search projects..."
                    className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-full text-sm placeholder-gray-400 focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green outline-none transition-all"
                />
            </div>
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-text-main rounded-full text-sm font-bold shadow-sm transition-colors whitespace-nowrap cursor-pointer"
            >
                <span className="material-symbols-outlined text-sm">add</span>
                New Project
            </button>
        </>
    );

    return (
        <div className="flex flex-col gap-6">
            <AdminPageHeader
                title="Projects Management"
                description="Manage and organize your portfolio case studies."
                rightAction={RightAction}
            />

            <div className="max-w-[1400px] w-full mx-auto px-8 pb-8">
                <div className="bento-card bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                            <button className="font-medium text-sage-green border-b-2 border-sage-green px-1 py-2 cursor-pointer">
                                All Projects (12)
                            </button>
                            <button className="font-medium text-text-muted hover:text-text-main px-1 py-2 transition-colors cursor-pointer">
                                Published (8)
                            </button>
                            <button className="font-medium text-text-muted hover:text-text-main px-1 py-2 transition-colors cursor-pointer">
                                Drafts (3)
                            </button>
                            <button className="font-medium text-text-muted hover:text-text-main px-1 py-2 transition-colors cursor-pointer">
                                Archived (1)
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                className="p-2 text-text-muted hover:text-text-main hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                                title="Filter"
                            >
                                <span className="material-symbols-outlined text-lg">
                                    filter_list
                                </span>
                            </button>
                            <button
                                className="p-2 text-text-muted hover:text-text-main hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                                title="Sort"
                            >
                                <span className="material-symbols-outlined text-lg">
                                    sort
                                </span>
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50/50 dark:bg-white/5 text-text-muted dark:text-gray-400 font-medium">
                                <tr>
                                    <th className="px-6 py-4 w-12">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-sage-green focus:ring-sage-green"
                                        />
                                    </th>
                                    <th className="px-6 py-4">Project Title</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {projectsData.map((project) => (
                                    <tr
                                        key={project.id}
                                        className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-sage-green focus:ring-sage-green"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="size-12 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700">
                                                    <div
                                                        className={`w-full h-full flex items-center justify-center ${getIconColorClasses(
                                                            project.iconColor
                                                        )}`}
                                                    >
                                                        <span className="material-symbols-outlined">
                                                            {project.icon}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-text-main dark:text-white">
                                                        {project.title}
                                                    </h3>
                                                    <p className="text-xs text-text-muted mt-0.5">
                                                        ID: #{project.id}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-text-muted">
                                            {project.category}
                                        </td>
                                        <td className="px-6 py-4 text-text-muted">
                                            {project.date}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeClasses(
                                                    project.status
                                                )}`}
                                            >
                                                <span
                                                    className={`size-1.5 rounded-full ${getStatusDotColor(
                                                        project.status
                                                    )}`}
                                                ></span>
                                                {project.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2 text-text-muted">
                                                <button
                                                    onClick={() =>
                                                        setIsModalOpen(true)
                                                    }
                                                    className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-full hover:text-sage-green hover:shadow-sm transition-all group-hover:visible cursor-pointer"
                                                    title="Edit"
                                                >
                                                    <span className="material-symbols-outlined text-lg">
                                                        edit
                                                    </span>
                                                </button>
                                                <button
                                                    className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-full hover:text-red-500 hover:shadow-sm transition-all group-hover:visible cursor-pointer"
                                                    title="Delete"
                                                >
                                                    <span className="material-symbols-outlined text-lg">
                                                        delete
                                                    </span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <ProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
