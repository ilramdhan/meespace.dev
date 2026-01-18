import { BentoCard } from "@/components/public/BentoCard";
import { Metadata } from "next";
import Link from "next/link";

interface Project {
    id: string;
    title: string;
    subtitle: string;
    slug: string;
    category: string;
    icon: string;
    icon_color: string;
    status: string;
    tech_stack?: string[];
}

async function getProjects(): Promise<Project[]> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/v1/projects?status=published`, { next: { revalidate: 60 } });
        if (!res.ok) return [];
        const data = await res.json();
        return data.data?.projects || [];
    } catch {
        return [];
    }
}

export const metadata: Metadata = {
    title: "Projects",
    description: "Portfolio of selected projects.",
};

export default async function ProjectsPage() {
    const projects = await getProjects();

    // Get unique categories
    const categories = [...new Set(projects.map(p => p.category).filter(Boolean))];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sidebar */}
            <aside className="lg:col-span-3 lg:sticky lg:top-28 space-y-8">
                <div className="bg-white/50 dark:bg-[#1e1e1e]/50 backdrop-blur-sm rounded-3xl p-6 border border-white dark:border-gray-800">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-4 px-2">
                        Categories
                    </h3>
                    <nav className="flex flex-col gap-2">
                        <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm bg-white dark:bg-[#2d2d2d] text-text-main dark:text-white shadow-sm font-semibold">
                            <span className="material-symbols-outlined text-lg">apps</span>
                            All Projects
                        </a>
                        <div className="h-px bg-gray-200 dark:bg-gray-700 my-2 mx-2"></div>
                        {categories.map((cat, idx) => (
                            <a key={idx} href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-text-muted hover:bg-white dark:hover:bg-gray-800 hover:text-text-main dark:hover:text-white hover:shadow-sm transition-all">
                                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                                {cat}
                            </a>
                        ))}
                    </nav>
                </div>
                <div className="bg-primary/20 rounded-3xl p-6 border border-primary/30">
                    <h4 className="font-bold text-text-main dark:text-white mb-2">Have a project?</h4>
                    <p className="text-xs text-text-muted dark:text-gray-300 mb-4">
                        Let&apos;s discuss how I can help bring your ideas to life.
                    </p>
                    <Link href="/#contact" className="block w-full bg-white dark:bg-gray-800 text-text-main dark:text-white py-2 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-all text-center">
                        Get in Touch
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-9 space-y-12">
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-text-main dark:text-white">All Projects</h2>
                        <div className="flex gap-2">
                            {categories.slice(0, 3).map((cat) => (
                                <span key={cat} className="px-3 py-1 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-medium text-text-main dark:text-white">
                                    {cat}
                                </span>
                            ))}
                        </div>
                    </div>
                    {projects.length === 0 ? (
                        <div className="text-center py-16 bg-white dark:bg-[#1e1e1e] rounded-3xl border border-gray-100 dark:border-gray-800">
                            <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-4">folder_open</span>
                            <p className="text-text-muted">No projects published yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {projects.map((project) => (
                                <BentoCard
                                    key={project.id}
                                    className="bg-white dark:bg-[#1e1e1e] rounded-3xl p-6 border border-gray-100 dark:border-gray-800 flex flex-col h-full !transition-transform !duration-200 hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <div className="mb-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`inline-block px-3 py-1 rounded-lg ${project.icon_color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300' : project.icon_color === 'purple' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300' : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300'} text-xs font-semibold`}>
                                                {project.category}
                                            </span>
                                            <span className="material-symbols-outlined text-gray-300">{project.icon || 'folder'}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-text-main dark:text-white">{project.title}</h3>
                                    </div>
                                    <p className="text-sm text-text-muted dark:text-gray-400 mb-6 flex-grow">{project.subtitle}</p>
                                    {project.tech_stack && project.tech_stack.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {project.tech_stack.slice(0, 4).map((tag) => (
                                                <span key={tag} className="px-2 py-1 bg-gray-50 dark:bg-gray-800 rounded-md text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <Link href={`/projects/${project.slug}`} className="w-full py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 group">
                                        View Details
                                        <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </Link>
                                </BentoCard>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
