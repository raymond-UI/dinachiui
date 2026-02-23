"use client";

import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar";
import { getAllComponentsMeta } from "@/lib/component-metadata";
import { SearchTrigger } from "@/components/search";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useSidebar } from "../ui/sidebar";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarSection {
  title: string;
  items: { title: string; href: string }[];
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
    const allComponents = [...getAllComponentsMeta()].sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    const componentSection: SidebarSection = {
      title: "Components",
      items: allComponents.map((c) => ({
        title: c.name,
        href: `/docs/components/${c.slug}`,
      })),
    };

    return [
      {
        title: "Getting Started",
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
      componentSection,
    ];
  }, []);

  return (
    <Sidebar
      variant="floating"
      className={isMobile ? "w-screen! max-w-none! border-0!" : ""}
    >
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
        <SidebarHeader className="px-4 py-3 border-b border-border">
          <SearchTrigger variant="sidebar" />
        </SidebarHeader>
      )}

      <SidebarContent className="h-full overflow-y-auto">
        <div
          className={cn(
            "flex flex-col font-sans",
            isMobile ? "px-5 py-6" : "px-4 py-4",
          )}
        >
          {sections.map((section, index) => (
            <div
              key={section.title}
              className={isMobile ? "mb-10" : "mb-6"}
            >
              <div
                className={cn(
                  "text-muted-foreground/50 font-extralight",
                  isMobile ? "text-sm mb-5" : "text-sm mb-2",
                )}
              >
                {section.title}
              </div>
              <nav
                className={cn(
                  "flex flex-col",
                  isMobile
                    ? index === 0 ? "gap-5" : "gap-4"
                    : "gap-0.5",
                )}
              >
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      ref={isActive ? activeRef : undefined}
                      onClick={handleLinkClick}
                      className={cn(
                        "tracking-tight transition-all duration-300 ease-out flex items-center gap-3",
                        isMobile
                          ? "text-lg font-medium text-sidebar-foreground hover:text-sidebar-accent-foreground"
                          : cn(
                              "text-base font-medium rounded-md px-2 py-1.5",
                              isActive
                                ? "text-sidebar-accent-foreground bg-sidebar-accent font-medium"
                                : "text-muted-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent/50",
                            ),
                      )}
                    >
                      {item.title}
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
