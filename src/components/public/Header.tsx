"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export function Header() {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="sticky top-0 z-50 w-full px-4 pt-4 sm:px-6 lg:px-8 flex justify-center pointer-events-none">
            <header className="pointer-events-auto bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-full shadow-sm px-6 py-3 flex items-center justify-between gap-4 md:gap-8 max-w-4xl w-full transition-colors duration-200">
                <div className="flex items-center gap-3">
                    <div className="size-8 bg-primary rounded-full flex items-center justify-center text-text-main">
                        <span className="material-symbols-outlined text-lg font-mono font-bold">{`{}`}</span>
                    </div>
                    <h1 className="text-text-main dark:text-white text-lg font-bold tracking-tight">
                        Sarah Jenkins
                    </h1>
                </div>

                <nav className="hidden md:flex items-center gap-8">
                    {["About", "Projects", "Blog", "Contact"].map((item) => (
                        <button
                            key={item}
                            onClick={() => scrollToSection(item.toLowerCase())}
                            className="text-text-main dark:text-gray-300 hover:text-primary-dark transition-colors text-sm font-medium"
                        >
                            {item}
                        </button>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <button
                        onClick={() => scrollToSection("contact")}
                        className="bg-primary hover:bg-primary-dark transition-colors text-text-main px-5 py-2 rounded-full text-sm font-bold tracking-wide hidden sm:block"
                    >
                        Contact Me
                    </button>
                </div>
            </header>
        </div>
    );
}
