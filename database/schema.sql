-- ============================================================================
-- meyspace.dev Database Schema
-- Compatible with Supabase (PostgreSQL)
-- ============================================================================
-- Version: 1.1.0
-- Description: Complete database schema for portfolio website with CMS
-- Features: Markdown support, Nested comments, Supabase Auth (Google only)
-- ============================================================================

-- Enable UUID extension (Supabase)
-- For Cloudflare D1, use TEXT for IDs and generate UUIDs in application
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ADMIN USERS TABLE
-- ============================================================================
-- Links to Supabase Auth users (Google OAuth only)
-- Admin access is controlled via this table - only pre-registered emails can access admin
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SITE SETTINGS TABLE
-- ============================================================================
-- Global site configuration and SEO settings
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_name VARCHAR(255) NOT NULL DEFAULT 'Portfolio',
    site_tagline VARCHAR(500),
    seo_title VARCHAR(255),
    seo_description TEXT,
    seo_keywords TEXT,
    favicon_url TEXT,
    logo_url TEXT,
    og_image_url TEXT,
    google_analytics_id VARCHAR(50),
    
    -- Contact info
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    location VARCHAR(255),
    
    -- Footer settings
    footer_text TEXT,
    copyright_text VARCHAR(255),
    
    -- Feature flags
    is_maintenance_mode BOOLEAN DEFAULT false,
    show_blog BOOLEAN DEFAULT true,
    show_newsletter BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PROFILE TABLE
-- ============================================================================
-- Main profile information displayed on landing page
CREATE TABLE IF NOT EXISTS profile (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    tagline VARCHAR(500),
    bio TEXT,
    short_bio TEXT,
    status VARCHAR(100), -- e.g., "Open to Work", "Available", "Busy"
    avatar_url TEXT,
    resume_url TEXT,
    
    -- Contact information
    email VARCHAR(255),
    phone VARCHAR(50),
    location VARCHAR(255),
    
    -- Social links (JSONB for flexibility)
    social_links JSONB DEFAULT '{}',
    -- Example: {"linkedin": "url", "github": "url", "twitter": "url"}
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ABOUT PAGE CONTENT TABLE
-- ============================================================================
-- Dynamic sections for About page (supports Markdown)
CREATE TABLE IF NOT EXISTS about_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_key VARCHAR(100) NOT NULL UNIQUE, -- 'header', 'story', 'fun_fact', 'offline'
    title VARCHAR(255),
    subtitle VARCHAR(500),
    content TEXT, -- Markdown content
    content_format VARCHAR(20) DEFAULT 'markdown', -- 'markdown' or 'html'
    image_url TEXT,
    
    -- For story section
    story_year VARCHAR(50),
    story_tag VARCHAR(100),
    
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SKILLS TABLE
-- ============================================================================
-- Skills displayed on landing page
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100), -- Material symbol icon name
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- STATS TABLE
-- ============================================================================
-- Statistics/counters displayed on landing page
CREATE TABLE IF NOT EXISTS stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label VARCHAR(255) NOT NULL,
    value VARCHAR(100) NOT NULL, -- "5+", "20+", "100%", etc.
    icon VARCHAR(100), -- Material symbol icon name
    color VARCHAR(50) DEFAULT 'blue', -- For UI theming
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TOOLS TABLE
-- ============================================================================
-- Tools/technologies displayed on landing page (with image icons)
CREATE TABLE IF NOT EXISTS tools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    icon_url TEXT, -- URL to tool icon image
    color VARCHAR(50) DEFAULT 'blue',
    website_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TECH STACK TABLE
-- ============================================================================
-- Admin-managed tech stack with proficiency levels
CREATE TABLE IF NOT EXISTS tech_stack (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- "Project Management", "Data Analysis", etc.
    proficiency VARCHAR(50), -- "Expert", "Advanced", "Intermediate", "Beginner"
    proficiency_value INT DEFAULT 0, -- 0-100 for progress bar
    icon VARCHAR(100), -- Material symbol icon name
    icon_url TEXT, -- Alternative: image URL
    color VARCHAR(50) DEFAULT 'blue',
    description TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PROJECTS TABLE
-- ============================================================================
-- Portfolio projects/case studies (supports Markdown)
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    short_description TEXT,
    full_description TEXT, -- Markdown content
    content_format VARCHAR(20) DEFAULT 'markdown', -- 'markdown' or 'html'
    
    -- Categorization
    category VARCHAR(100), -- "FinTech", "SaaS", "Healthcare", etc.
    category_color VARCHAR(50) DEFAULT 'blue',
    
    -- Visual
    icon VARCHAR(100), -- Material symbol icon name
    icon_color VARCHAR(50) DEFAULT 'blue',
    thumbnail_url TEXT,
    featured_image_url TEXT,
    
    -- Case study content (Markdown)
    problem_statement TEXT,
    solution_description TEXT,
    
    -- Metadata
    year VARCHAR(10),
    status VARCHAR(50) DEFAULT 'draft', -- 'published', 'draft', 'archived'
    is_featured BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    
    -- Stats
    view_count INT DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- ============================================================================
-- PROJECT TAGS TABLE
-- ============================================================================
-- Tags for projects (many-to-many)
CREATE TABLE IF NOT EXISTS project_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(50) DEFAULT 'gray',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Junction table for projects and tags
CREATE TABLE IF NOT EXISTS project_tag_relations (
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES project_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, tag_id)
);

