"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { useToast } from "@/components/shared/Toast";
import { apiCall } from "@/hooks/useApi";

interface Certification {
    id?: string;
    name: string;
    short_name: string;
    subtitle: string;
    issuer: string;
    issue_date: string;
    expiry_date: string;
    credential_id: string;
    credential_url: string;
    icon: string;
    description: string;
    display_order: number;
    is_active: boolean;
}

const ICON_OPTIONS = [
    "verified_user", "badge", "cloud", "workspace_premium", "military_tech",
    "school", "card_membership", "shield_with_house", "security", "grade",
    "star", "emoji_events", "psychology", "architecture", "code"
];

const defaultFormData: Certification = {
    name: '',
    short_name: '',
    subtitle: '',
    issuer: '',
    issue_date: '',
    expiry_date: '',
    credential_id: '',
    credential_url: '',
    icon: 'verified_user',
    description: '',
    display_order: 0,
    is_active: true,
};

export default function AdminCertificationsPage() {
    const [certifications, setCertifications] = useState<Certification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCert, setEditingCert] = useState<Certification | null>(null);
    const [formData, setFormData] = useState<Certification>(defaultFormData);
    const { showToast } = useToast();

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        const res = await apiCall<{ certifications: Certification[] }>('/api/v1/certifications?admin=true');
        if (res.success && res.data) {
            setCertifications(res.data.certifications || []);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const openCreateModal = () => {
        setEditingCert(null);
        setFormData({ ...defaultFormData, display_order: certifications.length });
        setIsModalOpen(true);
    };

    const openEditModal = (cert: Certification) => {
        setEditingCert(cert);
        setFormData({
            name: cert.name || '',
            short_name: cert.short_name || '',
            subtitle: cert.subtitle || '',
            issuer: cert.issuer || '',
            issue_date: cert.issue_date ? cert.issue_date.split('T')[0] : '',
            expiry_date: cert.expiry_date ? cert.expiry_date.split('T')[0] : '',
            credential_id: cert.credential_id || '',
            credential_url: cert.credential_url || '',
            icon: cert.icon || 'verified_user',
            description: cert.description || '',
            display_order: cert.display_order || 0,
            is_active: cert.is_active !== false,
        });
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (!formData.name.trim() || !formData.issuer.trim()) {
            showToast('Name and issuer are required', 'error');
            return;
        }

        setIsSaving(true);

        const payload = {
            ...formData,
            issue_date: formData.issue_date || null,
            expiry_date: formData.expiry_date || null,
        };

        if (editingCert?.id) {
            const res = await apiCall(`/api/v1/certifications?id=${editingCert.id}`, {
                method: 'PUT',
                body: payload,
            });
            if (res.success) {
                showToast('Certification updated successfully', 'success');
                fetchData();
                setIsModalOpen(false);
            } else {
                showToast(res.error || 'Failed to update certification', 'error');
            }
        } else {
            const res = await apiCall('/api/v1/certifications', {
                method: 'POST',
                body: payload,
            });
            if (res.success) {
                showToast('Certification created successfully', 'success');
                fetchData();
                setIsModalOpen(false);
            } else {
                showToast(res.error || 'Failed to create certification', 'error');
            }
        }

        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this certification?')) return;

        const res = await apiCall(`/api/v1/certifications?id=${id}`, { method: 'DELETE' });
        if (res.success) {
            showToast('Certification deleted successfully', 'success');
            fetchData();
        } else {
            showToast(res.error || 'Failed to delete certification', 'error');
        }
    };

    const getYear = (date: string) => {
        if (!date) return '';
        try {
            return new Date(date).getFullYear().toString();
        } catch {
            return '';
        }
    };

    const RightAction = (
        <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-text-main rounded-full text-sm font-bold shadow-sm transition-colors cursor-pointer"
        >
            <span className="material-symbols-outlined text-sm">add</span>
            Add Certification
        </button>
    );

    if (isLoading) {
        return (
            <div className="flex flex-col gap-6">
                <AdminPageHeader
                    title="Certifications"
                    description="Manage certifications displayed on the about page."
                />
                <div className="max-w-[1400px] w-full mx-auto px-8 pb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-[#1e1e1e] rounded-xl p-6 border border-gray-100 dark:border-gray-800 animate-pulse">
                                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
                                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
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
                title="Certifications"
                description="Manage certifications displayed on the about page."
                rightAction={RightAction}
            />

            <div className="max-w-[1400px] w-full mx-auto px-8 pb-8">
                {certifications.length === 0 ? (
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-xl p-12 border border-gray-100 dark:border-gray-800 text-center">
                        <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-4">verified_user</span>
                        <h3 className="text-lg font-semibold text-text-main dark:text-white mb-2">No certifications yet</h3>
                        <p className="text-text-muted dark:text-gray-400 mb-6">Add your first certification to display on the about page.</p>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-text-main rounded-full text-sm font-bold transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">add</span>
                            Add First Certification
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {certifications.map((cert) => (
                            <div
                                key={cert.id}
                                className={`bg-white dark:bg-[#1e1e1e] rounded-xl p-6 border border-gray-100 dark:border-gray-800 relative group flex flex-col ${!cert.is_active ? 'opacity-50' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                                        <span className="material-symbols-outlined text-2xl">{cert.icon || 'verified_user'}</span>
                                    </div>
                                    <div className="flex gap-1">
                                        {cert.issue_date && (
                                            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                                                {getYear(cert.issue_date)}
                                            </span>
                                        )}
                                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                                            <button
                                                onClick={() => openEditModal(cert)}
                                                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-base text-text-muted">edit</span>
                                            </button>
                                            <button
                                                onClick={() => cert.id && handleDelete(cert.id)}
                                                className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-base text-red-500">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <h4 className="font-bold text-text-main dark:text-white text-lg">
                                    {cert.short_name || cert.name}
                                </h4>
                                <p className="text-xs text-text-muted dark:text-gray-400 font-medium mb-2">
                                    {cert.subtitle || cert.issuer}
                                </p>
                                {cert.description && (
                                    <p className="text-sm text-text-muted dark:text-gray-500 leading-snug line-clamp-2 mt-auto">
                                        {cert.description}
                                    </p>
                                )}
                                {!cert.is_active && (
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
                                    {editingCert ? 'Edit Certification' : 'Add New Certification'}
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                            placeholder="e.g., Certified Scrum Product Owner"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                            Short Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.short_name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, short_name: e.target.value }))}
                                            className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                            placeholder="e.g., CSPO®"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                            Subtitle
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.subtitle}
                                            onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                                            className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                            placeholder="e.g., Scrum Alliance"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                            Issuer *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.issuer}
                                            onChange={(e) => setFormData(prev => ({ ...prev, issuer: e.target.value }))}
                                            className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                            placeholder="e.g., Scrum Alliance"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                            Issue Date
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.issue_date}
                                            onChange={(e) => setFormData(prev => ({ ...prev, issue_date: e.target.value }))}
                                            className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                            Expiry Date
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.expiry_date}
                                            onChange={(e) => setFormData(prev => ({ ...prev, expiry_date: e.target.value }))}
                                            className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                            Credential ID
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.credential_id}
                                            onChange={(e) => setFormData(prev => ({ ...prev, credential_id: e.target.value }))}
                                            className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                            placeholder="e.g., ABC123XYZ"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                            Credential URL
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.credential_url}
                                            onChange={(e) => setFormData(prev => ({ ...prev, credential_url: e.target.value }))}
                                            className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none"
                                            placeholder="https://verify.example.com/..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                        Icon
                                    </label>
                                    <div className="grid grid-cols-8 gap-2">
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

                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        rows={3}
                                        className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none resize-none"
                                        placeholder="Brief description of what this certification covers..."
                                    />
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
                                    {editingCert ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
