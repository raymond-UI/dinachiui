import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Playground - DinachiUI",
  description:
    "Generate DinachiUI interfaces from natural language descriptions using AI.",
};

export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
