"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { useToast } from "@/components/shared/Toast";
import { apiCall } from "@/hooks/useApi";

interface Comment {
    id: string;
    post_id: string;
    author_name: string;
    author_email?: string;
    author_initials: string;
    author_initials_color: string;
    content: string;
    likes_count: number;
    is_approved: boolean;
    depth: number;
    parent_comment_id?: string;
    created_at: string;
    post?: {
        title: string;
        slug: string;
    };
}

interface BlogPost {
    id: string;
    title: string;
    slug: string;
}

export default function AdminCommentsPage() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState<string>("all");
    const [deleteComment, setDeleteComment] = useState<Comment | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const { showToast } = useToast();

    // Fetch all blog posts for filter
    const fetchPosts = useCallback(async () => {
        const res = await apiCall<{ posts: BlogPost[] }>('/api/v1/blog?admin=true');
        if (res.success && res.data?.posts) {
            setPosts(res.data.posts);
        }
    }, []);

    // Fetch comments for selected post
    const fetchComments = useCallback(async () => {
        setIsLoading(true);

        if (selectedPost === "all") {
            const allComments: Comment[] = [];
            for (const post of posts) {
                const res = await apiCall<{ comments: Comment[] }>(`/api/v1/blog/${post.slug}/comments?admin=true`);
                if (res.success && res.data?.comments) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const flattenComments = (comments: any[], post: BlogPost): Comment[] => {
                        return comments.flatMap(c => [
                            { ...c, post: { title: post.title, slug: post.slug } },
                            ...flattenComments(c.replies || [], post)
                        ]);
                    };
                    allComments.push(...flattenComments(res.data.comments, post));
                }
            }
            setComments(allComments.sort((a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            ));
        } else {
            const post = posts.find(p => p.slug === selectedPost);
            if (post) {
                const res = await apiCall<{ comments: Comment[] }>(`/api/v1/blog/${selectedPost}/comments?admin=true`);
                if (res.success && res.data?.comments) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const flattenComments = (comments: any[]): Comment[] => {
                        return comments.flatMap(c => [
                            { ...c, post: { title: post.title, slug: post.slug } },
                            ...flattenComments(c.replies || [])
                        ]);
                    };
                    setComments(flattenComments(res.data.comments));
                }
            }
        }

        setIsLoading(false);
    }, [selectedPost, posts]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    useEffect(() => {
        if (posts.length > 0) {
            fetchComments();
        }
    }, [posts, fetchComments]);

    const handleDelete = async () => {
        if (!deleteComment) return;

        const post = posts.find(p => p.id === deleteComment.post_id) || deleteComment.post;
        if (!post) {
            showToast("Error: Post not found", "error");
            return;
        }

        setDeleteLoading(true);
        const res = await apiCall(`/api/v1/blog/${post.slug}/comments?id=${deleteComment.id}`, {
            method: 'DELETE',
        });
        setDeleteLoading(false);

        if (res.success) {
            showToast("Comment deleted successfully", "success");
            fetchComments();
        } else {
            showToast(res.error || "Failed to delete comment", "error");
        }

        setDeleteComment(null);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getColorClasses = (color: string) => {
        const colorMap: Record<string, string> = {
            blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
            green: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
            purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
            orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
            red: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
            cyan: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300',
        };
        return colorMap[color] || colorMap.blue;
    };

    const RightAction = (
        <div className="flex items-center gap-3">
            <select
                value={selectedPost}
                onChange={(e) => setSelectedPost(e.target.value)}
                className="bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2.5 text-sm text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
                <option value="all">All Posts</option>
                {posts.map((post) => (
                    <option key={post.id} value={post.slug}>{post.title}</option>
                ))}
            </select>
            <span className="text-sm text-text-muted bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-full">
                {comments.length} comment{comments.length !== 1 ? 's' : ''}
            </span>
        </div>
    );

    return (
        <div className="flex flex-col gap-6">
            <AdminPageHeader
                title="Comments Management"
                description="View and manage blog comments across all posts."
                rightAction={RightAction}
            />

            <div className="max-w-[1400px] w-full mx-auto px-8 pb-8">
                <div className="bento-card bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                    {/* Loading State */}
                    {isLoading ? (
                        <div className="p-8">
                            <div className="animate-pulse space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : comments.length > 0 ? (
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {comments.map((comment) => (
                                <div key={comment.id} className="p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                    <div className="flex items-start gap-4">
                                        <div className={`size-10 rounded-full ${getColorClasses(comment.author_initials_color)} flex items-center justify-center font-bold text-sm shrink-0`}>
                                            {comment.author_initials}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                                <span className="font-semibold text-sm text-text-main dark:text-white">
                                                    {comment.author_name}
                                                </span>
                                                {comment.author_email && (
                                                    <span className="text-xs text-text-muted">
                                                        ({comment.author_email})
                                                    </span>
                                                )}
                                                <span className="text-xs text-text-muted">
                                                    {formatDate(comment.created_at)}
                                                </span>
                                                {comment.depth > 0 && (
                                                    <span className="text-xs bg-primary/10 text-primary-dark px-1.5 py-0.5 rounded-full font-medium">
                                                        reply
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-text-main dark:text-gray-300 mb-2 whitespace-pre-wrap line-clamp-3">
                                                {comment.content}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs">
                                                <span className="text-text-muted">
                                                    On: <a href={`/insights/${comment.post?.slug}`} target="_blank" className="text-primary-dark hover:underline font-medium">
                                                        {comment.post?.title}
                                                    </a>
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setDeleteComment(comment)}
                                            className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                                            title="Delete comment"
                                        >
                                            <span className="material-symbols-outlined text-lg">delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-4">chat_bubble</span>
                            <p className="text-text-muted">No comments yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={!!deleteComment}
                title="Delete Comment"
                message={deleteComment ? `Are you sure you want to delete this comment by "${deleteComment.author_name}"? This action cannot be undone.` : ''}
                onConfirm={handleDelete}
                onCancel={() => setDeleteComment(null)}
                confirmLabel="Delete"
                variant="danger"
                isLoading={deleteLoading}
            />
        </div>
    );
}
