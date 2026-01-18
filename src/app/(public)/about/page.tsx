import { BentoCard } from "@/components/public/BentoCard";
import { Metadata } from "next";

interface Experience {
    id: string;
    title: string;
    company: string;
    location?: string;
    start_date: string;
    end_date?: string;
    is_current: boolean;
    description?: string;
}

interface Education {
    id: string;
    degree: string;
    institution: string;
    field_of_study?: string;
    start_year: number;
    end_year?: number;
    gpa?: string;
}

interface Certification {
    id: string;
    name: string;
    issuer: string;
    issue_date: string;
    expiry_date?: string;
    credential_url?: string;
    certificate_file_url?: string;
}

interface AboutContent {
    section_key: string;
    title?: string;
    content?: Record<string, unknown>;
}

async function fetchData() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    try {
        const [aboutRes, expRes, eduRes, certRes] = await Promise.all([
            fetch(`${baseUrl}/api/v1/about`, { next: { revalidate: 60 } }),
            fetch(`${baseUrl}/api/v1/experiences`, { next: { revalidate: 60 } }),
            fetch(`${baseUrl}/api/v1/education`, { next: { revalidate: 60 } }),
            fetch(`${baseUrl}/api/v1/certifications`, { next: { revalidate: 60 } }),
        ]);

        const aboutData = aboutRes.ok ? await aboutRes.json() : { data: {} };
        const expData = expRes.ok ? await expRes.json() : { data: { experiences: [] } };
        const eduData = eduRes.ok ? await eduRes.json() : { data: { education: [] } };
        const certData = certRes.ok ? await certRes.json() : { data: { certifications: [] } };

        return {
            about: aboutData.data || {},
            experiences: expData.data?.experiences || expData.experiences || [],
            education: eduData.data?.education || eduData.education || [],
            certifications: certData.data?.certifications || certData.certifications || [],
        };
    } catch {
        return { about: {}, experiences: [], education: [], certifications: [] };
    }
}

export const metadata: Metadata = {
    title: "About",
    description: "Learn more about me and my journey.",
};

// Helper to format dates
function formatDateRange(startDate: string, endDate?: string, isCurrent?: boolean): string {
    const start = new Date(startDate);
    const startStr = start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    if (isCurrent) return `${startStr} - Present`;
    if (!endDate) return startStr;

    const end = new Date(endDate);
    const endStr = end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    return `${startStr} - ${endStr}`;
}

