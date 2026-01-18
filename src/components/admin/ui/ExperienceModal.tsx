"use client";

import { useEffect, useState } from "react";
import { apiCall } from "@/hooks/useApi";
import { useToast } from "@/components/shared/Toast";

interface Experience {
    id?: string;
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
    display_order?: number;
    is_active?: boolean;
}

interface ExperienceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editData?: Experience | null;
}

export function ExperienceModal({ isOpen, onClose, onSuccess, editData }: ExperienceModalProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    const [formData, setFormData] = useState<Experience>({
        title: '',
        company: '',
        location: '',
        employment_type: 'Full-time',
        start_date: '',
        end_date: '',
        is_current: false,
        description: '',
        highlights: [],
        tags: [],
        color: 'blue',
        is_active: true,
    });

    const [highlightInput, setHighlightInput] = useState('');
    const [tagInput, setTagInput] = useState('');

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            if (editData) {
                setFormData({
                    id: editData.id,
                    title: editData.title || '',
                    company: editData.company || '',
                    location: editData.location || '',
                    employment_type: editData.employment_type || 'Full-time',
                    start_date: editData.start_date || '',
                    end_date: editData.end_date || '',
                    is_current: editData.is_current || false,
                    description: editData.description || '',
                    highlights: editData.highlights || [],
                    tags: editData.tags || [],
                    color: editData.color || 'blue',
                    is_active: editData.is_active !== false,
                });
            } else {
                setFormData({
                    title: '',
                    company: '',
                    location: '',
                    employment_type: 'Full-time',
                    start_date: '',
                    end_date: '',
                    is_current: false,
                    description: '',
                    highlights: [],
                    tags: [],
                    color: 'blue',
                    is_active: true,
                });
            }
            setHighlightInput('');
            setTagInput('');
        } else {
            const timer = setTimeout(() => setIsVisible(false), 200);
            return () => clearTimeout(timer);
        }
    }, [isOpen, editData]);

    const addHighlight = () => {
        if (highlightInput.trim()) {
            setFormData({
                ...formData,
                highlights: [...(formData.highlights || []), highlightInput.trim()]
            });
            setHighlightInput('');
        }
    };

    const removeHighlight = (index: number) => {
        setFormData({
            ...formData,
            highlights: (formData.highlights || []).filter((_, i) => i !== index)
        });
    };

    const addTag = () => {
        if (tagInput.trim()) {
            setFormData({
                ...formData,
                tags: [...(formData.tags || []), tagInput.trim()]
            });
            setTagInput('');
        }
    };

    const removeTag = (index: number) => {
        setFormData({
            ...formData,
            tags: (formData.tags || []).filter((_, i) => i !== index)
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.company || !formData.start_date) {
            showToast('Please fill in title, company and start date', 'error');
            return;
        }

        setIsLoading(true);

        const payload = {
            title: formData.title,
            company: formData.company,
            location: formData.location || null,
            employment_type: formData.employment_type || null,
            start_date: formData.start_date,
            end_date: formData.is_current ? null : (formData.end_date || null),
            is_current: formData.is_current,
            description: formData.description || null,
            highlights: formData.highlights || [],
            tags: formData.tags || [],
            color: formData.color,
            is_active: formData.is_active,
        };

        let result;
        if (editData?.id) {
            result = await apiCall(`/api/v1/experiences?id=${editData.id}`, { method: 'PUT', body: payload });
        } else {
            result = await apiCall('/api/v1/experiences', { method: 'POST', body: payload });
        }

        setIsLoading(false);

        if (result.success) {
            showToast(editData ? 'Experience updated successfully' : 'Experience added successfully', 'success');
            onSuccess();
            onClose();
        } else {
            showToast(result.error || 'Failed to save experience', 'error');
        }
    };

    if (!isVisible && !isOpen) return null;
    const isEditing = !!editData?.id;

    const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];
    const colorOptions = ['blue', 'purple', 'orange', 'green', 'yellow', 'red', 'indigo', 'cyan'];

    return (
        <>
            <div className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60] transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0"}`} onClick={onClose}></div>
            <div className="fixed inset-0 flex items-center justify-center z-[70] p-4 pointer-events-none">
                <div className={`bg-white dark:bg-[#1e1e1e] w-full max-w-xl rounded-[24px] shadow-2xl border border-gray-100 dark:border-gray-700 flex flex-col max-h-[90vh] pointer-events-auto transition-all duration-200 transform ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>

                    <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-text-main dark:text-white">{isEditing ? 'Edit Experience' : 'Add Experience'}</h2>
                            <p className="text-sm text-text-muted dark:text-gray-400 mt-1">Your professional work history</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col flex-1">
                        <div className="p-8 overflow-y-auto custom-scrollbar space-y-6">

                            <div>
                                <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">
                                    Job Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm"
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Senior Product Manager"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">
                                        Company <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm"
                                        type="text"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        placeholder="e.g. Google"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">Location</label>
                                    <input
                                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm"
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="e.g. San Francisco, CA"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">Employment Type</label>
                                    <select
                                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm"
                                        value={formData.employment_type}
                                        onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                                    >
                                        {employmentTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">Color</label>
                                    <select
                                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                    >
                                        {colorOptions.map(c => (
                                            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">
                                        Start Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm"
                                        type="date"
                                        value={formData.start_date}
                                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">End Date</label>
                                    <input
                                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm disabled:opacity-50"
                                        type="date"
                                        value={formData.end_date}
                                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                        disabled={formData.is_current}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-black/20 rounded-xl p-4">
                                <input
                                    type="checkbox"
                                    id="is_current"
                                    checked={formData.is_current}
                                    onChange={(e) => setFormData({ ...formData, is_current: e.target.checked, end_date: e.target.checked ? '' : formData.end_date })}
                                    className="w-4 h-4 accent-sage-green"
                                />
                                <label htmlFor="is_current" className="text-sm font-medium text-text-main dark:text-white cursor-pointer">
                                    I currently work here
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">Description</label>
                                <textarea
                                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm resize-none"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe your role and responsibilities..."
                                />
                            </div>

                            {/* Highlights */}
                            <div>
                                <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">Key Highlights</label>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-2.5 px-4 shadow-sm text-sm"
                                        type="text"
                                        value={highlightInput}
                                        onChange={(e) => setHighlightInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                                        placeholder="e.g. Led a team of 10 engineers"
                                    />
                                    <button
                                        type="button"
                                        onClick={addHighlight}
                                        className="px-4 py-2.5 bg-sage-green/20 text-sage-green rounded-xl text-sm font-medium hover:bg-sage-green/30 transition-colors cursor-pointer"
                                    >
                                        Add
                                    </button>
                                </div>
                                {(formData.highlights || []).length > 0 && (
                                    <div className="space-y-2">
                                        {(formData.highlights || []).map((h, idx) => (
                                            <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                                <span className="material-symbols-outlined text-sm text-green-500">check_circle</span>
                                                <span className="flex-1 text-sm text-text-main dark:text-white">{h}</span>
                                                <button type="button" onClick={() => removeHighlight(idx)} className="text-red-500 hover:text-red-600 cursor-pointer">
                                                    <span className="material-symbols-outlined text-sm">close</span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">Skills/Tags</label>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-2.5 px-4 shadow-sm text-sm"
                                        type="text"
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                        placeholder="e.g. React, Product Strategy"
                                    />
                                    <button
                                        type="button"
                                        onClick={addTag}
                                        className="px-4 py-2.5 bg-sage-green/20 text-sage-green rounded-xl text-sm font-medium hover:bg-sage-green/30 transition-colors cursor-pointer"
                                    >
                                        Add
                                    </button>
                                </div>
                                {(formData.tags || []).length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {(formData.tags || []).map((tag, idx) => (
                                            <span key={idx} className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-text-main dark:text-white rounded-full text-xs">
                                                {tag}
                                                <button type="button" onClick={() => removeTag(idx)} className="ml-1 hover:text-red-500 cursor-pointer">
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
                                {isLoading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add Experience')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
