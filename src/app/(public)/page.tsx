import { BentoCard } from "@/components/public/BentoCard";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import {
  Download,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Send,
} from "lucide-react";

// API fetch functions for server-side rendering
async function getProfile() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/v1/profile`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch {
    return null;
  }
}

async function getProjects() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/v1/projects?status=published&limit=4`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data?.projects || [];
  } catch {
    return [];
  }
}

async function getTechStack() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/v1/tech-stack`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data?.techStack?.slice(0, 6) || [];
  } catch {
    return [];
  }
}

async function getBlogPosts() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/v1/blog?status=published&limit=3`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data?.posts || [];
  } catch {
    return [];
  }
}

async function getSkills() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/v1/skills`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch {
    return [];
  }
}

// Default profile for fallback
const defaultProfile = {
  name: "Your Name",
  role: "Your Role",
  status: "Available for hire",
  tagline: "Welcome to my portfolio",
  bio: "Add your bio in the admin settings.",
  avatar: "/placeholder-avatar.png",
  email: "email@example.com",
  location: "Your Location",
  linkedin_url: "#",
  github_url: "#",
};

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Personal portfolio website",
};

export default async function Home() {
  const [profile, projects, techStack, posts, skills] = await Promise.all([
    getProfile(),
    getProjects(),
    getTechStack(),
    getBlogPosts(),
    getSkills(),
  ]);

  const p = profile || defaultProfile;

  // Ensure arrays are not null/undefined
  const projectsArr = projects || [];
  const skillsArr = skills || [];
  const techStackArr = techStack || [];
  const postsArr = posts || [];

  // Default stats if no data
  const stats = [
    { value: String(projectsArr.length), label: "Projects", icon: "folder_open", color: "blue" },
    { value: String(skillsArr.length), label: "Skills", icon: "psychology", color: "purple" },
    { value: String(techStackArr.length), label: "Technologies", icon: "code", color: "green" },
  ];

  return (
    <div className="space-y-8">
      {/* About Section Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-min" id="about">
        {/* Hero Card */}
        <BentoCard className="col-span-1 md:col-span-2 row-span-2 p-8 flex flex-col justify-between">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-purple/50 text-purple-900 dark:text-purple-200 text-xs font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              {p.status || "Available"}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-main dark:text-white leading-tight mb-4">
              {p.tagline || p.name}
            </h2>
            <p className="text-text-muted dark:text-gray-400 text-base md:text-lg leading-relaxed max-w-md">
              {p.short_bio || p.bio || "Welcome to my portfolio"}
            </p>
          </div>
          <div className="mt-8 flex items-end justify-between relative z-10">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-text-muted dark:text-gray-500 font-medium">
                Role
              </span>
              <span className="text-lg font-semibold text-text-main dark:text-white">
                {p.title || p.role}
              </span>
            </div>
            <div className="size-20 md:size-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg relative bg-gray-200 dark:bg-gray-700">
              {p.avatar_url || p.avatar ? (
                <Image
                  src={p.avatar_url || p.avatar}
                  alt={p.full_name || p.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 80px, 96px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="material-symbols-outlined text-4xl">person</span>
                </div>
              )}
            </div>
          </div>
          <div className="absolute -right-10 -top-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-500"></div>
        </BentoCard>

        {/* Stats */}
        {stats.map((stat, i) => (
          <BentoCard key={i} className="col-span-1 p-6 flex flex-col justify-center gap-2">
            <div className={`size-10 rounded-full ${stat.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300' : stat.color === 'purple' ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300' : 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300'} flex items-center justify-center mb-2`}>
              <span className="material-symbols-outlined font-icon">{stat.icon}</span>
            </div>
            <span className="text-4xl font-bold text-text-main dark:text-white tracking-tighter">
              {stat.value}
            </span>
            <span className="text-sm font-medium text-text-muted dark:text-gray-400">
              {stat.label}
            </span>
          </BentoCard>
        ))}

        {/* Resume CTA */}
        <BentoCard className="col-span-1 md:col-span-2 bg-primary/20 dark:bg-primary/10 border-primary/20 p-6 flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-text-main dark:text-white text-lg">
              Curious to see more?
            </h3>
            <p className="text-sm text-text-muted dark:text-gray-400">
              Grab a copy of my detailed resume.
            </p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-text-main dark:bg-white text-white dark:text-text-main px-6 py-3 rounded-xl font-bold text-sm shadow-md hover:opacity-90 transition-opacity whitespace-nowrap">
            <Download className="w-5 h-5" />
            <span>Digital Resume</span>
          </button>
        </BentoCard>

        {/* Tools Grid */}
        {techStackArr.length > 0 && (
          <div className="col-span-1 md:col-span-4 mt-2">
            <h3 className="text-lg font-bold text-text-main dark:text-white mb-4 pl-1">
              Tools & Technologies
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {techStackArr.map((tool: { id: string; name: string; icon: string; color: string }) => (
                <BentoCard
                  key={tool.id}
                  className="p-4 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tool.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : tool.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' : tool.color === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
                    <span className="material-symbols-outlined">{tool.icon}</span>
                  </div>
                  <span className="text-xs font-semibold text-text-muted dark:text-gray-400">
                    {tool.name}
                  </span>
                </BentoCard>
              ))}
            </div>
          </div>
        )}

        {/* Core Expertise */}
        {skillsArr.length > 0 && (
          <>
            <div className="col-span-1 md:col-span-4 mt-8 mb-2 flex items-center gap-4">
              <h3 className="text-xl font-bold text-text-main dark:text-white">
                Core Expertise
              </h3>
              <div className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-700"></div>
            </div>

            {skillsArr.slice(0, 4).map((skill: { id: string; name: string; description: string; icon: string }) => (
              <BentoCard key={skill.id} className="col-span-1 p-5 flex flex-col gap-3">
                <div className="size-10 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-text-main dark:text-white">
                  <span className="material-symbols-outlined font-icon">{skill.icon || 'star'}</span>
                </div>
                <div>
                  <h4 className="font-bold text-text-main dark:text-white">{skill.name}</h4>
                  <p className="text-xs text-text-muted dark:text-gray-400 mt-1">{skill.description}</p>
                </div>
              </BentoCard>
            ))}
          </>
        )}

        {/* Featured Projects */}
        {projectsArr.length > 0 && (
          <>
            <div className="col-span-1 md:col-span-4 mt-8 mb-2 flex items-center gap-4" id="projects">
              <h3 className="text-xl font-bold text-text-main dark:text-white">Featured Projects</h3>
              <div className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-700"></div>
              <Link href="/projects" className="text-sm font-semibold text-primary-dark hover:text-text-main transition-colors">View All</Link>
            </div>

            {projectsArr.slice(0, 4).map((project: { id: string; title: string; subtitle: string; slug: string; icon: string; icon_color: string; category: string }) => (
              <BentoCard key={project.id} className="col-span-1 md:col-span-2 p-6 flex flex-col justify-between group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`size-12 rounded-lg ${project.icon_color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : project.icon_color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' : 'bg-primary/20 text-text-main'} flex items-center justify-center`}>
                    <span className="material-symbols-outlined font-icon">{project.icon || 'folder'}</span>
                  </div>
                  <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-semibold rounded-full text-gray-500">{project.category}</div>
                </div>
                <div>
                  <Link href={`/projects/${project.slug}`}>
                    <h3 className="text-xl font-bold text-text-main dark:text-white mb-2 group-hover:text-primary-dark transition-colors">{project.title}</h3>
                  </Link>
                  <p className="text-text-muted dark:text-gray-400 text-sm mb-4 leading-relaxed">
                    {project.subtitle}
                  </p>
                </div>
              </BentoCard>
            ))}
          </>
        )}

        {/* Latest Insights */}
        {postsArr.length > 0 && (
          <>
            <div className="col-span-1 md:col-span-4 mt-8 mb-2 flex items-center gap-4" id="blog">
              <h3 className="text-xl font-bold text-text-main dark:text-white">Latest Insights</h3>
              <div className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-700"></div>
              <Link href="/insights" className="text-sm font-semibold text-primary-dark hover:text-text-main transition-colors">View All</Link>
            </div>

            {postsArr.slice(0, 3).map((post: { id: string; title: string; excerpt: string; slug: string; reading_time: number }) => (
              <BentoCard key={post.id} className="col-span-1 flex flex-col h-full !p-0">
                <div className="h-32 bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-primary/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-primary-dark opacity-30">
                    <span className="material-symbols-outlined text-5xl font-icon">article</span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <Link href={`/insights/${post.slug}`}>
                    <h4 className="font-bold text-lg text-text-main dark:text-white mb-2 leading-snug group-hover:text-primary-dark transition-colors">{post.title}</h4>
                  </Link>
                  <p className="text-sm text-text-muted dark:text-gray-400 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
                    <span>{post.reading_time || 5} min read</span>
                    <Link href={`/insights/${post.slug}`} className="font-medium text-text-main dark:text-white">Read More →</Link>
                  </div>
                </div>
              </BentoCard>
            ))}
          </>
        )}

        {/* Contact Section */}
        <div className="col-span-1 md:col-span-4 mt-8" id="contact">
          <div className="bg-gradient-to-br from-primary/30 to-accent-purple/30 dark:from-primary/10 dark:to-accent-purple/10 rounded-2xl p-8 md:p-12 relative overflow-hidden border border-white/50 dark:border-white/10 shadow-lg">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 dark:bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
              <div className="flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-bold text-text-main dark:text-white mb-4">Let&apos;s work together</h2>
                <p className="text-text-muted dark:text-gray-300 mb-8 text-lg">
                  I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
                </p>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-text-main dark:text-white">
                    <div className="size-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center shadow-sm">
                      <Mail className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{p.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-text-main dark:text-white">
                    <div className="size-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center shadow-sm">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{p.location || "Remote"}</span>
                  </div>
                </div>
                <div className="flex gap-4 mt-8">
                  {(p.linkedin_url || p.socials?.linkedin) && (
                    <a href={p.linkedin_url || p.socials?.linkedin} target="_blank" rel="noopener noreferrer" className="size-12 bg-white dark:bg-white/10 rounded-full flex items-center justify-center text-text-main dark:text-white hover:scale-110 transition-transform shadow-sm">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {(p.github_url || p.socials?.github) && (
                    <a href={p.github_url || p.socials?.github} target="_blank" rel="noopener noreferrer" className="size-12 bg-white dark:bg-white/10 rounded-full flex items-center justify-center text-text-main dark:text-white hover:scale-110 transition-transform shadow-sm">
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>

              <div className="bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/50 dark:border-white/10">
                <form className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-text-main dark:text-gray-300 mb-1">Name</label>
                    <input type="text" id="name" placeholder="John Doe" className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-primary focus:border-primary py-2.5 px-3 shadow-sm outline-none focus:ring-2 transition-shadow" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text-main dark:text-gray-300 mb-1">Email</label>
                    <input type="email" id="email" placeholder="john@company.com" className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-primary focus:border-primary py-2.5 px-3 shadow-sm outline-none focus:ring-2 transition-shadow" />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-text-main dark:text-gray-300 mb-1">Message</label>
                    <textarea id="message" rows={4} placeholder="Tell me about your project..." className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-text-main dark:text-white focus:ring-primary focus:border-primary py-2.5 px-3 shadow-sm outline-none focus:ring-2 transition-shadow"></textarea>
                  </div>
                  <button type="button" className="mt-2 w-full bg-text-main dark:bg-white text-white dark:text-text-main font-bold py-3 rounded-lg hover:opacity-90 transition-opacity shadow-md flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
