"use client";

import { usePathname } from "next/navigation";
import React from "react";

interface AdminPageHeaderProps {
    title: string;
    description?: string;
    rightAction?: React.ReactNode;
}

export function AdminPageHeader({
    title,
    description,
    rightAction,
}: AdminPageHeaderProps) {
    const pathname = usePathname();

    const generateBreadcrumbs = () => {
        // e.g. /admin/projects -> Admin > Projects
        const segments = pathname.split("/").filter(Boolean);
        // segments: ['admin', 'projects']
        return segments.map((segment, index) => {
            const isLast = index === segments.length - 1;
            const capitalize = (s: string) =>
                s.charAt(0).toUpperCase() + s.slice(1);

            return (
                <React.Fragment key={segment}>
                    <span className={`${isLast ? "text-text-main dark:text-white font-semibold" : ""}`}>
                        {capitalize(segment)}
                    </span>
                    {!isLast && (
                        <span className="material-symbols-outlined text-sm mx-2">
                            chevron_right
                        </span>
                    )}
                </React.Fragment>
            );
        });
    };

    return (
        <>
            <header className="sticky top-0 z-40 w-full h-16 bg-white dark:bg-[#1e1e1e] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-8 shrink-0">
                <div className="flex items-center text-sm text-text-muted dark:text-gray-400 font-medium">
                    {generateBreadcrumbs()}
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 text-text-muted hover:text-text-main relative cursor-pointer">
                        <span className="material-symbols-outlined">
                            notifications
                        </span>
                        <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-background-light dark:border-background-dark"></span>
                    </button>
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 px-3 py-1.5 rounded-full transition-colors">
                        <div className="size-8 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
                            <img
                                alt="User"
                                className="w-full h-full object-cover"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWjvILIy-MRe8QkzerFcRYAoHsgHvR3DFtMm9g12gFfKmnscj97trw_-psr6n4aUTp9KQKV9wcw5G5G_w6W0XHWHescRxZJl1hKaTANKcat3QRHey2wpQ3dtr68ODq2fqm0xke6jWZlYLyWQG-_th888szWDFM7A9rnQVRp5KC3FJAUH0vQThTzdeJfS5_yk3h0rxoFIRQYyJf7F7i5aGHmSzyy8zTUunDQjxnS_z7PKEjoWldZ81BL3xySW7M136V46VWQMs4fQFB"
                            />
                        </div>
                        <span className="text-sm font-medium text-text-main dark:text-white hidden md:block">
                            Sarah Jenkins
                        </span>
                        <span className="material-symbols-outlined text-text-muted text-sm">
                            expand_more
                        </span>
                    </div>
                </div>
            </header>

            <div className="max-w-[1400px] w-full mx-auto px-8 pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                    <div>
                        <h2 className="text-2xl font-bold text-text-main dark:text-white">
                            {title}
                        </h2>
                        {description && (
                            <p className="text-text-muted dark:text-gray-400 text-sm mt-1">
                                {description}
                            </p>
                        )}
                    </div>
                    {rightAction && (
                        <div className="flex gap-3 w-full sm:w-auto">
                            {rightAction}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
