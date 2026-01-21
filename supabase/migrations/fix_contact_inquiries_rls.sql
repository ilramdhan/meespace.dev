-- ============================================================================
-- Migration: Fix Contact Inquiries RLS Policy
-- Purpose: Allow anonymous users to submit contact inquiries
-- ============================================================================

-- Ensure is_admin() function exists (required for admin policy)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_users 
        WHERE id = auth.uid() AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Public can create contact inquiries" ON contact_inquiries;
DROP POLICY IF EXISTS "Admin full access to contact_inquiries" ON contact_inquiries;

-- Enable RLS on contact_inquiries table (if not already enabled)
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow anonymous (public) users to INSERT contact inquiries
-- This allows anyone to submit messages through the contact form
CREATE POLICY "Public can create contact inquiries" 
    ON contact_inquiries 
    FOR INSERT 
    WITH CHECK (true);

-- Policy 2: Allow admin users to have full access (SELECT, INSERT, UPDATE, DELETE)
-- This requires the is_admin() function to be defined
CREATE POLICY "Admin full access to contact_inquiries" 
    ON contact_inquiries 
    FOR ALL 
    USING (is_admin());
