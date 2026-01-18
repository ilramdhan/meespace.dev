"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { useToast } from "@/components/shared/Toast";
import { apiCall } from "@/hooks/useApi";

interface Education {
    id?: string;
    degree: string;
    field_of_study: string;
    school: string;
    location: string;
    start_year: number | null;
    end_year: number | null;
    gpa: string;
    description: string;
    achievements: string[];
    display_order: number;
    is_active: boolean;
}

const defaultFormData: Education = {
    degree: '',
    field_of_study: '',
    school: '',
    location: '',
    start_year: null,
    end_year: null,
    gpa: '',
    description: '',
    achievements: [],
    display_order: 0,
    is_active: true,
};

export default function AdminEducationPage() {
    const [educations, setEducations] = useState<Education[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEdu, setEditingEdu] = useState<Education | null>(null);
    const [formData, setFormData] = useState<Education>(defaultFormData);
    const [newAchievement, setNewAchievement] = useState('');
    const { showToast } = useToast();

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        const res = await apiCall<{ education: Education[] }>('/api/v1/education?admin=true');
        if (res.success && res.data) {
            setEducations(res.data.education || []);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const openCreateModal = () => {
        setEditingEdu(null);
        setFormData({ ...defaultFormData, display_order: educations.length });
        setNewAchievement('');
        setIsModalOpen(true);
    };

    const openEditModal = (edu: Education) => {
        setEditingEdu(edu);
        setFormData({
            degree: edu.degree || '',
            field_of_study: edu.field_of_study || '',
            school: edu.school || '',
            location: edu.location || '',
            start_year: edu.start_year || null,
            end_year: edu.end_year || null,
            gpa: edu.gpa || '',
            description: edu.description || '',
            achievements: Array.isArray(edu.achievements) ? edu.achievements : [],
            display_order: edu.display_order || 0,
            is_active: edu.is_active !== false,
        });
        setNewAchievement('');
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!formData.degree.trim() || !formData.school.trim()) {
            showToast('Degree and school are required', 'error');
            return;
        }

        setIsSaving(true);

        const payload = {
            ...formData,
            start_year: formData.start_year || null,
            end_year: formData.end_year || null,
        };

        if (editingEdu?.id) {
            const res = await apiCall(`/api/v1/education?id=${editingEdu.id}`, {
                method: 'PUT',
                body: payload,
            });
            if (res.success) {
                showToast('Education updated successfully', 'success');
                fetchData();
                setIsModalOpen(false);
            } else {
                showToast(res.error || 'Failed to update education', 'error');
            }
        } else {
            const res = await apiCall('/api/v1/education', {
                method: 'POST',
                body: payload,
            });
            if (res.success) {
                showToast('Education created successfully', 'success');
                fetchData();
                setIsModalOpen(false);
            } else {
                showToast(res.error || 'Failed to create education', 'error');
            }
        }

        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this education record?')) return;

        const res = await apiCall(`/api/v1/education?id=${id}`, { method: 'DELETE' });
        if (res.success) {
            showToast('Education deleted successfully', 'success');
            fetchData();
        } else {
            showToast(res.error || 'Failed to delete education', 'error');
        }
    };

    const addAchievement = () => {
        if (!newAchievement.trim()) return;
        setFormData(prev => ({
            ...prev,
            achievements: [...prev.achievements, newAchievement.trim()],
        }));
        setNewAchievement('');
    };

    const removeAchievement = (index: number) => {
        setFormData(prev => ({
            ...prev,
            achievements: prev.achievements.filter((_, i) => i !== index),
        }));
    };

    const RightAction = (
        <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-text-main rounded-full text-sm font-bold shadow-sm transition-colors cursor-pointer"
        >
            <span className="material-symbols-outlined text-sm">add</span>
            Add Education
        </button>
    );

    if (isLoading) {
        return (
            <div className="flex flex-col gap-6">
                <AdminPageHeader
                    title="Education"
                    description="Manage education history displayed on the about page."
                />
                <div className="max-w-[1400px] w-full mx-auto px-8 pb-8">
                    <div className="space-y-4">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-[#1e1e1e] rounded-xl p-6 border border-gray-100 dark:border-gray-800 animate-pulse">
                                <div className="flex gap-4">
                                    <div className="h-14 w-14 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                                    <div className="flex-1">
                                        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <AdminPageHeader
                title="Education"
                description="Manage education history displayed on the about page."
                rightAction={RightAction}
            />

            <div className="max-w-[1400px] w-full mx-auto px-8 pb-8">
                {educations.length === 0 ? (
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-xl p-12 border border-gray-100 dark:border-gray-800 text-center">
                        <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-4">school</span>
                        <h3 className="text-lg font-semibold text-text-main dark:text-white mb-2">No education records yet</h3>
                        <p className="text-text-muted dark:text-gray-400 mb-6">Add your educational background to display on the about page.</p>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-text-main rounded-full text-sm font-bold transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">add</span>
                            Add First Education
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {educations.map((edu) => (
                            <div
                                key={edu.id}
                                className={`bg-white dark:bg-[#1e1e1e] rounded-xl p-6 border border-gray-100 dark:border-gray-800 relative group ${!edu.is_active ? 'opacity-50' : ''}`}
                            >
                                <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
                                    <div className="flex gap-4">
                                        <div className="size-14 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
                                            <span className="material-symbols-outlined text-2xl">school</span>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-text-main dark:text-white">
                                                {edu.degree}
                                            </h4>
                                            <p className="text-text-muted dark:text-gray-400 font-medium">
                                                {edu.school}
                                                {edu.field_of_study && ` • ${edu.field_of_study}`}
                                            </p>
                                            {edu.achievements && edu.achievements.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {edu.achievements.slice(0, 2).map((achievement, idx) => (
                                                        <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-800 text-text-muted px-2 py-1 rounded">
                                                            {achievement}
                                                        </span>
                                                    ))}
                                                    {edu.achievements.length > 2 && (
                                                        <span className="text-xs text-text-muted">
                                                            +{edu.achievements.length - 2} more
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <span className="text-sm font-semibold text-text-main dark:text-white bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
                                                Class of {edu.end_year || edu.start_year || 'N/A'}
                                            </span>
                                            {edu.gpa && (
                                                <p className="text-xs text-text-muted dark:text-gray-500 mt-1">
                                                    GPA: {edu.gpa}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openEditModal(edu)}
                                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-lg text-text-muted">edit</span>
                                            </button>
                                            <button
                                                onClick={() => edu.id && handleDelete(edu.id)}
                                                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-lg text-red-500">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {!edu.is_active && (
                                    <span className="absolute top-2 right-2 text-xs bg-gray-200 dark:bg-gray-700 text-gray-500 px-2 py-0.5 rounded">
                                        Inactive
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60]"
                        onClick={() => setIsModalOpen(false)}
                    />
                    <div className="fixed inset-0 flex items-center justify-center z-[70] p-4">
                        <div className="bg-white dark:bg-[#1e1e1e] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                                <h2 className="text-xl font-bold text-text-main dark:text-white">
                                    {editingEdu ? 'Edit Education' : 'Add New Education'}
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                            Degree *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.degree}
                                            onChange={(e) => setFormData(prev => ({ ...prev, degree: e.target.value }))}
                                            className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                            placeholder="e.g., B.S. Information Systems"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                            Field of Study
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.field_of_study}
                                            onChange={(e) => setFormData(prev => ({ ...prev, field_of_study: e.target.value }))}
                                            className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                            placeholder="e.g., Business Administration"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                            School / Institution *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.school}
                                            onChange={(e) => setFormData(prev => ({ ...prev, school: e.target.value }))}
                                            className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                            placeholder="e.g., University of Technology"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                            className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                            placeholder="e.g., New York, NY"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                            Start Year
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.start_year || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, start_year: e.target.value ? parseInt(e.target.value) : null }))}
                                            className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                            placeholder="2014"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                            End Year
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.end_year || ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, end_year: e.target.value ? parseInt(e.target.value) : null }))}
                                            className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                            placeholder="2018"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                            GPA
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.gpa}
                                            onChange={(e) => setFormData(prev => ({ ...prev, gpa: e.target.value }))}
                                            className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                            placeholder="3.8"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        rows={2}
                                        className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none resize-none"
                                        placeholder="Brief description about your education..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                        Achievements
                                    </label>
                                    <div className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={newAchievement}
                                            onChange={(e) => setNewAchievement(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                                            className="flex-1 bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                            placeholder="e.g., Dean's List, Cum Laude"
                                        />
                                        <button
                                            type="button"
                                            onClick={addAchievement}
                                            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-text-main dark:text-white rounded-lg transition-colors"
                                        >
                                            <span className="material-symbols-outlined">add</span>
                                        </button>
                                    </div>
                                    {formData.achievements.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {formData.achievements.map((achievement, idx) => (
                                                <span key={idx} className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-text-main dark:text-white px-3 py-1.5 rounded-lg text-sm">
                                                    {achievement}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeAchievement(idx)}
                                                        className="hover:text-red-500 transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-base">close</span>
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                            Display Order
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.display_order}
                                            onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                                            className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                        />
                                    </div>
                                    <div className="flex items-end pb-1">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.is_active}
                                                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                                                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                            <span className="text-sm text-text-main dark:text-gray-300">Active</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-main transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-text-main rounded-full text-sm font-bold transition-colors disabled:opacity-50"
                                >
                                    {isSaving && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                                    {editingEdu ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
