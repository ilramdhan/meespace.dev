"use client";

import { useEffect, useState } from "react";
import { apiCall } from "@/hooks/useApi";
import { useToast } from "@/components/shared/Toast";

interface Education {
    id?: string;
    degree: string;
    field_of_study?: string;
    school: string;
    location?: string;
    start_year?: number;
    end_year?: number;
    gpa?: string;
    description?: string;
    achievements?: string[];
    display_order?: number;
    is_active?: boolean;
}

interface EducationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editData?: Education | null;
}

export function EducationModal({ isOpen, onClose, onSuccess, editData }: EducationModalProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    const [formData, setFormData] = useState<Education>({
        degree: '',
        field_of_study: '',
        school: '',
        location: '',
        start_year: new Date().getFullYear(),
        end_year: undefined,
        gpa: '',
        description: '',
        achievements: [],
        is_active: true,
    });

    const [achievementInput, setAchievementInput] = useState('');

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            if (editData) {
                setFormData({
                    id: editData.id,
                    degree: editData.degree || '',
                    field_of_study: editData.field_of_study || '',
                    school: editData.school || '',
                    location: editData.location || '',
                    start_year: editData.start_year || new Date().getFullYear(),
                    end_year: editData.end_year || undefined,
                    gpa: editData.gpa || '',
                    description: editData.description || '',
                    achievements: editData.achievements || [],
                    is_active: editData.is_active !== false,
                });
            } else {
                setFormData({
                    degree: '',
                    field_of_study: '',
                    school: '',
                    location: '',
                    start_year: new Date().getFullYear() - 4,
                    end_year: new Date().getFullYear(),
                    gpa: '',
                    description: '',
                    achievements: [],
                    is_active: true,
                });
            }
            setAchievementInput('');
        } else {
            const timer = setTimeout(() => setIsVisible(false), 200);
            return () => clearTimeout(timer);
        }
    }, [isOpen, editData]);

    const addAchievement = () => {
        if (achievementInput.trim()) {
            setFormData({
                ...formData,
                achievements: [...(formData.achievements || []), achievementInput.trim()]
            });
            setAchievementInput('');
        }
    };

    const removeAchievement = (index: number) => {
        setFormData({
            ...formData,
            achievements: (formData.achievements || []).filter((_, i) => i !== index)
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.degree || !formData.school) {
            showToast('Please fill in degree and school', 'error');
            return;
        }

        setIsLoading(true);

        const payload = {
            degree: formData.degree,
            field_of_study: formData.field_of_study || null,
            school: formData.school,
            location: formData.location || null,
            start_year: formData.start_year ? Number(formData.start_year) : null,
            end_year: formData.end_year ? Number(formData.end_year) : null,
            gpa: formData.gpa || null,
            description: formData.description || null,
            achievements: formData.achievements || [],
            is_active: formData.is_active,
        };

        let result;
        if (editData?.id) {
            result = await apiCall(`/api/v1/education?id=${editData.id}`, { method: 'PUT', body: payload });
        } else {
            result = await apiCall('/api/v1/education', { method: 'POST', body: payload });
        }

        setIsLoading(false);

        if (result.success) {
            showToast(editData ? 'Education updated successfully' : 'Education added successfully', 'success');
            onSuccess();
            onClose();
        } else {
            showToast(result.error || 'Failed to save education', 'error');
        }
    };

    if (!isVisible && !isOpen) return null;
    const isEditing = !!editData?.id;

    return (
        <>
            <div className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60] transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0"}`} onClick={onClose}></div>
            <div className="fixed inset-0 flex items-center justify-center z-[70] p-4 pointer-events-none">
                <div className={`bg-white dark:bg-[#1e1e1e] w-full max-w-xl rounded-[24px] shadow-2xl border border-gray-100 dark:border-gray-700 flex flex-col max-h-[90vh] pointer-events-auto transition-all duration-200 transform ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>

                    <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-text-main dark:text-white">{isEditing ? 'Edit Education' : 'Add Education'}</h2>
                            <p className="text-sm text-text-muted dark:text-gray-400 mt-1">Your academic background</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col flex-1">
                        <div className="p-8 overflow-y-auto custom-scrollbar space-y-6">

                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">
                                        Degree <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm"
                                        type="text"
                                        value={formData.degree}
                                        onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                                        placeholder="e.g. Bachelor of Science"
                                        required
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">
                                        School/University <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm"
                                        type="text"
                                        value={formData.school}
                                        onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                                        placeholder="e.g. MIT"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">Field of Study</label>
                                    <input
                                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm"
                                        type="text"
                                        value={formData.field_of_study}
                                        onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
                                        placeholder="e.g. Computer Science"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">Location</label>
                                    <input
                                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm"
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="e.g. Cambridge, MA"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">Start Year</label>
                                    <input
                                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm"
                                        type="number"
                                        value={formData.start_year || ''}
                                        onChange={(e) => setFormData({ ...formData, start_year: parseInt(e.target.value) })}
                                        placeholder="2020"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">End Year</label>
                                    <input
                                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm"
                                        type="number"
                                        value={formData.end_year || ''}
                                        onChange={(e) => setFormData({ ...formData, end_year: parseInt(e.target.value) })}
                                        placeholder="2024"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">GPA</label>
                                    <input
                                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm"
                                        type="text"
                                        value={formData.gpa}
                                        onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                                        placeholder="3.8"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">Description</label>
                                <textarea
                                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm resize-none"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Optional description of your studies..."
                                />
                            </div>

                            {/* Achievements */}
                            <div>
                                <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">Achievements</label>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-2.5 px-4 shadow-sm text-sm"
                                        type="text"
                                        value={achievementInput}
                                        onChange={(e) => setAchievementInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                                        placeholder="e.g. Dean's List, Summa Cum Laude"
                                    />
                                    <button
                                        type="button"
                                        onClick={addAchievement}
                                        className="px-4 py-2.5 bg-sage-green/20 text-sage-green rounded-xl text-sm font-medium hover:bg-sage-green/30 transition-colors cursor-pointer"
                                    >
                                        Add
                                    </button>
                                </div>
                                {(formData.achievements || []).length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {(formData.achievements || []).map((ach, idx) => (
                                            <span key={idx} className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-text-main dark:text-white rounded-full text-xs">
                                                {ach}
                                                <button type="button" onClick={() => removeAchievement(idx)} className="ml-1 hover:text-red-500 cursor-pointer">
                                                    <span className="material-symbols-outlined text-sm">close</span>
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="px-8 py-5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3 bg-gray-50/50 dark:bg-gray-900/30 rounded-b-[24px]">
                            <button type="button" onClick={onClose} disabled={isLoading} className="px-5 py-2.5 rounded-full border border-gray-300 dark:border-gray-600 text-sm font-semibold text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50">
                                Cancel
                            </button>
                            <button type="submit" disabled={isLoading} className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-dark text-text-main text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2">
                                {isLoading && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                                {isLoading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add Education')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
