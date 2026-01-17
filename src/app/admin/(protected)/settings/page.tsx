"use client";

import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";

export default function AdminSettingsPage() {
    return (
        <div className="flex flex-col gap-6">
            <AdminPageHeader
                title="Settings"
                description="Manage your portfolio configuration and preferences."
                rightAction={
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-text-main rounded-full text-sm font-bold shadow-sm transition-colors cursor-pointer">
                        <span className="material-symbols-outlined text-sm">save</span>
                        Save Changes
                    </button>
                }
            />

            <div className="max-w-[1400px] w-full mx-auto px-8 pb-8 flex flex-col gap-8">

                {/* General Settings */}
                <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-main dark:text-white ml-1">
                        General Settings
                    </h3>
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label
                                    className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2"
                                    htmlFor="site-name"
                                >
                                    Site Name
                                </label>
                                <input
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-text-main dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green transition-all placeholder:text-gray-400"
                                    id="site-name"
                                    type="text"
                                    defaultValue="Sarah Jenkins Portfolio"
                                />
                            </div>
                            <div>
                                <label
                                    className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2"
                                    htmlFor="seo-desc"
                                >
                                    SEO Description
                                </label>
                                <textarea
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-text-main dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green transition-all placeholder:text-gray-400 h-24 resize-none"
                                    id="seo-desc"
                                    defaultValue="Business System Analyst with 5+ years of experience specializing in requirements gathering, process modeling, and data analysis."
                                />
                                <p className="mt-2 text-xs text-text-muted dark:text-gray-500 text-right">
                                    145/160 characters
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Profile Settings */}
                <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-main dark:text-white ml-1">
                        Profile Settings
                    </h3>
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex flex-col items-center gap-4 shrink-0">
                                <div className="size-24 rounded-full overflow-hidden border-4 border-gray-50 dark:border-gray-800 relative group cursor-pointer">
                                    <img
                                        alt="Sarah Jenkins"
                                        className="w-full h-full object-cover"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWjvILIy-MRe8QkzerFcRYAoHsgHvR3DFtMm9g12gFfKmnscj97trw_-psr6n4aUTp9KQKV9wcw5G5G_w6W0XHWHescRxZJl1hKaTANKcat3QRHey2wpQ3dtr68ODq2fqm0xke6jWZlYLyWQG-_th888szWDFM7A9rnQVRp5KC3FJAUH0vQThTzdeJfS5_yk3h0rxoFIRQYyJf7F7i5aGHmSzyy8zTUunDQjxnS_z7PKEjoWldZ81BL3xySW7M136V46VWQMs4fQFB"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="material-symbols-outlined text-white">
                                            edit
                                        </span>
                                    </div>
                                </div>
                                <button className="text-sm font-medium text-sage-green hover:text-[#789586]">
                                    Change Photo
                                </button>
                            </div>
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-1 md:col-span-2">
                                    <label
                                        className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2"
                                        htmlFor="full-name"
                                    >
                                        Full Name
                                    </label>
                                    <input
                                        className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-text-main dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green transition-all"
                                        id="full-name"
                                        type="text"
                                        defaultValue="Sarah Jenkins"
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <label
                                        className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2"
                                        htmlFor="email"
                                    >
                                        Email Address
                                    </label>
                                    <input
                                        className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-text-main dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green transition-all"
                                        id="email"
                                        type="email"
                                        defaultValue="sarah.jenkins@example.com"
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-2">
                                    <label
                                        className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2"
                                        htmlFor="bio"
                                    >
                                        Short Bio
                                    </label>
                                    <textarea
                                        className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-text-main dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green transition-all placeholder:text-gray-400 h-24 resize-none"
                                        id="bio"
                                        defaultValue="Passionate about bridging the gap between business needs and technical solutions. I turn complex requirements into clear, actionable specifications."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Social Links */}
                <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-main dark:text-white ml-1">
                        Social Links
                    </h3>
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label
                                    className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2"
                                    htmlFor="linkedin"
                                >
                                    LinkedIn URL
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-text-muted text-sm font-bold">
                                            in/
                                        </span>
                                    </div>
                                    <input
                                        className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-text-main dark:text-white pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green transition-all"
                                        id="linkedin"
                                        placeholder="username"
                                        type="text"
                                        defaultValue="sarah-jenkins-bsa"
                                    />
                                </div>
                            </div>
                            <div>
                                <label
                                    className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2"
                                    htmlFor="github"
                                >
                                    GitHub URL
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-text-muted text-sm font-bold">
                                            git/
                                        </span>
                                    </div>
                                    <input
                                        className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-text-main dark:text-white pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green transition-all"
                                        id="github"
                                        placeholder="username"
                                        type="text"
                                        defaultValue="sarahcodes"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Security */}
                <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-text-main dark:text-white ml-1">
                        Security
                    </h3>
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="flex flex-col md:flex-row items-start gap-8">
                            <div className="flex-1 w-full grid grid-cols-1 gap-6">
                                <div>
                                    <label
                                        className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2"
                                        htmlFor="current-password"
                                    >
                                        Current Password
                                    </label>
                                    <input
                                        className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-text-main dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green transition-all"
                                        id="current-password"
                                        type="password"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label
                                            className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2"
                                            htmlFor="new-password"
                                        >
                                            New Password
                                        </label>
                                        <input
                                            className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-text-main dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green transition-all"
                                            id="new-password"
                                            type="password"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            className="block text-sm font-medium text-text-main dark:text-gray-300 mb-2"
                                            htmlFor="confirm-password"
                                        >
                                            Confirm Password
                                        </label>
                                        <input
                                            className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 text-text-main dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-sage-green/50 focus:border-sage-green transition-all"
                                            id="confirm-password"
                                            type="password"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="md:w-48 pt-0 md:pt-7">
                                <button className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-gray-700 text-text-main dark:text-white rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/10 transition-colors cursor-pointer">
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="space-y-4 pt-4">
                    <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-8 border border-red-100 dark:border-red-900/20">
                        <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-2">
                            Danger Zone
                        </h3>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-sm text-red-600/80 dark:text-red-400/70">
                                Once you delete your account, there is no going back. Please be
                                certain.
                            </p>
                            <button className="px-4 py-2 bg-white dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer">
                                Delete Account
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
