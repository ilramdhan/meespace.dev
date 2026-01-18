"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { usePathname } from "next/navigation";

export function Header() {
    const pathname = usePathname();

    const handleContactClick = () => {
        // If on home page, scroll to contact section
        if (pathname === '/') {
            const element = document.getElementById('contact');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // Navigate to home page with hash
            window.location.href = '/#contact';
        }
    };

    return (
        <div className="sticky top-0 z-50 w-full px-4 pt-4 sm:px-6 lg:px-8 flex justify-center pointer-events-none">
            <header className="pointer-events-auto bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-full shadow-sm px-6 py-3 flex items-center justify-between gap-4 md:gap-8 max-w-4xl w-full transition-colors duration-200">
                <div className="flex items-center gap-3">
                    <Link href="/" className="size-8 bg-primary rounded-full flex items-center justify-center text-text-main">
                        <span className="material-symbols-outlined text-lg font-mono font-bold">{`{}`}</span>
                    </Link>
                    <Link href="/" className="text-text-main dark:text-white text-lg font-bold tracking-tight">
                        Meyspace
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
