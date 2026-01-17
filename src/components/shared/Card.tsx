import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export type CardVariant = "default" | "elevated" | "bordered" | "ghost";
export type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps {
    children: ReactNode;
    className?: string;
    variant?: CardVariant;
    padding?: CardPadding;
    hover?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
    default:
        "bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800",
    elevated:
        "bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800 shadow-md",
    bordered:
        "bg-transparent border border-gray-200 dark:border-gray-700",
    ghost:
        "bg-transparent",
};

const paddingStyles: Record<CardPadding, string> = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
};

export function Card({
    children,
    className,
    variant = "default",
    padding = "md",
    hover = false,
}: CardProps) {
    return (
        <div
            className={cn(
                "rounded-xl overflow-hidden relative group",
                variantStyles[variant],
                paddingStyles[padding],
                hover && "hover:border-primary/50 cursor-pointer transition-all",
                className
            )}
        >
            {children}
        </div>
    );
}
