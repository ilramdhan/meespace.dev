import { cn } from "@/lib/utils";
import { ReactNode, CSSProperties } from "react";

interface BentoCardProps {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
}

export function BentoCard({ children, className, style }: BentoCardProps) {
    return (
        <div
            className={cn(
                "bento-card bg-white dark:bg-[#1f2623] rounded-xl border border-gray-100 dark:border-gray-700/50 overflow-hidden relative group",
                className
            )}
            style={style}
        >
            {children}
        </div>
    );
}

