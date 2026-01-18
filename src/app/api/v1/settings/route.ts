import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
    successResponse,
    errorResponse,
    withApiMiddleware,
} from '@/lib/api';

/**
 * GET /api/v1/settings
 * Get the site settings (public)
 */
export async function GET(request: NextRequest) {
    return withApiMiddleware(request, async (req, rateLimitInfo) => {
        try {
            const supabase = await createClient();

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, error } = await (supabase as any)
                .from('site_settings')
                .select('*')
                .limit(1)
                .maybeSingle();

            if (error || !data) {
                // Return default settings if none exist
                return successResponse({
                    site_name: 'Portfolio',
                    site_tagline: '',
                    seo_title: '',
                    seo_description: '',
                }, 200, rateLimitInfo);
            }

            return successResponse(data, 200, rateLimitInfo);
        } catch (err) {
            console.error('Error fetching settings:', err);
            return errorResponse('Internal server error', 500, rateLimitInfo);
        }
    });
}

/**
 * PUT /api/v1/settings
 * Update the site settings (admin only)
 */
export async function PUT(request: NextRequest) {
    return withApiMiddleware(
        request,
        async (req, rateLimitInfo) => {
            try {
                const supabase = await createClient();
                const body = await req.json();

                // Get existing settings ID
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const { data: existingSettings } = await (supabase as any)
                    .from('site_settings')
                    .select('id')
                    .limit(1)
                    .maybeSingle();

                if (!existingSettings) {
                    // Create new settings if doesn't exist
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const { data, error } = await (supabase as any)
                        .from('site_settings')
                        .insert(body)
                        .select();

                    if (error) {
                        console.error('Settings insert error:', error);
                        return errorResponse(error.message, 400, rateLimitInfo);
                    }
                    return successResponse(data?.[0] || data, 201, rateLimitInfo);
                }

                // Update existing settings
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const { data, error } = await (supabase as any)
                    .from('site_settings')
                    .update(body)
                    .eq('id', existingSettings.id)
                    .select();

                if (error) {
                    console.error('Settings update error:', error);
                    return errorResponse(error.message, 400, rateLimitInfo);
                }

                return successResponse(data?.[0] || data, 200, rateLimitInfo);
            } catch (err) {
                console.error('Error updating settings:', err);
                return errorResponse('Internal server error', 500, rateLimitInfo);
            }
        },
        { requireAdmin: true }
    );
}
