"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { useToast } from "@/components/shared/Toast";
import { apiCall } from "@/hooks/useApi";

interface Skill {
    id?: string;
    title: string;
    description: string;
    icon: string;
    display_order: number;
    is_active: boolean;
}

const ICON_OPTIONS = [
    "description", "integration_instructions", "analytics", "group_work",
    "handshake", "psychology", "architecture", "settings_suggest",
    "query_stats", "code", "hub", "schema", "api", "task_alt",
    "fact_check", "troubleshoot", "draw", "lightbulb"
];

export default function AdminSkillsPage() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
    const [formData, setFormData] = useState<Skill>({
        title: '',
        description: '',
        icon: 'description',
        display_order: 0,
        is_active: true,
    });
    const { showToast } = useToast();

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        const res = await apiCall<{ skills: Skill[] }>('/api/v1/skills?admin=true');
        if (res.success && res.data) {
            setSkills(res.data.skills || []);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const openCreateModal = () => {
        setEditingSkill(null);
        setFormData({
            title: '',
            description: '',
            icon: 'description',
            display_order: skills.length,
            is_active: true,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (skill: Skill) => {
        setEditingSkill(skill);
        setFormData({
            title: skill.title,
            description: skill.description,
            icon: skill.icon,
            display_order: skill.display_order,
            is_active: skill.is_active,
        });
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!formData.title.trim()) {
            showToast('Title is required', 'error');
            return;
        }

        setIsSaving(true);

        if (editingSkill?.id) {
            // Update existing
            const res = await apiCall(`/api/v1/skills?id=${editingSkill.id}`, {
                method: 'PUT',
                body: formData,
            });
            if (res.success) {
                showToast('Skill updated successfully', 'success');
                fetchData();
                setIsModalOpen(false);
            } else {
                showToast(res.error || 'Failed to update skill', 'error');
            }
        } else {
            // Create new
            const res = await apiCall('/api/v1/skills', {
                method: 'POST',
                body: formData,
            });
            if (res.success) {
                showToast('Skill created successfully', 'success');
                fetchData();
                setIsModalOpen(false);
            } else {
                showToast(res.error || 'Failed to create skill', 'error');
            }
        }

        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this skill?')) return;

        const res = await apiCall(`/api/v1/skills?id=${id}`, { method: 'DELETE' });
        if (res.success) {
            showToast('Skill deleted successfully', 'success');
            fetchData();
        } else {
            showToast(res.error || 'Failed to delete skill', 'error');
        }
    };

    const RightAction = (
        <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-text-main rounded-full text-sm font-bold shadow-sm transition-colors cursor-pointer"
        >
            <span className="material-symbols-outlined text-sm">add</span>
            Add New Skill
        </button>
    );

    if (isLoading) {
        return (
            <div className="flex flex-col gap-6">
                <AdminPageHeader
                    title="Skills Management"
                    description="Manage core expertise displayed on the home page."
                />
                <div className="max-w-[1400px] w-full mx-auto px-8 pb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-[#1e1e1e] rounded-xl p-6 border border-gray-100 dark:border-gray-800 animate-pulse">
                                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
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
                title="Skills Management"
                description="Manage core expertise displayed on the home page."
                rightAction={RightAction}
            />

            <div className="max-w-[1400px] w-full mx-auto px-8 pb-8">
                {skills.length === 0 ? (
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-xl p-12 border border-gray-100 dark:border-gray-800 text-center">
                        <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-4">star</span>
                        <h3 className="text-lg font-semibold text-text-main dark:text-white mb-2">No skills yet</h3>
                        <p className="text-text-muted dark:text-gray-400 mb-6">Add your first skill to display on the home page.</p>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-text-main rounded-full text-sm font-bold transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">add</span>
                            Add First Skill
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {skills.map((skill) => (
                            <div
                                key={skill.id}
                                className={`bg-white dark:bg-[#1e1e1e] rounded-xl p-5 border border-gray-100 dark:border-gray-800 relative group ${!skill.is_active ? 'opacity-50' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="size-10 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-text-main dark:text-white">
                                        <span className="material-symbols-outlined">{skill.icon || 'star'}</span>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => openEditModal(skill)}
                                            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-base text-text-muted">edit</span>
                                        </button>
                                        <button
                                            onClick={() => skill.id && handleDelete(skill.id)}
                                            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-base text-red-500">delete</span>
                                        </button>
                                    </div>
                                </div>
                                <h4 className="font-bold text-text-main dark:text-white mb-1">{skill.title}</h4>
                                <p className="text-xs text-text-muted dark:text-gray-400 line-clamp-2">{skill.description}</p>
                                {!skill.is_active && (
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
                        <div className="bg-white dark:bg-[#1e1e1e] rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                                <h2 className="text-xl font-bold text-text-main dark:text-white">
                                    {editingSkill ? 'Edit Skill' : 'Add New Skill'}
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                        placeholder="e.g., Requirements Elicitation"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        rows={3}
                                        className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none resize-none"
                                        placeholder="Brief description of this skill..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                        Icon
                                    </label>
                                    <div className="grid grid-cols-6 gap-2 mb-2">
                                        {ICON_OPTIONS.map(icon => (
                                            <button
                                                key={icon}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, icon }))}
                                                className={`p-2 rounded-lg border transition-colors ${formData.icon === icon
                                                    ? 'border-primary bg-primary/10'
                                                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                                                    }`}
                                            >
                                                <span className="material-symbols-outlined text-text-main dark:text-white">{icon}</span>
                                            </button>
                                        ))}
                                    </div>
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

                                {/* Preview */}
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-xs text-text-muted dark:text-gray-500 mb-3">Preview</p>
                                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                                        <div className="size-10 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center text-text-main dark:text-white mb-3">
                                            <span className="material-symbols-outlined">{formData.icon || 'star'}</span>
                                        </div>
                                        <h4 className="font-bold text-text-main dark:text-white">{formData.title || 'Skill Title'}</h4>
                                        <p className="text-xs text-text-muted dark:text-gray-400 mt-1">{formData.description || 'Description will appear here'}</p>
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
                                    {editingSkill ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
