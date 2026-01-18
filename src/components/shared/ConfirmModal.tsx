"use client";

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export function ConfirmModal({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'danger',
    onConfirm,
    onCancel,
    isLoading = false,
}: ConfirmModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    const variantStyles = {
        danger: {
            icon: 'delete',
            iconBg: 'bg-red-100 dark:bg-red-900/30',
            iconColor: 'text-red-600 dark:text-red-400',
            buttonBg: 'bg-red-600 hover:bg-red-700',
        },
        warning: {
            icon: 'warning',
            iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
            iconColor: 'text-yellow-600 dark:text-yellow-400',
            buttonBg: 'bg-yellow-600 hover:bg-yellow-700',
        },
        info: {
            icon: 'info',
            iconBg: 'bg-blue-100 dark:bg-blue-900/30',
            iconColor: 'text-blue-600 dark:text-blue-400',
            buttonBg: 'bg-blue-600 hover:bg-blue-700',
        },
    }[variant];

    const modal = (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={!isLoading ? onCancel : undefined}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-xl max-w-md w-full mx-4 p-6 animate-scale-in">
                {/* Icon */}
                <div className={`mx-auto w-12 h-12 rounded-full ${variantStyles.iconBg} flex items-center justify-center mb-4`}>
                    <span className={`material-symbols-outlined text-2xl ${variantStyles.iconColor}`}>
                        {variantStyles.icon}
                    </span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-center text-text-main dark:text-white mb-2">
                    {title}
                </h3>
                <p className="text-sm text-center text-text-muted dark:text-gray-400 mb-6">
                    {message}
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2.5 text-sm font-medium text-text-main dark:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`flex-1 px-4 py-2.5 text-sm font-medium text-white ${variantStyles.buttonBg} rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2`}
                    >
                        {isLoading && (
                            <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                        )}
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
}
