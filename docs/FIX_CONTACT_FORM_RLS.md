# Fix for Contact Form RLS Policy Error

## Problem
When trying to send a message through the contact form, users encounter this error:
```
new row violates row-level security policy for table "contact_inquiries"
```

## Root Cause
The Row Level Security (RLS) policy that allows anonymous users to insert contact inquiries is not applied to the Supabase database, even though it exists in the `database/schema.sql` file.

## Solution
Apply the migration file that creates the necessary RLS policies.

## How to Apply the Fix

### Option 1: Using Supabase CLI (Recommended)
1. Make sure you have the Supabase CLI installed and linked to your project
2. Run the migration:
   ```bash
   # Push all pending migrations to your database
   supabase db push
   
   # Or apply a specific migration
   supabase migration up --db-url <your-database-url>
   ```

### Option 2: Using Supabase Dashboard (SQL Editor)
1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `supabase/migrations/fix_contact_inquiries_rls.sql`
4. Paste it into the SQL Editor
5. Click "Run" to execute the migration

### Option 3: Manual Application
Run the following SQL in your Supabase SQL Editor:

```sql
-- Ensure is_admin() function exists
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_users 
        WHERE id = auth.uid() AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can create contact inquiries" ON contact_inquiries;
DROP POLICY IF EXISTS "Admin full access to contact_inquiries" ON contact_inquiries;

-- Enable RLS
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to INSERT
CREATE POLICY "Public can create contact inquiries" 
    ON contact_inquiries 
    FOR INSERT 
    WITH CHECK (true);

-- Allow admin users full access
CREATE POLICY "Admin full access to contact_inquiries" 
    ON contact_inquiries 
    FOR ALL 
    USING (is_admin());
```

## What This Fix Does
1. Creates/updates the `is_admin()` function used to check admin privileges
2. Drops any existing conflicting policies
3. Enables Row Level Security on the `contact_inquiries` table
4. Creates a policy that allows **anonymous users** to INSERT contact inquiries (this is the key fix)
5. Creates a policy that allows **admin users** to perform all operations

## Verification
After applying the migration, test the contact form:
1. Go to your website's contact page
2. Fill in the form with:
   - Name: Test User
   - Email: test@example.com
   - Message: Test message
3. Click "Send Message"
4. You should see a success message instead of an error

## Technical Details
- The issue occurs because Supabase uses Row Level Security (RLS) by default
- Without proper policies, even the anonymous (public) API key cannot insert data
- The policy `WITH CHECK (true)` allows any INSERT operation, which is safe for contact forms
- Admin operations are protected by the `is_admin()` function which checks authentication
