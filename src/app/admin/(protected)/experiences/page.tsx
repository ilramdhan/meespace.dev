"use client";

import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { useState, useEffect, useCallback } from "react";
import { ExperienceModal } from "@/components/admin/ui/ExperienceModal";
import { EducationModal } from "@/components/admin/ui/EducationModal";
import { CertificationModal } from "@/components/admin/ui/CertificationModal";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { useToast } from "@/components/shared/Toast";
import { apiCall } from "@/hooks/useApi";

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
    school: string;
    field_of_study?: string;
    location?: string;
    start_year?: number;
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
    issue_date?: string;
    expiry_date?: string;
    credential_id?: string;
    credential_url?: string;
    certificate_file_url?: string;
    icon?: string;
}

interface DeleteItem {
    type: 'experience' | 'education' | 'certification';
    id: string;
    name: string;
}

export default function AdminExperiencePage() {
    const [isExpModalOpen, setIsExpModalOpen] = useState(false);
    const [isEduModalOpen, setIsEduModalOpen] = useState(false);
    const [isCertModalOpen, setIsCertModalOpen] = useState(false);
    const [editingExp, setEditingExp] = useState<Experience | null>(null);
    const [editingEdu, setEditingEdu] = useState<Education | null>(null);
    const [editingCert, setEditingCert] = useState<Certification | null>(null);
    const [deleteItem, setDeleteItem] = useState<DeleteItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [education, setEducation] = useState<Education[]>([]);
    const [certifications, setCertifications] = useState<Certification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { showToast } = useToast();

    // Fetch all data
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        const [expRes, eduRes, certRes] = await Promise.all([
            apiCall<{ experiences: Experience[] }>('/api/v1/experiences?admin=true'),
            apiCall<{ education: Education[] }>('/api/v1/education?admin=true'),
            apiCall<{ certifications: Certification[] }>('/api/v1/certifications?admin=true'),
        ]);

        // Extract arrays from response objects
        if (expRes.success && expRes.data) {
            setExperiences(expRes.data.experiences || []);
        }
        if (eduRes.success && eduRes.data) {
            setEducation(eduRes.data.education || []);
        }
        if (certRes.success && certRes.data) {
            setCertifications(certRes.data.certifications || []);
        }

        if (!expRes.success || !eduRes.success || !certRes.success) {
            showToast('Some data failed to load', 'warning');
        }
        setIsLoading(false);
    }, [showToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Handle delete
    const handleDelete = async () => {
        if (!deleteItem) return;

        setIsDeleting(true);
        const endpoint = `/api/v1/${deleteItem.type === 'certification' ? 'certifications' : deleteItem.type === 'education' ? 'education' : 'experiences'}?id=${deleteItem.id}`;
        const result = await apiCall(endpoint, { method: 'DELETE' });

        if (result.success) {
            showToast(`"${deleteItem.name}" deleted successfully`, 'success');
            fetchData();
        } else {
            showToast(result.error || 'Failed to delete', 'error');
        }

        setIsDeleting(false);
        setDeleteItem(null);
    };

    // Modal close handlers
    const handleExpModalClose = (saved?: boolean) => {
        setIsExpModalOpen(false);
        setEditingExp(null);
        if (saved) fetchData();
    };

    const handleEduModalClose = (saved?: boolean) => {
        setIsEduModalOpen(false);
        setEditingEdu(null);
        if (saved) fetchData();
    };

    const handleCertModalClose = (saved?: boolean) => {
        setIsCertModalOpen(false);
        setEditingCert(null);
        if (saved) fetchData();
    };

    // Format date helper
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    // Loading skeleton
    const LoadingSkeleton = () => (
        <div className="animate-pulse space-y-4 p-6">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                    <div className="flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    </div>
                </div>
            ))}
        </div>
    );

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
                                <span className="material-symbols-outlined text-lg">work</span>
                            </div>
                            <h3 className="text-lg font-bold text-text-main dark:text-white">
                                Professional Experience
                            </h3>
                        </div>
                        <button
                            onClick={() => { setEditingExp(null); setIsExpModalOpen(true); }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-text-main rounded-full text-sm font-bold shadow-sm transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-sm">add</span>
                            Add Experience
                        </button>
                    </div>
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
                        {isLoading ? <LoadingSkeleton /> : experiences.length === 0 ? (
                            <div className="text-center py-12 text-text-muted">No experiences added yet</div>
                        ) : experiences.map((exp) => (
                            <div key={exp.id} className="p-6 flex flex-col md:flex-row md:items-center gap-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group relative">
                                <div className="md:pl-2 flex-1">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-base font-bold text-text-main dark:text-white">{exp.title}</h4>
                                            {exp.is_current && (
                                                <span className="px-2 py-0.5 rounded-md bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-[10px] font-bold uppercase tracking-wide">Current</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-sm text-text-main dark:text-gray-300 font-medium mt-0.5">{exp.company}</div>
                                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-2 text-xs text-text-muted dark:text-gray-500">
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-sm">calendar_month</span>
                                            {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : exp.end_date ? formatDate(exp.end_date) : ''}
                                        </span>
                                        {exp.location && (
                                            <span className="flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-sm">location_on</span>{exp.location}
                                            </span>
                                        )}
                                    </div>
                                    {exp.description && <p className="mt-3 text-sm text-text-muted dark:text-gray-400 line-clamp-2 pr-4">{exp.description}</p>}
                                </div>
                                <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => { setEditingExp(exp); setIsExpModalOpen(true); }} className="size-8 flex items-center justify-center rounded-full text-text-muted hover:bg-gray-100 dark:hover:bg-white/10 hover:text-text-main transition-colors cursor-pointer" title="Edit">
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                    </button>
                                    <button onClick={() => setDeleteItem({ type: 'experience', id: exp.id, name: exp.title })} className="size-8 flex items-center justify-center rounded-full text-text-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition-colors cursor-pointer" title="Delete">
                                        <span className="material-symbols-outlined text-lg">delete</span>
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
                                <span className="material-symbols-outlined text-lg">school</span>
                            </div>
                            <h3 className="text-lg font-bold text-text-main dark:text-white">Education</h3>
                        </div>
                        <button
                            onClick={() => { setEditingEdu(null); setIsEduModalOpen(true); }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-text-main rounded-full text-sm font-bold shadow-sm transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-sm">add</span>
                            Add Education
                        </button>
                    </div>
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
                        {isLoading ? <LoadingSkeleton /> : education.length === 0 ? (
                            <div className="text-center py-12 text-text-muted">No education records added yet</div>
                        ) : education.map((edu) => (
                            <div key={edu.id} className="p-6 flex flex-col md:flex-row md:items-center gap-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group relative">
                                <div className="md:pl-2 flex-1">
                                    <h4 className="text-base font-bold text-text-main dark:text-white">{edu.degree}</h4>
                                    <div className="text-sm text-text-main dark:text-gray-300 font-medium mt-0.5">{edu.school}</div>
                                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-2 text-xs text-text-muted dark:text-gray-500">
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-sm">calendar_month</span>
                                            {edu.start_year} - {edu.end_year || 'Present'}
                                        </span>
                                        {edu.gpa && (
                                            <span className="flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-sm">workspace_premium</span>GPA: {edu.gpa}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => { setEditingEdu(edu); setIsEduModalOpen(true); }} className="size-8 flex items-center justify-center rounded-full text-text-muted hover:bg-gray-100 dark:hover:bg-white/10 hover:text-text-main transition-colors cursor-pointer">
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                    </button>
                                    <button onClick={() => setDeleteItem({ type: 'education', id: edu.id, name: edu.degree })} className="size-8 flex items-center justify-center rounded-full text-text-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition-colors cursor-pointer">
                                        <span className="material-symbols-outlined text-lg">delete</span>
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
                                <span className="material-symbols-outlined text-lg">verified</span>
                            </div>
                            <h3 className="text-lg font-bold text-text-main dark:text-white">Certifications</h3>
                        </div>
                        <button
                            onClick={() => { setEditingCert(null); setIsCertModalOpen(true); }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-text-main rounded-full text-sm font-bold shadow-sm transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-sm">add</span>
                            Add Certificate
                        </button>
                    </div>
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden divide-y divide-gray-100 dark:divide-gray-800">
                        {isLoading ? <LoadingSkeleton /> : certifications.length === 0 ? (
                            <div className="text-center py-12 text-text-muted">No certifications added yet</div>
                        ) : certifications.map((cert) => (
                            <div key={cert.id} className="p-6 flex flex-col md:flex-row md:items-center gap-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group relative">
                                <div className="md:pl-2 flex-1">
                                    <h4 className="text-base font-bold text-text-main dark:text-white">{cert.name}</h4>
                                    <div className="text-sm text-text-main dark:text-gray-300 font-medium mt-0.5">{cert.issuer}</div>
                                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-2 text-xs text-text-muted dark:text-gray-500">
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-sm">calendar_month</span>
                                            {cert.issue_date ? formatDate(cert.issue_date) : 'Not specified'}
                                        </span>
                                        {cert.expiry_date && (
                                            <span className="flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-sm">event_busy</span>
                                                Expires: {formatDate(cert.expiry_date)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {cert.credential_url && (
                                        <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-xs font-medium text-text-muted hover:text-text-main border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                            Verify
                                        </a>
                                    )}
                                    <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setEditingCert(cert); setIsCertModalOpen(true); }} className="size-8 flex items-center justify-center rounded-full text-text-muted hover:bg-gray-100 dark:hover:bg-white/10 hover:text-text-main transition-colors cursor-pointer">
                                            <span className="material-symbols-outlined text-lg">edit</span>
                                        </button>
                                        <button onClick={() => setDeleteItem({ type: 'certification', id: cert.id, name: cert.name })} className="size-8 flex items-center justify-center rounded-full text-text-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition-colors cursor-pointer">
                                            <span className="material-symbols-outlined text-lg">delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </div>

            {/* Modals */}
            <ExperienceModal isOpen={isExpModalOpen} onClose={() => handleExpModalClose()} onSuccess={fetchData} editData={editingExp} />
            <EducationModal isOpen={isEduModalOpen} onClose={() => handleEduModalClose()} onSuccess={fetchData} editData={editingEdu} />
            <CertificationModal isOpen={isCertModalOpen} onClose={() => handleCertModalClose()} onSuccess={fetchData} editData={editingCert} />

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={!!deleteItem}
                title={`Delete ${deleteItem?.type === 'experience' ? 'Experience' : deleteItem?.type === 'education' ? 'Education' : 'Certification'}`}
                message={`Are you sure you want to delete "${deleteItem?.name}"? This action cannot be undone.`}
                confirmLabel="Delete"
                cancelLabel="Cancel"
                variant="danger"
                onConfirm={handleDelete}
                onCancel={() => setDeleteItem(null)}
                isLoading={isDeleting}
            />
        </div>
    );
}
