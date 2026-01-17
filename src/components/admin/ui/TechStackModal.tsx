"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface TechStackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TechStackModal({ isOpen, onClose }: TechStackModalProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = "hidden";
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            document.body.style.overflow = "unset";
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!mounted || !isVisible) return null;

    return createPortal(
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${isOpen ? "visible" : "invisible"}`}>
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className={`relative w-full max-w-lg bg-white dark:bg-[#1e1e1e] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all duration-300 transform ${isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"}`}
            >
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-md z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-text-main dark:text-white">
                            Add New Tool
                        </h2>
                        <p className="text-text-muted dark:text-gray-400 text-sm mt-1">
                            Add a new technology or tool to your stack.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-text-main dark:hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto custom-scrollbar space-y-6">
                    {/* Tool Name */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-text-main dark:text-white ml-1">
                            Tool Name
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. React, Figma, Jira"
                            className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-800 focus:border-sage-green focus:ring-0 text-text-main dark:text-white placeholder-gray-400 transition-all font-medium"
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-text-main dark:text-white ml-1">
                            Category
                        </label>
                        <select
                            className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-800 focus:border-sage-green focus:ring-0 text-text-main dark:text-white transition-all font-medium appearance-none"
                        >
                            <option>Development</option>
                            <option>Design</option>
                            <option>Project Management</option>
                            <option>Data Analysis</option>
                            <option>DevOps</option>
                            <option>Other</option>
                        </select>
                    </div>

                    {/* Proficiency */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-sm font-semibold text-text-main dark:text-white">
                                Proficiency
                            </label>
                            <span className="text-xs font-medium text-sage-green bg-sage-light dark:bg-sage-green/20 px-2 py-0.5 rounded-md">80%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-sage-green"
                        />
                        <div className="flex justify-between text-xs text-text-muted px-1">
                            <span>Beginner</span>
                            <span>Intermediate</span>
                            <span>Expert</span>
                        </div>
                    </div>

                    {/* Icon & Color */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-text-main dark:text-white ml-1">
                                Icon (Symbol)
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. code, brush"
                                className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-800 focus:border-sage-green focus:ring-0 text-text-main dark:text-white placeholder-gray-400 transition-all font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-text-main dark:text-white ml-1">
                                Theme Color
                            </label>
                            <select
                                className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-800 focus:border-sage-green focus:ring-0 text-text-main dark:text-white transition-all font-medium appearance-none"
                            >
                                <option value="blue">Blue</option>
                                <option value="purple">Purple</option>
                                <option value="orange">Orange</option>
                                <option value="green">Green</option>
                                <option value="yellow">Yellow</option>
                                <option value="red">Red</option>
                                <option value="indigo">Indigo</option>
                                <option value="cyan">Cyan</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3 bg-gray-50/50 dark:bg-gray-900/30 rounded-b-[24px]">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-full border border-gray-300 dark:border-gray-600 text-sm font-semibold text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:ring-2 focus:ring-gray-200 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-dark text-text-main text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer">
                        Save Tool
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
