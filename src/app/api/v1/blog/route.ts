import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
    successResponse,
    errorResponse,
    withApiMiddleware,
    generateSlug,
    getOrCreateTag,
} from '@/lib/api';

/**
 * GET /api/v1/blog
 * Get all published blog posts (public) or all posts (admin)
 */
export async function GET(request: NextRequest) {
    return withApiMiddleware(request, async (req, rateLimitInfo) => {
        try {
            const supabase = await createClient();
            const url = new URL(req.url);
            const isAdmin = url.searchParams.get('admin') === 'true';
            const category = url.searchParams.get('category');
            const featured = url.searchParams.get('featured') === 'true';
            const limit = parseInt(url.searchParams.get('limit') || '50', 10);
            const offset = parseInt(url.searchParams.get('offset') || '0', 10);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let query = (supabase as any)
                .from('blog_posts')
                .select(`
                    *,
                    blog_categories (*),
                    blog_post_tags (
                        blog_tags (*)
                    )
                `, { count: 'exact' })
                .order('published_at', { ascending: false, nullsFirst: false })
                .range(offset, offset + limit - 1);

            // Public users can only see published posts
            if (!isAdmin) {
                query = query.eq('status', 'published');
            }

            if (category) {
                query = query.eq('blog_categories.slug', category);
            }

            if (featured) {
                query = query.eq('is_featured', true);
            }

            const { data, error, count } = await query;

            if (error) {
                return errorResponse(error.message, 400, rateLimitInfo);
            }

            // Transform nested relations
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const transformedData = data?.map((post: any) => ({
                ...post,
                category: post.blog_categories,
                tags: post.blog_post_tags?.map((rel: { blog_tags: unknown }) => rel.blog_tags) || [],
                blog_categories: undefined,
                blog_post_tags: undefined,
            }));

            return successResponse({ posts: transformedData, total: count }, 200, rateLimitInfo);
        } catch (err) {
            console.error('Error fetching blog posts:', err);
            return errorResponse('Internal server error', 500, rateLimitInfo);
        }
    });
}

/**
 * POST /api/v1/blog
 * Create a new blog post (admin only)
 */
export async function POST(request: NextRequest) {
    return withApiMiddleware(
        request,
        async (req, rateLimitInfo) => {
            try {
                const supabase = await createClient();
                const body = await req.json();

                // Extract related data
                const { tags, categoryName, ...postData } = body;

                // Generate slug if not provided
                if (!postData.slug) {
                    postData.slug = generateSlug(postData.title);
                }

                // Auto-create category if categoryName provided
                if (categoryName && !postData.category_id) {
                    const category = await getOrCreateTag('blog_categories', categoryName);
                    postData.category_id = category.id;
                }

                // Set published_at if publishing
                if (postData.status === 'published' && !postData.published_at) {
                    postData.published_at = new Date().toISOString();
                }

                // Create the post
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const { data: post, error: postError } = await (supabase as any)
                    .from('blog_posts')
                    .insert(postData)
                    .select()
                    .single();

                if (postError) {
                    return errorResponse(postError.message, 400, rateLimitInfo);
                }

                // Handle tags (auto-create if needed)
                if (tags && Array.isArray(tags) && tags.length > 0) {
                    for (const tagName of tags) {
                        const tag = await getOrCreateTag('blog_tags', tagName);
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        await (supabase as any).from('blog_post_tags').insert({
                            post_id: post.id,
                            tag_id: tag.id,
                        });
                    }
                }

                return successResponse(post, 201, rateLimitInfo);
            } catch (err) {
                console.error('Error creating blog post:', err);
                return errorResponse('Internal server error', 500, rateLimitInfo);
            }
        },
        { requireAdmin: true }
    );
}
