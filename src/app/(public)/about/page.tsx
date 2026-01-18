import { BentoCard } from "@/components/public/BentoCard";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react";

interface Experience {
    id: string;
    title: string;
    company: string;
    location?: string;
    employment_type?: string;
    start_date: string;
    end_date?: string;
    is_current: boolean;
    description?: string;
    highlights?: string[];
    tags?: string[];
    color?: string;
}

interface Education {
    id: string;
    degree: string;
    institution?: string;
    school?: string;
    field_of_study?: string;
    start_year: number;
    end_year?: number;
    gpa?: string;
    description?: string;
    achievements?: string[];
}

interface Certification {
    id: string;
    name: string;
    short_name?: string;
    subtitle?: string;
    issuer: string;
    issue_date: string;
    expiry_date?: string;
    credential_id?: string;
    credential_url?: string;
    certificate_file_url?: string;
    icon?: string;
    description?: string;
    is_expired?: boolean;
}

async function fetchData() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    try {
        const [aboutRes, expRes, eduRes, certRes, profileRes] = await Promise.all([
            fetch(`${baseUrl}/api/v1/about`, { next: { revalidate: 60 } }),
            fetch(`${baseUrl}/api/v1/experiences`, { next: { revalidate: 60 } }),
            fetch(`${baseUrl}/api/v1/education`, { next: { revalidate: 60 } }),
            fetch(`${baseUrl}/api/v1/certifications`, { next: { revalidate: 60 } }),
            fetch(`${baseUrl}/api/v1/profile`, { next: { revalidate: 60 } }),
        ]);

        const aboutData = aboutRes.ok ? await aboutRes.json() : { data: {} };
        const expData = expRes.ok ? await expRes.json() : { data: { experiences: [] } };
        const eduData = eduRes.ok ? await eduRes.json() : { data: { education: [] } };
        const certData = certRes.ok ? await certRes.json() : { data: { certifications: [] } };
        const profileData = profileRes.ok ? await profileRes.json() : { data: null };

        return {
            about: aboutData.data || {},
            experiences: expData.data?.experiences || expData.experiences || [],
            education: eduData.data?.education || eduData.education || [],
            certifications: certData.data?.certifications || certData.certifications || [],
            profile: profileData.data || null,
        };
    } catch {
        return { about: {}, experiences: [], education: [], certifications: [], profile: null };
    }
}

export const metadata: Metadata = {
    title: "About",
    description: "Learn more about me and my journey.",
};

// Helper to format date range for experience
function formatDateRange(startDate: string, endDate?: string, isCurrent?: boolean): string {
    const start = new Date(startDate);
    const startYear = start.getFullYear();

    if (isCurrent) return `${startYear} - Present`;
    if (!endDate) return String(startYear);

    const end = new Date(endDate);
    return `${startYear} - ${end.getFullYear()}`;
}

// Get year from issue_date
function getYear(dateStr: string): string {
    try {
        return String(new Date(dateStr).getFullYear());
    } catch {
        return "";
    }
}

