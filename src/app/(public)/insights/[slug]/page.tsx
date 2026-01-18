import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    content?: string;
    status: string;
    reading_time?: number;
    published_at?: string;
    created_at: string;
    category?: { name: string };
    author?: { full_name: string };
    comments?: { author: string; content: string; created_at: string }[];
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/v1/blog/${slug}`, { next: { revalidate: 60 } });
        if (!res.ok) return null;
        const data = await res.json();
        return data.data;
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await getBlogPost(slug);

    if (!post) {
        return { title: "Insight Not Found" };
    }

    return {
        title: `${post.title} - Insights`,
        description: post.excerpt,
    };
}

export default async function InsightDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getBlogPost(slug);

    if (!post) {
        notFound();
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className="w-full max-w-[1000px] mx-auto">
            <div className="mb-6">
                <Link href="/insights" className="inline-flex items-center gap-2 text-sm font-medium text-text-muted hover:text-primary-dark transition-colors pl-1">
                    <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                    Back to Insights
                </Link>
            </div>

            <article className="bg-white dark:bg-[#1e1e1e] rounded-[24px] shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden mb-12">
                <div className="px-8 py-10 md:px-16 md:py-16">
                    <span className="inline-block text-primary-dark font-bold tracking-wide text-xs uppercase mb-4 bg-primary/10 px-3 py-1 rounded-full">
                        {post.category?.name || 'General'}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-bold text-text-main dark:text-white mb-8 leading-[1.15] tracking-tight">
                        {post.title}
                    </h1>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 border-b border-gray-100 dark:border-gray-800 pb-8">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-full bg-gray-200 overflow-hidden shadow-inner relative">
                                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-xs">
                                    {post.author?.full_name?.charAt(0) || 'A'}
                                </div>
                            </div>
                            <div>
                                <p className="text-base font-bold text-text-main dark:text-white">
                                    {post.author?.full_name || 'Author'}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-text-muted">
                                    <span>{formatDate(post.published_at || post.created_at)}</span>
                                    <span className="size-1 bg-text-muted rounded-full"></span>
                                    <span>{post.reading_time || 5} min read</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-text-muted transition-colors text-sm font-medium group cursor-pointer">
                                <span className="material-symbols-outlined text-[20px] group-hover:text-primary-dark transition-colors">bookmark</span>
                                <span className="hidden sm:inline">Save</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-text-muted transition-colors text-sm font-medium group cursor-pointer">
                                <span className="material-symbols-outlined text-[20px] group-hover:text-primary-dark transition-colors">share</span>
                                <span className="hidden sm:inline">Share</span>
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="prose dark:prose-invert max-w-none text-text-main dark:text-gray-300 leading-8 space-y-8 text-[1.05rem]">
                        {post.content ? (
                            <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        ) : post.excerpt ? (
                            <p>{post.excerpt}</p>
                        ) : (
                            <p className="text-text-muted italic">No content available.</p>
                        )}
                    </div>
                </div>

                {/* Comments Section */}
                <div className="bg-gray-50 dark:bg-[#161c19]/50 border-t border-gray-200 dark:border-gray-800 px-8 py-12 md:px-16 md:py-16">
                    <div className="max-w-3xl mx-auto">
                        <h3 className="text-xl font-bold text-text-main dark:text-white mb-8 flex items-center gap-3">
                            Comments
                            <span className="text-sm font-semibold text-text-muted bg-gray-200 dark:bg-gray-800 px-2.5 py-0.5 rounded-full">
                                {post.comments?.length || 0}
                            </span>
                        </h3>

                        {/* Comment Input */}
                        <div className="bg-white dark:bg-[#1e1e1e] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-10">
                            <div className="flex gap-4">
                                <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-dark font-bold shrink-0 text-sm">
                                    U
                                </div>
                                <div className="w-full">
                                    <textarea
                                        className="w-full bg-gray-50 dark:bg-black/20 border-0 rounded-lg p-3 text-sm text-text-main dark:text-white focus:ring-2 focus:ring-primary/50 placeholder-gray-400 resize-none transition-all focus:bg-white dark:focus:bg-black/40 outline-none"
                                        placeholder="Share your thoughts..."
                                        rows={3}
                                    ></textarea>
                                    <div className="flex justify-between items-center mt-3">
                                        <p className="text-xs text-text-muted font-medium flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[16px]">markdown</span>
                                            Markdown supported
                                        </p>
                                        <button className="bg-primary hover:bg-primary-dark text-text-main px-6 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm cursor-pointer">
                                            Post Comment
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Comments List */}
                        {post.comments && post.comments.length > 0 ? (
                            <div className="space-y-8">
                                {post.comments.map((comment, idx) => (
                                    <div key={idx} className="flex gap-5 group">
                                        <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold text-sm shrink-0">
                                            {comment.author.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-baseline gap-2 mb-1.5">
                                                <span className="font-bold text-sm text-text-main dark:text-white">{comment.author}</span>
                                                <span className="text-xs text-text-muted">{formatDate(comment.created_at)}</span>
                                            </div>
                                            <p className="text-sm text-text-main dark:text-gray-300 leading-relaxed mb-3">{comment.content}</p>
                                            <div className="flex items-center gap-4">
                                                <button className="text-xs font-semibold text-text-muted hover:text-primary-dark flex items-center gap-1 transition-colors cursor-pointer">
                                                    <span className="material-symbols-outlined text-[16px]">reply</span>
                                                    Reply
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-text-muted text-sm">No comments yet. Be the first to share your thoughts!</p>
                        )}
                    </div>
                </div>
            </article>
        </div>
    );
}
