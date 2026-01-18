import { BentoCard } from "@/components/public/BentoCard";
import { ContactForm } from "@/components/public/ContactForm";
import { SkillsCarousel } from "@/components/public/SkillsCarousel";
import { TechMarquee } from "@/components/public/TechMarquee";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import {
  Download,
  Github,
  Linkedin,
  Mail,
  MapPin,
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
    const res = await fetch(`${baseUrl}/api/v1/blog?status=published&limit=4`, { next: { revalidate: 60 } });
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
    return data.data?.skills || [];
  } catch {
    return [];
  }
}

async function getStats() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/v1/stats`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data?.stats || [];
  } catch {
    return [];
  }
}

async function getSettings() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/v1/settings`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch {
    return null;
  }
}

// Default profile for fallback
const defaultProfile = {
  full_name: "Your Name",
  role: "Your Role",
  status: "Available for hire",
  tagline: "Welcome to my portfolio",
  bio: "Add your bio in the admin settings.",
  avatar_url: "",
  email: "email@example.com",
  location: "Your Location",
  social_links: {},
};

// Default stats for fallback
const defaultStats = [
  { value: "5+", label: "Years of Experience in FinTech & SaaS", icon: "verified", color: "blue" },
  { value: "20+", label: "Successful Enterprise Projects Delivered", icon: "deployed_code", color: "green" },
];

// Color mapping for stats icons
const getStatColorClasses = (color: string) => {
  switch (color) {
    case 'blue':
      return 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300';
    case 'green':
      return 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300';
    case 'purple':
      return 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300';
    case 'orange':
      return 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300';
    default:
      return 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300';
  }
};

// Color mapping for tool hover
const getToolHoverColor = (color: string) => {
  switch (color) {
    case 'blue':
      return 'hover:bg-blue-50/50 dark:hover:bg-blue-900/10';
    case 'red':
      return 'hover:bg-red-50/50 dark:hover:bg-red-900/10';
    case 'purple':
      return 'hover:bg-purple-50/50 dark:hover:bg-purple-900/10';
    case 'yellow':
      return 'hover:bg-yellow-50/50 dark:hover:bg-yellow-900/10';
    case 'green':
      return 'hover:bg-green-50/50 dark:hover:bg-green-900/10';
    default:
      return 'hover:bg-blue-50/50 dark:hover:bg-blue-900/10';
  }
};

// Blog card overlay colors by index
const blogCardStyles = [
  {
    overlay: 'bg-primary/20 group-hover:bg-primary/30',
    iconColor: 'text-primary-dark opacity-30',
    hoverText: 'group-hover:text-primary-dark'
  },
  {
    overlay: 'bg-accent-purple/30 group-hover:bg-accent-purple/40',
    iconColor: 'text-purple-300 opacity-50',
    hoverText: 'group-hover:text-purple-600'
  },
  {
    overlay: 'bg-blue-100/50 dark:bg-blue-900/20 group-hover:bg-blue-100/70',
    iconColor: 'text-blue-300 opacity-50',
    hoverText: 'group-hover:text-blue-600'
  },
];

// Blog card icons by index
const blogCardIcons = ['article', 'groups', 'rocket_launch'];

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Personal portfolio website",
};

