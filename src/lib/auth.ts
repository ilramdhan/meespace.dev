import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

/**
 * Checks if the current user is authenticated and is an admin.
 * Redirects to login if not authenticated or not an admin.
 * Should be called at the top of server components in protected routes.
 */
export async function requireAdmin() {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect('/admin/login');
    }

    // Check if user is in admin_users table
    const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('id, email, full_name, role, is_active')
        .eq('id', user.id)
        .eq('is_active', true)
        .single();

    if (adminError || !adminUser) {
        // Sign out the user since they're not an admin
        await supabase.auth.signOut();
        redirect('/admin/login?error=not_admin');
    }

    return {
        user,
        adminUser
    };
}

/**
 * Gets the current authenticated user without redirecting.
 * Returns null if not authenticated.
 */
export async function getAuthUser() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

/**
 * Gets the current admin user data.
 * Returns null if not authenticated or not an admin.
 */
export async function getAdminUser() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: adminUser } = await supabase
        .from('admin_users')
        .select('id, email, full_name, role, is_active')
        .eq('id', user.id)
        .eq('is_active', true)
        .single();

    return adminUser;
}
