import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
    successResponse,
    errorResponse,
    withApiMiddleware,
    generateSlug,
    getOrCreateTag,
} from '@/lib/api';

interface RouteContext {
    params: Promise<{ slug: string }>;
}

/**
 * GET /api/v1/blog/[slug]
 * Get a single blog post by slug with comments
 */
export async function GET(request: NextRequest, context: RouteContext) {
    return withApiMiddleware(request, async (req, rateLimitInfo) => {
        try {
            const { slug } = await context.params;
            const supabase = await createClient();
            const url = new URL(req.url);
            const isAdmin = url.searchParams.get('admin') === 'true';

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let query = (supabase as any)
                .from('blog_posts')
                .select(`
                    *,
                    blog_categories (*),
                    blog_post_tags (
                        blog_tags (*)
                    )
                `)
                .eq('slug', slug);

            if (!isAdmin) {
                query = query.eq('status', 'published');
            }

            const { data: post, error } = await query.single();

            if (error || !post) {
                return errorResponse('Blog post not found', 404, rateLimitInfo);
            }

            // Increment view count for published posts
            if (post.status === 'published') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await (supabase as any)
                    .from('blog_posts')
                    .update({ view_count: (post.view_count || 0) + 1 })
                    .eq('id', post.id);
            }

            // Fetch comments (approved only for public, all for admin)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let commentsQuery = (supabase as any)
                .from('blog_comments')
                .select('*')
                .eq('post_id', post.id)
                .order('created_at', { ascending: true });

            if (!isAdmin) {
                commentsQuery = commentsQuery.eq('is_approved', true);
            }

            const { data: comments } = await commentsQuery;

            // Build nested comments structure
            const nestedComments = buildNestedComments(comments || []);

            // Transform nested relations
            const transformedPost = {
                ...post,
                category: post.blog_categories,
                tags: post.blog_post_tags?.map((rel: { blog_tags: unknown }) => rel.blog_tags) || [],
                comments: nestedComments,
                blog_categories: undefined,
                blog_post_tags: undefined,
            };

            return successResponse(transformedPost, 200, rateLimitInfo);
        } catch (err) {
            console.error('Error fetching blog post:', err);
            return errorResponse('Internal server error', 500, rateLimitInfo);
        }
    });
}

/**
 * Build nested comments structure from flat list
 */
interface Comment {
    id: string;
    parent_comment_id: string | null;
    depth: number;
    [key: string]: unknown;
}

interface NestedComment extends Comment {
    replies: NestedComment[];
}

function buildNestedComments(comments: Comment[]): NestedComment[] {
    const commentMap = new Map<string, NestedComment>();
    const rootComments: NestedComment[] = [];

    // First pass: create map of all comments
    for (const comment of comments) {
        commentMap.set(comment.id, { ...comment, replies: [] });
    }

    // Second pass: build tree structure
    for (const comment of comments) {
        const nestedComment = commentMap.get(comment.id)!;
        if (comment.parent_comment_id) {
            const parent = commentMap.get(comment.parent_comment_id);
            if (parent) {
                parent.replies.push(nestedComment);
            } else {
                // Parent not found, treat as root
                rootComments.push(nestedComment);
            }
        } else {
            rootComments.push(nestedComment);
        }
    }

    return rootComments;
}

/**
 * PUT /api/v1/blog/[slug]
 * Update a blog post (admin only)
 */
export async function PUT(request: NextRequest, context: RouteContext) {
    return withApiMiddleware(
        request,
        async (req, rateLimitInfo) => {
            try {
                const { slug } = await context.params;
                const supabase = await createClient();
                const body = await req.json();

                // Extract related data
                const { tags, categoryName, ...postData } = body;

                // Get existing post
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const { data: existingPost } = await (supabase as any)
                    .from('blog_posts')
                    .select('id, status, published_at')
                    .eq('slug', slug)
                    .single();

                if (!existingPost) {
                    return errorResponse('Blog post not found', 404, rateLimitInfo);
                }

                // Update slug if title changed
                if (postData.title && !postData.slug) {
                    postData.slug = generateSlug(postData.title);
                }

                // Auto-create category if categoryName provided
                if (categoryName) {
                    const category = await getOrCreateTag('blog_categories', categoryName);
                    postData.category_id = category.id;
                }

                // Set published_at if transitioning to published
                if (postData.status === 'published' && existingPost.status !== 'published' && !postData.published_at) {
                    postData.published_at = new Date().toISOString();
                }

                // Update post
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const { data: post, error: postError } = await (supabase as any)
                    .from('blog_posts')
                    .update(postData)
                    .eq('id', existingPost.id)
                    .select()
                    .single();

                if (postError) {
                    return errorResponse(postError.message, 400, rateLimitInfo);
                }

                // Update tags if provided
                if (tags && Array.isArray(tags)) {
                    // Remove existing tags
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    await (supabase as any)
                        .from('blog_post_tags')
                        .delete()
                        .eq('post_id', post.id);

                    // Add new tags
                    for (const tagName of tags) {
                        const tag = await getOrCreateTag('blog_tags', tagName);
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        await (supabase as any).from('blog_post_tags').insert({
                            post_id: post.id,
                            tag_id: tag.id,
                        });
                    }
                }

                return successResponse(post, 200, rateLimitInfo);
            } catch (err) {
                console.error('Error updating blog post:', err);
                return errorResponse('Internal server error', 500, rateLimitInfo);
            }
        },
        { requireAdmin: true }
    );
}

/**
 * DELETE /api/v1/blog/[slug]
 * Delete a blog post (admin only)
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
    return withApiMiddleware(
        request,
        async (req, rateLimitInfo) => {
            try {
                const { slug } = await context.params;
                const supabase = await createClient();

                const { error } = await supabase
                    .from('blog_posts')
                    .delete()
                    .eq('slug', slug);

                if (error) {
                    return errorResponse(error.message, 400, rateLimitInfo);
                }

                return successResponse({ message: 'Blog post deleted successfully' }, 200, rateLimitInfo);
            } catch (err) {
                console.error('Error deleting blog post:', err);
                return errorResponse('Internal server error', 500, rateLimitInfo);
            }
        },
        { requireAdmin: true }
    );
}
