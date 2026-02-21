import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import "./globals.css";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";
import PublicHeader from "@/components/reusables/PublicHeader";
import { SearchProvider, SearchModal } from "@/components/search";

export const metadata: Metadata = {
  title: {
    default: "DinachiUI - Production-ready React components",
    template: "%s - DinachiUI",
  },
  description:
    "Build faster with 35+ production-ready React components. Copy, paste, and customize. Built on Base UI with Tailwind CSS.",
  keywords: [
    "React",
    "components",
    "UI library",
    "design system",
    "TypeScript",
    "Tailwind CSS",
    "Base UI",
    "accessibility",
    "copy paste components",
  ],
  authors: [{ name: "DinachiUI Team" }],
  creator: "DinachiUI",
  metadataBase: new URL("https://dinachi.dev"),
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    types: {
      "text/plain": "/llms.txt",
    },
  },
  openGraph: {
    title: "DinachiUI - Production-ready React components",
    description:
      "Build faster with 35+ production-ready React components. Copy, paste, and customize.",
    type: "website",
    locale: "en_US",
    url: "https://dinachi.dev",
    siteName: "DinachiUI",
  },
  twitter: {
    card: "summary_large_image",
    title: "DinachiUI - Production-ready React components",
    description:
      "Build faster with 35+ production-ready React components. Copy, paste, and customize.",
    creator: "@dinachiUI",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "DinachiUI",
  url: "https://dinachi.dev",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  description:
    "Production-ready React component library built on Base UI with Tailwind CSS. Copy-paste components with full ownership via CLI.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(GeistSans.variable, GeistMono.variable)} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SearchProvider>
            <main className="flex flex-col relative w-full overflow-y-auto h-dvh sm:h-screen">
              <PublicHeader />
              <div className="w-full h-full">
                {children}
              </div>
            </main>
            <SearchModal />
          </SearchProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
