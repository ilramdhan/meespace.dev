"use client";

import { useEffect, useState } from "react";

interface CertificationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CertificationModal({ isOpen, onClose }: CertificationModalProps) {
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
                                Edit Certification
                            </h2>
                            <p className="text-sm text-text-muted dark:text-gray-400 mt-1">
                                Certified Solutions Architect
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
                                    htmlFor="cert-name"
                                >
                                    Certification Name
                                </label>
                                <input
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white focus:ring-sage-green focus:border-sage-green py-3 px-4 shadow-sm text-sm"
                                    id="cert-name"
                                    type="text"
                                    defaultValue="AWS Certified Solutions Architect"
                                />
                            </div>

                            <div>
                                <label
                                    className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2"
                                    htmlFor="issuer"
                                >
                                    Issuing Organization
                                </label>
                                <input
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white focus:ring-sage-green focus:border-sage-green py-3 px-4 shadow-sm text-sm"
                                    id="issuer"
                                    type="text"
                                    defaultValue="Amazon Web Services"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label
                                        className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2"
                                        htmlFor="issue-date"
                                    >
                                        Issue Date
                                    </label>
                                    <input
                                        className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white focus:ring-sage-green focus:border-sage-green py-3 px-4 shadow-sm text-sm"
                                        id="issue-date"
                                        type="text"
                                        defaultValue="Dec 2022"
                                        placeholder="MMM YYYY"
                                    />
                                </div>
                                <div>
                                    <label
                                        className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2"
                                        htmlFor="expiration-date"
                                    >
                                        Expiration Date
                                    </label>
                                    <input
                                        className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white focus:ring-sage-green focus:border-sage-green py-3 px-4 shadow-sm text-sm"
                                        id="expiration-date"
                                        type="text"
                                        defaultValue="Dec 2025"
                                        placeholder="MMM YYYY"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2"
                                    htmlFor="credential-url"
                                >
                                    Credential URL
                                </label>
                                <input
                                    className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white focus:ring-sage-green focus:border-sage-green py-3 px-4 shadow-sm text-sm"
                                    id="credential-url"
                                    type="url"
                                    defaultValue="https://aws.amazon.com/verification"
                                    placeholder="https://"
                                />
                            </div>

                            <div>
                                <label
                                    className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2"
                                    htmlFor="cert-file"
                                >
                                    Attachment (Certificate PDF/Image)
                                </label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900/20 transition-colors cursor-pointer">
                                    <div className="space-y-1 text-center">
                                        <div className="mx-auto size-12 text-gray-400">
                                            <span className="material-symbols-outlined text-4xl">
                                                cloud_upload
                                            </span>
                                        </div>
                                        <div className="flex text-sm text-text-muted dark:text-gray-400">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer bg-transparent rounded-md font-medium text-sage-green hover:text-sag-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-sage-green"
                                            >
                                                <span>Upload a file</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-text-muted dark:text-gray-500">
                                            PDF, PNG, JPG up to 10MB
                                        </p>
                                    </div>
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
