import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral" | "primary";

interface BadgeProps {
    children: ReactNode;
    variant?: BadgeVariant;
    className?: string;
    dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
    success:
        "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-100 dark:border-green-800",
    warning:
        "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-800",
    error:
        "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-100 dark:border-red-800",
    info:
        "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-100 dark:border-blue-800",
    neutral:
        "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700",
    primary:
        "bg-primary/20 text-text-main dark:bg-primary/10 dark:text-primary border border-primary/30",
};

const dotColors: Record<BadgeVariant, string> = {
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    neutral: "bg-gray-400",
    primary: "bg-primary-dark",
};

export function Badge({
    children,
    variant = "neutral",
    className,
    dot = false,
}: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                variantStyles[variant],
                className
            )}
        >
            {dot && (
                <span className={cn("size-1.5 rounded-full", dotColors[variant])} />
            )}
            {children}
        </span>
    );
}
