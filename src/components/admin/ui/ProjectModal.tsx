"use client";

import { useEffect, useState } from "react";
import { apiCall } from "@/hooks/useApi";
import { useToast } from "@/components/shared/Toast";
import { ImageUpload, MultiImageUpload } from "@/components/shared/ImageUpload";

interface Deliverable {
    id?: string;
    title: string;
    description: string;
    icon: string;
}

interface Outcome {
    id?: string;
    value: string;
    label: string;
}

interface ProjectImage {
    id?: string;
    image_url: string;
    caption: string;
}

interface Project {
    id?: string;
    title: string;
    slug: string;
    short_description?: string;
    full_description?: string;
    category?: string;
    category_color?: string;
    icon?: string;
    icon_color?: string;
    status: string;
    year?: string;
    is_featured?: boolean;
    thumbnail_url?: string;
    featured_image_url?: string;
    problem_statement?: string;
    solution_description?: string;
}

interface ProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editData?: Project | null;
}

type TabType = 'basic' | 'content' | 'media' | 'deliverables';

export function ProjectModal({ isOpen, onClose, onSuccess, editData }: ProjectModalProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('basic');
    const { showToast } = useToast();

    // Form state
    const [formData, setFormData] = useState<Project>({
        title: '',
        slug: '',
        short_description: '',
        full_description: '',
        category: '',
        category_color: 'blue',
        icon: 'folder',
        icon_color: 'blue',
        status: 'draft',
        year: new Date().getFullYear().toString(),
        is_featured: false,
        thumbnail_url: '',
        featured_image_url: '',
        problem_statement: '',
        solution_description: '',
    });

    // Deliverables & Outcomes
    const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
    const [outcomes, setOutcomes] = useState<Outcome[]>([]);
    const [projectImages, setProjectImages] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setActiveTab('basic');
            if (editData) {
                setFormData({
                    id: editData.id,
                    title: editData.title || '',
                    slug: editData.slug || '',
                    short_description: editData.short_description || '',
                    full_description: editData.full_description || '',
                    category: editData.category || '',
                    category_color: editData.category_color || 'blue',
                    icon: editData.icon || 'folder',
                    icon_color: editData.icon_color || 'blue',
                    status: editData.status || 'draft',
                    year: editData.year || new Date().getFullYear().toString(),
                    is_featured: editData.is_featured || false,
                    thumbnail_url: editData.thumbnail_url || '',
                    featured_image_url: editData.featured_image_url || '',
                    problem_statement: editData.problem_statement || '',
                    solution_description: editData.solution_description || '',
                });
                // TODO: Fetch deliverables, outcomes, images for this project
            } else {
                setFormData({
                    title: '',
                    slug: '',
                    short_description: '',
                    full_description: '',
                    category: '',
                    category_color: 'blue',
                    icon: 'folder',
                    icon_color: 'blue',
                    status: 'draft',
                    year: new Date().getFullYear().toString(),
                    is_featured: false,
                    thumbnail_url: '',
                    featured_image_url: '',
                    problem_statement: '',
                    solution_description: '',
                });
                setDeliverables([]);
                setOutcomes([]);
                setProjectImages([]);
            }
        } else {
            const timer = setTimeout(() => setIsVisible(false), 200);
            return () => clearTimeout(timer);
        }
    }, [isOpen, editData]);

    // Auto-generate slug from title
    const handleTitleChange = (title: string) => {
        setFormData({
            ...formData,
            title,
            slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        });
    };

    // Deliverables management
    const addDeliverable = () => {
        setDeliverables([...deliverables, { title: '', description: '', icon: 'check_circle' }]);
    };

    const updateDeliverable = (index: number, field: keyof Deliverable, value: string) => {
        const updated = [...deliverables];
        updated[index] = { ...updated[index], [field]: value };
        setDeliverables(updated);
    };

    const removeDeliverable = (index: number) => {
        setDeliverables(deliverables.filter((_, i) => i !== index));
    };

    // Outcomes management
    const addOutcome = () => {
        setOutcomes([...outcomes, { value: '', label: '' }]);
    };

    const updateOutcome = (index: number, field: keyof Outcome, value: string) => {
        const updated = [...outcomes];
        updated[index] = { ...updated[index], [field]: value };
        setOutcomes(updated);
    };

    const removeOutcome = (index: number) => {
        setOutcomes(outcomes.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.slug) {
            showToast('Please fill in title and slug', 'error');
            return;
        }

        setIsLoading(true);

        const payload = {
            title: formData.title,
            slug: formData.slug,
            short_description: formData.short_description || null,
            full_description: formData.full_description || null,
            category: formData.category || null,
            category_color: formData.category_color,
            icon: formData.icon,
            icon_color: formData.icon_color,
            status: formData.status,
            year: formData.year || null,
            is_featured: formData.is_featured,
            thumbnail_url: formData.thumbnail_url || null,
            featured_image_url: formData.featured_image_url || null,
            problem_statement: formData.problem_statement || null,
            solution_description: formData.solution_description || null,
        };

        let result;
        if (editData?.id) {
            result = await apiCall(`/api/v1/projects?id=${editData.id}`, { method: 'PUT', body: payload });
        } else {
            result = await apiCall('/api/v1/projects', { method: 'POST', body: payload });
        }

        // TODO: Save deliverables, outcomes, images to their respective tables

        setIsLoading(false);

        if (result.success) {
            showToast(editData ? 'Project updated successfully' : 'Project created successfully', 'success');
            onSuccess();
            onClose();
        } else {
            showToast(result.error || 'Failed to save project', 'error');
        }
    };

    if (!isVisible && !isOpen) return null;
    const isEditing = !!editData?.id;

    const tabs = [
        { id: 'basic' as TabType, label: 'Basic Info', icon: 'info' },
        { id: 'content' as TabType, label: 'Problem & Solution', icon: 'description' },
        { id: 'deliverables' as TabType, label: 'Deliverables & Outcomes', icon: 'task_alt' },
        { id: 'media' as TabType, label: 'Media', icon: 'image' },
    ];

    const colorOptions = ['blue', 'purple', 'orange', 'green', 'yellow', 'red', 'indigo', 'cyan'];

    return (
        <>
            <div className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60] transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0"}`} onClick={onClose}></div>
            <div className="fixed inset-0 flex items-center justify-center z-[70] p-4 pointer-events-none">
                <div className={`bg-white dark:bg-[#1e1e1e] w-full max-w-3xl rounded-[24px] shadow-2xl border border-gray-100 dark:border-gray-700 flex flex-col max-h-[90vh] pointer-events-auto transition-all duration-200 transform ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>

                    {/* Header */}
                    <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-text-main dark:text-white">{isEditing ? 'Edit Project' : 'New Project'}</h2>
                            <p className="text-sm text-text-muted dark:text-gray-400 mt-1">{isEditing ? 'Update project details' : 'Create a new portfolio project'}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="px-8 py-3 border-b border-gray-100 dark:border-gray-800 flex gap-2 overflow-x-auto">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${activeTab === tab.id
                                        ? 'bg-sage-green/20 text-sage-green'
                                        : 'text-text-muted hover:bg-gray-100 dark:hover:bg-white/5'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                        <div className="p-8 overflow-y-auto custom-scrollbar space-y-6 flex-1">

                            {/* TAB: Basic Info */}
                            {activeTab === 'basic' && (
                                <>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">
                                                Project Title <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm"
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => handleTitleChange(e.target.value)}
                                                placeholder="e.g. E-commerce Platform Redesign"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">
                                                Slug <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm"
                                                type="text"
                                                value={formData.slug}
                                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">Year</label>
                                            <input
                                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm"
                                                type="text"
                                                value={formData.year}
                                                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                                placeholder="2024"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">Short Description</label>
                                        <textarea
                                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm resize-none"
                                            rows={2}
                                            value={formData.short_description}
                                            onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                                            placeholder="Brief description for cards and previews..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">Category</label>
                                            <input
                                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm"
                                                type="text"
                                                value={formData.category}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                placeholder="e.g. FinTech, SaaS"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">Status</label>
                                            <select
                                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm"
                                                value={formData.status}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            >
                                                <option value="draft">Draft</option>
                                                <option value="published">Published</option>
                                                <option value="archived">Archived</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">Icon Color</label>
                                            <select
                                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm"
                                                value={formData.icon_color}
                                                onChange={(e) => setFormData({ ...formData, icon_color: e.target.value })}
                                            >
                                                {colorOptions.map(c => (
                                                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-black/20 rounded-xl p-4">
                                        <input
                                            type="checkbox"
                                            id="is_featured"
                                            checked={formData.is_featured}
                                            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                            className="w-4 h-4 accent-sage-green"
                                        />
                                        <label htmlFor="is_featured" className="text-sm font-medium text-text-main dark:text-white cursor-pointer">
                                            Featured Project (show on homepage)
                                        </label>
                                    </div>
                                </>
                            )}

                            {/* TAB: Problem & Solution */}
                            {activeTab === 'content' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">
                                            The Problem
                                        </label>
                                        <p className="text-xs text-text-muted mb-2">Describe the challenge or problem this project addressed. Markdown supported.</p>
                                        <textarea
                                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm resize-none font-mono"
                                            rows={6}
                                            value={formData.problem_statement}
                                            onChange={(e) => setFormData({ ...formData, problem_statement: e.target.value })}
                                            placeholder="## The Challenge&#10;&#10;Describe the problem that needed to be solved..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">
                                            The Solution
                                        </label>
                                        <p className="text-xs text-text-muted mb-2">Explain your approach and solution. Markdown supported.</p>
                                        <textarea
                                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm resize-none font-mono"
                                            rows={6}
                                            value={formData.solution_description}
                                            onChange={(e) => setFormData({ ...formData, solution_description: e.target.value })}
                                            placeholder="## The Approach&#10;&#10;Describe how you solved the problem..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">
                                            Full Description
                                        </label>
                                        <p className="text-xs text-text-muted mb-2">Detailed project description. Markdown supported.</p>
                                        <textarea
                                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm resize-none font-mono"
                                            rows={8}
                                            value={formData.full_description}
                                            onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                                            placeholder="# Project Overview&#10;&#10;Write your detailed project description here..."
                                        />
                                    </div>
                                </>
                            )}

                            {/* TAB: Deliverables & Outcomes */}
                            {activeTab === 'deliverables' && (
                                <>
                                    {/* Deliverables Section */}
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-text-main dark:text-gray-300">
                                                    My Role & Deliverables
                                                </label>
                                                <p className="text-xs text-text-muted">What you contributed to this project</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={addDeliverable}
                                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-sage-green hover:bg-sage-light dark:hover:bg-sage-green/10 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <span className="material-symbols-outlined text-sm">add</span>
                                                Add Deliverable
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            {deliverables.length === 0 ? (
                                                <div className="text-center py-8 text-text-muted text-sm border border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
                                                    No deliverables added yet. Click "Add Deliverable" to start.
                                                </div>
                                            ) : (
                                                deliverables.map((d, idx) => (
                                                    <div key={idx} className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                                        <input
                                                            className="w-24 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-text-main dark:text-white py-2 px-3 text-sm"
                                                            type="text"
                                                            value={d.icon}
                                                            onChange={(e) => updateDeliverable(idx, 'icon', e.target.value)}
                                                            placeholder="Icon"
                                                        />
                                                        <input
                                                            className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-text-main dark:text-white py-2 px-3 text-sm"
                                                            type="text"
                                                            value={d.title}
                                                            onChange={(e) => updateDeliverable(idx, 'title', e.target.value)}
                                                            placeholder="Title (e.g. Documentation)"
                                                        />
                                                        <input
                                                            className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-text-main dark:text-white py-2 px-3 text-sm"
                                                            type="text"
                                                            value={d.description}
                                                            onChange={(e) => updateDeliverable(idx, 'description', e.target.value)}
                                                            placeholder="Description"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeDeliverable(idx)}
                                                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">delete</span>
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {/* Outcomes Section */}
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-text-main dark:text-gray-300">
                                                    Key Outcomes
                                                </label>
                                                <p className="text-xs text-text-muted">Measurable results and achievements</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={addOutcome}
                                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-sage-green hover:bg-sage-light dark:hover:bg-sage-green/10 rounded-lg transition-colors cursor-pointer"
                                            >
                                                <span className="material-symbols-outlined text-sm">add</span>
                                                Add Outcome
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            {outcomes.length === 0 ? (
                                                <div className="text-center py-8 text-text-muted text-sm border border-dashed border-gray-300 dark:border-gray-600 rounded-xl">
                                                    No outcomes added yet. Click "Add Outcome" to start.
                                                </div>
                                            ) : (
                                                outcomes.map((o, idx) => (
                                                    <div key={idx} className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                                                        <input
                                                            className="w-28 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-text-main dark:text-white py-2 px-3 text-sm font-bold"
                                                            type="text"
                                                            value={o.value}
                                                            onChange={(e) => updateOutcome(idx, 'value', e.target.value)}
                                                            placeholder="40%"
                                                        />
                                                        <input
                                                            className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-text-main dark:text-white py-2 px-3 text-sm"
                                                            type="text"
                                                            value={o.label}
                                                            onChange={(e) => updateOutcome(idx, 'label', e.target.value)}
                                                            placeholder="Redundancy Reduced"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeOutcome(idx)}
                                                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">delete</span>
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* TAB: Media */}
                            {activeTab === 'media' && (
                                <>
                                    <div className="grid grid-cols-2 gap-6">
                                        <ImageUpload
                                            label="Thumbnail Image"
                                            folder="projects/thumbnails"
                                            currentUrl={formData.thumbnail_url}
                                            onUpload={(url) => setFormData({ ...formData, thumbnail_url: url })}
                                            helperText="Used for project cards (recommended: 400x300)"
                                        />
                                        <ImageUpload
                                            label="Featured Image"
                                            folder="projects/featured"
                                            currentUrl={formData.featured_image_url}
                                            onUpload={(url) => setFormData({ ...formData, featured_image_url: url })}
                                            helperText="Used as hero image on detail page"
                                        />
                                    </div>

                                    <MultiImageUpload
                                        label="Project Gallery (Carousel)"
                                        folder="projects/gallery"
                                        currentUrls={projectImages}
                                        onUpload={setProjectImages}
                                        maxImages={10}
                                    />
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-8 py-5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/30 rounded-b-[24px]">
                            <div className="flex items-center gap-2 text-xs text-text-muted">
                                <span className="material-symbols-outlined text-sm">info</span>
                                All fields with * are required
                            </div>
                            <div className="flex items-center gap-3">
                                <button type="button" onClick={onClose} disabled={isLoading} className="px-5 py-2.5 rounded-full border border-gray-300 dark:border-gray-600 text-sm font-semibold text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isLoading} className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-dark text-text-main text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2">
                                    {isLoading && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                                    {isLoading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Project')}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
