"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useToast } from "@/components/shared/Toast";
import { apiCall } from "@/hooks/useApi";

interface TechStackItem {
    id?: string;
    name: string;
    icon: string;
    color: string;
    category: string;
    proficiency: string;
    proficiency_value: number;
    is_active: boolean;
    display_order?: number;
}

interface TechStackModalProps {
    isOpen: boolean;
    onClose: (saved?: boolean) => void;
    editData?: TechStackItem | null;
}

export function TechStackModal({ isOpen, onClose, editData }: TechStackModalProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    // Form state
    const [formData, setFormData] = useState<TechStackItem>({
        name: '',
        icon: 'code',
        color: 'blue',
        category: 'Development',
        proficiency: 'Intermediate',
        proficiency_value: 50,
        is_active: true,
    });

    // Reset form when modal opens/editData changes
    useEffect(() => {
        if (isOpen) {
            if (editData) {
                setFormData({
                    name: editData.name || '',
                    icon: editData.icon || 'code',
                    color: editData.color || 'blue',
                    category: editData.category || 'Development',
                    proficiency: editData.proficiency || 'Intermediate',
                    proficiency_value: editData.proficiency_value || 50,
                    is_active: editData.is_active !== false,
                    display_order: editData.display_order,
                });
            } else {
                setFormData({
                    name: '',
                    icon: 'code',
                    color: 'blue',
                    category: 'Development',
                    proficiency: 'Intermediate',
                    proficiency_value: 50,
                    is_active: true,
                });
            }
        }
    }, [isOpen, editData]);

    // Update proficiency label based on value
    useEffect(() => {
        const value = formData.proficiency_value;
        let label = 'Intermediate';
        if (value < 30) label = 'Beginner';
        else if (value < 60) label = 'Intermediate';
        else if (value < 85) label = 'Advanced';
        else label = 'Expert';

        if (label !== formData.proficiency) {
            setFormData(prev => ({ ...prev, proficiency: label }));
        }
    }, [formData.proficiency_value, formData.proficiency]);

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

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            showToast('Please enter a tool name', 'warning');
            return;
        }

        setIsLoading(true);

        try {
            if (editData?.id) {
                // Update existing
                const result = await apiCall(`/api/v1/tech-stack?id=${editData.id}`, {
                    method: 'PUT',
                    body: formData,
                });

                if (result.success) {
                    showToast(`"${formData.name}" updated successfully`, 'success');
                    onClose(true);
                } else {
                    showToast(result.error || 'Failed to update tool', 'error');
                }
            } else {
                // Create new
                const result = await apiCall('/api/v1/tech-stack', {
                    method: 'POST',
                    body: formData,
                });

                if (result.success) {
                    showToast(`"${formData.name}" added successfully`, 'success');
                    onClose(true);
                } else {
                    showToast(result.error || 'Failed to add tool', 'error');
                }
            }
        } catch {
            showToast('An error occurred', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if (!mounted || !isVisible) return null;

    const isEditing = !!editData?.id;

    return createPortal(
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${isOpen ? "visible" : "invisible"}`}>
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
                onClick={() => !isLoading && onClose()}
            />

            {/* Modal Content */}
            <div
                className={`relative w-full max-w-lg bg-white dark:bg-[#1e1e1e] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all duration-300 transform ${isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"}`}
            >
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-md z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-text-main dark:text-white">
                            {isEditing ? 'Edit Tool' : 'Add New Tool'}
                        </h2>
                        <p className="text-text-muted dark:text-gray-400 text-sm mt-1">
                            {isEditing ? 'Update the tool details below.' : 'Add a new technology or tool to your stack.'}
                        </p>
                    </div>
                    <button
                        onClick={() => !isLoading && onClose()}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-text-main dark:hover:text-white transition-colors"
                        disabled={isLoading}
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
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-800 focus:border-sage-green focus:ring-0 text-text-main dark:text-white placeholder-gray-400 transition-all font-medium"
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-text-main dark:text-white ml-1">
                            Category
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-800 focus:border-sage-green focus:ring-0 text-text-main dark:text-white transition-all font-medium appearance-none"
                        >
                            <option>Development</option>
                            <option>Design</option>
                            <option>Analytics</option>
                            <option>Project Management</option>
                            <option>Documentation</option>
                            <option>Diagramming</option>
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
                            <span className="text-xs font-medium text-sage-green bg-sage-light dark:bg-sage-green/20 px-2 py-0.5 rounded-md">
                                {formData.proficiency_value}%
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={formData.proficiency_value}
                            onChange={(e) => setFormData(prev => ({ ...prev, proficiency_value: parseInt(e.target.value) }))}
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
                                value={formData.icon}
                                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                                className="w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-800 focus:border-sage-green focus:ring-0 text-text-main dark:text-white placeholder-gray-400 transition-all font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-text-main dark:text-white ml-1">
                                Theme Color
                            </label>
                            <select
                                value={formData.color}
                                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
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

                    {/* Active Toggle */}
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-black/20 rounded-xl p-4">
                        <div>
                            <p className="font-semibold text-text-main dark:text-white text-sm">Active</p>
                            <p className="text-xs text-text-muted">Show this tool on the public site</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, is_active: !prev.is_active }))}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.is_active ? 'bg-sage-green' : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${formData.is_active ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3 bg-gray-50/50 dark:bg-gray-900/30 rounded-b-[24px]">
                    <button
                        onClick={() => onClose()}
                        disabled={isLoading}
                        className="px-5 py-2.5 rounded-full border border-gray-300 dark:border-gray-600 text-sm font-semibold text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:ring-2 focus:ring-gray-200 cursor-pointer disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-dark text-text-main text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                    >
                        {isLoading && (
                            <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                        )}
                        {isEditing ? 'Update Tool' : 'Save Tool'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
