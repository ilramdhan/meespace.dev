"use client";

import { useEffect, useState } from "react";

interface ProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: Record<string, unknown>; // Replace with proper type in real app
}

export function ProjectModal({ isOpen, onClose }: ProjectModalProps) {
    const [isVisible, setIsVisible] = useState(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 200);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60] transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0"
                    }`}
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-[70] p-4 pointer-events-none">
                <div
                    className={`bg-white dark:bg-[#1e1e1e] w-full max-w-2xl rounded-[24px] shadow-2xl border border-gray-100 dark:border-gray-700 flex flex-col max-h-[90vh] pointer-events-auto transition-all duration-200 transform ${isOpen
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-95"
                        }`}
                >
                    <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-text-main dark:text-white">
                                Edit Project
                            </h2>
                            <p className="text-sm text-text-muted dark:text-gray-400 mt-1">
                                E-commerce API Integration
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined">
                                close
                            </span>
                        </button>
                    </div>

                    <div className="p-8 overflow-y-auto custom-scrollbar">
                        <form className="space-y-6">
                            <div>
                                <label
                                    className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2"
                                    htmlFor="project-title"
                                >
                                    Project Title
                                </label>
                                <input
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white focus:ring-sage-green focus:border-sage-green py-3 px-4 shadow-sm text-sm"
                                    id="project-title"
                                    type="text"
                                    defaultValue="E-commerce API Integration"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label
                                        className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2"
                                        htmlFor="year"
                                    >
                                        Year
                                    </label>
                                    <input
                                        className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white focus:ring-sage-green focus:border-sage-green py-3 px-4 shadow-sm text-sm"
                                        id="year"
                                        type="number"
                                        defaultValue="2023"
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2"
                                        htmlFor="status"
                                    >
                                        Status
                                    </label>
                                    <select
                                        className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white focus:ring-sage-green focus:border-sage-green py-3 px-4 shadow-sm text-sm"
                                        id="status"
                                        defaultValue="published"
                                    >
                                        <option value="published">
                                            Published
                                        </option>
                                        <option value="draft">Draft</option>
                                        <option value="archived">
                                            Archived
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label
                                    className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2"
                                    htmlFor="tags"
                                >
                                    Tags
                                </label>
                                <div className="relative">
                                    <div className="flex flex-wrap gap-2 p-2 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 min-h-[50px] items-center">
                                        <span className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-text-main dark:text-white text-xs font-medium px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                            PRD
                                            <button
                                                className="hover:text-red-500 cursor-pointer"
                                                type="button"
                                            >
                                                <span className="material-symbols-outlined text-[14px]">
                                                    close
                                                </span>
                                            </button>
                                        </span>
                                        <span className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-text-main dark:text-white text-xs font-medium px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                            UML
                                            <button
                                                className="hover:text-red-500 cursor-pointer"
                                                type="button"
                                            >
                                                <span className="material-symbols-outlined text-[14px]">
                                                    close
                                                </span>
                                            </button>
                                        </span>
                                        <input
                                            className="bg-transparent border-none text-sm focus:ring-0 p-1 placeholder-gray-400 w-24 outline-none"
                                            placeholder="Add tag..."
                                            type="text"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label
                                    className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2"
                                    htmlFor="description"
                                >
                                    Description
                                </label>
                                <textarea
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white focus:ring-sage-green focus:border-sage-green py-3 px-4 shadow-sm text-sm resize-none"
                                    id="description"
                                    rows={4}
                                    defaultValue="Facilitated the integration of a third-party payment gateway and inventory management system via RESTful APIs. Documented endpoints and data mapping."
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">
                                    Thumbnail
                                </label>
                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group">
                                    <div className="size-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-gray-400 dark:text-gray-500">
                                            add_photo_alternate
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-text-main dark:text-white">
                                        Click to upload or drag and drop
                                    </p>
                                    <p className="text-xs text-text-muted mt-1">
                                        SVG, PNG, JPG or GIF (max. 2MB)
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className="px-8 py-5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3 bg-gray-50/50 dark:bg-gray-900/30 rounded-b-[24px]">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-sm font-semibold text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:ring-2 focus:ring-gray-200 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-dark text-text-main text-sm font-bold shadow-md hover:shadow-lg transition-all focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-[#1e1e1e] cursor-pointer">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
