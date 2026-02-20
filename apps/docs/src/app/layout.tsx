import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

import "./globals.css";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";
import PublicHeader from "@/components/reusables/PublicHeader";

export const metadata: Metadata = {
  title: "DinachiUI - Production-ready React components",
  description:
    "Build faster with 35+ production-ready React components. Copy, paste, and customize. Built on Base UI foundation with accessibility in mind.",
  keywords: [
    "React",
    "components",
    "UI",
    "design system",
    "TypeScript",
    "Tailwind CSS",
    "accessibility",
  ],
  authors: [{ name: "DinachiUI Team" }],
  creator: "DinachiUI",
  metadataBase: new URL("https://dinachi.dev"),
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(GeistSans.variable, GeistMono.variable)} suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main className="flex flex-col relative w-full overflow-y-auto h-dvh sm:h-screen">
            <PublicHeader />
            <div className="w-full h-full">

            {children}
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
