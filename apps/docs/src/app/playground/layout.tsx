import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Playground - DinachiUI",
  description:
    "Generate DinachiUI interfaces from natural language descriptions using AI.",
  robots: { index: false, follow: false },
};

/**
 * Off the public site while the generative UI work is paused. The page and its
 * API route stay in the tree; set ENABLE_PLAYGROUND=true to run them locally.
 */
const ENABLED = process.env.ENABLE_PLAYGROUND === "true";

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!ENABLED) notFound();
  return <>{children}</>;
}
