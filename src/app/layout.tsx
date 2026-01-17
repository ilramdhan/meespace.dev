import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/shared/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'Sarah Jenkins | Senior Business System Analyst',
    template: '%s | Sarah Jenkins',
  },
  description: 'Senior Business System Analyst bridging business needs with technical solutions. Expert in PRDs, UML, and Agile transformations.',
  keywords: ['Business System Analyst', 'Product Management', 'Agile', 'FinTech', 'SaaS', 'PRD', 'UML'],
  authors: [{ name: 'Sarah Jenkins' }],
  creator: 'Sarah Jenkins',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Sarah Jenkins Portfolio',
    title: 'Sarah Jenkins | Senior Business System Analyst',
    description: 'Bridging Business Needs with Technical Solutions',
    images: [
      {
        url: '/og-image.jpg', // Placeholder for public/og-image.jpg
        width: 1200,
        height: 630,
        alt: 'Sarah Jenkins Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@sarahjenkins',
  },
  robots: {
    index: true,
    follow: true,
  },
};

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
      </body>
    </html>
  );
}

