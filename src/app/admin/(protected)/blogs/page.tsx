"use client";

import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { BlogModal } from "@/components/admin/ui/BlogModal";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { useToast } from "@/components/shared/Toast";
import { apiCall } from "@/hooks/useApi";
import { useState, useEffect, useCallback } from "react";

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    status: 'published' | 'draft' | 'scheduled';
    is_featured: boolean;
    view_count: number;
    created_at: string;
    published_at?: string;
    category?: { name: string };
}

interface ApiResponse {
    posts: BlogPost[];
    total: number;
}

export default function AdminBlogPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [deletePost, setDeletePost] = useState<BlogPost | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { showToast } = useToast();

    // Fetch blog posts from API
    const fetchPosts = useCallback(async () => {
        setIsLoading(true);
        const result = await apiCall<ApiResponse>('/api/v1/blog?admin=true');
        if (result.success && result.data) {
            setPosts(result.data.posts || []);
        } else {
            showToast(result.error || 'Failed to load blog posts', 'error');
        }
        setIsLoading(false);
    }, [showToast]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    // Stats
    const stats = [
        { label: "Total Articles", value: posts.length.toString(), icon: "article", color: "blue" },
        { label: "Total Views", value: posts.reduce((acc, p) => acc + (p.view_count || 0), 0).toLocaleString(), icon: "visibility", color: "purple" },
        { label: "Drafts", value: posts.filter(p => p.status === 'draft').length.toString(), icon: "edit_note", color: "orange" },
    ];

    // Category badge classes
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
            case "published": return "bg-green-500";
            case "draft": return "bg-gray-300 dark:bg-gray-600";
            case "scheduled": return "bg-yellow-400";
            default: return "bg-gray-400";
        }
    };

    const getStatusBadgeClasses = (status: string) => {
        switch (status) {
            case "published": return "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400";
            case "draft": return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
            case "scheduled": return "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
            default: return "bg-gray-50 text-gray-600";
        }
    };

    // Filter posts
    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || post.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const counts = {
        all: posts.length,
        published: posts.filter(p => p.status === 'published').length,
        draft: posts.filter(p => p.status === 'draft').length,
        scheduled: posts.filter(p => p.status === 'scheduled').length,
    };

    // Handle delete
    const handleDelete = async () => {
        if (!deletePost) return;

        setIsDeleting(true);
        const result = await apiCall(`/api/v1/blog/${deletePost.slug}`, { method: 'DELETE' });

        if (result.success) {
            showToast(`"${deletePost.title}" deleted successfully`, 'success');
            setPosts(prev => prev.filter(p => p.id !== deletePost.id));
        } else {
            showToast(result.error || 'Failed to delete post', 'error');
        }

        setIsDeleting(false);
        setDeletePost(null);
    };

    // Handle modal close
    const handleModalClose = (saved?: boolean) => {
        setIsModalOpen(false);
        setEditingPost(null);
        if (saved) fetchPosts();
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const RightAction = (
        <div className="flex gap-3">
            <button
                onClick={() => { setEditingPost(null); setIsModalOpen(true); }}
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
                                <span className="text-sm text-text-muted dark:text-gray-400 block">{stat.label}</span>
                                <span className="text-2xl font-bold text-text-main dark:text-white">{stat.value}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Blog Posts Table */}
                <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm flex flex-col">
                    {/* Filters */}
                    <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="relative w-full sm:w-64">
                                <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-lg">search</span>
                                <input
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-white/5 border-none rounded-xl text-sm text-text-main dark:text-white focus:ring-2 focus:ring-sage-green/50 placeholder-gray-400"
                                    placeholder="Search by title..."
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {['all', 'published', 'draft', 'scheduled'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${statusFilter === status
                                        ? 'bg-sage-light dark:bg-sage-green/20 text-sage-green'
                                        : 'text-text-muted hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)} ({counts[status as keyof typeof counts]})
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Loading State */}
                    {isLoading ? (
                        <div className="p-8 animate-pulse space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    <div className="flex-1">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredPosts.length === 0 ? (
                        <div className="text-center py-16">
                            <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-4">article</span>
                            <p className="text-text-muted mb-4">
                                {posts.length === 0 ? "No blog posts yet" : "No posts match your filter"}
                            </p>
                            {posts.length === 0 && (
                                <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-primary hover:bg-primary-dark text-text-main rounded-lg text-sm font-medium transition-colors">
                                    Create your first post
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50/50 dark:bg-white/5 text-text-muted dark:text-gray-400 font-medium">
                                    <tr>
                                        <th className="px-6 py-4">Title</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Views</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {filteredPosts.map((post) => (
                                        <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <h3 className="font-semibold text-text-main dark:text-white">{post.title}</h3>
                                                    <p className="text-xs text-text-muted mt-0.5">/{post.slug}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryBadgeClasses(post.category?.name || '')}`}>
                                                    {post.category?.name || 'Uncategorized'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-text-muted">
                                                {formatDate(post.published_at || post.created_at)}
                                            </td>
                                            <td className="px-6 py-4 text-text-muted">
                                                {(post.view_count || 0).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeClasses(post.status)}`}>
                                                    <span className={`size-1.5 rounded-full ${getStatusDotColor(post.status)}`}></span>
                                                    {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => { setEditingPost(post); setIsModalOpen(true); }}
                                                        className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-full hover:text-sage-green hover:shadow-sm transition-all cursor-pointer text-text-muted"
                                                        title="Edit"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => setDeletePost(post)}
                                                        className="p-2 hover:bg-white dark:hover:bg-white/10 rounded-full hover:text-red-500 hover:shadow-sm transition-all cursor-pointer text-text-muted"
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

            {/* Blog Modal */}
            <BlogModal
                isOpen={isModalOpen}
                onClose={() => handleModalClose()}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={!!deletePost}
                title="Delete Blog Post"
                message={`Are you sure you want to delete "${deletePost?.title}"? This action cannot be undone.`}
                confirmLabel="Delete"
                cancelLabel="Cancel"
                variant="danger"
                onConfirm={handleDelete}
                onCancel={() => setDeletePost(null)}
                isLoading={isDeleting}
            />
        </div>
    );
}
