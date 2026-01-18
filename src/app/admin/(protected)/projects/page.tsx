"use client";

import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { ProjectModal } from "@/components/admin/ui/ProjectModal";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { useToast } from "@/components/shared/Toast";
import { apiCall } from "@/hooks/useApi";
import { useState, useEffect, useCallback } from "react";

interface Project {
    id: string;
    title: string;
    slug: string;
    subtitle?: string;
    category: string;
    icon: string;
    icon_color: string;
    status: 'published' | 'draft' | 'archived';
    is_featured: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
}

interface ApiResponse {
    projects: Project[];
    total: number;
}

export default function AdminProjectsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [deleteProject, setDeleteProject] = useState<Project | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { showToast } = useToast();

    // Fetch projects from API
    const fetchProjects = useCallback(async () => {
        setIsLoading(true);
        const result = await apiCall<ApiResponse>('/api/v1/projects?admin=true');
        if (result.success && result.data) {
            setProjects(result.data.projects || []);
        } else {
            showToast(result.error || 'Failed to load projects', 'error');
        }
        setIsLoading(false);
    }, [showToast]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    // Helper functions
    const getIconColorClasses = (color: string) => {
        const map: Record<string, string> = {
            blue: "bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/20 text-blue-500",
            purple: "bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/40 dark:to-purple-800/20 text-purple-500",
            orange: "bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/40 dark:to-orange-800/20 text-orange-500",
            gray: "bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 text-gray-500",
            teal: "bg-gradient-to-br from-teal-100 to-teal-50 dark:from-teal-900/40 dark:to-teal-800/20 text-teal-600",
            green: "bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/40 dark:to-green-800/20 text-green-600",
        };
        return map[color] || map["gray"];
    };

    const getStatusBadgeClasses = (status: string) => {
        switch (status) {
            case "published":
                return "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-100 dark:border-green-800";
            case "draft":
                return "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-800";
            case "archived":
                return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700";
            default:
                return "bg-gray-50 text-gray-600 border-gray-200";
        }
    };

    const getStatusDotColor = (status: string) => {
        switch (status) {
            case "published": return "bg-green-500";
            case "draft": return "bg-yellow-500";
            case "archived": return "bg-gray-400";
            default: return "bg-gray-400";
        }
    };

    // Filter projects
    const filteredProjects = projects.filter((project) => {
        const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || project.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Count by status
    const counts = {
        all: projects.length,
        published: projects.filter(p => p.status === 'published').length,
        draft: projects.filter(p => p.status === 'draft').length,
        archived: projects.filter(p => p.status === 'archived').length,
    };

    // Handle delete
    const handleDelete = async () => {
        if (!deleteProject) return;

        setIsDeleting(true);
        const result = await apiCall(`/api/v1/projects/${deleteProject.slug}`, { method: 'DELETE' });

        if (result.success) {
            showToast(`"${deleteProject.title}" deleted successfully`, 'success');
            setProjects(prev => prev.filter(p => p.id !== deleteProject.id));
        } else {
            showToast(result.error || 'Failed to delete project', 'error');
        }

        setIsDeleting(false);
        setDeleteProject(null);
    };

    // Handle modal close
    const handleModalClose = (saved?: boolean) => {
        setIsModalOpen(false);
        setEditingProject(null);
        if (saved) {
            fetchProjects();
        }
    };

    // Handle edit
    const handleEdit = (project: Project) => {
        setEditingProject(project);
        setIsModalOpen(true);
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-full text-sm placeholder-gray-400 focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green outline-none transition-all"
                />
            </div>
            <button
                onClick={() => {
                    setEditingProject(null);
                    setIsModalOpen(true);
                }}
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
                    {/* Tabs */}
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                            <button
                                onClick={() => setStatusFilter("all")}
                                className={`font-medium px-1 py-2 transition-colors cursor-pointer ${statusFilter === "all"
                                    ? "text-sage-green border-b-2 border-sage-green"
                                    : "text-text-muted hover:text-text-main"
                                    }`}
                            >
                                All Projects ({counts.all})
                            </button>
                            <button
                                onClick={() => setStatusFilter("published")}
                                className={`font-medium px-1 py-2 transition-colors cursor-pointer ${statusFilter === "published"
                                    ? "text-sage-green border-b-2 border-sage-green"
                                    : "text-text-muted hover:text-text-main"
                                    }`}
                            >
                                Published ({counts.published})
                            </button>
                            <button
                                onClick={() => setStatusFilter("draft")}
                                className={`font-medium px-1 py-2 transition-colors cursor-pointer ${statusFilter === "draft"
                                    ? "text-sage-green border-b-2 border-sage-green"
                                    : "text-text-muted hover:text-text-main"
                                    }`}
                            >
                                Drafts ({counts.draft})
                            </button>
                            <button
                                onClick={() => setStatusFilter("archived")}
                                className={`font-medium px-1 py-2 transition-colors cursor-pointer ${statusFilter === "archived"
                                    ? "text-sage-green border-b-2 border-sage-green"
                                    : "text-text-muted hover:text-text-main"
                                    }`}
                            >
                                Archived ({counts.archived})
                            </button>
                        </div>
                    </div>

                    {/* Loading State */}
                    {isLoading ? (
                        <div className="p-8">
                            <div className="animate-pulse space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                                        </div>
                                        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : filteredProjects.length === 0 ? (
                        <div className="text-center py-16">
                            <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-4">folder_off</span>
                            <p className="text-text-muted mb-4">
                                {projects.length === 0 ? "No projects yet" : "No projects match your filter"}
                            </p>
                            {projects.length === 0 && (
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-text-main rounded-lg text-sm font-medium transition-colors"
                                >
                                    Create your first project
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50/50 dark:bg-white/5 text-text-muted dark:text-gray-400 font-medium">
                                    <tr>
                                        <th className="px-6 py-4">Project Title</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {filteredProjects.map((project) => (
                                        <tr
                                            key={project.id}
                                            className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-12 rounded-lg overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700">
                                                        <div
                                                            className={`w-full h-full flex items-center justify-center ${getIconColorClasses(project.icon_color)}`}
                                                        >
                                                            <span className="material-symbols-outlined">
                                                                {project.icon || 'folder'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-text-main dark:text-white">
                                                            {project.title}
                                                        </h3>
                                                        <p className="text-xs text-text-muted mt-0.5">
                                                            /{project.slug}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-text-muted">
                                                {project.category}
                                            </td>
                                            <td className="px-6 py-4 text-text-muted">
                                                {formatDate(project.created_at)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeClasses(project.status)}`}
                                                >
                                                    <span className={`size-1.5 rounded-full ${getStatusDotColor(project.status)}`}></span>
                                                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2 text-text-muted">
                                                    <button
                                                        onClick={() => handleEdit(project)}
                                                        className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-full hover:text-sage-green hover:shadow-sm transition-all cursor-pointer"
                                                        title="Edit"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteProject(project)}
                                                        className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-full hover:text-red-500 hover:shadow-sm transition-all cursor-pointer"
                                                        title="Delete"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Project Modal */}
            <ProjectModal
                isOpen={isModalOpen}
                onClose={() => handleModalClose()}
                onSuccess={fetchProjects}
                editData={editingProject}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={!!deleteProject}
                title="Delete Project"
                message={`Are you sure you want to delete "${deleteProject?.title}"? This action cannot be undone.`}
                confirmLabel="Delete"
                cancelLabel="Cancel"
                variant="danger"
                onConfirm={handleDelete}
                onCancel={() => setDeleteProject(null)}
                isLoading={isDeleting}
            />
        </div>
    );
}
