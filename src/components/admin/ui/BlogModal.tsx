"use client";

import { useEffect, useState } from "react";
import { apiCall } from "@/hooks/useApi";
import { useToast } from "@/components/shared/Toast";
import { ImageUpload } from "@/components/shared/ImageUpload";

interface BlogPost {
    id?: string;
    title: string;
    slug: string;
    excerpt?: string;
    content?: string;
    featured_image_url?: string;
    author_name?: string;
    category_id?: string;
    read_time_minutes?: number;
    status: string;
    is_featured?: boolean;
    meta_title?: string;
    meta_description?: string;
}

interface BlogCategory {
    id: string;
    name: string;
    slug: string;
}

interface BlogModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editData?: BlogPost | null;
}

export function BlogModal({ isOpen, onClose, onSuccess, editData }: BlogModalProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<BlogCategory[]>([]);
    const [activeTab, setActiveTab] = useState<'basic' | 'content' | 'seo'>('basic');
    const { showToast } = useToast();

    const [formData, setFormData] = useState<BlogPost>({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        featured_image_url: '',
        author_name: '',
        category_id: '',
        read_time_minutes: 5,
        status: 'draft',
        is_featured: false,
        meta_title: '',
        meta_description: '',
    });

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            const result = await apiCall('/api/v1/blog?categories=true');
            if (result.success && result.data) {
                const data = result.data as { categories?: BlogCategory[] };
                if (data.categories) {
                    setCategories(data.categories);
                }
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setActiveTab('basic');
            if (editData) {
                setFormData({
                    id: editData.id,
                    title: editData.title || '',
                    slug: editData.slug || '',
                    excerpt: editData.excerpt || '',
                    content: editData.content || '',
                    featured_image_url: editData.featured_image_url || '',
                    author_name: editData.author_name || '',
                    category_id: editData.category_id || '',
                    read_time_minutes: editData.read_time_minutes || 5,
                    status: editData.status || 'draft',
                    is_featured: editData.is_featured || false,
                    meta_title: editData.meta_title || '',
                    meta_description: editData.meta_description || '',
                });
            } else {
                setFormData({
                    title: '',
                    slug: '',
                    excerpt: '',
                    content: '',
                    featured_image_url: '',
                    author_name: '',
                    category_id: '',
                    read_time_minutes: 5,
                    status: 'draft',
                    is_featured: false,
                    meta_title: '',
                    meta_description: '',
                });
            }
        } else {
            const timer = setTimeout(() => setIsVisible(false), 200);
            return () => clearTimeout(timer);
        }
    }, [isOpen, editData]);

    // Auto-generate slug from title
    const handleTitleChange = (title: string) => {
        setFormData({
            ...formData,
            title,
            slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
            meta_title: formData.meta_title || title,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.slug) {
            showToast('Please fill in title and slug', 'error');
            return;
        }

        setIsLoading(true);

        const payload = {
            title: formData.title,
            slug: formData.slug,
            excerpt: formData.excerpt || null,
            content: formData.content || null,
            featured_image_url: formData.featured_image_url || null,
            author_name: formData.author_name || null,
            category_id: formData.category_id || null,
            read_time_minutes: Number(formData.read_time_minutes) || 5,
            status: formData.status,
            is_featured: formData.is_featured,
            meta_title: formData.meta_title || null,
            meta_description: formData.meta_description || null,
        };

        let result;
        if (editData?.id) {
            result = await apiCall(`/api/v1/blog?id=${editData.id}`, { method: 'PUT', body: payload });
        } else {
            result = await apiCall('/api/v1/blog', { method: 'POST', body: payload });
        }

        setIsLoading(false);

        if (result.success) {
            showToast(editData ? 'Article updated successfully' : 'Article created successfully', 'success');
            onSuccess();
            onClose();
        } else {
            showToast(result.error || 'Failed to save article', 'error');
        }
    };

    if (!isVisible && !isOpen) return null;
    const isEditing = !!editData?.id;

    const tabs = [
        { id: 'basic' as const, label: 'Basic Info', icon: 'info' },
        { id: 'content' as const, label: 'Content', icon: 'description' },
        { id: 'seo' as const, label: 'SEO', icon: 'search' },
    ];

    return (
        <>
            <div className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60] transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0"}`} onClick={onClose}></div>
            <div className="fixed inset-0 flex items-center justify-center z-[70] p-4 pointer-events-none">
                <div className={`bg-white dark:bg-[#1e1e1e] w-full max-w-2xl rounded-[24px] shadow-2xl border border-gray-100 dark:border-gray-700 flex flex-col max-h-[90vh] pointer-events-auto transition-all duration-200 transform ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>

                    <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-text-main dark:text-white">{isEditing ? 'Edit Article' : 'New Article'}</h2>
                            <p className="text-sm text-text-muted dark:text-gray-400 mt-1">{isEditing ? 'Update blog post' : 'Create a new blog post'}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="px-8 py-3 border-b border-gray-100 dark:border-gray-800 flex gap-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${activeTab === tab.id
                                    ? 'bg-sage-green/20 text-sage-green'
                                    : 'text-text-muted hover:bg-gray-100 dark:hover:bg-white/5'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                        <div className="p-8 overflow-y-auto custom-scrollbar space-y-6 flex-1">

                            {/* TAB: Basic Info */}
                            {activeTab === 'basic' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">
                                            Article Title <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm"
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => handleTitleChange(e.target.value)}
                                            placeholder="e.g. How to Build a REST API"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">
                                                Slug <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm"
                                                type="text"
                                                value={formData.slug}
                                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">Status</label>
                                            <select
                                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm"
                                                value={formData.status}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            >
                                                <option value="draft">Draft</option>
                                                <option value="published">Published</option>
                                                <option value="scheduled">Scheduled</option>
                                                <option value="archived">Archived</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">Category</label>
                                            <select
                                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm"
                                                value={formData.category_id}
                                                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">Reading Time (min)</label>
                                            <input
                                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm"
                                                type="number"
                                                min="1"
                                                value={formData.read_time_minutes}
                                                onChange={(e) => setFormData({ ...formData, read_time_minutes: parseInt(e.target.value) })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">Author</label>
                                            <input
                                                className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm"
                                                type="text"
                                                value={formData.author_name}
                                                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                                                placeholder="Your name"
                                            />
                                        </div>
                                    </div>

                                    <ImageUpload
                                        label="Featured Image"
                                        folder="blog/covers"
                                        currentUrl={formData.featured_image_url}
                                        onUpload={(url) => setFormData({ ...formData, featured_image_url: url })}
                                        helperText="Cover image for your article"
                                    />

                                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-black/20 rounded-xl p-4">
                                        <input
                                            type="checkbox"
                                            id="is_featured"
                                            checked={formData.is_featured}
                                            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                            className="w-4 h-4 accent-sage-green"
                                        />
                                        <label htmlFor="is_featured" className="text-sm font-medium text-text-main dark:text-white cursor-pointer">
                                            Featured Article (show prominently on homepage)
                                        </label>
                                    </div>
                                </>
                            )}

                            {/* TAB: Content */}
                            {activeTab === 'content' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">Excerpt</label>
                                        <textarea
                                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm resize-none"
                                            rows={3}
                                            value={formData.excerpt}
                                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                            placeholder="Short summary of the article..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">Content</label>
                                        <p className="text-xs text-text-muted mb-2">Write your article content. Markdown is supported.</p>
                                        <textarea
                                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm resize-none font-mono"
                                            rows={15}
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            placeholder="# Your Article&#10;&#10;Write your content here using Markdown..."
                                        />
                                    </div>
                                </>
                            )}

                            {/* TAB: SEO */}
                            {activeTab === 'seo' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">Meta Title</label>
                                        <input
                                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm"
                                            type="text"
                                            value={formData.meta_title}
                                            onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                                            placeholder="SEO title (defaults to article title)"
                                        />
                                        <p className="text-xs text-text-muted mt-1">{(formData.meta_title || formData.title).length}/60 characters</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-text-main dark:text-gray-300 mb-2">Meta Description</label>
                                        <textarea
                                            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-text-main dark:text-white py-3 px-4 shadow-sm text-sm resize-none"
                                            rows={3}
                                            value={formData.meta_description}
                                            onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                                            placeholder="SEO description for search engines"
                                        />
                                        <p className="text-xs text-text-muted mt-1">{(formData.meta_description || '').length}/160 characters</p>
                                    </div>

                                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                                        <p className="text-xs text-text-muted mb-2">SEO Preview</p>
                                        <div className="text-blue-600 dark:text-blue-400 font-medium text-sm truncate">
                                            {formData.meta_title || formData.title || 'Article Title'}
                                        </div>
                                        <div className="text-green-600 dark:text-green-400 text-xs truncate">
                                            yoursite.com/insights/{formData.slug || 'article-slug'}
                                        </div>
                                        <div className="text-text-muted text-xs mt-1 line-clamp-2">
                                            {formData.meta_description || formData.excerpt || 'Article description will appear here...'}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="px-8 py-5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3 bg-gray-50/50 dark:bg-gray-900/30 rounded-b-[24px]">
                            <button type="button" onClick={onClose} disabled={isLoading} className="px-5 py-2.5 rounded-full border border-gray-300 dark:border-gray-600 text-sm font-semibold text-text-main dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50">
                                Cancel
                            </button>
                            <button type="submit" disabled={isLoading} className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary-dark text-text-main text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2">
                                {isLoading && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                                {isLoading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Article')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
