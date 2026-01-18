import { NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

// Rate limiting store (in-memory, consider Redis for production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = parseInt(process.env.API_RATE_LIMIT || '60', 10);
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    return forwarded?.split(',')[0] || realIP || 'unknown';
}

/**
 * Check rate limit for a given IP
 * Returns true if request should be allowed, false if rate limited
 */
export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const record = rateLimitStore.get(ip);

    if (!record || now > record.resetTime) {
        // Reset or create new record
        rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return { allowed: true, remaining: RATE_LIMIT - 1, resetTime: now + RATE_LIMIT_WINDOW };
    }

    if (record.count >= RATE_LIMIT) {
        return { allowed: false, remaining: 0, resetTime: record.resetTime };
    }

    record.count++;
    return { allowed: true, remaining: RATE_LIMIT - record.count, resetTime: record.resetTime };
}

/**
 * Add security headers to response
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    return response;
}

/**
 * Add rate limit headers to response
 */
export function addRateLimitHeaders(
    response: NextResponse,
    remaining: number,
    resetTime: number
): NextResponse {
    response.headers.set('X-RateLimit-Limit', RATE_LIMIT.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', Math.ceil(resetTime / 1000).toString());
    return response;
}

/**
 * Create a successful JSON response with security headers
 */
export function successResponse<T>(
    data: T,
    status: number = 200,
    rateLimitInfo?: { remaining: number; resetTime: number }
) {
    const response = NextResponse.json(
        { success: true, data },
        { status }
    );
    addSecurityHeaders(response);
    if (rateLimitInfo) {
        addRateLimitHeaders(response, rateLimitInfo.remaining, rateLimitInfo.resetTime);
    }
    return response;
}

/**
 * Create an error JSON response with security headers
 */
export function errorResponse(
    message: string,
    status: number = 400,
    rateLimitInfo?: { remaining: number; resetTime: number }
) {
    const response = NextResponse.json(
        { success: false, error: message },
        { status }
    );
    addSecurityHeaders(response);
    if (rateLimitInfo) {
        addRateLimitHeaders(response, rateLimitInfo.remaining, rateLimitInfo.resetTime);
    }
    return response;
}

/**
 * Rate limit error response
 */
export function rateLimitedResponse(resetTime: number) {
    const response = NextResponse.json(
        {
            success: false,
            error: 'Too many requests. Please try again later.',
        },
        { status: 429 }
    );
    addSecurityHeaders(response);
    addRateLimitHeaders(response, 0, resetTime);
    return response;
}

/**
 * Unauthorized error response
 */
export function unauthorizedResponse(): NextResponse {
    return errorResponse('Unauthorized. Please login to access this resource.', 401);
}

/**
 * Forbidden error response
 */
export function forbiddenResponse(): NextResponse {
    return errorResponse('Forbidden. You do not have permission to access this resource.', 403);
}

/**
 * Check if the current user is an admin
 * Returns the user if admin, null otherwise
 */
export async function checkIsAdmin() {
    const supabase = await createClient();

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return null;
    }

    // Check if user exists in admin_users table
    const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', user.id)
        .eq('is_active', true)
        .single();

    if (adminError || !adminUser) {
        return null;
    }

    return { user, adminUser };
}

/**
 * Middleware wrapper for API routes that handles rate limiting and auth
 */
export async function withApiMiddleware(
    request: Request,
    handler: (request: Request, rateLimitInfo: { remaining: number; resetTime: number }) => Promise<NextResponse>,
    options: { requireAuth?: boolean; requireAdmin?: boolean } = {}
): Promise<NextResponse> {
    // Check rate limit
    const ip = getClientIP(request);
    const rateLimit = checkRateLimit(ip);

    if (!rateLimit.allowed) {
        return rateLimitedResponse(rateLimit.resetTime);
    }

    // Check authentication if required
    if (options.requireAuth || options.requireAdmin) {
        const authResult = await checkIsAdmin();

        if (!authResult) {
            return unauthorizedResponse();
        }

        // For admin routes, the auth check above already verifies admin status
    }

    return handler(request, { remaining: rateLimit.remaining, resetTime: rateLimit.resetTime });
}

/**
 * Generate a slug from a string
 */
export function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

/**
 * Get or create a category/tag by name (auto-create feature)
 */
export async function getOrCreateTag(
    tableName: 'project_tags' | 'blog_tags' | 'blog_categories',
    name: string,
    color: string = 'blue'
) {
    const supabase = await createAdminClient();
    const slug = generateSlug(name);

    // Try to find existing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existing } = await (supabase as any)
        .from(tableName)
        .select('*')
        .eq('slug', slug)
        .single();

    if (existing) {
        return existing;
    }

    // Create new
    const insertData: Record<string, unknown> = { name, slug };
    if (tableName !== 'blog_tags') {
        insertData.color = color;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: created, error } = await (supabase as any)
        .from(tableName)
        .insert(insertData)
        .select()
        .single();

    if (error) {
        throw new Error(`Failed to create ${tableName}: ${error.message}`);
    }

    return created;
}
