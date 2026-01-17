import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PageHeaderProps {
    title: string;
    description?: string;
    className?: string;
    actions?: ReactNode;
}

export function PageHeader({
    title,
    description,
    className,
    actions,
}: PageHeaderProps) {
    return (
        <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4", className)}>
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
            {actions && (
                <div className="flex gap-3 w-full sm:w-auto">
                    {actions}
                </div>
            )}
        </div>
    );
}
