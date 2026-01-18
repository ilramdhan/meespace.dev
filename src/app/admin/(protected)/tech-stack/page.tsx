"use client";

import { AdminPageHeader } from "@/components/admin/ui/AdminPageHeader";
import { useState, useEffect, useCallback } from "react";
import { TechStackModal } from "@/components/admin/ui/TechStackModal";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import { useToast } from "@/components/shared/Toast";
import { apiCall } from "@/hooks/useApi";

interface TechStackItem {
    id: string;
    name: string;
    icon: string;
    color: string;
    category: string;
    proficiency: string;
    proficiency_value: number;
    is_active: boolean;
    display_order: number;
}

interface ApiResponse {
    techStack: TechStackItem[];
    grouped: Record<string, TechStackItem[]>;
}

export default function AdminTechStackPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<TechStackItem | null>(null);
    const [deleteItem, setDeleteItem] = useState<TechStackItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Tools");

    const [techStack, setTechStack] = useState<TechStackItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { showToast } = useToast();

    // Fetch tech stack from API
    const fetchTechStack = useCallback(async () => {
        setIsLoading(true);
        const result = await apiCall<ApiResponse>('/api/v1/tech-stack?admin=true');
        if (result.success && result.data) {
            setTechStack(result.data.techStack || []);
        } else {
            showToast(result.error || 'Failed to load tech stack', 'error');
        }
        setIsLoading(false);
    }, [showToast]);

    useEffect(() => {
        fetchTechStack();
    }, [fetchTechStack]);

    // Helper for dynamic colors
    const getColorClasses = (color: string) => {
        const map: Record<string, { bg: string; text: string }> = {
            blue: { bg: "bg-blue-500/10 dark:bg-blue-500/20", text: "text-blue-600 dark:text-blue-400" },
            purple: { bg: "bg-purple-500/10 dark:bg-purple-500/20", text: "text-purple-600 dark:text-purple-400" },
            orange: { bg: "bg-orange-500/10 dark:bg-orange-500/20", text: "text-orange-600 dark:text-orange-400" },
            green: { bg: "bg-green-500/10 dark:bg-green-500/20", text: "text-green-600 dark:text-green-400" },
            yellow: { bg: "bg-yellow-500/10 dark:bg-yellow-500/20", text: "text-yellow-600 dark:text-yellow-400" },
            indigo: { bg: "bg-indigo-500/10 dark:bg-indigo-500/20", text: "text-indigo-600 dark:text-indigo-400" },
            cyan: { bg: "bg-cyan-500/10 dark:bg-cyan-500/20", text: "text-cyan-600 dark:text-cyan-400" },
            red: { bg: "bg-red-500/10 dark:bg-red-500/20", text: "text-red-600 dark:text-red-400" },
        };
        return map[color] || map["blue"];
    };

    const categories = ["All Tools", "Analytics", "Development", "Design", "Project Management", "Documentation", "Diagramming"];

    const filteredTools = techStack.filter((tool) => {
        const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All Tools" || tool.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Handle delete
    const handleDelete = async () => {
        if (!deleteItem) return;

        setIsDeleting(true);
        const result = await apiCall(`/api/v1/tech-stack?id=${deleteItem.id}`, { method: 'DELETE' });

        if (result.success) {
            showToast(`"${deleteItem.name}" deleted successfully`, 'success');
            setTechStack(prev => prev.filter(item => item.id !== deleteItem.id));
        } else {
            showToast(result.error || 'Failed to delete item', 'error');
        }

        setIsDeleting(false);
        setDeleteItem(null);
    };

    // Handle modal close with refresh
    const handleModalClose = (saved?: boolean) => {
        setIsModalOpen(false);
        setEditingItem(null);
        if (saved) {
            fetchTechStack();
        }
    };

    // Handle edit
    const handleEdit = (tool: TechStackItem) => {
        setEditingItem(tool);
        setIsModalOpen(true);
    };

    return (
        <div className="flex flex-col gap-6">
            <AdminPageHeader
                title="Tech Stack Management"
                description="Manage the tools and technologies displayed on your portfolio."
                rightAction={
                    <button
                        onClick={() => {
                            setEditingItem(null);
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-dark text-text-main rounded-full text-sm font-bold shadow-sm transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-lg">add</span>
                        Add New Tool
                    </button>
                }
            />

            <div className="max-w-[1400px] w-full mx-auto px-8 pb-8 flex flex-col gap-6">

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white dark:bg-[#1e1e1e] p-2 rounded-xl border border-gray-100 dark:border-gray-800">
                    <div className="flex-1 relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            search
                        </span>
                        <input
                            className="w-full pl-10 pr-4 py-2 bg-transparent border-none text-sm text-text-main dark:text-white placeholder-gray-400 focus:ring-0"
                            placeholder="Search tools..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="hidden md:block h-6 w-[1px] bg-gray-200 dark:bg-gray-700"></div>
                    <div className="flex gap-2 px-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${selectedCategory === cat
                                    ? "bg-sage-light dark:bg-sage-green/20 text-sage-green"
                                    : "text-text-muted hover:bg-gray-50 dark:hover:bg-gray-800"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-[#1e1e1e] rounded-xl p-5 border border-gray-100 dark:border-gray-800 animate-pulse min-h-[280px]">
                                <div className="h-16 w-16 mx-auto mt-4 mb-6 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-4"></div>
                                <div className="bg-gray-100 dark:bg-gray-800/50 rounded-xl p-3">
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredTools.map((tool) => {
                            const colors = getColorClasses(tool.color);
                            return (
                                <div
                                    key={tool.id}
                                    className="bento-card bg-white dark:bg-[#1e1e1e] rounded-xl p-5 border border-gray-100 dark:border-gray-800 relative group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                                >
                                    <div className="absolute top-4 left-4 text-gray-300 hover:text-text-muted cursor-grab active:cursor-grabbing">
                                        <span className="material-symbols-outlined">
                                            drag_indicator
                                        </span>
                                    </div>
                                    <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEdit(tool)}
                                            className="size-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-text-muted transition-colors cursor-pointer"
                                            title="Edit"
                                        >
                                            <span className="material-symbols-outlined text-lg">
                                                edit
                                            </span>
                                        </button>
                                        <button
                                            onClick={() => setDeleteItem(tool)}
                                            className="size-8 flex items-center justify-center rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-text-muted hover:text-red-600 transition-colors cursor-pointer"
                                            title="Delete"
                                        >
                                            <span className="material-symbols-outlined text-lg">
                                                delete
                                            </span>
                                        </button>
                                    </div>
                                    <div className="mt-4 mb-6 flex justify-center">
                                        <div className={`size-16 rounded-2xl flex items-center justify-center ${colors.bg}`}>
                                            <span className={`material-symbols-outlined text-3xl ${colors.text}`}>
                                                {tool.icon}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-center mb-4">
                                        <h3 className="font-bold text-text-main dark:text-white text-lg">
                                            {tool.name}
                                        </h3>
                                        <p className="text-xs text-text-muted uppercase tracking-wider font-semibold mt-1">
                                            {tool.category}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                                        <div className="flex justify-between items-center text-xs mb-2">
                                            <span className="text-text-muted font-medium">
                                                Proficiency
                                            </span>
                                            <span className="text-text-main dark:text-white font-bold">
                                                {tool.proficiency}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                                            <div
                                                className="bg-sage-green h-full rounded-full"
                                                style={{ width: `${tool.proficiency_value}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Add New Card Button */}
                        <div
                            onClick={() => {
                                setEditingItem(null);
                                setIsModalOpen(true);
                            }}
                            className="bento-card border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:border-sage-green hover:bg-sage-light/30 dark:hover:bg-sage-green/5 transition-all group min-h-[280px]"
                        >
                            <div className="size-16 rounded-full bg-gray-50 dark:bg-gray-800 group-hover:bg-white dark:group-hover:bg-[#1e1e1e] flex items-center justify-center mb-4 transition-colors">
                                <span className="material-symbols-outlined text-3xl text-gray-400 group-hover:text-sage-green transition-colors">
                                    add
                                </span>
                            </div>
                            <h3 className="font-bold text-text-muted group-hover:text-sage-green text-lg transition-colors">
                                Add New Tool
                            </h3>
                            <p className="text-xs text-gray-400 mt-2 max-w-[200px]">
                                Click to add a new technology to your stack.
                            </p>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && filteredTools.length === 0 && techStack.length > 0 && (
                    <div className="text-center py-12">
                        <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-4">search_off</span>
                        <p className="text-text-muted">No tools found matching your search.</p>
                    </div>
                )}
            </div>

            {/* Edit/Create Modal */}
            <TechStackModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                editData={editingItem}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={!!deleteItem}
                title="Delete Tool"
                message={`Are you sure you want to delete "${deleteItem?.name}"? This action cannot be undone.`}
                confirmLabel="Delete"
                cancelLabel="Cancel"
                variant="danger"
                onConfirm={handleDelete}
                onCancel={() => setDeleteItem(null)}
                isLoading={isDeleting}
            />
        </div>
    );
}
