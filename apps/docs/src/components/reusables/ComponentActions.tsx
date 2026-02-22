"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Check, ChevronDown } from "lucide-react";
import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
} from "@/components/ui/menu";
import { propsRegistry } from "@/lib/props-registry";
import type { ComponentExample } from "@/lib/examples-registry";

const AI_SERVICES = [
  {
    label: "Claude",
    baseUrl: "https://claude.ai/new",
    queryParam: "q",
  },
  {
    label: "ChatGPT",
    baseUrl: "https://chatgpt.com",
    queryParam: "q",
  },
] as const;

function extractAttribute(tag: string, attr: string): string | null {
  const regex = new RegExp(`${attr}="([^"]*)"`)
  const match = tag.match(regex)
  return match ? match[1] : null
}

function resolveComponentPreview(tag: string, registry: Record<string, ComponentExample[]>): string {
  const name = extractAttribute(tag, "name") ?? "";
  const title = extractAttribute(tag, "title") ?? "";
  const description = extractAttribute(tag, "description") ?? "";

  for (const examples of Object.values(registry)) {
    const match = examples.find((ex) => ex.componentId === name);
    if (match) {
      return `### ${title || match.name}\n\n${description || match.description}\n\n\`\`\`tsx\n${match.code}\n\`\`\``;
    }
  }
  return `### ${title}\n\n${description}`;
}

function parsePropsTable(block: string): string {
  const idMatch = block.match(/id="([^"]*)"/);
  if (!idMatch) return "";

  const id = idMatch[1];
  const props = propsRegistry[id];
  if (!props || props.length === 0) return "";

  let table =
    "| Prop | Type | Default | Description |\n|------|------|---------|-------------|\n";
  for (const p of props) {
    table += `| \`${p.name}\` | \`${p.type}\` | ${p.default ? `\`${p.default}\`` : "—"} | ${p.description} |\n`;
  }
  return table;
}

function resolveInstallTabs(
  cliCommand: string,
  source: string | null,
  dependencies: string[],
): string {
  let md = "**CLI**\n\n```bash\n" + cliCommand + "\n```\n\n";
  md += "**Manual**\n\n";
  if (dependencies.length > 0) {
    md += "Install dependencies:\n\n```bash\nnpm install " + dependencies.join(" ") + "\n```\n\n";
  }
  if (source) {
    md += "Copy and paste the component into your project:\n\n```tsx\n" + source + "\n```";
  }
  return md;
}

function mdxToMarkdown(
  rawContent: string,
  title: string,
  description: string,
  source: string | null,
  dependencies: string[],
  registry: Record<string, ComponentExample[]>,
): string {
  let md = `# ${title}\n\n${description}\n\n`;

  let content = rawContent;

  // Replace <InstallCommand cli="..." /> or <InstallTabs cli="..." />
  content = content.replace(
    /<(?:InstallCommand|InstallTabs)\s+cli="([^"]*)"\s*\/>/g,
    (_match, cli: string) => resolveInstallTabs(cli, source, dependencies),
  );

  // Replace <ComponentPreview ... /> (attributes in any order, values may contain /)
  content = content.replace(
    /<ComponentPreview\s[^>]*>/g,
    (match) => resolveComponentPreview(match, registry),
  );

  // Replace <PropsTable ... /> (multiline)
  content = content.replace(/<PropsTable[\s\S]*?\/>/g, (match) =>
    parsePropsTable(match),
  );

  md += content;
  return md.trim();
}

interface ComponentActionsProps {
  title: string;
  description: string;
  slug: string;
  rawContent: string;
  source?: string | null;
  dependencies?: string[];
  pageUrl?: string;
  sourceUrl?: string;
}

export function ComponentActions({
  title,
  description,
  slug,
  rawContent,
  source = null,
  dependencies = [],
  pageUrl,
  sourceUrl,
}: ComponentActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyMarkdown = useCallback(async () => {
    try {
      const { examplesRegistry } = await import("@/lib/examples-registry");
      const markdown = mdxToMarkdown(rawContent, title, description, source, dependencies, examplesRegistry);
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy markdown:", err);
    }
  }, [rawContent, title, description, source, dependencies]);

  const getPageUrl = useCallback(() => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return pageUrl ?? `https://beta.dinachi.dev/docs/${slug}`;
  }, [slug, pageUrl]);

  const generateAIUrl = useCallback(
    (service: (typeof AI_SERVICES)[number]) => {
      const prompt = `I'm looking at the ${title} documentation from Dinachi UI: ${getPageUrl()}\n\nHelp me understand this. Be ready to explain concepts, give examples, or help debug based on it.`;
      const encodedQuery = encodeURIComponent(prompt);
      return `${service.baseUrl}?${service.queryParam}=${encodedQuery}`;
    },
    [title, getPageUrl],
  );

  return (
    <div className="flex items-center justify-between mt-2">
      <div className="flex items-center gap-2">
        {/* Split button: Copy Page + dropdown chevron */}
        <div className="inline-flex items-center rounded-md border border-input">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyMarkdown}
            className="rounded-r-none border-0 min-w-33"
          >
            {copied ? (
              <>
                <Check className="size-4 mr-2" />
                Copied Page
              </>
            ) : (
              <>
                <Copy className="size-4 mr-2" />
                Copy Page
              </>
            )}
          </Button>
          <div className="w-px h-5 bg-border" />
          <Menu>
            <MenuTrigger className="h-9 w-8 rounded-l-none rounded-r-md border-0 min-w-0 px-0 flex items-center justify-center hover:bg-accent hover:text-accent-foreground cursor-pointer">
              <ChevronDown className="size-3.5" />
            </MenuTrigger>
            <MenuContent>
              {AI_SERVICES.map((service) => (
                <MenuItem
                  key={service.label}
                  className="cursor-pointer"
                  render={
                    <a
                      href={generateAIUrl(service)}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  <ExternalLink className="size-3.5 mr-2 opacity-50" />
                  Open in {service.label}
                </MenuItem>
              ))}
            </MenuContent>
          </Menu>
        </div>
      </div>
      {sourceUrl && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          View Source
        </a>
      )}
    </div>
  );
}