-- ============================================================================
-- PROJECT DELIVERABLES TABLE
-- ============================================================================
-- Deliverables/achievements for each project
CREATE TABLE IF NOT EXISTS project_deliverables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PROJECT OUTCOMES TABLE
-- ============================================================================
-- Measurable outcomes for each project
CREATE TABLE IF NOT EXISTS project_outcomes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    value VARCHAR(100) NOT NULL, -- "40%", "$150k", "200%"
    label VARCHAR(255) NOT NULL, -- "Redundancy Reduced", "Annual Savings"
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PROJECT TECH STACK JUNCTION TABLE
-- ============================================================================
-- Technologies used in each project
CREATE TABLE IF NOT EXISTS project_tech_stack (
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    tech_stack_id UUID NOT NULL REFERENCES tech_stack(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, tech_stack_id)
);

-- ============================================================================
-- PROJECT NAVIGATION TABLE
-- ============================================================================
-- Previous/Next navigation for projects
CREATE TABLE IF NOT EXISTS project_navigation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
    prev_project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    next_project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- EXPERIENCE TABLE
-- ============================================================================
-- Professional work experience (supports Markdown)
CREATE TABLE IF NOT EXISTS experiences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL, -- Job title
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    employment_type VARCHAR(100), -- "Full-time", "Part-time", "Contract"
    start_date DATE NOT NULL,
    end_date DATE, -- NULL means "Present"
    is_current BOOLEAN DEFAULT false,
    description TEXT, -- Markdown content
    content_format VARCHAR(20) DEFAULT 'markdown', -- 'markdown' or 'html'
    
    -- Rich content
    highlights JSONB DEFAULT '[]', -- Array of highlight strings (can include markdown)
    tags JSONB DEFAULT '[]', -- Array of skill tags
    
    color VARCHAR(50) DEFAULT 'blue',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- EDUCATION TABLE
-- ============================================================================
-- Educational background (supports Markdown)
CREATE TABLE IF NOT EXISTS education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    degree VARCHAR(255) NOT NULL,
    field_of_study VARCHAR(255),
    school VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    start_year INT,
    end_year INT,
    gpa VARCHAR(20),
    description TEXT, -- Markdown content
    content_format VARCHAR(20) DEFAULT 'markdown', -- 'markdown' or 'html'
    achievements JSONB DEFAULT '[]', -- Array of achievements
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- CERTIFICATIONS TABLE
-- ============================================================================
-- Professional certifications (supports Markdown)
CREATE TABLE IF NOT EXISTS certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(50), -- e.g., "CSPO", "CBAP"
    subtitle VARCHAR(255), -- e.g., "Certified Scrum Product Owner"
    issuer VARCHAR(255) NOT NULL,
    issue_date DATE,
    expiry_date DATE,
    credential_id VARCHAR(255),
    credential_url TEXT,
    certificate_file_url TEXT, -- Stored in bucket
    description TEXT, -- Markdown content
    content_format VARCHAR(20) DEFAULT 'markdown', -- 'markdown' or 'html'
    icon VARCHAR(100), -- Material symbol icon name
    is_expired BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- BLOG CATEGORIES TABLE
-- ============================================================================
-- Categories for blog posts
CREATE TABLE IF NOT EXISTS blog_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(50) DEFAULT 'blue',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- BLOG POSTS TABLE
-- ============================================================================
-- Blog articles/insights (supports Markdown)
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content TEXT, -- Markdown content
    content_format VARCHAR(20) DEFAULT 'markdown', -- 'markdown' or 'html'
    
    -- Media
    featured_image_url TEXT,
    author_name VARCHAR(255),
    author_image_url TEXT,
    
    -- Categorization
    category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
    
    -- Reading info
    read_time_minutes INT DEFAULT 5,
    
    -- Status
    status VARCHAR(50) DEFAULT 'draft', -- 'published', 'draft', 'scheduled', 'archived'
    
    -- Stats
    view_count INT DEFAULT 0,
    
    -- Metadata
    is_featured BOOLEAN DEFAULT false,
    
    -- SEO
    meta_title VARCHAR(255),
    meta_description TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    scheduled_at TIMESTAMPTZ
);