export default async function Home() {
  const [profile, projects, techStack, posts, skills, stats, settings] = await Promise.all([
    getProfile(),
    getProjects(),
    getTechStack(),
    getBlogPosts(),
    getSkills(),
    getStats(),
    getSettings(),
  ]);

  const p = profile || defaultProfile;
  const s = settings || {};

  // Ensure arrays are not null/undefined
  const projectsArr = projects || [];
  const skillsArr = skills || [];
  const techStackArr = techStack || [];
  const postsArr = posts || [];
  // Use stats from API or fallback to defaults
  const statsArr = (stats && stats.length > 0) ? stats : defaultStats;

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
              {p.status || "Open to Work"}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-main dark:text-white leading-tight mb-4">
              {p.tagline || "Bridging Business Needs with Technical Solutions"}
            </h2>
            <p className="text-text-muted dark:text-gray-400 text-base md:text-lg leading-relaxed max-w-md">
              {p.short_bio || p.bio || `Hi, I'm ${p.full_name}. I translate complex requirements into clear, actionable technical specifications.`}
            </p>
          </div>
          <div className="mt-8 flex items-end justify-between relative z-10">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-text-muted dark:text-gray-500 font-medium">
                Role
              </span>
              <span className="text-lg font-semibold text-text-main dark:text-white">
                {p.role}
              </span>
            </div>
            <div className="size-20 md:size-24 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg relative bg-gray-200 dark:bg-gray-700">
              {p.avatar_url ? (
                <Image
                  src={p.avatar_url}
                  alt={p.full_name}
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

        {/* Stats Cards */}
        {statsArr.slice(0, 2).map((stat: { id?: string; value: string; label: string; icon: string; color: string }, i: number) => (
          <BentoCard key={stat.id || i} className="col-span-1 p-6 flex flex-col justify-center gap-2">
            <div className={`size-10 rounded-full ${getStatColorClasses(stat.color)} flex items-center justify-center mb-2`}>
              <span className="material-symbols-outlined">{stat.icon}</span>
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
        <BentoCard className="col-span-1 md:col-span-2 !bg-primary/20 dark:!bg-primary/10 !border-primary/20 p-6 flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-text-main dark:text-white text-lg">
              Curious to see more?
            </h3>
            <p className="text-sm text-text-muted dark:text-gray-400">
              Grab a copy of my detailed resume.
            </p>
          </div>
          {p.resume_url ? (
            <a
              href={p.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-text-main dark:bg-white text-white dark:text-text-main px-6 py-3 rounded-xl font-bold text-sm shadow-md hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              <Download className="w-5 h-5" />
              <span>Digital Resume</span>
            </a>
          ) : (
            <button className="flex items-center justify-center gap-2 bg-text-main dark:bg-white text-white dark:text-text-main px-6 py-3 rounded-xl font-bold text-sm shadow-md hover:opacity-90 transition-opacity whitespace-nowrap">
              <Download className="w-5 h-5" />
              <span>Digital Resume</span>
            </button>
          )}
        </BentoCard>

        {/* Tools & Technologies - Auto-sliding Marquee */}
        {techStackArr.length > 0 && (
          <TechMarquee tools={techStackArr} />
        )}

        {/* Core Expertise - Carousel with arrows */}
        {skillsArr.length > 0 && (
          <SkillsCarousel skills={skillsArr} />
        )}

        {/* Featured Projects */}
        {projectsArr.length > 0 && (
          <>
            <div className="col-span-1 md:col-span-4 mt-8 mb-2 flex items-center gap-4" id="projects">
              <h3 className="text-xl font-bold text-text-main dark:text-white">Featured Projects</h3>
              <div className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-700"></div>
              <Link href="/projects" className="text-sm font-semibold text-primary-dark hover:text-text-main transition-colors">View All</Link>
            </div>

            {projectsArr.slice(0, 4).map((project: {
              id: string;
              title: string;
              short_description?: string;
              subtitle?: string;
              slug: string;
              icon?: string;
              icon_color?: string;
              year?: string;
              tags?: Array<{ id: string; name: string }>;
            }, index: number) => (
              <BentoCard key={project.id} className="col-span-1 md:col-span-2 p-6 flex flex-col justify-between group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`size-12 rounded-lg ${index % 2 === 0
                    ? 'bg-primary/20 text-text-main'
                    : 'bg-accent-purple/50 text-purple-900 dark:text-purple-200'
                    } flex items-center justify-center`}>
                    <span className="material-symbols-outlined">{project.icon || 'folder'}</span>
                  </div>
                  <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-semibold rounded-full text-gray-500">
                    {project.year || new Date().getFullYear()}
                  </div>
                </div>
                <div>
                  <Link href={`/projects/${project.slug}`}>
                    <h3 className={`text-xl font-bold text-text-main dark:text-white mb-2 ${index % 2 === 0
                      ? 'group-hover:text-primary-dark'
                      : 'group-hover:text-purple-700 dark:group-hover:text-purple-300'
                      } transition-colors`}>
                      {project.title}
                    </h3>
                  </Link>
                  <p className="text-text-muted dark:text-gray-400 text-sm mb-4 leading-relaxed">
                    {project.short_description || project.subtitle}
                  </p>
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag.id}
                          className="px-2 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded text-xs text-gray-600 dark:text-gray-300 font-medium"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}
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

            {postsArr.slice(0, 4).map((post: {
              id: string;
              title: string;
              excerpt: string;
              slug: string;
              read_time_minutes?: number;
              featured_image_url?: string;
            }, index: number) => {
              const cardStyle = blogCardStyles[index] || blogCardStyles[0];
              const cardIcon = blogCardIcons[index] || 'article';

              return (
                <BentoCard
                  key={post.id}
                  className={`${index === 2
                    ? 'col-span-1 md:col-span-2 md:col-start-2 lg:col-span-1 lg:col-start-auto'
                    : 'col-span-1'
                    } flex flex-col h-full !p-0 cursor-pointer`}
                >
                  <div className="h-40 bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                    {post.featured_image_url ? (
                      <Image
                        src={post.featured_image_url}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <>
                        <div className={`absolute inset-0 ${cardStyle.overlay} transition-colors`}></div>
                        <div className={`absolute inset-0 flex items-center justify-center ${cardStyle.iconColor}`}>
                          <span className="material-symbols-outlined text-6xl">{cardIcon}</span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <Link href={`/insights/${post.slug}`}>
                      <h4 className={`font-bold text-lg text-text-main dark:text-white mb-2 leading-snug ${cardStyle.hoverText} transition-colors`}>
                        {post.title}
                      </h4>
                    </Link>
                    <p className="text-sm text-text-muted dark:text-gray-400 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
                      <span>{post.read_time_minutes || 5} min read</span>
                      <Link href={`/insights/${post.slug}`} className="font-medium text-text-main dark:text-white">
                        Read More →
                      </Link>
                    </div>
                  </div>
                </BentoCard>
              );
            })}
          </>
        )}

        {/* Contact Section */}
        <div className="col-span-1 md:col-span-4 mt-8" id="contact">
          <div className="bg-gradient-to-br from-primary/30 to-accent-purple/30 dark:from-primary/10 dark:to-accent-purple/10 rounded-2xl p-8 md:p-12 relative overflow-hidden border border-white/50 dark:border-white/10 shadow-lg">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 dark:bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
              <div className="flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-bold text-text-main dark:text-white mb-4">
                  Let&apos;s collaborate on your next system migration
                </h2>
                <p className="text-text-muted dark:text-gray-300 mb-8 text-lg">
                  Whether you need help with requirements gathering, process optimization, or technical documentation, I&apos;m just a message away.
                </p>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-text-main dark:text-white">
                    <div className="size-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center shadow-sm">
                      <Mail className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{s.contact_email || p.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-text-main dark:text-white">
                    <div className="size-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center shadow-sm">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{s.location || p.location || "Remote Friendly"}</span>
                  </div>
                </div>
                <div className="flex gap-4 mt-8">
                  {p.social_links?.linkedin && (
                    <a
                      href={p.social_links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="size-12 bg-white dark:bg-white/10 rounded-full flex items-center justify-center text-text-main dark:text-white hover:scale-110 transition-transform shadow-sm"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {p.social_links?.github && (
                    <a
                      href={p.social_links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="size-12 bg-white dark:bg-white/10 rounded-full flex items-center justify-center text-text-main dark:text-white hover:scale-110 transition-transform shadow-sm"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>

              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
