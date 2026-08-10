"use client";

import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar";
import {
  categories,
  getComponentsByCategory,
  integrations,
} from "@/lib/component-metadata";
import { SearchTrigger } from "@/components/search";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useSidebar } from "../ui/sidebar";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarItem {
  title: string;
  href: string;
  isNew?: boolean;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
  /** Set in the margin beside the heading. Component categories only. */
  count?: number;
}

export function SidebarNavigation() {
  const pathname = usePathname();
  const { isMobile, setOpen } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpen(false);
    }
  };

  const activeRef = useCallback((node: HTMLAnchorElement | null) => {
    if (node) {
      node.scrollIntoView({ block: "center" });
    }
  }, []);

  const sections = useMemo<SidebarSection[]>(() => {
    const componentSections = categories.map<SidebarSection>((category) => {
      const items = [...getComponentsByCategory(category)].sort((a, b) =>
        a.name.localeCompare(b.name),
      );

      return {
        title: category,
        count: items.length,
        items: items.map((c) => ({
          title: c.name,
          href: `/docs/components/${c.slug}`,
          isNew: c.isNew,
        })),
      };
    });

    return [
      {
        title: "Getting started",
        items: [
          { title: "Conventions", href: "/docs/conventions" },
          { title: "Installation", href: "/docs/installation" },
          { title: "CLI", href: "/docs/cli" },
          { title: "Skills", href: "/docs/skills" },
          { title: "LLMs", href: "/llms.txt" },
        ],
      },
      {
        title: "Foundations",
        items: [{ title: "Theming", href: "/docs/theming" }],
      },
      {
        title: "Integrations",
        items: [
          ...integrations.map((i) => ({
            title: i.name,
            href: `/docs/integrations/${i.slug}`,
          })),
          { title: "Playground", href: "/playground" },
        ],
      },
      ...componentSections,
    ];
  }, []);

  return (
    <Sidebar className={isMobile ? "w-screen! max-w-none! border-0!" : ""}>
      {isMobile && (
        <div className="flex items-center justify-between px-2 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-muted-foreground font-medium hover:text-sidebar-foreground"
          >
            <X className="w-4 h-4" />
            Menu
          </Button>
        </div>
      )}

      {!isMobile && (
        <SidebarHeader className="border-b border-border px-6 py-4">
          <SearchTrigger
            variant="sidebar"
            className="border-0 bg-transparent px-0 shadow-none hover:bg-transparent hover:text-foreground"
          />
        </SidebarHeader>
      )}

      <SidebarContent className="h-full overflow-y-auto overscroll-contain">
        <div
          className={cn(
            "flex flex-col font-sans",
            isMobile ? "px-6 py-6" : "pb-16 pl-6 pr-4 pt-6",
          )}
        >
          {sections.map((section) => (
            <div key={section.title} className={isMobile ? "mb-8" : "mb-7"}>
              {/*
                The empty span is the rule. Baseline alignment drops its bottom edge
                onto the heading's baseline, so the dots run out of the word rather
                than floating above or below it.
              */}
              <h2
                className={cn(
                  "mb-1.5 flex items-baseline gap-2.5 text-foreground",
                  isMobile ? "text-xl" : "text-[17px]",
                )}
              >
                <span className="font-serif italic">{section.title}</span>
                <span className="min-w-4 flex-1 border-b border-dotted border-border" />
                {section.count !== undefined && (
                  <span className="font-mono text-[10px] tabular-nums text-muted-foreground/60">
                    {section.count}
                  </span>
                )}
              </h2>

              <nav className="flex flex-col">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      ref={isActive ? activeRef : undefined}
                      onClick={handleLinkClick}
                      className={cn(
                        "group/item relative flex items-center gap-2 tracking-tight transition-colors duration-200",
                        isMobile
                          ? "py-1.5 text-lg"
                          : "text-[13.5px] leading-7",
                        isActive
                          ? "font-medium text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {/*
                        A dash in the gutter instead of a filled row. It ghosts in on
                        hover at low opacity so the pointer has something to track
                        without the text shifting.
                      */}
                      <span
                        aria-hidden
                        className={cn(
                          "absolute -left-4 select-none transition-opacity duration-200",
                          isActive
                            ? "opacity-100"
                            : "opacity-0 group-hover/item:opacity-40",
                        )}
                      >
                        &mdash;
                      </span>
                      {item.title}
                      {item.isNew && (
                        <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-success">
                          New
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
