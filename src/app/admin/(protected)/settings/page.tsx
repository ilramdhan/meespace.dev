"use client";

import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { useToast } from "@/components/shared/Toast";
import { apiCall } from "@/hooks/useApi";
import { useState, useEffect, useCallback } from "react";
import { ImageUpload } from "@/components/shared/ImageUpload";

interface Settings {
    id?: string;
    site_name: string;
    site_tagline?: string;
    seo_title?: string;
    seo_description?: string;
    seo_keywords?: string;
    favicon_url?: string;
    logo_url?: string;
    logo_url_dark?: string;
    og_image_url?: string;
    google_analytics_id?: string;
}

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<Settings>({
        site_name: '',
        site_tagline: '',
        seo_title: '',
        seo_description: '',
        seo_keywords: '',
        favicon_url: '',
        logo_url: '',
        logo_url_dark: '',
        og_image_url: '',
        google_analytics_id: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'branding' | 'seo'>('branding');
    const { showToast } = useToast();

    // Fetch data
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        const settingsRes = await apiCall<Settings>('/api/v1/settings');

        if (settingsRes.success && settingsRes.data) {
            setSettings(settingsRes.data);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Handle save
    const handleSave = async () => {
        setIsSaving(true);

        const settingsRes = await apiCall('/api/v1/settings', {
            method: 'PUT',
            body: settings,
        });

        if (settingsRes.success) {
            showToast('Settings saved successfully', 'success');
        } else {
            showToast(settingsRes.error || 'Failed to save settings', 'error');
        }

        setIsSaving(false);
    };

    const RightAction = (
        <button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-text-main rounded-full text-sm font-bold shadow-sm transition-colors cursor-pointer disabled:opacity-50"
        >
            {isSaving ? (
                <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
            ) : (
                <span className="material-symbols-outlined text-sm">save</span>
            )}
            Save Changes
        </button>
    );

    if (isLoading) {
        return (
            <div className="flex flex-col gap-6">
                <AdminPageHeader title="Settings" description="Manage website branding, logos, and SEO metadata." />
                <div className="max-w-[1400px] w-full mx-auto px-8 pb-8">
                    <div className="animate-pulse space-y-8">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-[#1e1e1e] rounded-xl p-8 border border-gray-100 dark:border-gray-800">
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
                                <div className="space-y-4">
                                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
                title="Settings"
                description="Manage website branding, logos, and SEO metadata."
                rightAction={RightAction}
            />

            <div className="max-w-[1400px] w-full mx-auto px-8 pb-8">
                <div className="bento-card bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col">
                    {/* Tabs */}
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4">
                        <button
                            onClick={() => setActiveTab('branding')}
                            className={`flex items-center gap-2 font-medium px-3 py-2 rounded-lg transition-colors cursor-pointer text-sm ${activeTab === 'branding'
                                ? 'bg-primary/10 text-primary-dark'
                                : 'text-text-muted hover:text-text-main hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                        >
                            <span className="material-symbols-outlined text-lg">palette</span>
                            Branding & Logo
                        </button>
                        <button
                            onClick={() => setActiveTab('seo')}
                            className={`flex items-center gap-2 font-medium px-3 py-2 rounded-lg transition-colors cursor-pointer text-sm ${activeTab === 'seo'
                                ? 'bg-primary/10 text-primary-dark'
                                : 'text-text-muted hover:text-text-main hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                        >
                            <span className="material-symbols-outlined text-lg">travel_explore</span>
                            SEO & Metadata
                        </button>
                    </div>

                    {/* Branding Tab */}
                    {activeTab === 'branding' && (
                        <div className="p-6 space-y-8">
                            {/* Site Identity */}
                            <div>
                                <h4 className="text-sm font-bold text-text-main dark:text-white mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg text-primary-dark">badge</span>
                                    Site Identity
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                            Site Name
                                        </label>
                                        <input
                                            className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                                            type="text"
                                            value={settings.site_name || ''}
                                            onChange={(e) => setSettings(prev => ({ ...prev, site_name: e.target.value }))}
                                            placeholder="My Portfolio"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                            Site Tagline
                                        </label>
                                        <input
                                            className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                                            type="text"
                                            value={settings.site_tagline || ''}
                                            onChange={(e) => setSettings(prev => ({ ...prev, site_tagline: e.target.value }))}
                                            placeholder="Business System Analyst Portfolio"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Logos */}
                            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                                <h4 className="text-sm font-bold text-text-main dark:text-white mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg text-primary-dark">image</span>
                                    Logos & Icons
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div>
                                        <ImageUpload
                                            label="Favicon"
                                            folder="branding/favicon"
                                            currentUrl={settings.favicon_url}
                                            onUpload={(url) => setSettings(prev => ({ ...prev, favicon_url: url }))}
                                            accept="image/x-icon,image/png,image/svg+xml"
                                            helperText="32x32 or 64x64 PNG/ICO"
                                        />
                                        <p className="text-xs text-text-muted dark:text-gray-500 mt-2">
                                            Displayed in browser tab
                                        </p>
                                    </div>
                                    <div>
                                        <ImageUpload
                                            label="Logo (Light Mode)"
                                            folder="branding/logo"
                                            currentUrl={settings.logo_url}
                                            onUpload={(url) => setSettings(prev => ({ ...prev, logo_url: url }))}
                                            accept="image/png,image/svg+xml,image/webp"
                                            helperText="Dark colored logo for light bg"
                                        />
                                        <p className="text-xs text-text-muted dark:text-gray-500 mt-2">
                                            Used on light backgrounds
                                        </p>
                                    </div>
                                    <div>
                                        <ImageUpload
                                            label="Logo (Dark Mode)"
                                            folder="branding/logo-dark"
                                            currentUrl={settings.logo_url_dark}
                                            onUpload={(url) => setSettings(prev => ({ ...prev, logo_url_dark: url }))}
                                            accept="image/png,image/svg+xml,image/webp"
                                            helperText="Light colored logo for dark bg"
                                        />
                                        <p className="text-xs text-text-muted dark:text-gray-500 mt-2">
                                            Used on dark backgrounds
                                        </p>
                                    </div>
                                    <div>
                                        <ImageUpload
                                            label="OG Image"
                                            folder="branding/og"
                                            currentUrl={settings.og_image_url}
                                            onUpload={(url) => setSettings(prev => ({ ...prev, og_image_url: url }))}
                                            accept="image/png,image/jpeg,image/webp"
                                            helperText="1200x630 recommended"
                                        />
                                        <p className="text-xs text-text-muted dark:text-gray-500 mt-2">
                                            Social media share preview
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                                <h4 className="text-sm font-bold text-text-main dark:text-white mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg text-primary-dark">visibility</span>
                                    Preview
                                </h4>
                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 flex items-center gap-4">
                                    {settings.logo_url ? (
                                        <img
                                            src={settings.logo_url}
                                            alt="Site Logo"
                                            className="h-10 w-auto object-contain"
                                        />
                                    ) : (
                                        <div className="h-10 w-10 bg-primary/20 rounded-lg flex items-center justify-center">
                                            <span className="material-symbols-outlined text-primary-dark">home</span>
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-bold text-text-main dark:text-white">
                                            {settings.site_name || 'Site Name'}
                                        </p>
                                        <p className="text-xs text-text-muted dark:text-gray-400">
                                            {settings.site_tagline || 'Your tagline here'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SEO Tab */}
                    {activeTab === 'seo' && (
                        <div className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                    SEO Title
                                </label>
                                <input
                                    className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                                    type="text"
                                    value={settings.seo_title || ''}
                                    onChange={(e) => setSettings(prev => ({ ...prev, seo_title: e.target.value }))}
                                    placeholder="John Doe - Business System Analyst Portfolio"
                                />
                                <p className="mt-2 text-xs text-text-muted dark:text-gray-500">
                                    {(settings.seo_title || '').length}/60 characters • Displayed in browser tab and search results
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                    Meta Description
                                </label>
                                <textarea
                                    className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all h-24 resize-none"
                                    value={settings.seo_description || ''}
                                    onChange={(e) => setSettings(prev => ({ ...prev, seo_description: e.target.value }))}
                                    placeholder="Experienced Business System Analyst specializing in requirements gathering, process optimization, and digital transformation..."
                                />
                                <p className="mt-2 text-xs text-text-muted dark:text-gray-500 text-right">
                                    {(settings.seo_description || '').length}/160 characters
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                    SEO Keywords
                                </label>
                                <input
                                    className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                                    type="text"
                                    value={settings.seo_keywords || ''}
                                    onChange={(e) => setSettings(prev => ({ ...prev, seo_keywords: e.target.value }))}
                                    placeholder="business analyst, system analyst, requirements, agile, scrum"
                                />
                                <p className="mt-2 text-xs text-text-muted dark:text-gray-500">
                                    Comma-separated keywords for search engines
                                </p>
                            </div>

                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <label className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2">
                                    Google Analytics ID
                                </label>
                                <input
                                    className="w-full bg-white dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                                    type="text"
                                    value={settings.google_analytics_id || ''}
                                    onChange={(e) => setSettings(prev => ({ ...prev, google_analytics_id: e.target.value }))}
                                    placeholder="G-XXXXXXXXXX"
                                />
                                <p className="mt-2 text-xs text-text-muted dark:text-gray-500">
                                    Optional: Track website analytics
                                </p>
                            </div>

                            {/* SEO Preview */}
                            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                                <h4 className="text-sm font-bold text-text-main dark:text-white mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg text-primary-dark">search</span>
                                    Search Result Preview
                                </h4>
                                <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                    <p className="text-blue-600 dark:text-blue-400 text-lg hover:underline cursor-pointer">
                                        {settings.seo_title || settings.site_name || 'Page Title'}
                                    </p>
                                    <p className="text-green-700 dark:text-green-500 text-sm">
                                        https://yoursite.com
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 line-clamp-2">
                                        {settings.seo_description || 'Your meta description will appear here...'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
