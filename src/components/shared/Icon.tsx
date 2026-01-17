import { cn } from "@/lib/utils";

type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

interface IconProps {
    name: string;
    size?: IconSize;
    className?: string;
    filled?: boolean;
}

const sizeStyles: Record<IconSize, string> = {
    xs: "text-sm",
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl",
};

/**
 * Wrapper component for Material Symbols icons
 * @param name - Material Symbol icon name (e.g., "dashboard", "folder_open")
 * @param size - Icon size variant
 * @param filled - Whether to use filled variant (default: outlined)
 */
export function Icon({
    name,
    size = "md",
    className,
    filled = false,
}: IconProps) {
    return (
        <span
            className={cn(
                filled ? "material-symbols-rounded" : "material-symbols-outlined",
                sizeStyles[size],
                className
            )}
        >
            {name}
        </span>
    );
}
