"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSearch } from "./search-provider";

export function SearchTrigger({
  variant,
  className,
}: {
  variant: "sidebar" | "inline";
  className?: string;
}) {
  const { open } = useSearch();

  if (variant === "sidebar") {
    return (
      <Button
        variant="outline"
        onClick={open}
        className={cn(
          "flex w-full items-center gap-2 justify-start h-auto px-3 py-1.5 text-sm text-muted-foreground",
          className,
        )}
      >
        <Search className="h-3.5 w-3.5" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:inline-flex">
          <span className="text-xs">&#8984;</span>K
        </kbd>
      </Button>
    );
  }

  // No box. In a header the search field is the widest thing on the row and it is
  // competing with the nav for a job the shortcut already does.
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={open}
      className={cn(
        "h-8 gap-1.5 px-2 text-sm font-normal text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      <span>Search</span>
      <kbd className="pointer-events-none select-none font-sans text-xs text-muted-foreground/60">
        <span className="text-[13px]">&#8984;</span>K
      </kbd>
    </Button>
  );
}
