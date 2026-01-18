"use client";

import { useEffect, useState } from "react";
import { apiCall } from "@/hooks/useApi";
import { useToast } from "@/components/shared/Toast";
import { ImageUpload } from "@/components/shared/ImageUpload";

interface Certification {
    id?: string;
    name: string;
    short_name?: string;
    subtitle?: string;
    issuer: string;
    issue_date?: string;
    expiry_date?: string;
    credential_id?: string;
    credential_url?: string;
    certificate_file_url?: string;
    description?: string;
    icon?: string;
    is_expired?: boolean;
    is_active?: boolean;
}

interface CertificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editData?: Certification | null;
}

export function CertificationModal({ isOpen, onClose, onSuccess, editData }: CertificationModalProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    const [formData, setFormData] = useState<Certification>({
        name: '',
        short_name: '',
        subtitle: '',
        issuer: '',
        issue_date: '',
        expiry_date: '',
        credential_id: '',
        credential_url: '',
        certificate_file_url: '',
        description: '',
        icon: 'verified',
        is_expired: false,
        is_active: true,
    });

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            if (editData) {
                setFormData({
                    id: editData.id,
                    name: editData.name || '',
                    short_name: editData.short_name || '',
                    subtitle: editData.subtitle || '',
                    issuer: editData.issuer || '',
                    issue_date: editData.issue_date || '',
                    expiry_date: editData.expiry_date || '',
                    credential_id: editData.credential_id || '',
                    credential_url: editData.credential_url || '',
                    certificate_file_url: editData.certificate_file_url || '',
                    description: editData.description || '',
                    icon: editData.icon || 'verified',
                    is_expired: editData.is_expired || false,
                    is_active: editData.is_active !== false,
                });
            } else {
                setFormData({
                    name: '',
                    short_name: '',
                    subtitle: '',
                    issuer: '',
                    issue_date: '',
                    expiry_date: '',
                    credential_id: '',
                    credential_url: '',
                    certificate_file_url: '',
                    description: '',
                    icon: 'verified',
                    is_expired: false,
                    is_active: true,
                });
            }
        } else {
            const timer = setTimeout(() => setIsVisible(false), 200);
            return () => clearTimeout(timer);
        }
    }, [isOpen, editData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.issuer) {
            showToast('Please fill in certification name and issuer', 'error');
            return;
        }

        setIsLoading(true);

        const payload = {
            name: formData.name,
            short_name: formData.short_name || null,
            subtitle: formData.subtitle || null,
            issuer: formData.issuer,
            issue_date: formData.issue_date || null,
            expiry_date: formData.expiry_date || null,
            credential_id: formData.credential_id || null,
            credential_url: formData.credential_url || null,
            certificate_file_url: formData.certificate_file_url || null,
            description: formData.description || null,
            icon: formData.icon || 'verified',
            is_expired: formData.is_expired,
            is_active: formData.is_active,
        };

        let result;
        if (editData?.id) {
            result = await apiCall(`/api/v1/certifications?id=${editData.id}`, { method: 'PUT', body: payload });
        } else {
            result = await apiCall('/api/v1/certifications', { method: 'POST', body: payload });
        }

        setIsLoading(false);

        if (result.success) {
            showToast(editData ? 'Certification updated successfully' : 'Certification added successfully', 'success');
            onSuccess();
            onClose();
        } else {
            showToast(result.error || 'Failed to save certification', 'error');
        }
    };

    if (!isVisible && !isOpen) return null;
    const isEditing = !!editData?.id;

    const iconOptions = ['verified', 'workspace_premium', 'military_tech', 'school', 'emoji_events', 'star', 'grade', 'badge'];

    return (
        <>
            <div className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60] transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0"}`} onClick={onClose}></div>
            <div className="fixed inset-0 flex items-center justify-center z-[70] p-4 pointer-events-none">
                <div className={`bg-white dark:bg-[#1e1e1e] w-full max-w-xl rounded-[24px] shadow-2xl border border-gray-100 dark:border-gray-700 flex flex-col max-h-[90vh] pointer-events-auto transition-all duration-200 transform ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>

                    <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-text-main dark:text-white">{isEditing ? 'Edit Certification' : 'Add Certification'}</h2>
                            <p className="text-sm text-text-muted dark:text-gray-400 mt-1">Professional certifications and credentials</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col flex-1">
                        <div className="p-8 overflow-y-auto custom-scrollbar space-y-6">

                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">
                                        Certification Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Certified Scrum Product Owner"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">Short Name</label>
                                    <input
                                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm"
                                        type="text"
                                        value={formData.short_name}
                                        onChange={(e) => setFormData({ ...formData, short_name: e.target.value })}
                                        placeholder="CSPO"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">Subtitle</label>
                                <input
                                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm"
                                    type="text"
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                    placeholder="e.g. Scrum Alliance Certification"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">
                                    Issuing Organization <span className="text-red-500">*</span>
                                </label>
                                <input
                                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm"
                                    type="text"
                                    value={formData.issuer}
                                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                                    placeholder="e.g. Scrum Alliance"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">Issue Date</label>
                                    <input
                                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm"
                                        type="date"
                                        value={formData.issue_date}
                                        onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">Expiry Date</label>
                                    <input
                                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm"
                                        type="date"
                                        value={formData.expiry_date}
                                        onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">Credential ID</label>
                                    <input
                                        className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm"
                                        type="text"
                                        value={formData.credential_id}
                                        onChange={(e) => setFormData({ ...formData, credential_id: e.target.value })}
                                        placeholder="e.g. ABC123XYZ"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">Icon</label>
                                    <div className="flex gap-1.5 flex-wrap">
                                        {iconOptions.map(icon => (
                                            <button
                                                key={icon}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, icon })}
                                                className={`p-2 rounded-lg border transition-colors cursor-pointer ${formData.icon === icon
                                                    ? 'border-sage-green bg-sage-light dark:bg-sage-green/20'
                                                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-white/10'
                                                    }`}
                                                title={icon}
                                            >
                                                <span className="material-symbols-outlined text-sm">{icon}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">Credential URL</label>
                                <input
                                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm"
                                    type="url"
                                    value={formData.credential_url}
                                    onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                                    placeholder="https://verify.example.com/credential/abc123"
                                />
                            </div>

                            <ImageUpload
                                label="Certificate File (PDF or Image)"
                                folder="certifications"
                                currentUrl={formData.certificate_file_url}
                                onUpload={(url) => setFormData({ ...formData, certificate_file_url: url })}
                                accept="image/*,.pdf"
                                helperText="Upload your certificate image or PDF"
                            />

                            <div>
                                <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">Description</label>
                                <textarea
                                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm resize-none"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Optional description..."
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_expired}
                                        onChange={(e) => setFormData({ ...formData, is_expired: e.target.checked })}
                                        className="w-4 h-4 accent-red-500"
                                    />
                                    <span className="text-sm text-text-main dark:text-gray-300">Expired</span>
                                </label>
                            </div>
                        </div>

                        <div className="px-8 py-5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3 bg-gray-50/50 dark:bg-gray-900/30 rounded-b-[24px]">
                            <button type="button" onClick={onClose} disabled={isLoading} className="px-5 py-2.5 rounded-full border border-gray-300 dark:border-gray-600 text-sm font-semibold text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50">
                                Cancel
                            </button>
                            <button type="submit" disabled={isLoading} className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-dark text-text-main text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2">
                                {isLoading && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                                {isLoading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add Certification')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
