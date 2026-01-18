import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

/**
 * GET /api/v1/auth/callback
 * Handles OAuth callback from Supabase Auth (Google)
 */
export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const next = requestUrl.searchParams.get('next') || '/admin/dashboard';

    if (code) {
        const supabase = await createClient();

        // Exchange code for session
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // Check if user is in admin_users table
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data: adminUser } = await supabase
                    .from('admin_users')
                    .select('*')
                    .eq('id', user.id)
                    .eq('is_active', true)
                    .single();

                if (adminUser) {
                    // Update last login
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    await (supabase as any)
                        .from('admin_users')
                        .update({ last_login_at: new Date().toISOString() })
                        .eq('id', user.id);

                    // Redirect to dashboard
                    return NextResponse.redirect(new URL(next, requestUrl.origin));
                } else {
                    // User is not an admin - sign them out
                    await supabase.auth.signOut();
                    return NextResponse.redirect(
                        new URL('/admin/login?error=not_admin', requestUrl.origin)
                    );
                }
            }
        }
    }

    // Something went wrong
    return NextResponse.redirect(
        new URL('/admin/login?error=callback_failed', requestUrl.origin)
    );
}