-- ============================================================================
-- BLOG TAGS TABLE
-- ============================================================================
-- Tags for blog posts (topics)
CREATE TABLE IF NOT EXISTS blog_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Junction table for blog posts and tags
CREATE TABLE IF NOT EXISTS blog_post_tags (
    post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES blog_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- ============================================================================
-- BLOG COMMENTS TABLE
-- ============================================================================
-- Comments on blog posts (supports nested/threaded comments)
CREATE TABLE IF NOT EXISTS blog_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255),
    author_initials VARCHAR(10),
    author_initials_color VARCHAR(50) DEFAULT 'blue',
    content TEXT NOT NULL,
    likes_count INT DEFAULT 0,
    is_approved BOOLEAN DEFAULT false,
    parent_comment_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE, -- For nested replies
    depth INT DEFAULT 0, -- Nesting level (0 = root, 1 = first level reply, etc.)
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ACTIVITY LOG TABLE
-- ============================================================================
-- Recent activity tracking for dashboard
CREATE TABLE IF NOT EXISTS activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    action_type VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete', 'publish', 'backup', etc.
    entity_type VARCHAR(50), -- 'project', 'blog', 'experience', etc.
    entity_id UUID,
    icon VARCHAR(100),
    color VARCHAR(50) DEFAULT 'blue',
    admin_user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ANALYTICS TABLE
-- ============================================================================
-- Visitor analytics data
CREATE TABLE IF NOT EXISTS analytics_daily (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL UNIQUE,
    page_views INT DEFAULT 0,
    unique_visitors INT DEFAULT 0,
    bounce_rate DECIMAL(5,2),
    avg_session_duration INT, -- in seconds
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- CONTACT INQUIRIES TABLE
-- ============================================================================
-- Contact form submissions
CREATE TABLE IF NOT EXISTS contact_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new', -- 'new', 'read', 'replied', 'archived'
    is_read BOOLEAN DEFAULT false,
    responded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- NEWSLETTER SUBSCRIBERS TABLE
-- ============================================================================
-- Newsletter subscription list
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ
);

-- ============================================================================
-- MEDIA LIBRARY TABLE
-- ============================================================================
-- Centralized media/file management
CREATE TABLE IF NOT EXISTS media_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size INT, -- in bytes
    mime_type VARCHAR(100),
    alt_text VARCHAR(255),
    caption TEXT,
    folder VARCHAR(255) DEFAULT 'general',
    uploaded_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SIDEBAR NAVIGATION / PROJECT LINKS TABLE
-- ============================================================================
-- Custom navigation links for projects page sidebar
CREATE TABLE IF NOT EXISTS sidebar_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label VARCHAR(255) NOT NULL,
    url TEXT,
    icon VARCHAR(100),
    color VARCHAR(50) DEFAULT 'blue',
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE, -- If linked to project
    is_active BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SIDEBAR CTA TABLE
-- ============================================================================
-- Call-to-action section in sidebar
CREATE TABLE IF NOT EXISTS sidebar_cta (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    button_text VARCHAR(100),
    button_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Projects
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_is_featured ON projects(is_featured);
CREATE INDEX idx_projects_category ON projects(category);

-- Blog posts
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_category_id ON blog_posts(category_id);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at);

-- Activity log
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at);
CREATE INDEX idx_activity_log_entity_type ON activity_log(entity_type);

-- Analytics
CREATE INDEX idx_analytics_daily_date ON analytics_daily(date);

-- Contact inquiries
CREATE INDEX idx_contact_inquiries_status ON contact_inquiries(status);
CREATE INDEX idx_contact_inquiries_created_at ON contact_inquiries(created_at);

