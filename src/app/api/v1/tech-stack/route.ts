import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
    successResponse,
    errorResponse,
    withApiMiddleware,
} from '@/lib/api';

/**
 * GET /api/v1/tech-stack
 * Get all tech stack items (public: active only)
 */
export async function GET(request: NextRequest) {
    return withApiMiddleware(request, async (req, rateLimitInfo) => {
        try {
            const supabase = await createClient();
            const url = new URL(req.url);
            const isAdmin = url.searchParams.get('admin') === 'true';
            const category = url.searchParams.get('category');

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let query = (supabase as any)
                .from('tech_stack')
                .select('*')
                .order('display_order', { ascending: true });

            if (!isAdmin) {
                query = query.eq('is_active', true);
            }

            if (category) {
                query = query.eq('category', category);
            }

            const { data, error } = await query;

            if (error) {
                return errorResponse(error.message, 400, rateLimitInfo);
            }

            // Group by category for easier frontend consumption
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const grouped = data?.reduce((acc: Record<string, any[]>, item: any) => {
                const cat = item.category || 'Other';
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(item);
                return acc;
            }, {});

            return successResponse({ techStack: data, grouped }, 200, rateLimitInfo);
        } catch (err) {
            console.error('Error fetching tech stack:', err);
            return errorResponse('Internal server error', 500, rateLimitInfo);
        }
    });
}

/**
 * POST /api/v1/tech-stack
 * Create a new tech stack item (admin only)
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
                    .from('tech_stack')
                    .insert(body)
                    .select()
                    .single();

                if (error) {
                    return errorResponse(error.message, 400, rateLimitInfo);
                }

                return successResponse(data, 201, rateLimitInfo);
            } catch (err) {
                console.error('Error creating tech stack:', err);
                return errorResponse('Internal server error', 500, rateLimitInfo);
            }
        },
        { requireAdmin: true }
    );
}

/**
 * PUT /api/v1/tech-stack?id=<id>
 * Update a tech stack item (admin only)
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
                    .from('tech_stack')
                    .update(body)
                    .eq('id', id)
                    .select()
                    .single();

                if (error) {
                    return errorResponse(error.message, 400, rateLimitInfo);
                }

                return successResponse(data, 200, rateLimitInfo);
            } catch (err) {
                console.error('Error updating tech stack:', err);
                return errorResponse('Internal server error', 500, rateLimitInfo);
            }
        },
        { requireAdmin: true }
    );
}

/**
 * DELETE /api/v1/tech-stack?id=<id>
 * Delete a tech stack item (admin only)
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
                    .from('tech_stack')
                    .delete()
                    .eq('id', id);

                if (error) {
                    return errorResponse(error.message, 400, rateLimitInfo);
                }

                return successResponse({ message: 'Tech stack item deleted successfully' }, 200, rateLimitInfo);
            } catch (err) {
                console.error('Error deleting tech stack:', err);
                return errorResponse('Internal server error', 500, rateLimitInfo);
            }
        },
        { requireAdmin: true }
    );
}
