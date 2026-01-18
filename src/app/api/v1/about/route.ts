import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
    successResponse,
    errorResponse,
    withApiMiddleware,
} from '@/lib/api';
import { AboutContent } from '@/types/database.types';

/**
 * GET /api/v1/about
 * Get all about page content sections (public: active only)
 */
export async function GET(request: NextRequest) {
    return withApiMiddleware(request, async (req, rateLimitInfo) => {
        try {
            const supabase = await createClient();
            const url = new URL(req.url);
            const isAdmin = url.searchParams.get('admin') === 'true';
            const sectionKey = url.searchParams.get('section');

            let query = supabase
                .from('about_content')
                .select('*')
                .order('display_order', { ascending: true });

            if (!isAdmin) {
                query = query.eq('is_active', true);
            }

            if (sectionKey) {
                query = query.eq('section_key', sectionKey);
            }

            const { data, error } = await query;

            if (error) {
                return errorResponse(error.message, 400, rateLimitInfo);
            }

            // Convert to object keyed by section_key for easier access
            const sections = data ? data.reduce((acc: Record<string, AboutContent>, item: AboutContent) => {
                acc[item.section_key] = item;
                return acc;
            }, {} as Record<string, AboutContent>) : {};

            return successResponse({ aboutContent: data, sections }, 200, rateLimitInfo);
        } catch (err) {
            console.error('Error fetching about content:', err);
            return errorResponse('Internal server error', 500, rateLimitInfo);
        }
    });
}

/**
 * POST /api/v1/about
 * Create a new about content section (admin only)
 */
export async function POST(request: NextRequest) {
    return withApiMiddleware(
        request,
        async (req, rateLimitInfo) => {
            try {
                const supabase = await createClient();
                const body = await req.json();

                const { data, error } = await supabase
                    .from('about_content')
                    .insert(body)
                    .select()
                    .single();

                if (error) {
                    return errorResponse(error.message, 400, rateLimitInfo);
                }

                return successResponse(data, 201, rateLimitInfo);
            } catch (err) {
                console.error('Error creating about content:', err);
                return errorResponse('Internal server error', 500, rateLimitInfo);
            }
        },
        { requireAdmin: true }
    );
}

/**
 * PUT /api/v1/about?section=<section_key>
 * Update an about content section by section_key (admin only)
 */
export async function PUT(request: NextRequest) {
    return withApiMiddleware(
        request,
        async (req, rateLimitInfo) => {
            try {
                const supabase = await createClient();
                const url = new URL(req.url);
                const sectionKey = url.searchParams.get('section');

                if (!sectionKey) {
                    return errorResponse('Section key is required', 400, rateLimitInfo);
                }

                const body = await req.json();

                // Check if section exists
                const { data: existing } = await supabase
                    .from('about_content')
                    .select('id')
                    .eq('section_key', sectionKey)
                    .single();

                if (!existing) {
                    // Create if doesn't exist
                    const { data, error } = await supabase
                        .from('about_content')
                        .insert({ ...body, section_key: sectionKey })
                        .select()
                        .single();

                    if (error) {
                        return errorResponse(error.message, 400, rateLimitInfo);
                    }

                    return successResponse(data, 201, rateLimitInfo);
                }

                // Update existing
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const { data, error } = await (supabase as any)
                    .from('about_content')
                    .update(body)
                    .eq('section_key', sectionKey)
                    .select()
                    .single();

                if (error) {
                    return errorResponse(error.message, 400, rateLimitInfo);
                }

                return successResponse(data, 200, rateLimitInfo);
            } catch (err) {
                console.error('Error updating about content:', err);
                return errorResponse('Internal server error', 500, rateLimitInfo);
            }
        },
        { requireAdmin: true }
    );
}

/**
 * DELETE /api/v1/about?section=<section_key>
 * Delete an about content section (admin only)
 */
export async function DELETE(request: NextRequest) {
    return withApiMiddleware(
        request,
        async (req, rateLimitInfo) => {
            try {
                const supabase = await createClient();
                const url = new URL(req.url);
                const sectionKey = url.searchParams.get('section');

                if (!sectionKey) {
                    return errorResponse('Section key is required', 400, rateLimitInfo);
                }

                const { error } = await supabase
                    .from('about_content')
                    .delete()
                    .eq('section_key', sectionKey);

                if (error) {
                    return errorResponse(error.message, 400, rateLimitInfo);
                }

                return successResponse({ message: 'About content deleted successfully' }, 200, rateLimitInfo);
            } catch (err) {
                console.error('Error deleting about content:', err);
                return errorResponse('Internal server error', 500, rateLimitInfo);
            }
        },
        { requireAdmin: true }
    );
}
