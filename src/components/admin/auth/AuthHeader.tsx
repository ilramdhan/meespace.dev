"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface SiteSettings {
    site_name?: string;
    logo_url?: string;
    logo_url_dark?: string;
}

export function AuthHeader() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
        fetch('/api/v1/settings')
            .then(res => res.json())
            .then(data => setSettings(data.data || {}))
            .catch(() => setSettings({}));
    }, []);

    const siteName = settings?.site_name || 'Meyspace';

    // Determine which logo to use based on theme
    const isDark = mounted && resolvedTheme === 'dark';
    const logoUrl = isDark && settings?.logo_url_dark
        ? settings.logo_url_dark
        : settings?.logo_url;

    return (
        <div className="w-full px-4 pt-4 sm:px-6 lg:px-8 flex justify-center pointer-events-none fixed top-0 z-50">
            <header className="pointer-events-auto bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-full shadow-sm px-6 py-3 flex items-center justify-between gap-8 max-w-4xl w-full">
                <Link href="/" className="flex items-center gap-2 group">
                    {logoUrl ? (
                        <Image
                            src={logoUrl}
                            alt={siteName}
                            width={32}
                            height={32}
                            className="h-8 w-auto object-contain"
                        />
                    ) : (
                        <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary-dark font-bold text-sm group-hover:bg-primary/30 transition-colors">
                            <span className="material-symbols-outlined text-lg">
                                data_object
                            </span>
                        </div>
                    )}
                    <span className="font-bold text-lg tracking-tight text-text-main dark:text-white">
                        {siteName}
                    </span>
                </Link>
                <nav className="flex items-center gap-4">
                    <Link
                        href="/"
                        className="text-text-muted hover:text-text-main dark:text-gray-400 dark:hover:text-white transition-colors text-sm font-medium"
                    >
                        Back to Site
                    </Link>
                </nav>
            </header>
        </div>
    );
}
