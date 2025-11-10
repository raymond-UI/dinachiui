"use client";

import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface AIOption {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface ComponentActionsProps {
  onCopyMarkdown?: () => void;
  aiOptions?: AIOption[];
  getAIUrl?: (option: AIOption) => string;
}

const defaultAIOptions: AIOption[] = [
  { label: "Claude", href: "https://claude.ai" },
  { label: "ChatGPT", href: "https://chatgpt.com" },
  { label: "Gemini", href: "https://gemini.google.com" },
];

export function ComponentActions({
  onCopyMarkdown,
  aiOptions = defaultAIOptions,
  getAIUrl,
}: ComponentActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={onCopyMarkdown} className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-input bg-transparent px-4 py-2 text-sm font-medium ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        <Copy className="size-4" />
        Copy as Markdown
      </Button>
      <Popover openOnHover>
        <PopoverTrigger
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-input bg-transparent px-4 py-2 text-sm font-medium ring-offset-background hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <ExternalLink className="size-4" />
          Open in AI
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2" align="start">
          <div className="flex flex-col gap-1">
            {aiOptions.map((option) => (
              <a
                key={option.label}
                href={getAIUrl ? getAIUrl(option) : option.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <span>{option.label}</span>
                <ExternalLink className="size-3 opacity-50" />
              </a>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

