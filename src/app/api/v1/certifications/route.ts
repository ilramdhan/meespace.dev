import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
    successResponse,
    errorResponse,
    withApiMiddleware,
} from '@/lib/api';

/**
 * GET /api/v1/certifications
 * Get all certifications (public: active only)
 */
export async function GET(request: NextRequest) {
    return withApiMiddleware(request, async (req, rateLimitInfo) => {
        try {
            const supabase = await createClient();
            const url = new URL(req.url);
            const isAdmin = url.searchParams.get('admin') === 'true';

            let query = supabase
                .from('certifications')
                .select('*')
                .order('issue_date', { ascending: false, nullsFirst: true });

            if (!isAdmin) {
                query = query.eq('is_active', true);
            }

            const { data, error } = await query;

            if (error) {
                return errorResponse(error.message, 400, rateLimitInfo);
            }

            return successResponse({ certifications: data }, 200, rateLimitInfo);
        } catch (err) {
            console.error('Error fetching certifications:', err);
            return errorResponse('Internal server error', 500, rateLimitInfo);
        }
    });
}

/**
 * POST /api/v1/certifications
 * Create a new certification (admin only)
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
                    .from('certifications')
                    .insert(body)
                    .select()
                    .single();

                if (error) {
                    return errorResponse(error.message, 400, rateLimitInfo);
                }

                return successResponse(data, 201, rateLimitInfo);
            } catch (err) {
                console.error('Error creating certification:', err);
                return errorResponse('Internal server error', 500, rateLimitInfo);
            }
        },
        { requireAdmin: true }
    );
}

/**
 * PUT /api/v1/certifications?id=<id>
 * Update a certification (admin only)
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
                    .from('certifications')
                    .update(body)
                    .eq('id', id)
                    .select()
                    .single();

                if (error) {
                    return errorResponse(error.message, 400, rateLimitInfo);
                }

                return successResponse(data, 200, rateLimitInfo);
            } catch (err) {
                console.error('Error updating certification:', err);
                return errorResponse('Internal server error', 500, rateLimitInfo);
            }
        },
        { requireAdmin: true }
    );
}

/**
 * DELETE /api/v1/certifications?id=<id>
 * Delete a certification (admin only)
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
                    .from('certifications')
                    .delete()
                    .eq('id', id);

                if (error) {
                    return errorResponse(error.message, 400, rateLimitInfo);
                }

                return successResponse({ message: 'Certification deleted successfully' }, 200, rateLimitInfo);
            } catch (err) {
                console.error('Error deleting certification:', err);
                return errorResponse('Internal server error', 500, rateLimitInfo);
            }
        },
        { requireAdmin: true }
    );
}
