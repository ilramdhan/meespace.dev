# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **Start your project** → Sign up/Login
3. Click **New Project**
4. Fill in:
   - **Name**: `meyspace` (or your preference)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Singapore (closest to Indonesia)
5. Click **Create new project** and wait 2-3 minutes

---

## Step 2: Get API Keys

Once project is created, go to **Settings → API**:

| Environment Variable | Where to Find |
|---------------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL: `https://xxxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project API keys → `anon` `public` |
| `SUPABASE_SERVICE_ROLE_KEY` | Project API keys → `service_role` (⚠️ keep secret!) |

---

## Step 3: Run Database Schema

1. Go to **SQL Editor** in Supabase Dashboard
2. Click **New query**
3. Copy the contents of `schema.sql` from your project
4. Click **Run** to execute

This creates all tables, RLS policies, and seed data.

---

## Step 4: Create Storage Bucket

1. Go to **Storage** in Supabase Dashboard
2. Click **New bucket**
3. Name: `meyspace.dev`
4. Check ✅ **Public bucket**
5. Click **Create bucket**

---

## Step 5: Setup Google OAuth

### In Supabase:
1. Go to **Authentication → Providers → Google**
2. Toggle **Enable Sign in with Google**
3. You'll need Client ID and Client Secret from Google

### In Google Cloud Console:
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project or select existing
3. Go to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth client ID**
5. Application type: **Web application**
6. Add **Authorized redirect URIs**:
   - `https://YOUR_PROJECT.supabase.co/auth/v1/callback`
7. Copy **Client ID** and **Client Secret**
8. Paste them in Supabase Google provider settings

---

## Step 6: Create Your .env.local File

Create `.env.local` in your project root:

```bash
# Copy from your Supabase dashboard
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Storage
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=meyspace.dev

# Auth URLs
NEXT_PUBLIC_AUTH_REDIRECT_URL=http://localhost:3000/api/v1/auth/callback
NEXT_PUBLIC_ADMIN_LOGIN_URL=http://localhost:3000/admin/login

# API
NEXT_PUBLIC_API_VERSION=v1
API_RATE_LIMIT=60
```

---

## Step 7: Add Yourself as Admin

Run this in Supabase SQL Editor (replace with your email):

```sql
INSERT INTO admin_users (id, email, display_name, role)
VALUES (
  gen_random_uuid(),
  'your-google-email@gmail.com',
  'Your Name',
  'super_admin'
);
```

**Note**: After you sign in with Google, update the admin_users record:
```sql
UPDATE admin_users 
SET id = 'YOUR_SUPABASE_AUTH_USER_ID'
WHERE email = 'your-google-email@gmail.com';
```

---

## Troubleshooting

### "Database tables not found"
→ Run `schema.sql` in SQL Editor

### "Unauthorized" on API calls
→ Check your environment variables are correct

### "Failed to fetch" errors
→ Check your Supabase URL is correct and project is running

### Admin login not working
→ Make sure your email is in admin_users table and Google OAuth is configured