export default async function AboutPage() {
    const { about, experiences, education, certifications } = await fetchData();

    // Extract about sections
    const sections = about.sections || {};
    const header = sections.header?.content || { title: "About Me", subtitle: "My journey and experiences" };
    const story = sections.story?.content || {
        title: "My Story",
        content: ["Add your story in the admin panel."],
        image: "/placeholder-avatar.png",
        tag: "Background",
        year: "Present"
    };
    const funFact = sections.funFact?.content || { title: "Fun Fact", description: "Add a fun fact in the admin panel." };
    const offline = sections.offline?.content || { title: "When Offline", description: "Add your hobbies in the admin panel." };

    // Get first education as primary degree
    const primaryEducation = education.length > 0 ? education[0] : null;

    return (
        <div className="w-full">
            <div className="mb-10 text-center md:text-left">
                <h2 className="text-3xl md:text-5xl font-bold text-text-main dark:text-white mb-3">
                    {header.title || "About Me"}
                </h2>
                <p className="text-text-muted dark:text-gray-400 text-lg max-w-2xl">
                    {header.subtitle || "My journey and experiences"}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min">
                {/* Story Card */}
                <BentoCard className="col-span-1 md:col-span-2 row-span-1 bg-white dark:bg-[#1e1e1e] p-8 flex flex-col justify-between relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                        <div className="size-24 md:size-32 shrink-0 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-sm relative bg-gray-200 dark:bg-gray-700">
                            {story.image && (
                                <img alt="Portrait" className="w-full h-full object-cover" src={story.image} />
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full bg-accent-sage text-green-900 text-xs font-semibold">
                                    {story.tag}
                                </span>
                                <span className="text-sm text-text-muted dark:text-gray-400 font-medium">
                                    {story.year}
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold text-text-main dark:text-white mb-4">
                                {story.title}
                            </h3>
                            {(story.content || []).map((paragraph: string, idx: number) => (
                                <p key={idx} className={`text-text-muted dark:text-gray-400 leading-relaxed ${idx < (story.content?.length || 0) - 1 ? "mb-4" : ""}`}>
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                    <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-500 pointer-events-none"></div>
                </BentoCard>

                {/* Fun Fact Card */}
                <BentoCard className="col-span-1 bg-accent-purple/30 dark:bg-purple-900/10 p-6 flex flex-col justify-between border border-accent-purple/50 dark:border-purple-800/30">
                    <div className="flex justify-between items-start">
                        <div className="size-10 rounded-full bg-white dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-300">
                            <span className="material-symbols-outlined">lightbulb</span>
                        </div>
                    </div>
                    <div className="mt-4">
                        <h4 className="font-bold text-text-main dark:text-white text-lg mb-2">{funFact.title}</h4>
                        <p className="text-sm text-text-muted dark:text-purple-200">{funFact.description}</p>
                    </div>
                </BentoCard>

                {/* Education & Certs Card - NOW FROM REAL DATA */}
                <BentoCard className="col-span-1 md:col-span-1 md:row-span-2 bg-white dark:bg-[#1e1e1e] p-6 flex flex-col gap-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
                        <div className="size-10 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-300">
                            <span className="material-symbols-outlined">school</span>
                        </div>
                        <h3 className="font-bold text-text-main dark:text-white text-lg">Education & Certs</h3>
                    </div>
                    <div className="flex flex-col gap-5">
                        {/* Education List */}
                        {education.length > 0 && (
                            <div>
                                <span className="text-xs font-semibold text-text-muted dark:text-gray-500 uppercase tracking-wider">Education</span>
                                <div className="mt-2 space-y-3">
                                    {education.map((edu: Education) => (
                                        <div key={edu.id} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                            <h4 className="font-bold text-text-main dark:text-white text-sm">{edu.degree}</h4>
                                            <p className="text-xs text-text-muted dark:text-gray-400 mt-1">{edu.institution}</p>
                                            {edu.field_of_study && (
                                                <p className="text-xs text-text-muted dark:text-gray-400">{edu.field_of_study}</p>
                                            )}
                                            <p className="text-xs text-text-muted dark:text-gray-500 mt-0.5">
                                                {edu.start_year} - {edu.end_year || 'Present'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Certifications List */}
                        {certifications.length > 0 && (
                            <div>
                                <span className="text-xs font-semibold text-text-muted dark:text-gray-500 uppercase tracking-wider">Certifications</span>
                                <div className="mt-2 space-y-3">
                                    {certifications.map((cert: Certification) => (
                                        <div key={cert.id} className="flex items-start gap-3 p-3 border border-gray-100 dark:border-gray-700 rounded-lg hover:border-primary/50 transition-colors">
                                            <div className="mt-0.5 text-blue-600 dark:text-blue-400">
                                                <span className="material-symbols-outlined text-[20px]">verified</span>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-text-main dark:text-white text-sm">{cert.name}</h4>
                                                <p className="text-xs text-text-muted dark:text-gray-400">{cert.issuer}</p>
                                                <p className="text-xs text-text-muted dark:text-gray-500 mt-0.5">
                                                    {new Date(cert.issue_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                                </p>
                                                {cert.credential_url && (
                                                    <a
                                                        href={cert.credential_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-sage-green hover:underline mt-1 inline-block"
                                                    >
                                                        View Credential →
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {education.length === 0 && certifications.length === 0 && (
                            <p className="text-text-muted text-sm text-center py-4">Add education & certifications in the admin panel.</p>
                        )}
                    </div>
                </BentoCard>

                {/* Experience Roadmap Card - NOW FROM REAL DATA */}
                <BentoCard className="col-span-1 md:col-span-2 row-span-2 bg-white dark:bg-[#1e1e1e] p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-300">
                                <span className="material-symbols-outlined">work_history</span>
                            </div>
                            <h3 className="font-bold text-text-main dark:text-white text-xl">Experience Roadmap</h3>
                        </div>
                    </div>
                    {experiences.length === 0 ? (
                        <p className="text-text-muted text-center py-8">Add your experiences in the admin panel.</p>
                    ) : (
                        <div className="relative pl-4 md:pl-8 space-y-10">
                            <div className="absolute left-[23px] md:left-[39px] top-2 bottom-2 w-[2px] bg-gray-200 dark:bg-gray-800"></div>
                            {experiences.map((exp: Experience, idx: number) => (
                                <div key={exp.id} className="relative pl-8">
                                    <div className={`absolute -left-[9px] top-1.5 w-5 h-5 rounded-full border-4 border-white dark:border-[#1e1e1e] shadow-sm z-10 ${idx === 0 ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"}`}></div>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-lg font-bold text-text-main dark:text-white">{exp.title}</h4>
                                            {exp.is_current && (
                                                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-md bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                                                    Current
                                                </span>
                                            )}
                                        </div>
                                        <span className={`text-sm font-medium px-3 py-1 rounded-full w-fit mt-1 sm:mt-0 ${idx === 0 ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20" : "text-text-muted dark:text-gray-500 bg-gray-100 dark:bg-gray-800"}`}>
                                            {formatDateRange(exp.start_date, exp.end_date, exp.is_current)}
                                        </span>
                                    </div>
                                    <p className="text-text-muted dark:text-gray-400 text-sm font-medium mb-3">
                                        {exp.company}
                                        {exp.location && <span className="text-text-muted/70"> · {exp.location}</span>}
                                    </p>
                                    {exp.description && (
                                        <p className="text-sm text-text-muted dark:text-gray-400 leading-relaxed">
                                            {exp.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </BentoCard>

                {/* Offline Mode Card */}
                <BentoCard className="col-span-1 bg-accent-rose/30 dark:bg-rose-900/10 p-6 flex flex-col justify-between border border-accent-rose/50 dark:border-rose-800/30">
                    <div className="flex justify-between items-start">
                        <div className="size-10 rounded-full bg-white dark:bg-rose-900/50 flex items-center justify-center text-rose-500 dark:text-rose-300">
                            <span className="material-symbols-outlined">hiking</span>
                        </div>
                    </div>
                    <div className="mt-4">
                        <h4 className="font-bold text-text-main dark:text-white text-lg mb-2">{offline.title}</h4>
                        <p className="text-sm text-text-muted dark:text-rose-200">{offline.description}</p>
                    </div>
                </BentoCard>
            </div>
        </div>
    );
}
