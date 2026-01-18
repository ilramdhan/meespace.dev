"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

interface SiteSettings {
    site_name?: string;
    logo_url?: string;
    logo_url_dark?: string;
}

export function Header() {
    const pathname = usePathname();
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

    const handleContactClick = () => {
        if (pathname === '/') {
            const element = document.getElementById('contact');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            window.location.href = '/#contact';
        }
    };

    const siteName = settings?.site_name || 'Meyspace';

    // Determine which logo to use based on theme
    const isDark = mounted && resolvedTheme === 'dark';
    const logoUrl = isDark && settings?.logo_url_dark
        ? settings.logo_url_dark
        : settings?.logo_url;

    return (
        <div className="sticky top-0 z-50 w-full px-4 pt-4 sm:px-6 lg:px-8 flex justify-center pointer-events-none">
            <header className="pointer-events-auto bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-full shadow-sm px-6 py-3 flex items-center justify-between gap-4 md:gap-8 max-w-4xl w-full transition-colors duration-200">
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center justify-center shrink-0">
                        {logoUrl ? (
                            <Image
                                src={logoUrl}
                                alt={siteName}
                                width={32}
                                height={32}
                                className="h-8 w-auto object-contain"
                            />
                        ) : (
                            <div className="size-8 bg-primary rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-lg font-mono font-bold text-text-main">{`{}`}</span>
                            </div>
                        )}
                    </Link>
                    <Link href="/" className="text-text-main dark:text-white text-lg font-bold tracking-tight">
                        {siteName}
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-8">
                    <Link
                        href="/"
                        className={`text-sm font-medium transition-colors ${pathname === '/' ? 'text-primary-dark' : 'text-text-main dark:text-gray-300 hover:text-primary-dark'}`}
                    >
                        Home
                    </Link>
                    <Link
                        href="/about"
                        className={`text-sm font-medium transition-colors ${pathname === '/about' ? 'text-primary-dark' : 'text-text-main dark:text-gray-300 hover:text-primary-dark'}`}
                    >
                        About
                    </Link>
                    <Link
                        href="/insights"
                        className={`text-sm font-medium transition-colors ${pathname.startsWith('/insights') ? 'text-primary-dark' : 'text-text-main dark:text-gray-300 hover:text-primary-dark'}`}
                    >
                        Insights
                    </Link>
                    <Link
                        href="/projects"
                        className={`text-sm font-medium transition-colors ${pathname.startsWith('/projects') ? 'text-primary-dark' : 'text-text-main dark:text-gray-300 hover:text-primary-dark'}`}
                    >
                        Projects
                    </Link>
                </nav>

                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <button
                        onClick={handleContactClick}
                        className="bg-primary hover:bg-primary-dark transition-colors text-text-main px-5 py-2 rounded-full text-sm font-bold tracking-wide hidden sm:block cursor-pointer"
                    >
                        Contact Me
                    </button>
                </div>
            </header>
        </div>
    );
}
