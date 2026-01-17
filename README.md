# Sarah Jenkins - Senior Business System Analyst Portfolio

![Portfolio Preview](https://github.com/ilramdhan/meespace.dev/raw/main/public/og-image.jpg)

A modern, high-performance portfolio website designed for a Senior Business System Analyst. Built with **Next.js 16**, **Tailwind CSS v4**, and **Supabase**, featuring a responsive Bento Grid layout, dark mode support, and an integrated Admin CMS.

## 🚀 Features

- **Modern Design**: Bento Grid layout with glassmorphism and smooth animations.
- **Theming**: Fully responsive Light and Dark mode (via `next-themes`).
- **CMS Ready**: Admin dashboard for managing projects, blog posts, and media.
- **Performance**: Optimized with Next.js App Router and Server Components.
- **SEO**: Dynamic metadata, OpenGraph support, and semantic HTML.
- **Tech Stack**: TypeScript, Tailwind CSS v4, Zod, Supabase.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Backend**: [Supabase](https://supabase.com/) (Postgres DB + Auth + Storage)
- **Icons**: [Material Symbols](https://fonts.google.com/icons) & [Lucide React](https://lucide.dev/)
- **Validation**: [Zod](https://zod.dev/)

## 🏁 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (for backend)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ilramdhan/meespace.dev.git
   cd meespace.dev
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase keys in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   SUPABASE_SERVICE_ROLE_KEY="your-service-key"
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the site.

## 📂 Project Structure

This project follows a modular App Router structure:

```
src/
├── app/                  # Routes (Public & Admin)
├── components/           # UI Components (Atomic design)
│   ├── admin/            # Admin-specific components
│   ├── public/           # Public page components
│   └── shared/           # Shared reusable components
├── data/                 # Static JSON Data (Mock)
├── lib/                  # Utilities & Configs
├── actions/              # Server Actions (Backend Logic)
└── types/                # TypeScript Interfaces
```

## 🧩 Shared Components

Reusable UI components for consistency across all pages:

| Component | Purpose |
|-----------|---------|
| `Button` | Primary/secondary/ghost button variants |
| `Card` | Consistent card with rounded-xl styling |
| `PageHeader` | Page title and description |
| `Badge` | Status badges with color variants |
| `Icon` | Material Symbols icon wrapper |

For detailed usage, see [UI Guidelines](./docs/UI_GUIDELINES.md).

For a deep dive into the architecture, routing, and coding standards, please read [CONTRIBUTING.md](./CONTRIBUTING.md).

## 🤝 Contributing

We welcome contributions! Please check our [Contribution Guidelines](./CONTRIBUTING.md) for details on:
- Best Practices
- Backend Integration Workflow
- Component Standards

## 📄 License

This project is licensed under the MIT License.
