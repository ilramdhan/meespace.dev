"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { useToast } from "@/components/shared/Toast";
import { apiCall } from "@/hooks/useApi";

interface Stat {
    id?: string;
    value: string;
    label: string;
    icon: string;
    color: string;
    display_order: number;
    is_active: boolean;
}

const ICON_OPTIONS = [
    "verified", "deployed_code", "trending_up", "work", "code", "analytics",
    "star", "emoji_events", "school", "people", "rocket_launch", "thumb_up",
    "speed", "check_circle", "workspace_premium", "military_tech"
];

const COLOR_OPTIONS = [
    { value: "blue", label: "Blue", class: "bg-blue-500" },
    { value: "green", label: "Green", class: "bg-green-500" },
    { value: "purple", label: "Purple", class: "bg-purple-500" },
    { value: "orange", label: "Orange", class: "bg-orange-500" },
    { value: "red", label: "Red", class: "bg-red-500" },
];

export default function AdminStatsPage() {
    const [stats, setStats] = useState<Stat[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStat, setEditingStat] = useState<Stat | null>(null);
    const [formData, setFormData] = useState<Stat>({
        value: '',
        label: '',
        icon: 'verified',
        color: 'blue',
        display_order: 0,
        is_active: true,
    });
    const { showToast } = useToast();

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        const res = await apiCall<{ stats: Stat[] }>('/api/v1/stats?admin=true');
        if (res.success && res.data) {
            setStats(res.data.stats || []);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const openCreateModal = () => {
        setEditingStat(null);
        setFormData({
            value: '',
            label: '',
            icon: 'verified',
            color: 'blue',
            display_order: stats.length,
            is_active: true,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (stat: Stat) => {
        setEditingStat(stat);
        setFormData({
            value: stat.value,
            label: stat.label,
            icon: stat.icon,
            color: stat.color,
            display_order: stat.display_order,
            is_active: stat.is_active,
        });
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!formData.value.trim() || !formData.label.trim()) {
            showToast('Value and label are required', 'error');
            return;
        }

        setIsSaving(true);

        if (editingStat?.id) {
            // Update existing
            const res = await apiCall(`/api/v1/stats?id=${editingStat.id}`, {
                method: 'PUT',
                body: formData,
            });
            if (res.success) {
                showToast('Stat updated successfully', 'success');
                fetchData();
                setIsModalOpen(false);
            } else {
                showToast(res.error || 'Failed to update stat', 'error');
            }
        } else {
            // Create new
            const res = await apiCall('/api/v1/stats', {
                method: 'POST',
                body: formData,
            });
            if (res.success) {
                showToast('Stat created successfully', 'success');
                fetchData();
                setIsModalOpen(false);
            } else {
                showToast(res.error || 'Failed to create stat', 'error');
            }
        }

        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this stat?')) return;

        const res = await apiCall(`/api/v1/stats?id=${id}`, { method: 'DELETE' });
        if (res.success) {
            showToast('Stat deleted successfully', 'success');
            fetchData();
        } else {
            showToast(res.error || 'Failed to delete stat', 'error');
        }
    };

    const getColorClasses = (color: string) => {
        switch (color) {
            case 'blue': return 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300';
            case 'green': return 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300';
            case 'purple': return 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300';
            case 'orange': return 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300';
            case 'red': return 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300';
            default: return 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300';
        }
    };

    const RightAction = (
        <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-text-main rounded-full text-sm font-bold shadow-sm transition-colors cursor-pointer"
        >
            <span className="material-symbols-outlined text-sm">add</span>
            Add New Stat
        </button>
    );

    if (isLoading) {
        return (
            <div className="flex flex-col gap-6">
                <AdminPageHeader
                    title="Stats Management"
                    description="Manage statistics displayed on the home page."
                />
                <div className="max-w-[1400px] w-full mx-auto px-8 pb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-[#1e1e1e] rounded-xl p-6 border border-gray-100 dark:border-gray-800 animate-pulse">
                                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full mb-4"></div>
                                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
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
                title="Stats Management"
                description="Manage statistics displayed on the home page."
                rightAction={RightAction}
            />

            <div className="max-w-[1400px] w-full mx-auto px-8 pb-8">
                {stats.length === 0 ? (
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-xl p-12 border border-gray-100 dark:border-gray-800 text-center">
                        <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-4">analytics</span>
                        <h3 className="text-lg font-semibold text-text-main dark:text-white mb-2">No stats yet</h3>
                        <p className="text-text-muted dark:text-gray-400 mb-6">Add your first statistic to display on the home page.</p>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-text-main rounded-full text-sm font-bold transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">add</span>
                            Add First Stat
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stats.map((stat) => (
                            <div
                                key={stat.id}
                                className={`bg-white dark:bg-[#1e1e1e] rounded-xl p-6 border border-gray-100 dark:border-gray-800 relative group ${!stat.is_active ? 'opacity-50' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`size-12 rounded-full ${getColorClasses(stat.color)} flex items-center justify-center`}>
                                        <span className="material-symbols-outlined">{stat.icon}</span>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => openEditModal(stat)}
                                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-lg text-text-muted">edit</span>
                                        </button>
                                        <button
                                            onClick={() => stat.id && handleDelete(stat.id)}
                                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-lg text-red-500">delete</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-text-main dark:text-white mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-text-muted dark:text-gray-400">
                                    {stat.label}
                                </div>
                                {!stat.is_active && (
                                    <span className="absolute top-2 right-2 text-xs bg-gray-200 dark:bg-gray-700 text-gray-500 px-2 py-1 rounded">
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
                                    {editingStat ? 'Edit Stat' : 'Add New Stat'}
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                        Value *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.value}
                                        onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                                        className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                        placeholder="e.g., 5+, 100%, $50k"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                        Label *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.label}
                                        onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                                        className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                        placeholder="e.g., Years of Experience"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                            Icon
                                        </label>
                                        <select
                                            value={formData.icon}
                                            onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                                            className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                        >
                                            {ICON_OPTIONS.map(icon => (
                                                <option key={icon} value={icon}>{icon}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                            Color
                                        </label>
                                        <select
                                            value={formData.color}
                                            onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                                            className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                        >
                                            {COLOR_OPTIONS.map(color => (
                                                <option key={color.value} value={color.value}>{color.label}</option>
                                            ))}
                                        </select>
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
                                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 flex items-center gap-4">
                                        <div className={`size-12 rounded-full ${getColorClasses(formData.color)} flex items-center justify-center`}>
                                            <span className="material-symbols-outlined">{formData.icon}</span>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-text-main dark:text-white">
                                                {formData.value || '0'}
                                            </div>
                                            <div className="text-sm text-text-muted dark:text-gray-400">
                                                {formData.label || 'Label'}
                                            </div>
                                        </div>
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
                                    {editingStat ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
