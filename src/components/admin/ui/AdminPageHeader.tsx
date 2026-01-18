"use client";

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
    return (
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
    );
}
