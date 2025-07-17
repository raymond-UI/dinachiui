import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "DinachiUI - Production-ready React components",
  description:
    "Build faster with 20+ production-ready React components. Copy, paste, and customize. Built on Base UI foundation with accessibility in mind.",
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
      "Build faster with 20+ production-ready React components. Copy, paste, and customize.",
    type: "website",
    locale: "en_US",
    url: "https://dinachi.dev",
    siteName: "DinachiUI",
  },
  twitter: {
    card: "summary_large_image",
    title: "DinachiUI - Production-ready React components",
    description:
      "Build faster with 20+ production-ready React components. Copy, paste, and customize.",
    creator: "@dinachiUI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
