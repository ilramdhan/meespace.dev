import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
    successResponse,
    errorResponse,
    withApiMiddleware,
    addSecurityHeaders,
} from '@/lib/api';

const BUCKET_NAME = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'meyspace.dev';

/**
 * POST /api/v1/upload
 * Upload a file to Supabase Storage (admin only)
 */
export async function POST(request: NextRequest) {
    return withApiMiddleware(
        request,
        async (req, rateLimitInfo) => {
            try {
                const supabase = await createClient();
                const formData = await req.formData();
                const file = formData.get('file') as File;
                const folder = (formData.get('folder') as string) || 'media';
                const altText = formData.get('alt_text') as string;
                const caption = formData.get('caption') as string;

                if (!file) {
                    return errorResponse('File is required', 400, rateLimitInfo);
                }

                // Validate file type
                const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml', 'application/pdf'];
                if (!allowedTypes.includes(file.type)) {
                    return errorResponse('Invalid file type. Allowed: PNG, JPEG, GIF, WebP, SVG, PDF', 400, rateLimitInfo);
                }

                // Validate file size (50MB max)
                const maxSize = 50 * 1024 * 1024;
                if (file.size > maxSize) {
                    return errorResponse('File size exceeds 50MB limit', 400, rateLimitInfo);
                }

                // Generate unique filename
                const timestamp = Date.now();
                const randomStr = Math.random().toString(36).substring(2, 10);
                const extension = file.name.split('.').pop();
                const filename = `${timestamp}-${randomStr}.${extension}`;
                const filePath = `${folder}/${filename}`;

                // Upload to Supabase Storage
                const fileBuffer = await file.arrayBuffer();
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from(BUCKET_NAME)
                    .upload(filePath, fileBuffer, {
                        contentType: file.type,
                        upsert: false,
                    });

                if (uploadError) {
                    return errorResponse(`Upload failed: ${uploadError.message}`, 400, rateLimitInfo);
                }

                // Get public URL
                const { data: publicUrlData } = supabase.storage
                    .from(BUCKET_NAME)
                    .getPublicUrl(filePath);

                // Get current user for uploaded_by
                const { data: { user } } = await supabase.auth.getUser();

                // Store in media_files table
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const { data: mediaFile, error: mediaError } = await (supabase as any)
                    .from('media_files')
                    .insert({
                        filename,
                        original_filename: file.name,
                        file_path: filePath,
                        file_url: publicUrlData.publicUrl,
                        file_size: file.size,
                        mime_type: file.type,
                        alt_text: altText,
                        caption,
                        folder,
                        uploaded_by: user?.id,
                    })
                    .select()
                    .single();

                if (mediaError) {
                    console.error('Failed to save media record:', mediaError);
                }

                return successResponse({
                    url: publicUrlData.publicUrl,
                    path: filePath,
                    filename,
                    originalFilename: file.name,
                    size: file.size,
                    mimeType: file.type,
                    mediaFile,
                }, 201, rateLimitInfo);
            } catch (err) {
                console.error('Error uploading file:', err);
                return errorResponse('Internal server error', 500, rateLimitInfo);
            }
        },
        { requireAdmin: true }
    );
}

/**
 * DELETE /api/v1/upload?path=<file_path>
 * Delete a file from Supabase Storage (admin only)
 */
export async function DELETE(request: NextRequest) {
    return withApiMiddleware(
        request,
        async (req, rateLimitInfo) => {
            try {
                const supabase = await createClient();
                const url = new URL(req.url);
                const filePath = url.searchParams.get('path');

                if (!filePath) {
                    return errorResponse('File path is required', 400, rateLimitInfo);
                }

                // Delete from storage
                const { error: storageError } = await supabase.storage
                    .from(BUCKET_NAME)
                    .remove([filePath]);

                if (storageError) {
                    return errorResponse(`Delete failed: ${storageError.message}`, 400, rateLimitInfo);
                }

                // Delete from media_files table
                await supabase
                    .from('media_files')
                    .delete()
                    .eq('file_path', filePath);

                return successResponse({ message: 'File deleted successfully' }, 200, rateLimitInfo);
            } catch (err) {
                console.error('Error deleting file:', err);
                return errorResponse('Internal server error', 500, rateLimitInfo);
            }
        },
        { requireAdmin: true }
    );
}

/**
 * GET /api/v1/upload
 * Get all media files (admin only)
 */
export async function GET(request: NextRequest) {
    return withApiMiddleware(
        request,
        async (req, rateLimitInfo) => {
            try {
                const supabase = await createClient();
                const url = new URL(req.url);
                const folder = url.searchParams.get('folder');
                const limit = parseInt(url.searchParams.get('limit') || '50', 10);
                const offset = parseInt(url.searchParams.get('offset') || '0', 10);

                let query = supabase
                    .from('media_files')
                    .select('*', { count: 'exact' })
                    .order('created_at', { ascending: false })
                    .range(offset, offset + limit - 1);

                if (folder) {
                    query = query.eq('folder', folder);
                }

                const { data, error, count } = await query;

                if (error) {
                    return errorResponse(error.message, 400, rateLimitInfo);
                }

                return successResponse({ files: data, total: count }, 200, rateLimitInfo);
            } catch (err) {
                console.error('Error fetching media files:', err);
                return errorResponse('Internal server error', 500, rateLimitInfo);
            }
        },
        { requireAdmin: true }
    );
}
