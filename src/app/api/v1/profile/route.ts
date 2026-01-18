import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
    successResponse,
    errorResponse,
    withApiMiddleware,
} from '@/lib/api';

/**
 * GET /api/v1/profile
 * Get the profile information (public)
 */
export async function GET(request: NextRequest) {
    return withApiMiddleware(request, async (req, rateLimitInfo) => {
        try {
            const supabase = await createClient();

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, error } = await (supabase as any)
                .from('profile')
                .select('*')
                .limit(1)
                .maybeSingle();

            if (error) {
                return errorResponse('Profile not found', 404, rateLimitInfo);
            }

            return successResponse(data, 200, rateLimitInfo);
        } catch (err) {
            console.error('Error fetching profile:', err);
            return errorResponse('Internal server error', 500, rateLimitInfo);
        }
    });
}

/**
 * PUT /api/v1/profile
 * Update the profile information (admin only)
 */
export async function PUT(request: NextRequest) {
    return withApiMiddleware(
        request,
        async (req, rateLimitInfo) => {
            try {
                const supabase = await createClient();
                const body = await req.json();

                // Get existing profile ID
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const { data: existingProfile } = await (supabase as any)
                    .from('profile')
                    .select('id')
                    .limit(1)
                    .maybeSingle();

                if (!existingProfile) {
                    // Create new profile if doesn't exist
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const { data, error } = await (supabase as any)
                        .from('profile')
                        .insert(body)
                        .select();

                    if (error) {
                        console.error('Profile insert error:', error);
                        return errorResponse(error.message, 400, rateLimitInfo);
                    }
                    return successResponse(data?.[0] || data, 201, rateLimitInfo);
                }

                // Update existing profile
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const { data, error } = await (supabase as any)
                    .from('profile')
                    .update(body)
                    .eq('id', existingProfile.id)
                    .select();

                if (error) {
                    console.error('Profile update error:', error);
                    return errorResponse(error.message, 400, rateLimitInfo);
                }

                return successResponse(data?.[0] || data, 200, rateLimitInfo);
            } catch (err) {
                console.error('Error updating profile:', err);
                return errorResponse('Internal server error', 500, rateLimitInfo);
            }
        },
        { requireAdmin: true }
    );
}
