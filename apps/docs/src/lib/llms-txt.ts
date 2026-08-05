import { publicComponents } from "@dinachi/components/component-inventory";
import { getAllComponents } from "@/lib/components";
import { getAllDocs } from "@/lib/docs";

/**
 * The agent-facing rendering of this site, as served at `/llms.txt`.
 *
 * Lives here rather than in the route so a page can show the same bytes a crawler
 * receives. Anything that diverges from what is actually served would make the
 * comparison a lie.
 */
export async function buildLlmsTxt(): Promise<string> {
  const components = await getAllComponents();
  const docs = await getAllDocs();

  const componentList = components
    .map(
      (c) =>
        `- [${c.title}](https://dinachi.dev/docs/components/${c.slug}): ${c.description}`
    )
    .join("\n");

  // Counted rather than written down, so the number cannot drift from the inventory the
  // CLI installs from. The tiers matter to an agent: `add --all` will not produce a
  // motion component, and reading the wrong count as the whole surface hides ten of them.
  const motionCount = publicComponents.filter(
    (c) => c.category === "Motion"
  ).length;
  const coreCount = publicComponents.length - motionCount;

  const docList = docs
    .map(
      (d) =>
        `- [${d.title}](https://dinachi.dev/docs/${d.slug}): ${d.description}`
    )
    .join("\n");

  return `# DinachiUI

> Production-ready React component library built on Base UI with Tailwind CSS. Copy-paste components with full ownership via CLI.

DinachiUI provides ${publicComponents.length} accessible React components that you install directly into your project using a CLI tool. Components are built on Base UI primitives for accessibility, styled with Tailwind CSS, and fully customizable.

They come in two tiers. The core tier is ${coreCount} components built on Base UI; \`npx @dinachi/cli@latest add --all\` installs all of them. The motion tier is ${motionCount} animated components that depend on [motion](https://motion.dev) and install separately with \`npx @dinachi/cli@latest add --motion\`. Naming a motion component installs it on its own either way.

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
}
