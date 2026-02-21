"use client";

import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

interface DocPageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  sourceUrl?: string;
  children: React.ReactNode;
}

export default function DocPageHeader({
  title = "Page Title",
  description = "Page Description",
  action,
  className,
  sourceUrl,
  children,
}: DocPageHeaderProps) {
  return (
    <div
      className={cn(
        "w-full bg-radial from-accent/5 to-muted/5 backdrop-blur-xs border-[0.5px] border-r-0 border-accent",
        className,
      )}
    >
      <div className="flex flex-col gap-2 border-border border-dashed border-b p-2 lg:p-6 mb-12">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground text-pretty">{description}</p>
        {action && action}
        {sourceUrl && (
          <div className="flex items-center gap-2">
            <a
              href={sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View Source
            </a>
          </div>
        )}
      </div>
      <div className="space-y-4 lg:space-y-12 px-2 lg:px-6">{children}</div>
    </div>
  );
}
