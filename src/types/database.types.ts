/**
 * Database types for meyspace.dev
 * These types are auto-generated from the database schema
 * 
 * To regenerate, run: npx supabase gen types typescript --project-id <project-id> > src/types/database.types.ts
 */

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            about_content: {
                Row: {
                    id: string
                    section_key: string
                    title: string | null
                    subtitle: string | null
                    content: string | null
                    content_format: string
                    image_url: string | null
                    story_year: string | null
                    story_tag: string | null
                    display_order: number
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    section_key: string
                    title?: string | null
                    subtitle?: string | null
                    content?: string | null
                    content_format?: string
                    image_url?: string | null
                    story_year?: string | null
                    story_tag?: string | null
                    display_order?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    section_key?: string
                    title?: string | null
                    subtitle?: string | null
                    content?: string | null
                    content_format?: string
                    image_url?: string | null
                    story_year?: string | null
                    story_tag?: string | null
                    display_order?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            admin_users: {
                Row: {
                    id: string
                    email: string
                    full_name: string
                    avatar_url: string | null
                    role: string
                    is_active: boolean
                    last_login_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name: string
                    avatar_url?: string | null
                    role?: string
                    is_active?: boolean
                    last_login_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string
                    avatar_url?: string | null
                    role?: string
                    is_active?: boolean
                    last_login_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            blog_categories: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    description: string | null
                    color: string
                    display_order: number
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    description?: string | null
                    color?: string
                    display_order?: number
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    description?: string | null
                    color?: string
                    display_order?: number
                    is_active?: boolean
                    created_at?: string
                }
            }
            blog_comments: {
                Row: {
                    id: string
                    post_id: string
                    author_name: string
                    author_email: string | null
                    author_initials: string | null
                    author_initials_color: string
                    content: string
                    likes_count: number
                    is_approved: boolean
                    parent_comment_id: string | null
                    depth: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    post_id: string
                    author_name: string
                    author_email?: string | null
                    author_initials?: string | null
                    author_initials_color?: string
                    content: string
                    likes_count?: number
                    is_approved?: boolean
                    parent_comment_id?: string | null
                    depth?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    post_id?: string
                    author_name?: string
                    author_email?: string | null
                    author_initials?: string | null
                    author_initials_color?: string
                    content?: string
                    likes_count?: number
                    is_approved?: boolean
                    parent_comment_id?: string | null
                    depth?: number
                    created_at?: string
                }
            }
            blog_posts: {
                Row: {
                    id: string
                    slug: string
                    title: string
                    excerpt: string | null
                    content: string | null
                    content_format: string
                    featured_image_url: string | null
                    author_name: string | null
                    author_image_url: string | null
                    category_id: string | null
                    read_time_minutes: number
                    status: string
                    view_count: number
                    is_featured: boolean
                    meta_title: string | null
                    meta_description: string | null
                    created_at: string
                    updated_at: string
                    published_at: string | null
                    scheduled_at: string | null
                }
                Insert: {
                    id?: string
                    slug: string
                    title: string
                    excerpt?: string | null
                    content?: string | null
                    content_format?: string
                    featured_image_url?: string | null
                    author_name?: string | null
                    author_image_url?: string | null
                    category_id?: string | null
                    read_time_minutes?: number
                    status?: string
                    view_count?: number
                    is_featured?: boolean
                    meta_title?: string | null
                    meta_description?: string | null
                    created_at?: string
                    updated_at?: string
                    published_at?: string | null
                    scheduled_at?: string | null
                }
                Update: {
                    id?: string
                    slug?: string
                    title?: string
                    excerpt?: string | null
                    content?: string | null
                    content_format?: string
                    featured_image_url?: string | null
                    author_name?: string | null
                    author_image_url?: string | null
                    category_id?: string | null
                    read_time_minutes?: number
                    status?: string
                    view_count?: number
                    is_featured?: boolean
                    meta_title?: string | null
                    meta_description?: string | null
                    created_at?: string
                    updated_at?: string
                    published_at?: string | null
                    scheduled_at?: string | null
                }
            }
            blog_post_tags: {
                Row: {
                    post_id: string
                    tag_id: string
                }
                Insert: {
                    post_id: string
                    tag_id: string
                }
                Update: {
                    post_id?: string
                    tag_id?: string
                }
            }
            blog_tags: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    created_at?: string
                }
            }
            certifications: {
                Row: {
                    id: string
                    name: string
                    short_name: string | null
                    subtitle: string | null
                    issuer: string
                    issue_date: string | null
                    expiry_date: string | null
                    credential_id: string | null
                    credential_url: string | null
                    certificate_file_url: string | null
                    description: string | null
                    content_format: string
                    icon: string | null
                    is_expired: boolean
                    display_order: number
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    short_name?: string | null
                    subtitle?: string | null
                    issuer: string
                    issue_date?: string | null
                    expiry_date?: string | null
                    credential_id?: string | null
                    credential_url?: string | null
                    certificate_file_url?: string | null
                    description?: string | null
                    content_format?: string
                    icon?: string | null
                    is_expired?: boolean
                    display_order?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    short_name?: string | null
                    subtitle?: string | null
                    issuer?: string
                    issue_date?: string | null
                    expiry_date?: string | null
                    credential_id?: string | null
                    credential_url?: string | null
                    certificate_file_url?: string | null
                    description?: string | null
                    content_format?: string
                    icon?: string | null
                    is_expired?: boolean
                    display_order?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            education: {
                Row: {
                    id: string
                    degree: string
                    field_of_study: string | null
                    school: string
                    location: string | null
                    start_year: number | null
                    end_year: number | null
                    gpa: string | null
                    description: string | null
                    content_format: string
                    achievements: Json
                    display_order: number
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    degree: string
                    field_of_study?: string | null
                    school: string
                    location?: string | null
                    start_year?: number | null
                    end_year?: number | null
                    gpa?: string | null
                    description?: string | null
                    content_format?: string
                    achievements?: Json
                    display_order?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    degree?: string
                    field_of_study?: string | null
                    school?: string
                    location?: string | null
                    start_year?: number | null
                    end_year?: number | null
                    gpa?: string | null
                    description?: string | null
                    content_format?: string
                    achievements?: Json
                    display_order?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            experiences: {
                Row: {
                    id: string
                    title: string
                    company: string
                    location: string | null
                    employment_type: string | null
                    start_date: string
                    end_date: string | null
                    is_current: boolean
                    description: string | null
                    content_format: string
                    highlights: Json
                    tags: Json
                    color: string
                    display_order: number
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    company: string
                    location?: string | null
                    employment_type?: string | null
                    start_date: string
                    end_date?: string | null
                    is_current?: boolean
                    description?: string | null
                    content_format?: string
                    highlights?: Json
                    tags?: Json
                    color?: string
                    display_order?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    company?: string
                    location?: string | null
                    employment_type?: string | null
                    start_date?: string
                    end_date?: string | null
                    is_current?: boolean
                    description?: string | null
                    content_format?: string
                    highlights?: Json
                    tags?: Json
                    color?: string
                    display_order?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            profile: {
                Row: {
                    id: string
                    full_name: string
                    role: string
                    tagline: string | null
                    bio: string | null
                    short_bio: string | null
                    status: string | null
                    avatar_url: string | null
                    resume_url: string | null
                    email: string | null
                    phone: string | null
                    location: string | null
                    social_links: Json
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    full_name: string
                    role: string
                    tagline?: string | null
                    bio?: string | null
                    short_bio?: string | null
                    status?: string | null
                    avatar_url?: string | null
                    resume_url?: string | null
                    email?: string | null
                    phone?: string | null
                    location?: string | null
                    social_links?: Json
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    full_name?: string
                    role?: string
                    tagline?: string | null
                    bio?: string | null
                    short_bio?: string | null
                    status?: string | null
                    avatar_url?: string | null
                    resume_url?: string | null
                    email?: string | null
                    phone?: string | null
                    location?: string | null
                    social_links?: Json
                    created_at?: string
                    updated_at?: string
                }
            }
            projects: {
                Row: {
                    id: string
                    slug: string
                    title: string
                    short_description: string | null
                    full_description: string | null
                    content_format: string
                    category: string | null
                    category_color: string
                    icon: string | null
                    icon_color: string
                    thumbnail_url: string | null
                    featured_image_url: string | null
                    problem_statement: string | null
                    solution_description: string | null
                    year: string | null
                    status: string
                    is_featured: boolean
                    display_order: number
                    view_count: number
                    created_at: string
                    updated_at: string
                    published_at: string | null
                }
                Insert: {
                    id?: string
                    slug: string
                    title: string
                    short_description?: string | null
                    full_description?: string | null
                    content_format?: string
                    category?: string | null
                    category_color?: string
                    icon?: string | null
                    icon_color?: string
                    thumbnail_url?: string | null
                    featured_image_url?: string | null
                    problem_statement?: string | null
                    solution_description?: string | null
                    year?: string | null
                    status?: string
                    is_featured?: boolean
                    display_order?: number
                    view_count?: number
                    created_at?: string
                    updated_at?: string
                    published_at?: string | null
                }
                Update: {
                    id?: string
                    slug?: string
                    title?: string
                    short_description?: string | null
                    full_description?: string | null
                    content_format?: string
                    category?: string | null
                    category_color?: string
                    icon?: string | null
                    icon_color?: string
                    thumbnail_url?: string | null
                    featured_image_url?: string | null
                    problem_statement?: string | null
                    solution_description?: string | null
                    year?: string | null
                    status?: string
                    is_featured?: boolean
                    display_order?: number
                    view_count?: number
                    created_at?: string
                    updated_at?: string
                    published_at?: string | null
                }
            }
            project_deliverables: {
                Row: {
                    id: string
                    project_id: string
                    title: string
                    description: string | null
                    icon: string | null
                    display_order: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    project_id: string
                    title: string
                    description?: string | null
                    icon?: string | null
                    display_order?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    project_id?: string
                    title?: string
                    description?: string | null
                    icon?: string | null
                    display_order?: number
                    created_at?: string
                }
            }
            project_outcomes: {
                Row: {
                    id: string
                    project_id: string
                    value: string
                    label: string
                    display_order: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    project_id: string
                    value: string
                    label: string
                    display_order?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    project_id?: string
                    value?: string
                    label?: string
                    display_order?: number
                    created_at?: string
                }
            }
            project_tags: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    color: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    color?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    color?: string
                    created_at?: string
                }
            }
            project_tag_relations: {
                Row: {
                    project_id: string
                    tag_id: string
                }
                Insert: {
                    project_id: string
                    tag_id: string
                }
                Update: {
                    project_id?: string
                    tag_id?: string
                }
            }
            project_tech_stack: {
                Row: {
                    project_id: string
                    tech_stack_id: string
                }
                Insert: {
                    project_id: string
                    tech_stack_id: string
                }
                Update: {
                    project_id?: string
                    tech_stack_id?: string
                }
            }
            site_settings: {
                Row: {
                    id: string
                    site_name: string
                    site_tagline: string | null
                    seo_title: string | null
                    seo_description: string | null
                    seo_keywords: string | null
                    favicon_url: string | null
                    logo_url: string | null
                    og_image_url: string | null
                    google_analytics_id: string | null
                    contact_email: string | null
                    contact_phone: string | null
                    location: string | null
                    footer_text: string | null
                    copyright_text: string | null
                    is_maintenance_mode: boolean
                    show_blog: boolean
                    show_newsletter: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    site_name?: string
                    site_tagline?: string | null
                    seo_title?: string | null
                    seo_description?: string | null
                    seo_keywords?: string | null
                    favicon_url?: string | null
                    logo_url?: string | null
                    og_image_url?: string | null
                    google_analytics_id?: string | null
                    contact_email?: string | null
                    contact_phone?: string | null
                    location?: string | null
                    footer_text?: string | null
                    copyright_text?: string | null
                    is_maintenance_mode?: boolean
                    show_blog?: boolean
                    show_newsletter?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    site_name?: string
                    site_tagline?: string | null
                    seo_title?: string | null
                    seo_description?: string | null
                    seo_keywords?: string | null
                    favicon_url?: string | null
                    logo_url?: string | null
                    og_image_url?: string | null
                    google_analytics_id?: string | null
                    contact_email?: string | null
                    contact_phone?: string | null
                    location?: string | null
                    footer_text?: string | null
                    copyright_text?: string | null
                    is_maintenance_mode?: boolean
                    show_blog?: boolean
                    show_newsletter?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            skills: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    icon: string | null
                    display_order: number
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    icon?: string | null
                    display_order?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    icon?: string | null
                    display_order?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            stats: {
                Row: {
                    id: string
                    label: string
                    value: string
                    icon: string | null
                    color: string
                    display_order: number
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    label: string
                    value: string
                    icon?: string | null
                    color?: string
                    display_order?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    label?: string
                    value?: string
                    icon?: string | null
                    color?: string
                    display_order?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            tech_stack: {
                Row: {
                    id: string
                    name: string
                    category: string
                    proficiency: string | null
                    proficiency_value: number
                    icon: string | null
                    icon_url: string | null
                    color: string
                    description: string | null
                    display_order: number
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    category: string
                    proficiency?: string | null
                    proficiency_value?: number
                    icon?: string | null
                    icon_url?: string | null
                    color?: string
                    description?: string | null
                    display_order?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    category?: string
                    proficiency?: string | null
                    proficiency_value?: number
                    icon?: string | null
                    icon_url?: string | null
                    color?: string
                    description?: string | null
                    display_order?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            tools: {
                Row: {
                    id: string
                    name: string
                    icon_url: string | null
                    color: string
                    website_url: string | null
                    display_order: number
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    icon_url?: string | null
                    color?: string
                    website_url?: string | null
                    display_order?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    icon_url?: string | null
                    color?: string
                    website_url?: string | null
                    display_order?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            activity_log: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    action_type: string
                    entity_type: string | null
                    entity_id: string | null
                    icon: string | null
                    color: string
                    admin_user_id: string | null
                    metadata: Json
                    created_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    action_type: string
                    entity_type?: string | null
                    entity_id?: string | null
                    icon?: string | null
                    color?: string
                    admin_user_id?: string | null
                    metadata?: Json
                    created_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    action_type?: string
                    entity_type?: string | null
                    entity_id?: string | null
                    icon?: string | null
                    color?: string
                    admin_user_id?: string | null
                    metadata?: Json
                    created_at?: string
                }
            }
            analytics_daily: {
                Row: {
                    id: string
                    date: string
                    page_views: number
                    unique_visitors: number
                    bounce_rate: number | null
                    avg_session_duration: number | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    date: string
                    page_views?: number
                    unique_visitors?: number
                    bounce_rate?: number | null
                    avg_session_duration?: number | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    date?: string
                    page_views?: number
                    unique_visitors?: number
                    bounce_rate?: number | null
                    avg_session_duration?: number | null
                    created_at?: string
                    updated_at?: string
                }
            }
            contact_inquiries: {
                Row: {
                    id: string
                    name: string
                    email: string
                    company: string | null
                    subject: string | null
                    message: string
                    status: string
                    is_read: boolean
                    responded_at: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    email: string
                    company?: string | null
                    subject?: string | null
                    message: string
                    status?: string
                    is_read?: boolean
                    responded_at?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    email?: string
                    company?: string | null
                    subject?: string | null
                    message?: string
                    status?: string
                    is_read?: boolean
                    responded_at?: string | null
                    created_at?: string
                }
            }
            newsletter_subscribers: {
                Row: {
                    id: string
                    email: string
                    name: string | null
                    is_active: boolean
                    subscribed_at: string
                    unsubscribed_at: string | null
                }
                Insert: {
                    id?: string
                    email: string
                    name?: string | null
                    is_active?: boolean
                    subscribed_at?: string
                    unsubscribed_at?: string | null
                }
                Update: {
                    id?: string
                    email?: string
                    name?: string | null
                    is_active?: boolean
                    subscribed_at?: string
                    unsubscribed_at?: string | null
                }
            }
            media_files: {
                Row: {
                    id: string
                    filename: string
                    original_filename: string
                    file_path: string
                    file_url: string
                    file_size: number | null
                    mime_type: string | null
                    alt_text: string | null
                    caption: string | null
                    folder: string
                    uploaded_by: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    filename: string
                    original_filename: string
                    file_path: string
                    file_url: string
                    file_size?: number | null
                    mime_type?: string | null
                    alt_text?: string | null
                    caption?: string | null
                    folder?: string
                    uploaded_by?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    filename?: string
                    original_filename?: string
                    file_path?: string
                    file_url?: string
                    file_size?: number | null
                    mime_type?: string | null
                    alt_text?: string | null
                    caption?: string | null
                    folder?: string
                    uploaded_by?: string | null
                    created_at?: string
                }
            }
            sidebar_links: {
                Row: {
                    id: string
                    label: string
                    url: string | null
                    icon: string | null
                    color: string
                    project_id: string | null
                    is_active: boolean
                    display_order: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    label: string
                    url?: string | null
                    icon?: string | null
                    color?: string
                    project_id?: string | null
                    is_active?: boolean
                    display_order?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    label?: string
                    url?: string | null
                    icon?: string | null
                    color?: string
                    project_id?: string | null
                    is_active?: boolean
                    display_order?: number
                    created_at?: string
                }
            }
            sidebar_cta: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    button_text: string | null
                    button_url: string | null
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    button_text?: string | null
                    button_url?: string | null
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    button_text?: string | null
                    button_url?: string | null
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            project_navigation: {
                Row: {
                    id: string
                    project_id: string
                    prev_project_id: string | null
                    next_project_id: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    project_id: string
                    prev_project_id?: string | null
                    next_project_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    project_id?: string
                    prev_project_id?: string | null
                    next_project_id?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            is_admin: {
                Args: Record<PropertyKey, never>
                Returns: boolean
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

// Helper types for easier use
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Commonly used types
export type Profile = Tables<'profile'>
export type Project = Tables<'projects'>
export type BlogPost = Tables<'blog_posts'>
export type BlogCategory = Tables<'blog_categories'>
export type BlogComment = Tables<'blog_comments'>
export type Experience = Tables<'experiences'>
export type Education = Tables<'education'>
export type Certification = Tables<'certifications'>
export type TechStack = Tables<'tech_stack'>
export type Skill = Tables<'skills'>
export type Stat = Tables<'stats'>
export type Tool = Tables<'tools'>
export type AboutContent = Tables<'about_content'>
export type SiteSettings = Tables<'site_settings'>
export type AdminUser = Tables<'admin_users'>
export type ActivityLog = Tables<'activity_log'>
