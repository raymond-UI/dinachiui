"use client";

import { useState, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";

type CollapsibleProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export function MdxCollapsible({
  title,
  children,
  defaultOpen = false,
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="my-4 rounded-xl border border-border bg-muted/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center cursor-pointer gap-2 px-4 py-3 text-left font-medium text-foreground transition-all ease-out duration-200 hover:bg-accent/15 rounded-xl ${isOpen ? "rounded-b-none" : ""}`}
        aria-expanded={isOpen}
      >
        <ChevronRight
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            isOpen ? "rotate-90" : ""
          }`}
        />
        {title}
      </button>
      {isOpen && (
        <div className="border-t border-border px-4 py-3 text-muted-foreground">
          {children}
        </div>
      )}
    </div>
  );
}
