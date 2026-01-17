"use client";

import { useEffect, useState } from "react";

interface BlogModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: Record<string, unknown>;
}

export function BlogModal({ isOpen, onClose }: BlogModalProps) {
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
                                Edit Article
                            </h2>
                            <p className="text-sm text-text-muted dark:text-gray-400 mt-1">
                                The Art of Writing PRDs
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
                                    htmlFor="article-title"
                                >
                                    Article Title
                                </label>
                                <input
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white focus:ring-sage-green focus:border-sage-green py-3 px-4 shadow-sm text-sm"
                                    id="article-title"
                                    type="text"
                                    defaultValue="The Art of Writing PRDs"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label
                                        className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2"
                                        htmlFor="category"
                                    >
                                        Category
                                    </label>
                                    <select
                                        className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white focus:ring-sage-green focus:border-sage-green py-3 px-4 shadow-sm text-sm"
                                        id="category"
                                        defaultValue="product-mgmt"
                                    >
                                        <option value="product-mgmt">
                                            Product Mgmt
                                        </option>
                                        <option value="engineering">Engineering</option>
                                        <option value="design">Design</option>
                                        <option value="process">Process</option>
                                        <option value="soft-skills">Soft Skills</option>
                                    </select>
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
                                        <option value="scheduled">
                                            Scheduled
                                        </option>
                                        <option value="archived">
                                            Archived
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label
                                    className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2"
                                    htmlFor="slug"
                                >
                                    Slug
                                </label>
                                <input
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white focus:ring-sage-green focus:border-sage-green py-3 px-4 shadow-sm text-sm"
                                    id="slug"
                                    type="text"
                                    defaultValue="/art-of-writing-prds"
                                />
                            </div>
                            <div>
                                <label
                                    className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2"
                                    htmlFor="content-preview"
                                >
                                    Content Preview
                                </label>
                                <textarea
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white focus:ring-sage-green focus:border-sage-green py-3 px-4 shadow-sm text-sm resize-none"
                                    id="content-preview"
                                    rows={4}
                                    defaultValue="A Product Requirement Document (PRD) is the heart of any product development process. It serves as a single source of truth..."
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">
                                    Cover Image
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
                            className="px-5 py-2.5 rounded-full border border-gray-300 dark:border-gray-600 text-sm font-semibold text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:ring-2 focus:ring-gray-200 cursor-pointer"
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
