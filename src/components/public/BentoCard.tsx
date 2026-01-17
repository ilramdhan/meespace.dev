import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BentoCardProps {
    children: ReactNode;
    className?: string;
}

export function BentoCard({ children, className }: BentoCardProps) {
    return (
        <div
            className={cn(
                "bg-white dark:bg-[#1e1e1e] rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden relative group",
                className
            )}
        >
            {children}
        </div>
    );
}

