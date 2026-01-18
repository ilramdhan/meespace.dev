import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse, withApiMiddleware } from '@/lib/api';

/**
 * POST /api/v1/auth/signout
 * Sign out the current user
 */
export async function POST(request: NextRequest) {
    return withApiMiddleware(request, async (req, rateLimitInfo) => {
        try {
            const supabase = await createClient();

            const { error } = await supabase.auth.signOut();

            if (error) {
                return errorResponse(error.message, 400, rateLimitInfo);
            }

            return successResponse({ message: 'Signed out successfully' }, 200, rateLimitInfo);
        } catch (err) {
            console.error('Error signing out:', err);
            return errorResponse('Internal server error', 500, rateLimitInfo);
        }
    });
}
