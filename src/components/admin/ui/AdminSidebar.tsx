"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
    { label: "Overview", icon: "dashboard", href: "/admin/dashboard" },
    { label: "Projects", icon: "folder_open", href: "/admin/projects" },
    { label: "Blog/Insights", icon: "article", href: "/admin/blogs" },
    { label: "Experience", icon: "work_history", href: "/admin/experiences" },
    { label: "Tech Stack", icon: "memory", href: "/admin/tech-stack" },
    { label: "Settings", icon: "settings", href: "/admin/settings" },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white dark:bg-[#1e1e1e] border-r border-gray-200 dark:border-gray-800 flex flex-col h-full shrink-0">
            <div className="p-6 flex items-center gap-3">
                <div className="size-8 bg-primary rounded-full flex items-center justify-center text-text-main">
                    <span className="material-symbols-outlined text-lg">
                        data_object
                    </span>
                </div>
                <h1 className="text-text-main dark:text-white text-lg font-bold tracking-tight">
                    SJ Admin
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
                        SJ
                        {/* <img alt="Sarah Jenkins" className="w-full h-full object-cover" src="..." /> */}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-bold text-text-main dark:text-white truncate">
                            Sarah Jenkins
                        </span>
                        <span className="text-xs text-text-muted dark:text-gray-400 truncate">
                            Admin
                        </span>
                    </div>
                    <Link
                        href="/admin/login"
                        className="ml-auto text-text-muted hover:text-text-main"
                    >
                        <span className="material-symbols-outlined text-lg">
                            logout
                        </span>
                    </Link>
                </div>
            </div>
        </aside>
    );
}
