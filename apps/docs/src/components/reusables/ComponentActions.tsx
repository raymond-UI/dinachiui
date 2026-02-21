"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Check } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { examplesRegistry } from "@/lib/examples-registry";

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
  {
    label: "Gemini",
    baseUrl: "https://gemini.google.com/app",
    queryParam: "q",
  },
] as const;

function extractAttribute(tag: string, attr: string): string | null {
  const regex = new RegExp(`${attr}="([^"]*)"`)
  const match = tag.match(regex)
  return match ? match[1] : null
}

function resolveComponentPreview(tag: string): string {
  const name = extractAttribute(tag, "name") ?? "";
  const title = extractAttribute(tag, "title") ?? "";
  const description = extractAttribute(tag, "description") ?? "";

  for (const examples of Object.values(examplesRegistry)) {
    const match = examples.find((ex) => ex.componentId === name);
    if (match) {
      return `### ${title || match.name}\n\n${description || match.description}\n\n\`\`\`tsx\n${match.code}\n\`\`\``;
    }
  }
  return `### ${title}\n\n${description}`;
}

function parsePropsTable(block: string): string {
  const props: Array<{
    name: string;
    type: string;
    default?: string;
    description: string;
  }> = [];

  const propObjRegex = /\{[^}]*name:\s*"([^"]*)"[^}]*\}/g;
  let objMatch;
  while ((objMatch = propObjRegex.exec(block)) !== null) {
    const obj = objMatch[0];
    const name = obj.match(/name:\s*"([^"]*)"/)?.[1] ?? "";
    const type = obj.match(/type:\s*"([^"]*)"/)?.[1] ?? "";
    const defaultVal = obj.match(/default:\s*"([^"]*)"/)?.[1];
    const desc = obj.match(/description:\s*"([^"]*)"/)?.[1] ?? "";
    props.push({ name, type, default: defaultVal, description: desc });
  }

  if (props.length === 0) return "";

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
    (match) => resolveComponentPreview(match),
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
}

export function ComponentActions({
  title,
  description,
  slug,
  rawContent,
  source = null,
  dependencies = [],
  pageUrl,
}: ComponentActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyMarkdown = useCallback(async () => {
    try {
      const markdown = mdxToMarkdown(rawContent, title, description, source, dependencies);
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
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={handleCopyMarkdown}>
        {copied ? (
          <>
            <Check className="size-4 text-green-500" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="size-4 mr-2" />
            Copy as Markdown
          </>
        )}
      </Button>
      <Popover>
        <PopoverTrigger
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-input bg-transparent px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
        >
          <ExternalLink className="size-4" />
          Open in AI
        </PopoverTrigger>
        <PopoverContent className="w-48 px-2! py-2!" align="start">
          <div className="flex flex-col gap-1">
            {AI_SERVICES.map((service) => (
              <a
                key={service.label}
                href={generateAIUrl(service)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <span>{service.label}</span>
                <ExternalLink className="size-3 opacity-50" />
              </a>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
