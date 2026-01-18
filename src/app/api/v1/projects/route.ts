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
 * GET /api/v1/projects
 * Get all published projects (public) or all projects (admin)
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
                .from('projects')
                .select(`
                    *,
                    project_tag_relations (
                        project_tags (*)
                    ),
                    project_deliverables (*),
                    project_outcomes (*),
                    project_tech_stack (
                        tech_stack (*)
                    )
                `)
                .order('display_order', { ascending: true })
                .range(offset, offset + limit - 1);

            // Public users can only see published projects
            if (!isAdmin) {
                query = query.eq('status', 'published');
            }

            if (category) {
                query = query.eq('category', category);
            }

            if (featured) {
                query = query.eq('is_featured', true);
            }

            const { data, error, count } = await query;

            if (error) {
                return errorResponse(error.message, 400, rateLimitInfo);
            }

            // Transform nested relations for cleaner response
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const transformedData = data?.map((project: any) => ({
                ...project,
                tags: project.project_tag_relations?.map((rel: { project_tags: unknown }) => rel.project_tags) || [],
                deliverables: project.project_deliverables || [],
                outcomes: project.project_outcomes || [],
                techStack: project.project_tech_stack?.map((rel: { tech_stack: unknown }) => rel.tech_stack) || [],
                project_tag_relations: undefined,
                project_deliverables: undefined,
                project_outcomes: undefined,
                project_tech_stack: undefined,
            }));

            return successResponse({ projects: transformedData, total: count }, 200, rateLimitInfo);
        } catch (err) {
            console.error('Error fetching projects:', err);
            return errorResponse('Internal server error', 500, rateLimitInfo);
        }
    });
}

/**
 * POST /api/v1/projects
 * Create a new project (admin only)
 */
export async function POST(request: NextRequest) {
    return withApiMiddleware(
        request,
        async (req, rateLimitInfo) => {
            try {
                const supabase = await createClient();
                const body = await req.json();

                // Extract related data
                const { tags, deliverables, outcomes, techStack, ...projectData } = body;

                // Generate slug if not provided
                if (!projectData.slug) {
                    projectData.slug = generateSlug(projectData.title);
                }

                // Create the project
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const { data: project, error: projectError } = await (supabase as any)
                    .from('projects')
                    .insert(projectData)
                    .select()
                    .single();

                if (projectError) {
                    return errorResponse(projectError.message, 400, rateLimitInfo);
                }

                // Handle tags (auto-create if needed)
                if (tags && Array.isArray(tags) && tags.length > 0) {
                    for (const tagName of tags) {
                        const tag = await getOrCreateTag('project_tags', tagName);
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        await (supabase as any).from('project_tag_relations').insert({
                            project_id: project.id,
                            tag_id: tag.id,
                        });
                    }
                }

                // Handle deliverables
                if (deliverables && Array.isArray(deliverables)) {
                    for (let i = 0; i < deliverables.length; i++) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        await (supabase as any).from('project_deliverables').insert({
                            project_id: project.id,
                            ...deliverables[i],
                            display_order: i,
                        });
                    }
                }

                // Handle outcomes
                if (outcomes && Array.isArray(outcomes)) {
                    for (let i = 0; i < outcomes.length; i++) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        await (supabase as any).from('project_outcomes').insert({
                            project_id: project.id,
                            ...outcomes[i],
                            display_order: i,
                        });
                    }
                }

                // Handle tech stack
                if (techStack && Array.isArray(techStack)) {
                    for (const techId of techStack) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        await (supabase as any).from('project_tech_stack').insert({
                            project_id: project.id,
                            tech_stack_id: techId,
                        });
                    }
                }

                return successResponse(project, 201, rateLimitInfo);
            } catch (err) {
                console.error('Error creating project:', err);
                return errorResponse('Internal server error', 500, rateLimitInfo);
            }
        },
        { requireAdmin: true }
    );
}