// Certification color by index
const certColors = [
    { bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-600 dark:text-blue-400", badge: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20" },
    { bg: "bg-purple-50 dark:bg-purple-900/20", text: "text-purple-600 dark:text-purple-400", badge: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20" },
    { bg: "bg-orange-50 dark:bg-orange-900/20", text: "text-orange-600 dark:text-orange-400", badge: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20" },
];

// Default content for hardcoded fallback
const defaultContent = {
    header: {
        title: "Behind the Analysis",
        subtitle: "My journey from curiosity to architecting business solutions."
    },
    story: {
        tag: "Story",
        year: "Est. 2018",
        title: "It started with a broken spreadsheet.",
        paragraphs: [
            "My path into tech wasn't traditional. While working in operations, I noticed my team spending hours manually reconciling data across three different systems. I couldn't ignore the inefficiency.",
            "I taught myself SQL on weekends to automate those reports. That first 'aha' moment—seeing a 4-hour task turn into a 5-second query—hooked me on problem-solving. Today, I bring that same relentless drive for efficiency to enterprise-scale systems."
        ]
    },
    funFact: {
        title: "Fun Fact",
        description: "I'm an avid puzzle solver. I recently completed a 3,000-piece map of the world without looking at the box picture. It taught me patience and pattern recognition!"
    },
    offline: {
        title: "Offline Mode",
        description: "When I'm not mapping processes, I'm mapping trails. I spend my weekends hiking the Catskills—nature is the best system reset."
    }
};

export default async function AboutPage() {
    const { about, experiences, education, certifications, profile } = await fetchData();

    // Extract about sections
    const sections = about.sections || {};

    // Header section
    const headerData = sections.header || {};
    const header = {
        title: headerData.title || defaultContent.header.title,
        subtitle: headerData.subtitle || defaultContent.header.subtitle
    };

    // Story section
    const storyData = sections.story || {};
    let storyParagraphs = defaultContent.story.paragraphs;
    try {
        if (storyData.content) {
            const parsed = JSON.parse(storyData.content);
            if (Array.isArray(parsed) && parsed.length > 0) {
                storyParagraphs = parsed;
            }
        }
    } catch {
        if (storyData.content) storyParagraphs = [storyData.content];
    }
    const story = {
        title: storyData.title || defaultContent.story.title,
        content: storyParagraphs,
        image: storyData.image_url || profile?.avatar_url || "",
        tag: storyData.story_tag || defaultContent.story.tag,
        year: storyData.story_year || defaultContent.story.year
    };

    // Fun Fact section
    const funFactData = sections.funFact || {};
    const funFact = {
        title: funFactData.title || defaultContent.funFact.title,
        description: funFactData.content || defaultContent.funFact.description
    };

    // Offline section
    const offlineData = sections.offline || {};
    const offline = {
        title: offlineData.title || defaultContent.offline.title,
        description: offlineData.content || defaultContent.offline.description
    };

    // Get first education as primary degree
    const primaryEducation = education.length > 0 ? education[0] : null;

    return (
        <div className="w-full">
            {/* Page Header */}
            <div className="mb-10 text-center md:text-left">
                <h2 className="text-3xl md:text-5xl font-bold text-text-main dark:text-white mb-3">
                    {header.title}
                </h2>
                <p className="text-text-muted dark:text-gray-400 text-lg max-w-2xl">
                    {header.subtitle}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min">
                {/* Story Card - 2 columns */}
                <BentoCard className="col-span-1 md:col-span-2 p-8 flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                        <div className="size-24 md:size-32 shrink-0 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-sm relative bg-gray-200 dark:bg-gray-700">
                            {story.image ? (
                                <Image
                                    src={story.image}
                                    alt="Portrait"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 96px, 128px"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <span className="material-symbols-outlined text-4xl">person</span>
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full bg-[#d1e2d8] text-green-900 text-xs font-semibold">
                                    {story.tag}
                                </span>
                                <span className="text-sm text-text-muted dark:text-gray-400 font-medium">
                                    {story.year}
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-text-main dark:text-white mb-4">
                                {story.title}
                            </h3>
                            {story.content.map((paragraph: string, idx: number) => (
                                <p key={idx} className={`text-text-muted dark:text-gray-400 leading-relaxed ${idx < story.content.length - 1 ? "mb-4" : ""}`}>
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                    <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
                </BentoCard>

                {/* Fun Fact Card */}
                <BentoCard className="col-span-1 !bg-accent-purple/30 dark:!bg-purple-900/10 p-6 flex flex-col !border-accent-purple/50 dark:!border-purple-800/30">
                    <div className="flex justify-between items-start">
                        <div className="size-10 rounded-full bg-white dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-300">
                            <span className="material-symbols-outlined">lightbulb</span>
                        </div>
                    </div>
                    <div className="mt-3">
                        <h4 className="font-bold text-text-main dark:text-white text-lg mb-2">{funFact.title}</h4>
                        <p className="text-sm text-text-muted dark:text-purple-200">{funFact.description}</p>
                    </div>
                </BentoCard>

                {/* Certification Cards - 3 individual cards */}
                {certifications.length > 0 ? (
                    certifications.slice(0, 3).map((cert: Certification, idx: number) => {
                        const color = certColors[idx % certColors.length];
                        const icons = ["verified_user", "badge", "cloud"];
                        const icon = cert.icon || icons[idx % icons.length];

                        return (
                            <BentoCard key={cert.id} className="col-span-1 p-6 flex flex-col gap-4">
                                <div className="flex items-start justify-between">
                                    <div className={`p-2 ${color.bg} rounded-lg ${color.text}`}>
                                        <span className="material-symbols-outlined text-2xl">{icon}</span>
                                    </div>
                                    <span className={`text-xs font-semibold ${color.badge} px-2 py-1 rounded`}>
                                        {getYear(cert.issue_date)}
                                    </span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-text-main dark:text-white text-lg">
                                        {cert.short_name || cert.name}
                                    </h4>
                                    <p className="text-xs text-text-muted dark:text-gray-400 font-medium">
                                        {cert.subtitle || cert.issuer}
                                    </p>
                                    {cert.description && (
                                        <p className="text-sm text-text-muted dark:text-gray-500 mt-3 leading-snug">
                                            {cert.description}
                                        </p>
                                    )}
                                </div>
                            </BentoCard>
                        );
                    })
                ) : (
                    // Fallback hardcoded certs
                    <>
                        <BentoCard className="col-span-1 p-6 flex flex-col gap-4">
                            <div className="flex items-start justify-between">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                                    <span className="material-symbols-outlined text-2xl">verified_user</span>
                                </div>
                                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">2023</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-text-main dark:text-white text-lg">CSPO®</h4>
                                <p className="text-xs text-text-muted dark:text-gray-400 font-medium">Certified Scrum Product Owner</p>
                                <p className="text-sm text-text-muted dark:text-gray-500 mt-3 leading-snug">
                                    Mastered backlog prioritization, stakeholder management, and maximizing value delivery in Agile environments.
                                </p>
                            </div>
                        </BentoCard>
                        <BentoCard className="col-span-1 p-6 flex flex-col gap-4">
                            <div className="flex items-start justify-between">
                                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                                    <span className="material-symbols-outlined text-2xl">badge</span>
                                </div>
                                <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded">2022</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-text-main dark:text-white text-lg">IIBA-CBAP</h4>
                                <p className="text-xs text-text-muted dark:text-gray-400 font-medium">Certified Business Analysis Professional</p>
                                <p className="text-sm text-text-muted dark:text-gray-500 mt-3 leading-snug">
                                    Deep dive into requirements lifecycle management, strategy analysis, and solution evaluation techniques.
                                </p>
                            </div>
                        </BentoCard>
                        <BentoCard className="col-span-1 p-6 flex flex-col gap-4">
                            <div className="flex items-start justify-between">
                                <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400">
                                    <span className="material-symbols-outlined text-2xl">cloud</span>
                                </div>
                                <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">2021</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-text-main dark:text-white text-lg">AWS Certified</h4>
                                <p className="text-xs text-text-muted dark:text-gray-400 font-medium">Cloud Practitioner</p>
                                <p className="text-sm text-text-muted dark:text-gray-500 mt-3 leading-snug">
                                    Gained foundational knowledge of cloud architecture, deployment services, and security best practices.
                                </p>
                            </div>
                        </BentoCard>
                    </>
                )}

                {/* Experience Roadmap Card - 2 columns */}
                <BentoCard className="col-span-1 md:col-span-2 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-300">
                                <span className="material-symbols-outlined">work_history</span>
                            </div>
                            <h3 className="font-bold text-text-main dark:text-white text-xl">Experience Roadmap</h3>
                        </div>
                        {profile?.resume_url && (
                            <a
                                href={profile.resume_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-primary-dark font-semibold hover:text-text-main transition-colors flex items-center gap-1"
                            >
                                Download CV <Download className="w-4 h-4" />
                            </a>
                        )}
                    </div>

                    {experiences.length > 0 ? (
                        <div className="space-y-8">
                            {experiences.map((exp: Experience, idx: number) => {
                                const isFirst = idx === 0;
                                const iconBg = isFirst
                                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400";
                                const icons = ["manage_accounts", "analytics", "terminal"];
                                const icon = icons[idx % icons.length];

                                return (
                                    <div key={exp.id} className="flex flex-col sm:flex-row gap-5 group">
                                        <div className="shrink-0">
                                            <div className={`size-14 rounded-2xl ${iconBg} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                                                <span className="material-symbols-outlined text-3xl">{icon}</span>
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                                                <div>
                                                    <h4 className="text-lg font-bold text-text-main dark:text-white">{exp.title}</h4>
                                                    <p className="text-text-muted dark:text-gray-400 text-sm font-medium">
                                                        {exp.company}{exp.location && ` • ${exp.location}`}
                                                    </p>
                                                </div>
                                                <span className={`text-sm font-medium px-3 py-1 rounded-full w-fit mt-2 sm:mt-0 ${isFirst
                                                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                                                    : "text-text-muted dark:text-gray-500 bg-gray-100 dark:bg-gray-800"
                                                    }`}>
                                                    {formatDateRange(exp.start_date, exp.end_date, exp.is_current)}
                                                </span>
                                            </div>
                                            {exp.highlights && exp.highlights.length > 0 && (
                                                <ul className="space-y-2 mt-3">
                                                    {exp.highlights.map((highlight: string, hIdx: number) => (
                                                        <li key={hIdx} className="flex items-start gap-2 text-sm text-text-muted dark:text-gray-400 leading-relaxed">
                                                            <span className={`material-symbols-outlined text-base mt-0.5 shrink-0 ${isFirst ? "text-green-500" : "text-gray-400"}`}>
                                                                check_circle
                                                            </span>
                                                            <span dangerouslySetInnerHTML={{ __html: highlight }} />
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                            {exp.tags && exp.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {exp.tags.map((tag: string, tIdx: number) => (
                                                        <span key={tIdx} className="px-2 py-1 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs rounded border border-gray-200 dark:border-gray-700">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        // Hardcoded fallback experiences
                        <div className="space-y-8">
                            <div className="flex flex-col sm:flex-row gap-5 group">
                                <div className="shrink-0">
                                    <div className="size-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
                                        <span className="material-symbols-outlined text-3xl">manage_accounts</span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                                        <div>
                                            <h4 className="text-lg font-bold text-text-main dark:text-white">Senior Business System Analyst</h4>
                                            <p className="text-text-muted dark:text-gray-400 text-sm font-medium">FinTech Corp • New York, NY</p>
                                        </div>
                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full w-fit mt-2 sm:mt-0">2021 - Present</span>
                                    </div>
                                    <ul className="space-y-2 mt-3">
                                        <li className="flex items-start gap-2 text-sm text-text-muted dark:text-gray-400 leading-relaxed">
                                            <span className="material-symbols-outlined text-green-500 text-base mt-0.5 shrink-0">check_circle</span>
                                            <span>Spearheaded the migration of legacy CRM to Salesforce, reducing data redundancy by <strong>40%</strong>.</span>
                                        </li>
                                        <li className="flex items-start gap-2 text-sm text-text-muted dark:text-gray-400 leading-relaxed">
                                            <span className="material-symbols-outlined text-green-500 text-base mt-0.5 shrink-0">check_circle</span>
                                            <span>Led requirement gathering workshops for 5 major product releases.</span>
                                        </li>
                                    </ul>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        <span className="px-2 py-1 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs rounded border border-gray-200 dark:border-gray-700">JIRA</span>
                                        <span className="px-2 py-1 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs rounded border border-gray-200 dark:border-gray-700">Salesforce</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-5 group">
                                <div className="shrink-0">
                                    <div className="size-14 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
                                        <span className="material-symbols-outlined text-3xl">analytics</span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                                        <div>
                                            <h4 className="text-lg font-bold text-text-main dark:text-white">Business Analyst</h4>
                                            <p className="text-text-muted dark:text-gray-400 text-sm font-medium">Global Logistics Ltd. • Chicago, IL</p>
                                        </div>
                                        <span className="text-sm font-medium text-text-muted dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full w-fit mt-2 sm:mt-0">2019 - 2021</span>
                                    </div>
                                    <ul className="space-y-2 mt-3">
                                        <li className="flex items-start gap-2 text-sm text-text-muted dark:text-gray-400 leading-relaxed">
                                            <span className="material-symbols-outlined text-gray-400 text-base mt-0.5 shrink-0">check_circle</span>
                                            <span>Optimized warehouse inventory tracking system, achieving a <strong>15% reduction</strong> in stock discrepancies.</span>
                                        </li>
                                        <li className="flex items-start gap-2 text-sm text-text-muted dark:text-gray-400 leading-relaxed">
                                            <span className="material-symbols-outlined text-gray-400 text-base mt-0.5 shrink-0">check_circle</span>
                                            <span>Created comprehensive documentation (BRD, FRD) for internal API integrations.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </BentoCard>

                {/* Right column: Education + Offline stacked */}
                <div className="col-span-1 flex flex-col gap-6">
                    {/* Education Card */}
                    {primaryEducation && (
                        <BentoCard className="p-6 flex flex-col gap-4">
                            <div className="flex items-start justify-between">
                                <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400">
                                    <span className="material-symbols-outlined text-2xl">school</span>
                                </div>
                                <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">
                                    {primaryEducation.end_year || primaryEducation.start_year}
                                </span>
                            </div>
                            <div>
                                <span className="text-xs font-semibold text-text-muted dark:text-gray-500 uppercase tracking-wider">Education</span>
                                <h4 className="font-bold text-text-main dark:text-white text-lg mt-1">
                                    {primaryEducation.degree}
                                </h4>
                                <p className="text-sm text-text-muted dark:text-gray-400 mt-1">
                                    {primaryEducation.school || primaryEducation.institution}
                                </p>
                                {primaryEducation.gpa && (
                                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                                        GPA: {primaryEducation.gpa}
                                    </p>
                                )}
                                {primaryEducation.achievements && primaryEducation.achievements.length > 0 && (
                                    <p className="text-xs text-text-muted dark:text-gray-400 italic mt-2">
                                        {primaryEducation.achievements[0]}
                                    </p>
                                )}
                            </div>
                        </BentoCard>
                    )}

                    {/* Fallback education if none from API */}
                    {!primaryEducation && (
                        <BentoCard className="p-6 flex flex-col gap-4">
                            <div className="flex items-start justify-between">
                                <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400">
                                    <span className="material-symbols-outlined text-2xl">school</span>
                                </div>
                                <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded">2018</span>
                            </div>
                            <div>
                                <span className="text-xs font-semibold text-text-muted dark:text-gray-500 uppercase tracking-wider">Education</span>
                                <h4 className="font-bold text-text-main dark:text-white text-lg mt-1">B.S. Information Systems</h4>
                                <p className="text-sm text-text-muted dark:text-gray-400 mt-1">University of Technology</p>
                                <p className="text-xs text-text-muted dark:text-gray-400 italic mt-2">Dean&apos;s List • Graduated Cum Laude</p>
                            </div>
                        </BentoCard>
                    )}

                    {/* Offline Mode Card */}
                    <BentoCard className="!bg-[#fce1e4]/30 dark:!bg-rose-900/10 p-6 flex flex-col gap-4 !border-[#fce1e4]/50 dark:!border-rose-800/30">
                        <div className="size-10 rounded-full bg-white dark:bg-rose-900/50 flex items-center justify-center text-rose-500 dark:text-rose-300">
                            <span className="material-symbols-outlined">hiking</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-text-main dark:text-white text-lg">{offline.title}</h4>
                            <p className="text-sm text-text-muted dark:text-rose-200 mt-2">{offline.description}</p>
                        </div>
                    </BentoCard>
                </div>
            </div>
        </div>
    );
}
