import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Fetch settings for dynamic metadata
async function getSettings() {
  try {
    const res = await fetch(`${baseUrl}/api/v1/settings`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  const siteName = settings?.site_name || 'Meyspace';
  const seoTitle = settings?.seo_title || `${siteName} | Portfolio`;
  const seoDescription = settings?.seo_description || 'Personal portfolio website showcasing projects, insights, and professional experience.';
  const seoKeywords = settings?.seo_keywords?.split(',').map((k: string) => k.trim()) || ['Portfolio', 'Developer', 'Designer', 'Projects', 'Blog', 'Insights'];
  const faviconUrl = settings?.favicon_url || '/favicon.ico';
  const ogImageUrl = settings?.og_image_url || `${baseUrl}/og-image.svg`;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: seoTitle,
      template: `%s | ${siteName}`,
    },
    description: seoDescription,
    keywords: seoKeywords,
    authors: [{ name: siteName }],
    creator: siteName,
    icons: {
      icon: [
        { url: faviconUrl, sizes: 'any' },
      ],
      apple: faviconUrl,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: baseUrl,
      siteName: siteName,
      title: seoTitle,
      description: seoDescription,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${siteName} Portfolio`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Material Symbols Outlined for icons */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/30",
          inter.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
