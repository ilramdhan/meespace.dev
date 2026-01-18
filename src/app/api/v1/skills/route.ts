import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
    successResponse,
    errorResponse,
    withApiMiddleware,
} from '@/lib/api';

/**
 * GET /api/v1/skills
 * Get all skills (public: active only)
 */
export async function GET(request: NextRequest) {
    return withApiMiddleware(request, async (req, rateLimitInfo) => {
        try {
            const supabase = await createClient();
            const url = new URL(req.url);
            const isAdmin = url.searchParams.get('admin') === 'true';

            let query = supabase
                .from('skills')
                .select('*')
                .order('display_order', { ascending: true });

            if (!isAdmin) {
                query = query.eq('is_active', true);
            }

            const { data, error } = await query;

            if (error) {
                return errorResponse(error.message, 400, rateLimitInfo);
            }

            return successResponse({ skills: data }, 200, rateLimitInfo);
        } catch (err) {
            console.error('Error fetching skills:', err);
            return errorResponse('Internal server error', 500, rateLimitInfo);
        }
    });
}

/**
 * POST /api/v1/skills
 * Create a new skill (admin only)
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
                    .from('skills')
                    .insert(body)
                    .select()
                    .single();

                if (error) {
                    return errorResponse(error.message, 400, rateLimitInfo);
                }

                return successResponse(data, 201, rateLimitInfo);
            } catch (err) {
                console.error('Error creating skill:', err);
                return errorResponse('Internal server error', 500, rateLimitInfo);
            }
        },
        { requireAdmin: true }
    );
}

/**
 * PUT /api/v1/skills?id=<id>
 * Update a skill (admin only)
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
                    .from('skills')
                    .update(body)
                    .eq('id', id)
                    .select()
                    .single();

                if (error) {
                    return errorResponse(error.message, 400, rateLimitInfo);
                }

                return successResponse(data, 200, rateLimitInfo);
            } catch (err) {
                console.error('Error updating skill:', err);
                return errorResponse('Internal server error', 500, rateLimitInfo);
            }
        },
        { requireAdmin: true }
    );
}

/**
 * DELETE /api/v1/skills?id=<id>
 * Delete a skill (admin only)
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
                    .from('skills')
                    .delete()
                    .eq('id', id);

                if (error) {
                    return errorResponse(error.message, 400, rateLimitInfo);
                }

                return successResponse({ message: 'Skill deleted successfully' }, 200, rateLimitInfo);
            } catch (err) {
                console.error('Error deleting skill:', err);
                return errorResponse('Internal server error', 500, rateLimitInfo);
            }
        },
        { requireAdmin: true }
    );
}
