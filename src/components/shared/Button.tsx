import { cn } from "@/lib/utils";
import { ReactNode, ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        "bg-primary hover:bg-primary-dark text-text-main font-bold shadow-sm",
    secondary:
        "bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 font-medium shadow-sm",
    ghost:
        "text-text-main dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 font-medium",
    outline:
        "border border-primary text-primary-dark hover:bg-primary/10 font-medium",
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
    md: "px-5 py-2.5 text-sm rounded-full gap-2",
    lg: "px-6 py-3 text-base rounded-full gap-2",
};

export function Button({
    children,
    variant = "primary",
    size = "md",
    fullWidth = false,
    leftIcon,
    rightIcon,
    className,
    ...props
}: ButtonProps) {
    return (
        <button
            {...props}
            className={cn(
                "inline-flex items-center justify-center transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                variantStyles[variant],
                sizeStyles[size],
                fullWidth && "w-full",
                className
            )}
        >
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </button>
    );
}
