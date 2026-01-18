import { BentoCard } from "@/components/public/BentoCard";
import { Metadata } from "next";
import Link from "next/link";

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    slug: string;
    status: string;
    reading_time?: number;
    published_at?: string;
    created_at: string;
    category?: { name: string };
    author?: { full_name: string };
}

async function getBlogPosts(): Promise<BlogPost[]> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/v1/blog?status=published`, { next: { revalidate: 60 } });
        if (!res.ok) return [];
        const data = await res.json();
        return data.data?.posts || [];
    } catch {
        return [];
    }
}

export const metadata: Metadata = {
    title: "Insights & Blog",
    description: "Thoughts, tutorials, and industry insights.",
};

export default async function InsightsPage() {
    const posts = await getBlogPosts();

    // Get latest post (featured)
    const latestPost = posts[0];
    const otherPosts = posts.slice(1);

    // Get unique categories (topics)
    const topics = [...new Set(posts.map(p => p.category?.name).filter(Boolean))];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <div className="flex flex-col gap-10">
            {/* Header */}
            <div className="text-center md:text-left">
                <h2 className="text-4xl font-bold text-text-main dark:text-white tracking-tight mb-3">
                    Insights & Blog
                </h2>
                <p className="text-text-muted dark:text-gray-400 max-w-2xl">
                    Thoughts, tutorials, and industry insights on technology and business analysis.
                </p>
            </div>

            {posts.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-[#1e1e1e] rounded-3xl border border-gray-100 dark:border-gray-800">
                    <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-4">article</span>
                    <p className="text-text-muted">No blog posts published yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-min">
                    {/* Hero / Latest Post Card */}
                    {latestPost && (
                        <Link href={`/insights/${latestPost.slug}`} className="col-span-1 md:col-span-2 row-span-2 block group relative h-full">
                            <BentoCard className="bg-white dark:bg-[#1e1e1e] rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col h-full cursor-pointer relative">
                                <div className="absolute top-6 left-6 z-10">
                                    <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-black/50 backdrop-blur-sm text-text-main dark:text-white text-xs font-bold border border-gray-200 dark:border-gray-700 shadow-sm">
                                        Latest Post
                                    </span>
                                </div>
                                <div className="h-64 overflow-hidden relative bg-gray-100 dark:bg-gray-800">
                                    <div className="absolute inset-0 bg-primary/20 dark:bg-primary/10"></div>
                                    <div className="absolute -right-10 -top-10 w-48 h-48 bg-purple-200 dark:bg-purple-900/30 rounded-full blur-3xl"></div>
                                    <div className="absolute -left-10 bottom-0 w-64 h-64 bg-primary rounded-full blur-3xl opacity-40"></div>
                                    <div className="w-full h-full flex items-center justify-center relative z-0">
                                        <span className="material-symbols-outlined text-6xl text-text-muted/20 dark:text-white/10 scale-150 transform group-hover:scale-125 transition-transform duration-700">
                                            article
                                        </span>
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-grow">
                                    <div className="flex gap-2 mb-4">
                                        <span className="px-2 py-0.5 rounded-md bg-accent-purple/50 text-purple-900 dark:text-purple-200 text-xs font-semibold">
                                            {latestPost.category?.name || 'General'}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium">
                                            {latestPost.reading_time || 5} min read
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-text-main dark:text-white mb-3 group-hover:text-primary-dark transition-colors">
                                        {latestPost.title}
                                    </h3>
                                    <p className="text-text-muted dark:text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                                        {latestPost.excerpt}
                                    </p>
                                    <div className="mt-auto flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="size-8 rounded-full bg-gray-200 overflow-hidden relative">
                                                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-xs">
                                                    {latestPost.author?.full_name?.charAt(0) || 'A'}
                                                </div>
                                            </div>
                                            <span className="text-xs font-medium text-text-main dark:text-gray-300">
                                                {latestPost.author?.full_name || 'Author'}
                                            </span>
                                        </div>
                                        <span className="text-xs text-text-muted dark:text-gray-500">
                                            {formatDate(latestPost.published_at || latestPost.created_at)}
                                        </span>
                                    </div>
                                </div>
                            </BentoCard>
                        </Link>
                    )}

                    {/* Topics Cloud Card */}
                    {topics.length > 0 && (
                        <div className="col-span-1 bg-white dark:bg-[#1e1e1e] rounded-xl p-6 border border-gray-100 dark:border-gray-800 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="material-symbols-outlined text-primary-dark">label</span>
                                <h3 className="font-bold text-text-main dark:text-white">Topics</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {topics.map((topic) => (
                                    <span key={topic} className="px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-primary/20 cursor-pointer transition-colors dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700">
                                        {topic}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Other Posts */}
                    {otherPosts.map((post) => (
                        <Link key={post.id} href={`/insights/${post.slug}`} className="col-span-1 bg-white dark:bg-[#1e1e1e] rounded-xl p-6 border border-gray-100 dark:border-gray-800 flex flex-col justify-between group hover:border-primary/50 transition-colors shadow-sm hover:shadow-md">
                            <div>
                                <span className="inline-block px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wider mb-3">
                                    {post.category?.name || 'General'}
                                </span>
                                <h4 className="text-lg font-bold text-text-main dark:text-white leading-tight group-hover:text-primary-dark transition-colors mb-2">
                                    {post.title}
                                </h4>
                                <p className="text-xs text-text-muted dark:text-gray-400 line-clamp-3">
                                    {post.excerpt}
                                </p>
                            </div>
                            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-text-main dark:text-white group-hover:gap-2 transition-all">
                                Read Post <span className="material-symbols-outlined text-[16px]">arrow_right_alt</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
