"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

const NAV_ITEMS = [
    { label: "Overview", icon: "dashboard", href: "/admin/dashboard" },
    { label: "Projects", icon: "folder_open", href: "/admin/projects" },
    { label: "Blog/Insights", icon: "article", href: "/admin/blogs" },
    { label: "Comments", icon: "chat_bubble", href: "/admin/comments" },
    { label: "Experience", icon: "work_history", href: "/admin/experiences" },
    { label: "Education", icon: "school", href: "/admin/education" },
    { label: "Certifications", icon: "verified", href: "/admin/certifications" },
    { label: "Tech Stack", icon: "memory", href: "/admin/tech-stack" },
    { label: "Stats", icon: "analytics", href: "/admin/stats" },
    { label: "Skills", icon: "star", href: "/admin/skills" },
    { label: "About Content", icon: "person", href: "/admin/about" },
    { label: "Home Content", icon: "home", href: "/admin/home" },
    { label: "Messages", icon: "mail", href: "/admin/messages" },
    { label: "Settings", icon: "settings", href: "/admin/settings" },
];

interface SiteSettings {
    site_name?: string;
    logo_url?: string;
    logo_url_dark?: string;
}

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        setMounted(true);
        fetch('/api/v1/settings')
            .then(res => res.json())
            .then(data => setSettings(data.data || {}))
            .catch(() => setSettings({}));
    }, []);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await supabase.auth.signOut();
            router.push('/admin/login?error=signout_success');
        } catch (error) {
            console.error('Logout error:', error);
            router.push('/admin/login');
        }
    };

    const siteName = settings?.site_name || 'Meyspace';

    // Determine which logo to use based on theme
    const isDark = mounted && resolvedTheme === 'dark';
    const logoUrl = isDark && settings?.logo_url_dark
        ? settings.logo_url_dark
        : settings?.logo_url;

    return (
        <aside className="w-64 bg-white dark:bg-[#1e1e1e] border-r border-gray-200 dark:border-gray-800 flex flex-col h-full shrink-0">
            <div className="p-6 flex items-center gap-3">
                {logoUrl ? (
                    <Image
                        src={logoUrl}
                        alt={siteName}
                        width={32}
                        height={32}
                        className="h-8 w-auto object-contain"
                    />
                ) : (
                    <div className="size-8 bg-primary rounded-full flex items-center justify-center text-text-main">
                        <span className="material-symbols-outlined text-lg">
                            data_object
                        </span>
                    </div>
                )}
                <h1 className="text-text-main dark:text-white text-lg font-bold tracking-tight">
                    {siteName}
                </h1>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-colors group ${isActive
                                ? "bg-sage-light dark:bg-sage-green/20 text-sage-green dark:text-sage-light font-semibold"
                                : "text-text-muted dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-text-main dark:hover:text-white"
                                }`}
                        >
                            <span className="material-symbols-outlined">
                                {item.icon}
                            </span>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                <div className="bg-primary/20 dark:bg-primary/10 rounded-xl p-4 flex items-center gap-3">
                    <div className="size-8 rounded-full overflow-hidden bg-gray-200 text-xs flex items-center justify-center font-bold text-gray-500">
                        A
                    </div>
                    <div className="flex flex-col overflow-hidden flex-1">
                        <span className="text-sm font-bold text-text-main dark:text-white truncate">
                            Admin
                        </span>
                        <span className="text-xs text-text-muted dark:text-gray-400 truncate">
                            Super Admin
                        </span>
                    </div>
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="ml-auto text-text-muted hover:text-red-500 transition-colors cursor-pointer disabled:opacity-50"
                        title="Sign out"
                    >
                        {isLoggingOut ? (
                            <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                        ) : (
                            <span className="material-symbols-outlined text-lg">logout</span>
                        )}
                    </button>
                </div>
            </div>
        </aside>
    );
}
