import { BentoCard } from "@/components/public/BentoCard";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Project {
    id: string;
    title: string;
    subtitle: string;
    description?: string;
    slug: string;
    category: string;
    icon: string;
    icon_color: string;
    status: string;
    tech_stack?: string[];
    problem?: string;
    solution?: string;
    outcomes?: { value: string; label: string }[];
    deliverables?: { title: string; description: string; icon: string }[];
}

async function getProject(slug: string): Promise<Project | null> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/v1/projects/${slug}`, { next: { revalidate: 60 } });
        if (!res.ok) return null;
        const data = await res.json();
        return data.data;
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const project = await getProject(slug);

    if (!project) {
        return { title: "Project Not Found" };
    }

    return {
        title: `${project.title} - Case Study`,
        description: project.subtitle,
    };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = await getProject(slug);

    if (!project) {
        notFound();
    }

    return (
        <div className="w-full max-w-5xl mx-auto">
            {/* Back Link */}
            <div className="mb-10">
                <Link href="/projects" className="inline-flex items-center gap-2 text-text-muted hover:text-text-main dark:hover:text-white transition-colors font-medium group">
                    <div className="p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 group-hover:bg-primary/20 transition-colors">
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                    </div>
                    Back to Projects
                </Link>
            </div>

            <article className="space-y-12">
                {/* Header */}
                <header className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 ${project.icon_color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300' : project.icon_color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300'} rounded-xl`}>
                            <span className="material-symbols-outlined text-xl">{project.icon || 'folder'}</span>
                        </div>
                        <span className="text-sm font-bold text-text-muted tracking-wide uppercase">{project.category}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-main dark:text-white leading-tight tracking-tight">
                        {project.title}
                    </h1>
                    <p className="text-lg md:text-xl text-text-muted dark:text-gray-400 max-w-3xl leading-relaxed">
                        {project.subtitle}
                    </p>
                    {project.tech_stack && project.tech_stack.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {project.tech_stack.map((tag) => (
                                <span key={tag} className="px-4 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium text-text-main dark:text-gray-300">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </header>

                <hr className="border-gray-200 dark:border-gray-800" />

                {/* Problem & Solution */}
                {(project.problem || project.solution) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {project.problem && (
                            <BentoCard className="rounded-3xl p-8 h-full bg-white dark:bg-[#1e1e1e] border-gray-100 dark:border-gray-800">
                                <h3 className="text-xl font-bold text-text-main dark:text-white flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-500">
                                        <span className="material-symbols-outlined">error_outline</span>
                                    </div>
                                    The Problem
                                </h3>
                                <p className="text-text-muted dark:text-gray-400 leading-relaxed text-base">{project.problem}</p>
                            </BentoCard>
                        )}
                        {project.solution && (
                            <BentoCard className="rounded-3xl p-8 h-full bg-white dark:bg-[#1e1e1e] border-gray-100 dark:border-gray-800">
                                <h3 className="text-xl font-bold text-text-main dark:text-white flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600 dark:text-green-500">
                                        <span className="material-symbols-outlined">check_circle</span>
                                    </div>
                                    The Solution
                                </h3>
                                <p className="text-text-muted dark:text-gray-400 leading-relaxed text-base">{project.solution}</p>
                            </BentoCard>
                        )}
                    </div>
                )}

                {/* Description */}
                {project.description && (
                    <section className="bg-gray-50 dark:bg-gray-900/50 rounded-3xl p-8 md:p-10 border border-gray-200 dark:border-gray-800">
                        <h3 className="text-2xl font-bold text-text-main dark:text-white flex items-center gap-3 mb-6">
                            <span className="material-symbols-outlined text-blue-500 text-3xl">description</span>
                            Overview
                        </h3>
                        <p className="text-text-muted dark:text-gray-400 leading-relaxed text-base whitespace-pre-line">{project.description}</p>
                    </section>
                )}

                {/* Deliverables */}
                {project.deliverables && project.deliverables.length > 0 && (
                    <section className="bg-gray-50 dark:bg-gray-900/50 rounded-3xl p-8 md:p-10 border border-gray-200 dark:border-gray-800">
                        <h3 className="text-2xl font-bold text-text-main dark:text-white flex items-center gap-3 mb-8">
                            <span className="material-symbols-outlined text-purple-500 text-3xl">person_play</span>
                            My Role & Deliverables
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                            {project.deliverables.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-4">
                                    <div className="mt-1 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 shrink-0">
                                        <span className="material-symbols-outlined text-primary-dark text-xl">{item.icon}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-text-main dark:text-white mb-1">{item.title}</h4>
                                        <p className="text-sm text-text-muted dark:text-gray-400 leading-relaxed">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Outcomes */}
                {project.outcomes && project.outcomes.length > 0 && (
                    <section>
                        <h3 className="text-xl font-bold text-text-main dark:text-white mb-6 flex items-center gap-3">
                            <span className="material-symbols-outlined text-blue-500 text-2xl">trending_up</span>
                            Key Outcomes
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                            {project.outcomes.map((stat, idx) => (
                                <div key={idx} className="bg-primary/10 rounded-2xl p-6 text-center border border-primary/20">
                                    <span className="block text-3xl md:text-4xl font-bold text-text-main dark:text-white mb-1">{stat.value}</span>
                                    <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Technologies */}
                {project.tech_stack && project.tech_stack.length > 0 && (
                    <section>
                        <h4 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-4">Technologies & Tools</h4>
                        <div className="flex flex-wrap gap-3">
                            {project.tech_stack.map((tool, idx) => (
                                <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
                                    <span className="material-symbols-outlined text-blue-500 text-sm">code</span>
                                    <span className="text-sm font-semibold text-text-main dark:text-white">{tool}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </article>

            {/* Navigation */}
            <nav className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 flex justify-center">
                <Link href="/projects" className="group flex items-center gap-2 px-6 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all border border-gray-200 dark:border-gray-700">
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    <span className="text-sm font-semibold text-text-main dark:text-white">Back to All Projects</span>
                </Link>
            </nav>
        </div>
    );
}
