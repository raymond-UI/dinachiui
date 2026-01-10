"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ComponentDoc } from "@/lib/components-registry";

// AI service configurations
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

// Generate markdown documentation from component data
function generateMarkdown(component: ComponentDoc): string {
  const propsTable = component.props.length > 0
    ? `## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
${component.props.map(p => `| \`${p.name}\` | \`${p.type}\` | ${p.defaultValue ?? '-'} | ${p.description} |`).join('\n')}`
    : '';

  const examples = component.examples.length > 0
    ? `## Examples

${component.examples.map(ex => `### ${ex.name}

${ex.description}

\`\`\`tsx
${ex.code}
\`\`\``).join('\n\n')}`
    : '';

  const dependencies = component.dependencies.length > 0
    ? `## Dependencies

${component.dependencies.map(d => `- \`${d}\``).join('\n')}`
    : '';

  return `# ${component.name}

${component.description}

## Installation

\`\`\`bash
${component.installation.cli}
\`\`\`

## Usage

\`\`\`tsx
${component.usage}
\`\`\`

${propsTable}

${examples}

${dependencies}

## Source

[View source on GitHub](${component.source})
`.trim();
}

// Generate AI chat URL with pre-filled prompt
function generateAIUrl(
  service: typeof AI_SERVICES[number],
  component: ComponentDoc,
  pageUrl: string
): string {
  const prompt = `I'm looking at the ${component.name} component documentation from Dinachi UI: ${pageUrl}

Help me understand how to use it. Be ready to explain concepts, give examples, or help debug based on it.`;

  const encodedQuery = encodeURIComponent(prompt);
  return `${service.baseUrl}?${service.queryParam}=${encodedQuery}`;
}

interface ComponentActionsProps {
  component: ComponentDoc;
}

export function ComponentActions({ component }: ComponentActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyMarkdown = useCallback(async () => {
    try {
      const markdown = generateMarkdown(component);
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy markdown:", err);
    }
  }, [component]);

  const getPageUrl = useCallback(() => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return `https://dinachi.dev/docs/components/${component.slug}`;
  }, [component.slug]);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        onClick={handleCopyMarkdown}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-input bg-transparent px-4 py-2 text-sm font-medium ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {copied ? (
          <>
            <Check className="size-4 text-green-500" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="size-4" />
            Copy as Markdown
          </>
        )}
      </Button>
      <Popover>
        <PopoverTrigger
          openOnHover
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-input bg-transparent px-4 py-2 text-sm font-medium ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <ExternalLink className="size-4" />
          Open in AI
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2" align="start">
          <div className="flex flex-col gap-1">
            {AI_SERVICES.map((service) => (
              <a
                key={service.label}
                href={generateAIUrl(service, component, getPageUrl())}
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

