"use client";

import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { useState } from "react";
import experienceData from "@/data/admin-experience.json";
import { ExperienceModal } from "@/components/admin/ui/ExperienceModal";
import { EducationModal } from "@/components/admin/ui/EducationModal";
import { CertificationModal } from "@/components/admin/ui/CertificationModal";

export default function AdminExperiencePage() {
    const [isExpModalOpen, setIsExpModalOpen] = useState(false);
    const [isEduModalOpen, setIsEduModalOpen] = useState(false);
    const [isCertModalOpen, setIsCertModalOpen] = useState(false);

    return (
        <div className="flex flex-col gap-6">
            <AdminPageHeader
                title="Experience & Education"
                description="Manage your professional career timeline and academic achievements."
            />

            <div className="max-w-[1400px] w-full mx-auto px-8 pb-8 flex flex-col gap-10">

                {/* Professional Experience Section */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <span className="material-symbols-outlined text-lg">
                                    work
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-text-main dark:text-white">
                                Professional Experience
                            </h3>
                        </div>
                        <button
                            onClick={() => setIsExpModalOpen(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-text-main rounded-full text-sm font-bold shadow-sm transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-sm">
                                add
                            </span>
                            Add Experience
                        </button>
                    </div>
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
                        {experienceData.experiences.map((exp) => (
                            <div
                                key={exp.id}
                                className="p-6 flex flex-col md:flex-row md:items-center gap-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group relative"
                            >
                                <div className="md:pl-2 flex-1">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-base font-bold text-text-main dark:text-white">
                                                {exp.title}
                                            </h4>
                                            {exp.type === "Current" && (
                                                <span className="px-2 py-0.5 rounded-md bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-[10px] font-bold uppercase tracking-wide">
                                                    Current
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-sm text-text-main dark:text-gray-300 font-medium mt-0.5">
                                        {exp.company}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-2 text-xs text-text-muted dark:text-gray-500">
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-sm">
                                                calendar_month
                                            </span>{" "}
                                            {exp.startDate} - {exp.endDate}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-sm">
                                                location_on
                                            </span>{" "}
                                            {exp.location}
                                        </span>
                                    </div>
                                    {exp.description && (
                                        <p className="mt-3 text-sm text-text-muted dark:text-gray-400 line-clamp-2 pr-4">
                                            {exp.description}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => setIsExpModalOpen(true)}
                                        className="size-8 flex items-center justify-center rounded-full text-text-muted hover:bg-gray-100 dark:hover:bg-white/10 hover:text-text-main transition-colors cursor-pointer"
                                        title="Edit"
                                    >
                                        <span className="material-symbols-outlined text-lg">
                                            edit
                                        </span>
                                    </button>
                                    <button
                                        className="size-8 flex items-center justify-center rounded-full text-text-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                                        title="Delete"
                                    >
                                        <span className="material-symbols-outlined text-lg">
                                            delete
                                        </span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Education Section */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                <span className="material-symbols-outlined text-lg">
                                    school
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-text-main dark:text-white">
                                Education
                            </h3>
                        </div>
                        <button
                            onClick={() => setIsEduModalOpen(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-text-main rounded-full text-sm font-bold shadow-sm transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-sm">
                                add
                            </span>
                            Add Education
                        </button>
                    </div>
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
                        {experienceData.education.map((edu) => (
                            <div
                                key={edu.id}
                                className="p-6 flex flex-col md:flex-row md:items-center gap-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group relative"
                            >
                                <div className="md:pl-2 flex-1">
                                    <div className="flex items-start justify-between">
                                        <h4 className="text-base font-bold text-text-main dark:text-white">
                                            {edu.degree}
                                        </h4>
                                    </div>
                                    <div className="text-sm text-text-main dark:text-gray-300 font-medium mt-0.5">
                                        {edu.school}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-2 text-xs text-text-muted dark:text-gray-500">
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-sm">
                                                calendar_month
                                            </span>{" "}
                                            {edu.year}
                                        </span>
                                        {edu.gpa && (
                                            <span className="flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-sm">
                                                    workspace_premium
                                                </span>{" "}
                                                GPA: {edu.gpa}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => setIsEduModalOpen(true)}
                                        className="size-8 flex items-center justify-center rounded-full text-text-muted hover:bg-gray-100 dark:hover:bg-white/10 hover:text-text-main transition-colors cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-lg">
                                            edit
                                        </span>
                                    </button>
                                    <button className="size-8 flex items-center justify-center rounded-full text-text-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-lg">
                                            delete
                                        </span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Certifications Section */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="size-8 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
                                <span className="material-symbols-outlined text-lg">
                                    verified
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-text-main dark:text-white">
                                Certifications
                            </h3>
                        </div>
                        <button
                            onClick={() => setIsCertModalOpen(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-text-main rounded-full text-sm font-bold shadow-sm transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-sm">
                                add
                            </span>
                            Add Certificate
                        </button>
                    </div>
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
                        {experienceData.certifications.map((cert) => (
                            <div
                                key={cert.id}
                                className="p-6 flex flex-col md:flex-row md:items-center gap-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group relative"
                            >
                                <div className="md:pl-2 flex-1">
                                    <div className="flex items-start justify-between">
                                        <h4 className="text-base font-bold text-text-main dark:text-white">
                                            {cert.name}
                                        </h4>
                                    </div>
                                    <div className="text-sm text-text-main dark:text-gray-300 font-medium mt-0.5">
                                        {cert.issuer}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-2 text-xs text-text-muted dark:text-gray-500">
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-sm">
                                                calendar_month
                                            </span>{" "}
                                            {cert.date}
                                        </span>
                                        {cert.expires && (
                                            <span className="flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-sm">
                                                    event_busy
                                                </span>{" "}
                                                {cert.expires}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <a
                                        href={cert.credentialUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1.5 text-xs font-medium text-text-muted hover:text-text-main border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                    >
                                        Verify
                                    </a>
                                    <button
                                        className="p-2 text-text-muted hover:text-text-main hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                                        title="View Attachment"
                                    >
                                        <span className="material-symbols-outlined text-xl">
                                            visibility
                                        </span>
                                    </button>
                                    <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1"></div>
                                    <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => setIsCertModalOpen(true)}
                                            className="size-8 flex items-center justify-center rounded-full text-text-muted hover:bg-gray-100 dark:hover:bg-white/10 hover:text-text-main transition-colors cursor-pointer"
                                        >
                                            <span className="material-symbols-outlined text-lg">
                                                edit
                                            </span>
                                        </button>
                                        <button className="size-8 flex items-center justify-center rounded-full text-text-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                                        >
                                            <span className="material-symbols-outlined text-lg">
                                                delete
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </div>

            <ExperienceModal
                isOpen={isExpModalOpen}
                onClose={() => setIsExpModalOpen(false)}
            />
            <EducationModal
                isOpen={isEduModalOpen}
                onClose={() => setIsEduModalOpen(false)}
            />
            <CertificationModal
                isOpen={isCertModalOpen}
                onClose={() => setIsCertModalOpen(false)}
            />
        </div >
    );
}
