"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, Component, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogPortal,
  DialogBackdrop,
  DialogPopup,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ScrollArea,
  ScrollAreaViewport,
  ScrollAreaContent,
  ScrollAreaScrollbar,
  ScrollAreaThumb,
} from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { useSearch } from "./search-provider";
import { useSearchIndex } from "@/hooks/use-search-index";
import { useHotkey } from "@/hooks/use-hotkey";
import type { SearchItem } from "@/lib/search-data";

export function SearchModal() {
  const { isOpen, open, close } = useSearch();
  const { search } = useSearchIndex();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cmd+K / Ctrl+K to toggle
  useHotkey("k", useCallback(() => {
    if (isOpen) close();
    else open();
  }, [isOpen, open, close]));

  const groupedResults = search(query);
  const flatResults = groupedResults.flatMap((g) => g.items);

  // Reset active index on query change
  useEffect(() => setActiveIndex(0), [query]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setActiveIndex(0);
    }
  }, [isOpen]);

  const navigateTo = useCallback(
    (item: SearchItem) => {
      close();
      router.push(item.href);
    },
    [close, router],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) => Math.min(prev + 1, flatResults.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (flatResults[activeIndex]) {
            navigateTo(flatResults[activeIndex]);
          }
          break;
      }
    },
    [activeIndex, flatResults, navigateTo],
  );

  // Scroll active item into view
  useEffect(() => {
    const el = document.querySelector(`[data-search-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  let flatIndex = 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) close(); }}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup
          className="fixed left-[50%] top-[15%] z-50 w-[calc(100%-2rem)] max-w-lg translate-x-[-50%] translate-y-0 gap-0 border bg-background p-0 shadow-lg rounded-xl data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:scale-95 data-ending-style:opacity-0 transition-all duration-150 overflow-hidden"
          onKeyDown={handleKeyDown}
        >
          <DialogTitle className="sr-only">Search documentation</DialogTitle>

          {/* Search input */}
          <div className="flex items-center px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search components, pages..."
              className="h-11 border-0 shadow-none ring-0 focus-visible:ring-0 focus-visible:border-0 bg-transparent px-0"
              autoFocus
            />
            <Badge variant="outline" className="text-[10px] shrink-0">
              ESC
            </Badge>
          </div>

          <Separator />

          {/* Results */}
          <ScrollArea className="max-h-[300px]">
            <ScrollAreaViewport>
              <ScrollAreaContent>
                {groupedResults.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    No results found for &ldquo;{query}&rdquo;
                  </div>
                ) : (
                  groupedResults.map((group, groupIdx) => (
                    <div key={group.category}>
                      {groupIdx > 0 && <Separator />}
                      <div className="px-3 py-1.5">
                        <Badge variant="outline" className="text-[10px] font-medium">
                          {group.category}
                        </Badge>
                      </div>
                      {group.items.map((item) => {
                        const idx = flatIndex++;
                        return (
                          <Button
                            key={item.id}
                            variant="ghost"
                            data-search-index={idx}
                            className={cn(
                              "relative flex w-full justify-start rounded-none h-auto px-3 py-2 text-sm font-normal",
                              idx === activeIndex
                                ? "bg-accent text-accent-foreground"
                                : "text-foreground",
                            )}
                            onClick={() => navigateTo(item)}
                            onMouseEnter={() => setActiveIndex(idx)}
                          >
                            {item.type === "page" ? (
                              <FileText className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                            ) : (
                              <Component className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
                            )}
                            <span className="flex-1 text-left">{item.title}</span>
                            {idx === activeIndex && (
                              <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            )}
                          </Button>
                        );
                      })}
                    </div>
                  ))
                )}
              </ScrollAreaContent>
            </ScrollAreaViewport>
            <ScrollAreaScrollbar orientation="vertical">
              <ScrollAreaThumb />
            </ScrollAreaScrollbar>
          </ScrollArea>

          <Separator />

          {/* Footer hints */}
          <div className="flex items-center px-3 py-2">
            <div className="flex gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Badge variant="outline" className="text-[10px] px-1 py-0">&#8593;&#8595;</Badge>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <Badge variant="outline" className="text-[10px] px-1 py-0">&#8629;</Badge>
                Open
              </span>
              <span className="flex items-center gap-1">
                <Badge variant="outline" className="text-[10px] px-1 py-0">esc</Badge>
                Close
              </span>
            </div>
          </div>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