-- Comments (including nested comments index)
CREATE INDEX idx_blog_comments_post_id ON blog_comments(post_id);
CREATE INDEX idx_blog_comments_is_approved ON blog_comments(is_approved);
CREATE INDEX idx_blog_comments_parent_id ON blog_comments(parent_comment_id);
CREATE INDEX idx_blog_comments_depth ON blog_comments(depth);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at column
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profile_updated_at BEFORE UPDATE ON profile FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_about_content_updated_at BEFORE UPDATE ON about_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON experiences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON education FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON certifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_analytics_daily_updated_at BEFORE UPDATE ON analytics_daily FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tech_stack_updated_at BEFORE UPDATE ON tech_stack FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sidebar_cta_updated_at BEFORE UPDATE ON sidebar_cta FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_project_navigation_updated_at BEFORE UPDATE ON project_navigation FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR SUPABASE
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE tech_stack ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tag_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tech_stack ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_navigation ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE sidebar_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE sidebar_cta ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PUBLIC READ POLICIES (for landing page content)
-- ============================================================================

-- Allow public read access to published content
CREATE POLICY "Public read access to site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read access to profile" ON profile FOR SELECT USING (true);
CREATE POLICY "Public read access to about_content" ON about_content FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access to skills" ON skills FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access to stats" ON stats FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access to tools" ON tools FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access to tech_stack" ON tech_stack FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access to published projects" ON projects FOR SELECT USING (status = 'published');
CREATE POLICY "Public read access to project_tags" ON project_tags FOR SELECT USING (true);
CREATE POLICY "Public read access to project_tag_relations" ON project_tag_relations FOR SELECT USING (true);
CREATE POLICY "Public read access to project_deliverables" ON project_deliverables FOR SELECT USING (true);
CREATE POLICY "Public read access to project_outcomes" ON project_outcomes FOR SELECT USING (true);
CREATE POLICY "Public read access to project_tech_stack" ON project_tech_stack FOR SELECT USING (true);
CREATE POLICY "Public read access to project_navigation" ON project_navigation FOR SELECT USING (true);
CREATE POLICY "Public read access to experiences" ON experiences FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access to education" ON education FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access to certifications" ON certifications FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access to blog_categories" ON blog_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access to published blog_posts" ON blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Public read access to blog_tags" ON blog_tags FOR SELECT USING (true);
CREATE POLICY "Public read access to blog_post_tags" ON blog_post_tags FOR SELECT USING (true);
CREATE POLICY "Public read access to approved comments" ON blog_comments FOR SELECT USING (is_approved = true);
CREATE POLICY "Public read access to sidebar_links" ON sidebar_links FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access to sidebar_cta" ON sidebar_cta FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access to media_files" ON media_files FOR SELECT USING (true);

-- Allow public to create contact inquiries and subscribe to newsletter
CREATE POLICY "Public can create contact inquiries" ON contact_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can subscribe to newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can create comments" ON blog_comments FOR INSERT WITH CHECK (true);

-- ============================================================================
-- ADMIN POLICIES (requires Supabase Auth - Google OAuth)
-- ============================================================================
-- These policies check if the authenticated user exists in admin_users table

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_users 
        WHERE id = auth.uid() AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin full access policies
CREATE POLICY "Admin full access to admin_users" ON admin_users FOR ALL USING (is_admin());
CREATE POLICY "Admin full access to site_settings" ON site_settings FOR ALL USING (is_admin());
CREATE POLICY "Admin full access to profile" ON profile FOR ALL USING (is_admin());
CREATE POLICY "Admin full access to about_content" ON about_content FOR ALL USING (is_admin());
CREATE POLICY "Admin full access to skills" ON skills FOR ALL USING (is_admin());
CREATE POLICY "Admin full access to stats" ON stats FOR ALL USING (is_admin());
CREATE POLICY "Admin full access to tools" ON tools FOR ALL USING (is_admin());
CREATE POLICY "Admin full access to tech_stack" ON tech_stack FOR ALL USING (is_admin());
CREATE POLICY "Admin full access to projects" ON projects FOR ALL USING (is_admin());
CREATE POLICY "Admin full access to project_tags" ON project_tags FOR ALL USING (is_admin());
CREATE POLICY "Admin full access to project_tag_relations" ON project_tag_relations FOR ALL USING (is_admin());
CREATE POLICY "Admin full access to project_deliverables" ON project_deliverables FOR ALL USING (is_admin());
CREATE POLICY "Admin full access to project_outcomes" ON project_outcomes FOR ALL USING (is_admin());
CREATE POLICY "Admin full access to project_tech_stack" ON project_tech_stack FOR ALL USING (is_admin());
CREATE POLICY "Admin full access to project_navigation" ON project_navigation FOR ALL USING (is_admin());
CREATE POLICY "Admin full access to experiences" ON experiences FOR ALL USING (is_admin());
CREATE POLICY "Admin full access to education" ON education FOR ALL USING (is_admin());
CREATE POLICY "Admin full access to certifications" ON certifications FOR ALL USING (is_admin());
CREATE POLICY "Admin full access to blog_categories" ON blog_categories FOR ALL USING (is_admin());
CREATE POLICY "Admin full access to blog_posts" ON blog_posts FOR ALL USING (is_admin());
CREATE POLICY "Admin full access to blog_tags" ON blog_tags FOR ALL USING (is_admin());
CREATE POLICY "Admin full access to blog_post_tags" ON blog_post_tags FOR ALL USING (is_admin());
CREATE POLICY "Admin full access to blog_comments" ON blog_comments FOR ALL USING (is_admin());
CREATE POLICY "Admin full access to activity_log" ON activity_log FOR ALL USING (is_admin());
CREATE POLICY "Admin full access to analytics_daily" ON analytics_daily FOR ALL USING (is_admin());
CREATE POLICY "Admin full access to contact_inquiries" ON contact_inquiries FOR ALL USING (is_admin());
CREATE POLICY "Admin full access to newsletter_subscribers" ON newsletter_subscribers FOR ALL USING (is_admin());
CREATE POLICY "Admin full access to media_files" ON media_files FOR ALL USING (is_admin());
CREATE POLICY "Admin full access to sidebar_links" ON sidebar_links FOR ALL USING (is_admin());
CREATE POLICY "Admin full access to sidebar_cta" ON sidebar_cta FOR ALL USING (is_admin());

