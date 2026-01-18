import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
    successResponse,
    errorResponse,
    withApiMiddleware,
} from '@/lib/api';

/**
 * GET /api/v1/experiences
 * Get all experience records (public: active only)
 */
export async function GET(request: NextRequest) {
    return withApiMiddleware(request, async (req, rateLimitInfo) => {
        try {
            const supabase = await createClient();
            const url = new URL(req.url);
            const isAdmin = url.searchParams.get('admin') === 'true';

            let query = supabase
                .from('experiences')
                .select('*')
                .order('start_date', { ascending: false });

            if (!isAdmin) {
                query = query.eq('is_active', true);
            }

            const { data, error } = await query;

            if (error) {
                return errorResponse(error.message, 400, rateLimitInfo);
            }

            return successResponse({ experiences: data }, 200, rateLimitInfo);
        } catch (err) {
            console.error('Error fetching experiences:', err);
            return errorResponse('Internal server error', 500, rateLimitInfo);
        }
    });
}

/**
 * POST /api/v1/experiences
 * Create a new experience (admin only)
 */
export async function POST(request: NextRequest) {
    return withApiMiddleware(
        request,
        async (req, rateLimitInfo) => {
            try {
                const supabase = await createClient();
                const body = await req.json();

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const { data, error } = await (supabase as any)
                    .from('experiences')
                    .insert(body)
                    .select()
                    .single();

                if (error) {
                    return errorResponse(error.message, 400, rateLimitInfo);
                }

                return successResponse(data, 201, rateLimitInfo);
            } catch (err) {
                console.error('Error creating experience:', err);
                return errorResponse('Internal server error', 500, rateLimitInfo);
            }
        },
        { requireAdmin: true }
    );
}

/**
 * PUT /api/v1/experiences?id=<id>
 * Update an experience (admin only)
 */
export async function PUT(request: NextRequest) {
    return withApiMiddleware(
        request,
        async (req, rateLimitInfo) => {
            try {
                const supabase = await createClient();
                const url = new URL(req.url);
                const id = url.searchParams.get('id');

                if (!id) {
                    return errorResponse('ID is required', 400, rateLimitInfo);
                }

                const body = await req.json();

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const { data, error } = await (supabase as any)
                    .from('experiences')
                    .update(body)
                    .eq('id', id)
                    .select()
                    .single();

                if (error) {
                    return errorResponse(error.message, 400, rateLimitInfo);
                }

                return successResponse(data, 200, rateLimitInfo);
            } catch (err) {
                console.error('Error updating experience:', err);
                return errorResponse('Internal server error', 500, rateLimitInfo);
            }
        },
        { requireAdmin: true }
    );
}

/**
 * DELETE /api/v1/experiences?id=<id>
 * Delete an experience (admin only)
 */
export async function DELETE(request: NextRequest) {
    return withApiMiddleware(
        request,
        async (req, rateLimitInfo) => {
            try {
                const supabase = await createClient();
                const url = new URL(req.url);
                const id = url.searchParams.get('id');

                if (!id) {
                    return errorResponse('ID is required', 400, rateLimitInfo);
                }

                const { error } = await supabase
                    .from('experiences')
                    .delete()
                    .eq('id', id);

                if (error) {
                    return errorResponse(error.message, 400, rateLimitInfo);
                }

                return successResponse({ message: 'Experience deleted successfully' }, 200, rateLimitInfo);
            } catch (err) {
                console.error('Error deleting experience:', err);
                return errorResponse('Internal server error', 500, rateLimitInfo);
            }
        },
        { requireAdmin: true }
    );
}
