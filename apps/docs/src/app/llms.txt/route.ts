import { NextResponse } from "next/server";
import { getAllComponents } from "@/lib/components";
import { getAllDocs } from "@/lib/docs";

export async function GET() {
  const components = await getAllComponents();
  const docs = await getAllDocs();

  const componentList = components
    .map(
      (c) =>
        `- [${c.title}](https://dinachi.dev/docs/components/${c.slug}): ${c.description}`
    )
    .join("\n");

  const docList = docs
    .map(
      (d) =>
        `- [${d.title}](https://dinachi.dev/docs/${d.slug}): ${d.description}`
    )
    .join("\n");

  const content = `# DinachiUI

> Production-ready React component library built on Base UI with Tailwind CSS. Copy-paste components with full ownership via CLI.

DinachiUI provides 35+ accessible React components that you install directly into your project using a CLI tool. Components are built on Base UI primitives for accessibility, styled with Tailwind CSS, and fully customizable.

## Getting Started

- [Installation](https://dinachi.dev/docs/installation): Get started with any React framework
- [Next.js Guide](https://dinachi.dev/docs/installation/nextjs): Step-by-step Next.js setup
- [Vite Guide](https://dinachi.dev/docs/installation/vite): Step-by-step Vite setup
- [CLI Reference](https://dinachi.dev/docs/cli): CLI commands and configuration

## Documentation

${docList}

## Components

${componentList}

## Links

- [GitHub](https://github.com/raymond-UI/dinachiUI)
- [npm](https://www.npmjs.com/package/@dinachi/cli)
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control":
        "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