-- ============================================================================
-- SEED DATA (Optional - Initial content)
-- ============================================================================

-- Insert default site settings
INSERT INTO site_settings (site_name, site_tagline, seo_description)
VALUES ('Sarah Jenkins Portfolio', 'Bridging Business Needs with Technical Solutions', 'Business System Analyst with 5+ years of experience specializing in requirements gathering, process modeling, and data analysis.')
ON CONFLICT DO NOTHING;

-- Insert default blog categories
INSERT INTO blog_categories (name, slug, color, display_order) VALUES 
    ('Technical', 'technical', 'blue', 1),
    ('Case Study', 'case-study', 'green', 2),
    ('Career', 'career', 'orange', 3),
    ('Soft Skills', 'soft-skills', 'purple', 4),
    ('Product Mgmt', 'product-mgmt', 'blue', 5),
    ('Engineering', 'engineering', 'purple', 6),
    ('Process', 'process', 'orange', 7)
ON CONFLICT (slug) DO NOTHING;

-- Insert default project tags
INSERT INTO project_tags (name, slug, color) VALUES 
    ('PRD', 'prd', 'blue'),
    ('UML', 'uml', 'purple'),
    ('Agile', 'agile', 'green'),
    ('BPMN', 'bpmn', 'orange'),
    ('SQL', 'sql', 'red'),
    ('Jira', 'jira', 'blue'),
    ('Salesforce', 'salesforce', 'blue'),
    ('API REST', 'api-rest', 'green'),
    ('Tableau', 'tableau', 'blue'),
    ('Snowflake', 'snowflake', 'cyan'),
    ('Python', 'python', 'yellow'),
    ('Postman', 'postman', 'orange'),
    ('Figma', 'figma', 'purple'),
    ('iOS', 'ios', 'gray'),
    ('Visio', 'visio', 'indigo')
ON CONFLICT (slug) DO NOTHING;

-- Insert default blog tags (topics)
INSERT INTO blog_tags (name, slug) VALUES 
    ('Technical Writing', 'technical-writing'),
    ('Agile', 'agile'),
    ('Case Study', 'case-study'),
    ('SQL', 'sql'),
    ('Stakeholder Mgmt', 'stakeholder-mgmt')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- STORAGE BUCKET SETUP (Supabase specific - run in Supabase dashboard)
-- ============================================================================
-- 
-- IMPORTANT: Create a single bucket named 'meyspace.dev' for all files
-- Organize files by folder paths within the bucket
--
-- Bucket creation (run in SQL Editor):
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
    'meyspace.dev', 
    'meyspace.dev', 
    true,
    52428800, -- 50MB limit
    ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml', 'application/pdf']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for the meyspace.dev bucket
CREATE POLICY "Public can view all files" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'meyspace.dev');

CREATE POLICY "Admin can upload files" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'meyspace.dev' AND is_admin());

CREATE POLICY "Admin can update files" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'meyspace.dev' AND is_admin());

CREATE POLICY "Admin can delete files" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'meyspace.dev' AND is_admin());
--
-- Recommended folder structure within bucket:
-- /avatars       - Profile and author images
-- /projects      - Project thumbnails and featured images  
-- /blog          - Blog post featured images
-- /certificates  - Certification files
-- /tools         - Tool/technology icons
-- /media         - General media library

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
