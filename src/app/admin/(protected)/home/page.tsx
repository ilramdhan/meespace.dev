"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { useToast } from "@/components/shared/Toast";
import { apiCall } from "@/hooks/useApi";

interface HomeContent {
    // Hero section (from profile)
    full_name: string;
    role: string;
    tagline: string;
    bio: string;
    short_bio: string;
    status: string;
    avatar_url: string;

    // Site settings
    site_name: string;
    site_tagline: string;

    // Footer
    footer_text: string;
    copyright_text: string;
    contact_email: string;
    contact_phone: string;
    location: string;
}

export default function AdminHomePage() {
    const [formData, setFormData] = useState<HomeContent>({
        full_name: '',
        role: '',
        tagline: '',
        bio: '',
        short_bio: '',
        status: '',
        avatar_url: '',
        site_name: '',
        site_tagline: '',
        footer_text: '',
        copyright_text: '',
        contact_email: '',
        contact_phone: '',
        location: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'hero' | 'footer'>('hero');
    const { showToast } = useToast();

    const fetchData = useCallback(async () => {
        setIsLoading(true);

        // Fetch profile
        const profileRes = await apiCall<{ id: string; full_name: string; role: string; tagline: string; bio: string; short_bio: string; status: string; avatar_url: string }>('/api/v1/profile');

        // Fetch settings
        const settingsRes = await apiCall<{ site_name: string; site_tagline: string; footer_text: string; copyright_text: string; contact_email: string; contact_phone: string; location: string }>('/api/v1/settings');

        if (profileRes.success && profileRes.data) {
            setFormData(prev => ({
                ...prev,
                full_name: profileRes.data?.full_name || '',
                role: profileRes.data?.role || '',
                tagline: profileRes.data?.tagline || '',
                bio: profileRes.data?.bio || '',
                short_bio: profileRes.data?.short_bio || '',
                status: profileRes.data?.status || '',
                avatar_url: profileRes.data?.avatar_url || '',
            }));
        }

        if (settingsRes.success && settingsRes.data) {
            setFormData(prev => ({
                ...prev,
                site_name: settingsRes.data?.site_name || '',
                site_tagline: settingsRes.data?.site_tagline || '',
                footer_text: settingsRes.data?.footer_text || '',
                copyright_text: settingsRes.data?.copyright_text || '',
                contact_email: settingsRes.data?.contact_email || '',
                contact_phone: settingsRes.data?.contact_phone || '',
                location: settingsRes.data?.location || '',
            }));
        }

        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSave = async () => {
        setIsSaving(true);

        // Update profile (hero section)
        const profileRes = await apiCall('/api/v1/profile', {
            method: 'PUT',
            body: JSON.stringify({
                full_name: formData.full_name,
                role: formData.role,
                tagline: formData.tagline,
                bio: formData.bio,
                short_bio: formData.short_bio,
                status: formData.status,
            }),
        });

        // Update settings (footer section)
        const settingsRes = await apiCall('/api/v1/settings', {
            method: 'PUT',
            body: JSON.stringify({
                site_name: formData.site_name,
                site_tagline: formData.site_tagline,
                footer_text: formData.footer_text,
                copyright_text: formData.copyright_text,
                contact_email: formData.contact_email,
                contact_phone: formData.contact_phone,
                location: formData.location,
            }),
        });

        setIsSaving(false);

        if (profileRes.success && settingsRes.success) {
            showToast('Content saved successfully!', 'success');
        } else {
            showToast(profileRes.error || settingsRes.error || 'Failed to save content', 'error');
        }
    };

    const RightAction = (
        <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-text-main rounded-full text-sm font-bold shadow-sm transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
        >
            {isSaving && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
            <span className="material-symbols-outlined text-sm">save</span>
            Save Changes
        </button>
    );

    if (isLoading) {
        return (
            <div className="flex flex-col gap-6">
                <AdminPageHeader
                    title="Home & Footer Content"
                    description="Manage hero section and footer content displayed on the landing page."
                />
                <div className="max-w-[1400px] w-full mx-auto px-8 pb-8">
                    <div className="bento-card bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-100 dark:border-gray-800 p-8">
                        <div className="animate-pulse space-y-4">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <AdminPageHeader
                title="Home & Footer Content"
                description="Manage hero section and footer content displayed on the landing page."
                rightAction={RightAction}
            />

            <div className="max-w-[1400px] w-full mx-auto px-8 pb-8">
                <div className="bento-card bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col">
                    {/* Tabs */}
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4">
                        <button
                            onClick={() => setActiveTab('hero')}
                            className={`flex items-center gap-2 font-medium px-3 py-2 rounded-lg transition-colors cursor-pointer text-sm ${activeTab === 'hero'
                                    ? 'bg-primary/10 text-primary-dark'
                                    : 'text-text-muted hover:text-text-main hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                        >
                            <span className="material-symbols-outlined text-lg">person</span>
                            Hero Section
                        </button>
                        <button
                            onClick={() => setActiveTab('footer')}
                            className={`flex items-center gap-2 font-medium px-3 py-2 rounded-lg transition-colors cursor-pointer text-sm ${activeTab === 'footer'
                                    ? 'bg-primary/10 text-primary-dark'
                                    : 'text-text-muted hover:text-text-main hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                        >
                            <span className="material-symbols-outlined text-lg">bottom_navigation</span>
                            Footer
                        </button>
                    </div>

                    {/* Hero Section Tab */}
                    {activeTab === 'hero' && (
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                                        className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                                        placeholder="Your full name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Role/Title</label>
                                    <input
                                        type="text"
                                        value={formData.role}
                                        onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                                        className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                                        placeholder="e.g., Product Designer"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Site Name</label>
                                    <input
                                        type="text"
                                        value={formData.site_name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, site_name: e.target.value }))}
                                        className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                                        placeholder="Your portfolio name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                        className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                                    >
                                        <option value="">Select status...</option>
                                        <option value="Open to Work">Open to Work</option>
                                        <option value="Available for Freelance">Available for Freelance</option>
                                        <option value="Currently Employed">Currently Employed</option>
                                        <option value="Busy">Busy</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Tagline</label>
                                <input
                                    type="text"
                                    value={formData.tagline}
                                    onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                                    className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                                    placeholder="A short catchy tagline"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Short Bio</label>
                                <textarea
                                    value={formData.short_bio}
                                    onChange={(e) => setFormData(prev => ({ ...prev, short_bio: e.target.value }))}
                                    rows={3}
                                    className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none"
                                    placeholder="A brief introduction (displayed in hero)"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Full Bio</label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                                    rows={5}
                                    className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none"
                                    placeholder="Detailed biography (Markdown supported)"
                                />
                            </div>
                        </div>
                    )}

                    {/* Footer Tab */}
                    {activeTab === 'footer' && (
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Footer Text</label>
                                <textarea
                                    value={formData.footer_text}
                                    onChange={(e) => setFormData(prev => ({ ...prev, footer_text: e.target.value }))}
                                    rows={3}
                                    className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none"
                                    placeholder="Text displayed in the footer section"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Copyright Text</label>
                                <input
                                    type="text"
                                    value={formData.copyright_text}
                                    onChange={(e) => setFormData(prev => ({ ...prev, copyright_text: e.target.value }))}
                                    className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                                    placeholder="e.g., © 2024 Your Name. All rights reserved."
                                />
                            </div>

                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <h4 className="text-sm font-bold text-text-main dark:text-white mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg text-primary-dark">contact_mail</span>
                                    Contact Information
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Contact Email</label>
                                        <input
                                            type="email"
                                            value={formData.contact_email}
                                            onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                                            className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Contact Phone</label>
                                        <input
                                            type="text"
                                            value={formData.contact_phone}
                                            onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                                            className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                                            placeholder="+1 234 567 890"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-text-main dark:text-white mb-2">Location</label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                        className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                                        placeholder="e.g., Jakarta, Indonesia"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
