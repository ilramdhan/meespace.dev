import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
    successResponse,
    errorResponse,
    withApiMiddleware,
} from '@/lib/api';

interface RouteContext {
    params: Promise<{ slug: string }>;
}

/**
 * GET /api/v1/blog/[slug]/comments
 * Get all comments for a blog post (nested structure)
 */
export async function GET(request: NextRequest, context: RouteContext) {
    return withApiMiddleware(request, async (req, rateLimitInfo) => {
        try {
            const { slug } = await context.params;
            const supabase = await createClient();
            const url = new URL(req.url);
            const isAdmin = url.searchParams.get('admin') === 'true';

            // Get post ID from slug
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: post } = await (supabase as any)
                .from('blog_posts')
                .select('id')
                .eq('slug', slug)
                .single();

            if (!post) {
                return errorResponse('Blog post not found', 404, rateLimitInfo);
            }

            // Fetch comments
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let query = (supabase as any)
                .from('blog_comments')
                .select('*')
                .eq('post_id', post.id)
                .order('created_at', { ascending: true });

            if (!isAdmin) {
                query = query.eq('is_approved', true);
            }

            const { data: comments, error } = await query;

            if (error) {
                return errorResponse(error.message, 400, rateLimitInfo);
            }

            // Build nested structure
            const nestedComments = buildNestedComments(comments || []);

            return successResponse({ comments: nestedComments }, 200, rateLimitInfo);
        } catch (err) {
            console.error('Error fetching comments:', err);
            return errorResponse('Internal server error', 500, rateLimitInfo);
        }
    });
}

/**
 * POST /api/v1/blog/[slug]/comments
 * Create a new comment (public - pending approval, or admin - auto approved)
 */
export async function POST(request: NextRequest, context: RouteContext) {
    return withApiMiddleware(request, async (req, rateLimitInfo) => {
        try {
            const { slug } = await context.params;
            const supabase = await createClient();
            const body = await req.json();

            // Get post ID from slug
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: post } = await (supabase as any)
                .from('blog_posts')
                .select('id')
                .eq('slug', slug)
                .eq('status', 'published')
                .single();

            if (!post) {
                return errorResponse('Blog post not found', 404, rateLimitInfo);
            }

            // Calculate depth based on parent
            let depth = 0;
            if (body.parent_comment_id) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const { data: parent } = await (supabase as any)
                    .from('blog_comments')
                    .select('depth')
                    .eq('id', body.parent_comment_id)
                    .single();

                if (parent) {
                    depth = (parent.depth || 0) + 1;
                }
            }

            // Generate initials from author name
            const initials = body.author_name
                ?.split(' ')
                .map((n: string) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2) || '??';

            // Random color for initials
            const colors = ['blue', 'green', 'purple', 'orange', 'red', 'cyan'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];

            const commentData = {
                post_id: post.id,
                author_name: body.author_name,
                author_email: body.author_email,
                author_initials: initials,
                author_initials_color: randomColor,
                content: body.content,
                parent_comment_id: body.parent_comment_id || null,
                depth,
                is_approved: false, // Comments need approval by default
            };

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: comment, error } = await (supabase as any)
                .from('blog_comments')
                .insert(commentData)
                .select()
                .single();

            if (error) {
                return errorResponse(error.message, 400, rateLimitInfo);
            }

            return successResponse(comment, 201, rateLimitInfo);
        } catch (err) {
            console.error('Error creating comment:', err);
            return errorResponse('Internal server error', 500, rateLimitInfo);
        }
    });
}

// Helper: Build nested comments
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

    for (const comment of comments) {
        commentMap.set(comment.id, { ...comment, replies: [] });
    }

    for (const comment of comments) {
        const nestedComment = commentMap.get(comment.id)!;
        if (comment.parent_comment_id) {
            const parent = commentMap.get(comment.parent_comment_id);
            if (parent) {
                parent.replies.push(nestedComment);
            } else {
                rootComments.push(nestedComment);
            }
        } else {
            rootComments.push(nestedComment);
        }
    }

    return rootComments;
}
