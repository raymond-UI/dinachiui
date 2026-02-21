"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearch } from "./search-provider";

export function SearchTrigger({ variant = "header" }: { variant?: "header" | "sidebar" }) {
  const { open } = useSearch();

  if (variant === "sidebar") {
    return (
      <Button
        variant="outline"
        onClick={open}
        className="flex w-full items-center gap-2 justify-start h-auto px-3 py-1.5 text-sm text-muted-foreground"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="flex-1 text-left">Search...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:inline-flex">
          <span className="text-xs">&#8984;</span>K
        </kbd>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={open}
      className="relative justify-start gap-2 text-muted-foreground w-full sm:w-56 lg:w-64 sm:pr-12"
    >
      <Search className="h-3.5 w-3.5 shrink-0" />
      <span className="hidden lg:inline-flex">Search documentation...</span>
      <span className="inline-flex lg:hidden">Search...</span>
      <kbd className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
        <span className="text-xs">&#8984;</span>K
      </kbd>
    </Button>
  );
}
