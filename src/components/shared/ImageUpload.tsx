"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

interface ImageUploadProps {
    bucket?: string;
    folder?: string;
    onUpload: (url: string) => void;
    currentUrl?: string;
    accept?: string;
    label?: string;
    helperText?: string;
    className?: string;
}

export function ImageUpload({
    bucket = "meyspace.dev",
    folder = "uploads",
    onUpload,
    currentUrl,
    accept = "image/*",
    label = "Upload Image",
    helperText,
    className = "",
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentUrl || null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError("File size must be less than 5MB");
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            const supabase = createClient();

            // Generate unique filename
            const fileExt = file.name.split(".").pop();
            const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

            // Upload to Supabase Storage
            const { data, error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(fileName, file, {
                    cacheControl: "3600",
                    upsert: false,
                });

            if (uploadError) {
                throw uploadError;
            }

            // Get public URL
            const { data: urlData } = supabase.storage
                .from(bucket)
                .getPublicUrl(data.path);

            const publicUrl = urlData.publicUrl;
            setPreview(publicUrl);
            onUpload(publicUrl);
        } catch (err) {
            console.error("Upload error:", err);
            setError(err instanceof Error ? err.message : "Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        onUpload("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const isPdf = preview?.toLowerCase().endsWith(".pdf");

    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label className="block text-sm font-semibold text-text-main dark:text-gray-300">
                    {label}
                </label>
            )}

            <div className="relative">
                {preview ? (
                    <div className="relative group">
                        {isPdf ? (
                            <div className="w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center gap-3 border border-gray-200 dark:border-gray-700">
                                <span className="material-symbols-outlined text-3xl text-red-500">picture_as_pdf</span>
                                <span className="text-sm text-text-muted truncate max-w-[150px]">
                                    {preview.split("/").pop()}
                                </span>
                            </div>
                        ) : (
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full h-32 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
                            />
                        )}
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                        <a
                            href={preview}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute bottom-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <span className="material-symbols-outlined text-sm">open_in_new</span>
                        </a>
                    </div>
                ) : (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-sage-green hover:bg-sage-light/20 dark:hover:bg-sage-green/10 transition-colors ${isUploading ? "opacity-50 pointer-events-none" : ""
                            }`}
                    >
                        {isUploading ? (
                            <>
                                <span className="material-symbols-outlined text-2xl text-sage-green animate-spin">
                                    progress_activity
                                </span>
                                <span className="text-sm text-text-muted">Uploading...</span>
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-2xl text-text-muted">
                                    cloud_upload
                                </span>
                                <span className="text-sm text-text-muted">
                                    Click to upload
                                </span>
                            </>
                        )}
                    </div>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isUploading}
                />
            </div>

            {helperText && !error && (
                <p className="text-xs text-text-muted">{helperText}</p>
            )}

            {error && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">error</span>
                    {error}
                </p>
            )}
        </div>
    );
}

// Multi-image upload component for galleries
interface MultiImageUploadProps {
    bucket?: string;
    folder?: string;
    onUpload: (urls: string[]) => void;
    currentUrls?: string[];
    maxImages?: number;
    label?: string;
}

export function MultiImageUpload({
    bucket = "meyspace.dev",
    folder = "gallery",
    onUpload,
    currentUrls = [],
    maxImages = 10,
    label = "Upload Images",
}: MultiImageUploadProps) {
    const [images, setImages] = useState<string[]>(currentUrls);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (images.length + files.length > maxImages) {
            alert(`Maximum ${maxImages} images allowed`);
            return;
        }

        setIsUploading(true);

        try {
            const supabase = createClient();
            const newUrls: string[] = [];

            for (const file of Array.from(files)) {
                if (file.size > 5 * 1024 * 1024) continue; // Skip files > 5MB

                const fileExt = file.name.split(".").pop();
                const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

                const { data, error } = await supabase.storage
                    .from(bucket)
                    .upload(fileName, file, { cacheControl: "3600", upsert: false });

                if (!error && data) {
                    const { data: urlData } = supabase.storage
                        .from(bucket)
                        .getPublicUrl(data.path);
                    newUrls.push(urlData.publicUrl);
                }
            }

            const updatedImages = [...images, ...newUrls];
            setImages(updatedImages);
            onUpload(updatedImages);
        } catch (err) {
            console.error("Upload error:", err);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const removeImage = (index: number) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
        onUpload(updatedImages);
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-semibold text-text-main dark:text-gray-300">
                {label}
            </label>

            <div className="grid grid-cols-3 gap-3">
                {images.map((url, index) => (
                    <div key={index} className="relative group aspect-video">
                        <img
                            src={url}
                            alt={`Image ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                        />
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-xs">close</span>
                        </button>
                    </div>
                ))}

                {images.length < maxImages && (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`aspect-video border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-sage-green transition-colors ${isUploading ? "opacity-50" : ""
                            }`}
                    >
                        {isUploading ? (
                            <span className="material-symbols-outlined animate-spin text-sage-green">progress_activity</span>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-text-muted">add_photo_alternate</span>
                                <span className="text-xs text-text-muted mt-1">Add</span>
                            </>
                        )}
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading}
            />

            <p className="text-xs text-text-muted">{images.length}/{maxImages} images</p>
        </div>
    );
}
