-- ============================================================================
-- Migration: Ensure all columns match schema.sql
-- Run this in Supabase SQL Editor
-- ============================================================================
-- NOTE: This migration adds any missing columns to match the original schema.sql
-- It uses IF NOT EXISTS to be safely re-runnable
-- ============================================================================

-- ============================================================================
-- PROJECTS TABLE - Add all missing columns
-- ============================================================================
ALTER TABLE projects ADD COLUMN IF NOT EXISTS short_description TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS full_description TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS problem_statement TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS solution_description TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS category_color VARCHAR(50) DEFAULT 'blue';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS featured_image_url TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS year VARCHAR(10);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS view_count INT DEFAULT 0;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS content_format VARCHAR(20) DEFAULT 'markdown';

-- ============================================================================
-- BLOG_POSTS TABLE - Add all missing columns
-- ============================================================================
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS featured_image_url TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author_name VARCHAR(255);
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author_image_url TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS read_time_minutes INT DEFAULT 5;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_title VARCHAR(255);
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS content_format VARCHAR(20) DEFAULT 'markdown';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ;

-- ============================================================================
-- EDUCATION TABLE - Add all missing columns (using 'school' as per schema)
-- ============================================================================
ALTER TABLE education ADD COLUMN IF NOT EXISTS field_of_study VARCHAR(255);
ALTER TABLE education ADD COLUMN IF NOT EXISTS location VARCHAR(255);
ALTER TABLE education ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE education ADD COLUMN IF NOT EXISTS content_format VARCHAR(20) DEFAULT 'markdown';
ALTER TABLE education ADD COLUMN IF NOT EXISTS achievements JSONB DEFAULT '[]';

-- ============================================================================
-- EXPERIENCES TABLE - Add all missing columns
-- ============================================================================
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS employment_type VARCHAR(100);
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]';
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]';
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS color VARCHAR(50) DEFAULT 'blue';
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS content_format VARCHAR(20) DEFAULT 'markdown';

-- ============================================================================
-- CERTIFICATIONS TABLE - Add all missing columns
-- ============================================================================
ALTER TABLE certifications ADD COLUMN IF NOT EXISTS short_name VARCHAR(50);
ALTER TABLE certifications ADD COLUMN IF NOT EXISTS subtitle VARCHAR(255);
ALTER TABLE certifications ADD COLUMN IF NOT EXISTS credential_id VARCHAR(255);
ALTER TABLE certifications ADD COLUMN IF NOT EXISTS certificate_file_url TEXT;
ALTER TABLE certifications ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE certifications ADD COLUMN IF NOT EXISTS content_format VARCHAR(20) DEFAULT 'markdown';
ALTER TABLE certifications ADD COLUMN IF NOT EXISTS icon VARCHAR(100);
ALTER TABLE certifications ADD COLUMN IF NOT EXISTS is_expired BOOLEAN DEFAULT false;

-- ============================================================================
-- TECH_STACK TABLE - Add icon_url for image icons
-- ============================================================================
ALTER TABLE tech_stack ADD COLUMN IF NOT EXISTS icon_url TEXT;
ALTER TABLE tech_stack ADD COLUMN IF NOT EXISTS description TEXT;

-- ============================================================================
-- PROFILE TABLE - Add resume_url for CV download
-- ============================================================================
ALTER TABLE profile ADD COLUMN IF NOT EXISTS resume_url TEXT;

-- ============================================================================
-- CREATE PROJECT_DELIVERABLES TABLE IF NOT EXISTS
-- ============================================================================
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
-- CREATE PROJECT_OUTCOMES TABLE IF NOT EXISTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS project_outcomes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    value VARCHAR(100) NOT NULL,
    label VARCHAR(255) NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- CREATE PROJECT_TECH_STACK JUNCTION TABLE IF NOT EXISTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS project_tech_stack (
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    tech_stack_id UUID NOT NULL REFERENCES tech_stack(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, tech_stack_id)
);

-- ============================================================================
-- CREATE PROJECT_IMAGES TABLE FOR GALLERY/CAROUSEL
-- ============================================================================
CREATE TABLE IF NOT EXISTS project_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- CREATE BLOG_CATEGORIES TABLE IF NOT EXISTS
-- ============================================================================
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

-- Add category_id FK to blog_posts if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'blog_posts' AND column_name = 'category_id'
    ) THEN
        ALTER TABLE blog_posts ADD COLUMN category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL;
    END IF;
END $$;

-- ============================================================================
-- VERIFICATION: List all updated columns
-- ============================================================================
SELECT 
    table_name, 
    column_name, 
    data_type,
    column_default
FROM information_schema.columns 
WHERE table_name IN (
    'projects', 'blog_posts', 'education', 'experiences', 
    'certifications', 'tech_stack', 'profile',
    'project_deliverables', 'project_outcomes', 'project_images', 'blog_categories'
)
ORDER BY table_name, ordinal_position;
