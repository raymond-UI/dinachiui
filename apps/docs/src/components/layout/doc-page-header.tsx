"use client";

import { cn } from "@/lib/utils";

interface DocPageHeaderProps {
  title: string;
  description?: string;
  /** Sits beside the title. Used to mark a component as belonging to an opt-in tier. */
  badge?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export default function DocPageHeader({
  title = "Page Title",
  description = "Page Description",
  badge,
  action,
  className,
  children,
}: DocPageHeaderProps) {
  return (
    <div
      className={cn(
        "w-full bg-radial from-accent/5 to-muted/5 border-[0.5px] border-r-0 lg:border-r border-accent",
        className,
      )}
    >
      <div className="flex flex-col gap-1 border-border border-dashed border-b p-2 lg:p-6 mb-12">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl font-bold">{title}</h1>
          {badge}
        </div>
        <p className="text-muted-foreground text-pretty text-sm">{description}</p>
        {action && action}
      </div>
      <div className="space-y-4 lg:space-y-12 px-2 lg:px-6">{children}</div>
    </div>
  );
}
