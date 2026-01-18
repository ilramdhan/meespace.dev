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
 * GET /api/v1/projects/[slug]
 * Get a single project by slug (public: published only, admin: all)
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
                    ),
                    project_navigation (
                        prev_project:prev_project_id (id, slug, title, icon, icon_color),
                        next_project:next_project_id (id, slug, title, icon, icon_color)
                    )
                `)
                .eq('slug', slug)
                .single();

            if (!isAdmin) {
                query = query.eq('status', 'published');
            }

            const { data: project, error } = await query;

            if (error || !project) {
                return errorResponse('Project not found', 404, rateLimitInfo);
            }

            // Increment view count for published projects
            if (project.status === 'published') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await (supabase as any)
                    .from('projects')
                    .update({ view_count: (project.view_count || 0) + 1 })
                    .eq('id', project.id);
            }

            // Transform nested relations
            const transformedProject = {
                ...project,
                tags: project.project_tag_relations?.map((rel: { project_tags: unknown }) => rel.project_tags) || [],
                deliverables: project.project_deliverables || [],
                outcomes: project.project_outcomes || [],
                techStack: project.project_tech_stack?.map((rel: { tech_stack: unknown }) => rel.tech_stack) || [],
                navigation: project.project_navigation?.[0] || null,
                project_tag_relations: undefined,
                project_deliverables: undefined,
                project_outcomes: undefined,
                project_tech_stack: undefined,
                project_navigation: undefined,
            };

            return successResponse(transformedProject, 200, rateLimitInfo);
        } catch (err) {
            console.error('Error fetching project:', err);
            return errorResponse('Internal server error', 500, rateLimitInfo);
        }
    });
}

/**
 * PUT /api/v1/projects/[slug]
 * Update a project (admin only)
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
                const { tags, deliverables, outcomes, techStack, ...projectData } = body;

                // Get existing project
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const { data: existingProject } = await (supabase as any)
                    .from('projects')
                    .select('id')
                    .eq('slug', slug)
                    .single();

                if (!existingProject) {
                    return errorResponse('Project not found', 404, rateLimitInfo);
                }

                // Update slug if title changed and slug not provided
                if (projectData.title && !projectData.slug) {
                    projectData.slug = generateSlug(projectData.title);
                }

                // Update project
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const { data: project, error: projectError } = await (supabase as any)
                    .from('projects')
                    .update(projectData)
                    .eq('id', existingProject.id)
                    .select()
                    .single();

                if (projectError) {
                    return errorResponse(projectError.message, 400, rateLimitInfo);
                }

                // Update tags if provided
                if (tags && Array.isArray(tags)) {
                    // Remove existing tags
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await (supabase as any)
                        .from('project_tag_relations')
                        .delete()
                        .eq('project_id', project.id);

                    // Add new tags
                    for (const tagName of tags) {
                        const tag = await getOrCreateTag('project_tags', tagName);
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        await (supabase as any).from('project_tag_relations').insert({
                            project_id: project.id,
                            tag_id: tag.id,
                        });
                    }
                }

                // Update deliverables if provided
                if (deliverables && Array.isArray(deliverables)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await (supabase as any)
                        .from('project_deliverables')
                        .delete()
                        .eq('project_id', project.id);

                    for (let i = 0; i < deliverables.length; i++) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        await (supabase as any).from('project_deliverables').insert({
                            project_id: project.id,
                            ...deliverables[i],
                            display_order: i,
                        });
                    }
                }

                // Update outcomes if provided
                if (outcomes && Array.isArray(outcomes)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await (supabase as any)
                        .from('project_outcomes')
                        .delete()
                        .eq('project_id', project.id);

                    for (let i = 0; i < outcomes.length; i++) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        await (supabase as any).from('project_outcomes').insert({
                            project_id: project.id,
                            ...outcomes[i],
                            display_order: i,
                        });
                    }
                }

                // Update tech stack if provided
                if (techStack && Array.isArray(techStack)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await (supabase as any)
                        .from('project_tech_stack')
                        .delete()
                        .eq('project_id', project.id);

                    for (const techId of techStack) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        await (supabase as any).from('project_tech_stack').insert({
                            project_id: project.id,
                            tech_stack_id: techId,
                        });
                    }
                }

                return successResponse(project, 200, rateLimitInfo);
            } catch (err) {
                console.error('Error updating project:', err);
                return errorResponse('Internal server error', 500, rateLimitInfo);
            }
        },
        { requireAdmin: true }
    );
}

/**
 * DELETE /api/v1/projects/[slug]
 * Delete a project (admin only)
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
    return withApiMiddleware(
        request,
        async (req, rateLimitInfo) => {
            try {
                const { slug } = await context.params;
                const supabase = await createClient();

                const { error } = // eslint-disable-next-line @typescript-eslint/no-explicit-any
                await (supabase as any)
                    .from('projects')
                    .delete()
                    .eq('slug', slug);

                if (error) {
                    return errorResponse(error.message, 400, rateLimitInfo);
                }

                return successResponse({ message: 'Project deleted successfully' }, 200, rateLimitInfo);
            } catch (err) {
                console.error('Error deleting project:', err);
                return errorResponse('Internal server error', 500, rateLimitInfo);
            }
        },
        { requireAdmin: true }
    );
}
