# BSA Portfolio - Developer Guidelines

📋 **Comprehensive guide for contributing to the BSA Portfolio project**

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Routing Architecture](#routing-architecture)
5. [Component Guidelines](#component-guidelines)
6. [Styling Guidelines](#styling-guidelines)
7. [Backend Integration](#backend-integration)
8. [Best Practices](#best-practices)

---

## Project Overview

This is a **portfolio landing page** with two main sections:
- **Public** - Portfolio landing page (home, about, projects, blog, contact)
- **Admin** - Dashboard for content management (CMS)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Theme | next-themes (light/dark) |
| Icons | Material Symbols Outlined, Lucide React |
| Backend | Supabase (Auth + Database) |
| Validation | Zod |

---

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (admin)/                  # Admin route group (requires auth)
│   │   └── dashboard/            # Admin dashboard pages
│   ├── (public)/                 # Public route group
│   │   ├── layout.tsx            # Public layout (Header + Footer)
│   │   └── page.tsx              # Home page
│   ├── globals.css               # Global styles + Tailwind config
│   └── layout.tsx                # Root layout (ThemeProvider)
│
├── components/
│   ├── admin/                    # Admin-specific components
│   ├── public/                   # Public page components
│   │   ├── BentoCard.tsx         # Reusable card component
│   │   ├── Header.tsx            # Navigation header
│   │   └── Footer.tsx            # Page footer
│   └── shared/                   # Shared across admin/public
│       ├── ThemeProvider.tsx     # Theme context provider
│       └── ThemeToggle.tsx       # Dark/light mode toggle
│
├── actions/                      # Server Actions
├── lib/                          # Utilities and configurations
│   └── utils.ts                  # Helper functions (cn, etc.)
└── types/                        # TypeScript type definitions
```

---

## Routing Architecture

### Route Groups

| Group | Path | Purpose | Auth |
|-------|------|---------|------|
| `(public)` | `/` | Landing page | No |
| `(admin)` | `/dashboard/*` | Admin CMS | Yes |

### URL Structure

### URL Structure

```
/                     → Home (Current)
/about               → About Me (Future)
/projects            → Projects List (Future)
/projects/[slug]     → Project Details (Future)
/blog                → Blog Feed (Future)
/blog/[slug]         → Blog Post Details (Future)
/contact             → Contact Page (Future)

# Admin
/dashboard           → Overview
/dashboard/projects  → Manage Projects (CRUD)
/dashboard/blog      → Manage Posts (CRUD)
/dashboard/media     → Media Library (Storage)
/dashboard/settings  → Site Configuration
```

---

## Storage & Assets

We use **Supabase Storage** (compatible with S3/MinIO) for handling images and SVGs.

### Buckets
- `portfolio-assets`: Public bucket for blog images, project thumbnails, etc.
- `secure-docs`: Private bucket for resume PDFs or sensitive docs.

### Configuration
See `.env.example` for keys.

```env
NEXT_PUBLIC_STORAGE_ENDPOINT="https://..."
NEXT_PUBLIC_STORAGE_BUCKET="portfolio-assets"
```

### Usage Example
```typescript
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
const { data } = supabase.storage
  .from('portfolio-assets')
  .getPublicUrl('folder/image.png');
```

---

## Git Workflow

The project is connected to `https://github.com/ilramdhan/meespace.dev.git`.

### Push to Main
```bash
# 1. Initialize (if not already)
git init
git branch -M main

# 2. Add Remote
git remote add origin https://github.com/ilramdhan/meespace.dev.git

# 3. Commit & Push
git add .
git commit -m "feat: initial project setup"
git push -u origin main
```

---

## Component Guidelines

### Naming Conventions

```typescript
// ✅ Good - PascalCase for components
export function BentoCard() {}
export function HeroSection() {}

// ❌ Bad
export function bentoCard() {}
export function hero_section() {}
```

### Component Organization

```typescript
// 1. Imports (external → internal → types)
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

// 2. Types/Interfaces
interface BentoCardProps {
  children: ReactNode;
  className?: string;
}

// 3. Component
export function BentoCard({ children, className }: BentoCardProps) {
  return (
    <div className={cn("base-classes", className)}>
      {children}
    </div>
  );
}
```

### Reusable Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `BentoCard` | `components/public/` | Card container for bento grid |
| `ThemeToggle` | `components/shared/` | Light/dark mode switch |
| `ThemeProvider` | `components/shared/` | Theme context wrapper |
| `Button` | `components/shared/` | Primary/secondary/ghost buttons |
| `Card` | `components/shared/` | Unified card with rounded-xl |
| `PageHeader` | `components/shared/` | Page title and description |
| `Badge` | `components/shared/` | Status badges with variants |
| `Icon` | `components/shared/` | Material Symbols wrapper |

> **Important**: For detailed UI guidelines including color usage, button patterns, and layout rules, see [docs/UI_GUIDELINES.md](./docs/UI_GUIDELINES.md).

---

## Styling Guidelines

### Tailwind CSS v4 Configuration

All Tailwind config is in `globals.css`:

```css
/* Source paths - what files Tailwind scans */
@source "../components/**/*.{js,ts,jsx,tsx}";
@source "./**/*.{js,ts,jsx,tsx}";

/* Class-based dark mode for next-themes */
@variant dark (&:where(.dark, .dark *));

/* Custom colors */
@theme {
  --color-primary: #d0e6dc;
  --color-primary-dark: #b0c9be;
  --color-text-main: #121715;
  --color-text-muted: #658174;
  /* ... */
}
```

### Color Palette

| Name | Light | Dark | Usage |
|------|-------|------|-------|
| `primary` | `#d0e6dc` | same | Buttons, accents |
| `primary-dark` | `#b0c9be` | same | Hover states |
| `text-main` | `#121715` | `#ffffff` | Headings |
| `text-muted` | `#658174` | `#a3b5ae` | Body text |
| `background` | `#F5F5F7` | `#161c19` | Page bg |

### Dark Mode Pattern

Always define both light and dark variants:

```tsx
// ✅ Good
<div className="bg-white dark:bg-[#1e1e1e] text-text-main dark:text-white">

// ❌ Bad - missing dark variant
<div className="bg-white text-text-main">
```

---

## Backend Integration

### Supabase Setup

```typescript
// lib/supabase/client.ts - Client-side
import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// lib/supabase/server.ts - Server-side
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
```

### Server Actions Pattern

```typescript
// actions/content.ts
"use server";

import { z } from "zod";

const ContentSchema = z.object({
  title: z.string().min(1),
  body: z.string(),
});

export async function createContent(formData: FormData) {
  const validated = ContentSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
  });

  if (!validated.success) {
    return { error: validated.error.flatten() };
  }

  // Insert to Supabase...
}
```

---

## Data Management

### Mock Data Pattern (JSON)

To facilitate ease of backend integration, all static/dummy data is externalized into JSON files in `src/data/`. These files mimic potential API responses.

**Location:** `src/data/*.json`
**Types:** `src/types/data.ts`

**Usage Example:**

```typescript
import profile from "@/data/profile.json";
import { Profile } from "@/types/data";

// Type-safe usage
const userProfile: Profile = profile;

return <h1>{userProfile.name}</h1>;
```

**Why this pattern?**
1.  **Separation of Concerns:** UI logic is separate from data content.
2.  **API Readiness:** JSON structure matches expected API response format.
3.  **Easy Updates:** Content updates don't require touching component code.

---

## 🏗️ Adding New Pages

### 1. Public Pages (e.g., About, Services)
To add a new public page like `/about`:

1.  Create a folder: `src/app/(public)/about`
2.  Create `page.tsx`:
    ```tsx
    import { Metadata } from "next";

    export const metadata: Metadata = {
      title: "About Me",
      description: "My professional journey...",
    };

    export default function AboutPage() {
      return (
        <main className="container py-20">
          <h1 className="text-4xl font-bold">About Me</h1>
          {/* Content */}
        </main>
      );
    }
    ```

### 2. Admin Pages (e.g., Settings, Analytics)
To add a new admin page like `/dashboard/settings`:

1.  Create feature folder: `src/app/(admin)/dashboard/settings`
2.  Create `page.tsx`.
3.  **Authentication is auto-handled** by the layout in `(admin)`.

---

## 🔌 End-to-End Backend Integration

Follow this 5-step workflow to build a full CRUD feature (e.g., "Projects").

### Step 1: Database (Supabase)
Create your table in Supabase SQL Editor:
```sql
create table projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  image_url text,
  created_at timestamp with time zone default now()
);
```

### Step 2: Types (`src/types/`)
Define the TypeScript interface in `src/types/project.ts`:
```typescript
export interface Project {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}
```

### Step 3: Schema (`src/lib/schemas/`)
Define Zod schema for validation in `src/lib/schema.ts` (or feature specific):
```typescript
import { z } from "zod";

export const ProjectSchema = z.object({
  title: z.string().min(3, "Title too short"),
  description: z.string().optional(),
});
```

### Step 4: Server Action (`src/actions/`)
Create `src/actions/project.ts`. **Always use "use server"**.

```typescript
"use server";

import { createClient } from "@/lib/supabase/server";
import { ProjectSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";

export async function createProject(formData: FormData) {
  // 1. Validate
  const validated = ProjectSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
  });

  if (!validated.success) return { error: validated.error.flatten() };

  // 2. Auth & DB
  const supabase = createClient();
  const { error } = await supabase
    .from("projects")
    .insert(validated.data);

  if (error) return { error: error.message };

  // 3. Revalidate & Redirect
  revalidatePath("/dashboard/projects");
  return { success: true };
}
```

### Step 5: UI Component (`src/components/`)
Connect the action to a Client Component form.

```tsx
"use client";

import { createProject } from "@/actions/project";

export function ProjectForm() {
  async function handleSubmit(formData: FormData) {
    const result = await createProject(formData);
    if (result.error) alert("Error!");
    else alert("Success!");
  }

  return (
    <form action={handleSubmit}>
      <input name="title" placeholder="Project Title" required />
      <textarea name="description" placeholder="Description" />
      <button type="submit">Save Project</button>
    </form>
  );
}
```

---

## Best Practices


### ✅ DO

- Use `cn()` utility for conditional classnames
- Always provide `dark:` variants for colors
- Keep components small and focused
- Use Server Components by default
- Add `"use client"` only when needed
- Validate all inputs with Zod
- Use TypeScript strictly

### ❌ DON'T

- Don't use inline styles
- Don't hardcode colors (use theme colors)
- Don't put business logic in components
- Don't skip TypeScript types
- Don't use `any` type
- Don't mix client/server logic in same file

### File Naming

```
components/
  ComponentName.tsx    # PascalCase for components
  
lib/
  utils.ts            # camelCase for utilities
  supabase-client.ts  # kebab-case for configs

types/
  content.ts          # camelCase for type files
```

---

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm start
```

---

*Last updated: January 2026*
