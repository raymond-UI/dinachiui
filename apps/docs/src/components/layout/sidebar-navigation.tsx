"use client";

import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar";
import { SearchTrigger } from "@/components/search";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useId, useLayoutEffect, useRef, useState } from "react";
import { useSidebar } from "../ui/sidebar";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  activeHrefForPath,
  docsNav,
  sectionForPath,
  type NavSection,
  type NavSectionId,
} from "@/lib/docs-nav";
import { SectionIcon } from "./section-icons";

export function SidebarNavigation() {
  const pathname = usePathname();
  const { isMobile, setOpen } = useSidebar();
  const activeHref = activeHrefForPath(pathname);

  // One section open at a time. Navigating opens the section holding the new page.
  const [openId, setOpenId] = useState<NavSectionId | null>(() => sectionForPath(pathname));
  const [seenPath, setSeenPath] = useState(pathname);
  if (pathname !== seenPath) {
    setSeenPath(pathname);
    const id = sectionForPath(pathname);
    if (id) setOpenId(id);
  }

  const handleLinkClick = () => {
    if (isMobile) setOpen(false);
  };

  const activeRef = useCallback((node: HTMLAnchorElement | null) => {
    node?.scrollIntoView({ block: "nearest" });
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
        <div className={cn("flex flex-col font-sans", isMobile ? "px-6 py-4" : "pb-16 pl-6 pr-4 pt-4")}>
          {docsNav.map((section) => (
            <NavGroup
              key={section.id}
              section={section}
              open={openId === section.id}
              onToggle={() => setOpenId((id) => (id === section.id ? null : section.id))}
              activeHref={activeHref}
              activeRef={activeRef}
              onLinkClick={handleLinkClick}
              isMobile={isMobile}
            />
          ))}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

interface NavGroupProps {
  section: NavSection;
  open: boolean;
  onToggle: () => void;
  activeHref: string | null;
  activeRef: (node: HTMLAnchorElement | null) => void;
  onLinkClick: () => void;
  isMobile: boolean;
}

function NavGroup({
  section,
  open,
  onToggle,
  activeHref,
  activeRef,
  onLinkClick,
  isMobile,
}: NavGroupProps) {
  const panelId = useId();
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);
  // No transition until the first measurement lands, so the page loads already settled.
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    setHeight(el.scrollHeight);
    const observer = new ResizeObserver(() => setHeight(el.scrollHeight));
    observer.observe(el);
    const frame = requestAnimationFrame(() => setReady(true));
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="group/section" data-open={open || undefined}>
      <h2 className="m-0">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className={cn(
            "flex w-full cursor-pointer items-baseline gap-2.5 py-[7px] text-left transition-colors duration-200",
            "[--icon-fill:.13] hover:[--icon-fill:.26] group-data-open/section:[--icon-fill:.26]",
            "text-muted-foreground hover:text-foreground/80 group-data-open/section:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 rounded-sm",
            isMobile ? "text-lg" : "text-base",
          )}
        >
          <SectionIcon id={section.id} className="translate-y-[3px] self-start" />
          <span className="font-serif italic">{section.title}</span>
          <span aria-hidden className="min-w-4 flex-1 border-b border-dotted border-border" />
          {!open && (
            <span className="font-mono text-[10px] tabular-nums text-muted-foreground/60">
              {section.items.length}
            </span>
          )}
        </button>
      </h2>

      <div
        id={panelId}
        inert={!open}
        style={{ height: open ? (height ?? "auto") : 0 }}
        className={cn(
          "overflow-hidden",
          ready && "transition-[height] duration-180 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none",
        )}
      >
        <nav ref={innerRef} className="flex flex-col pb-3 pl-[26px] pt-0.5">
          {section.items.map((item) => {
            const isActive = item.href === activeHref;
            return (
              <Link
                key={item.href}
                href={item.href}
                ref={isActive ? activeRef : undefined}
                aria-current={isActive ? "page" : undefined}
                onClick={onLinkClick}
                className={cn(
                  "relative flex items-center gap-2 tracking-tight transition-colors duration-200",
                  isMobile ? "py-1.5 text-lg" : "text-[13.5px] leading-7",
                  isActive
                    ? "font-medium text-foreground before:absolute before:-left-3.5 before:top-1/2 before:w-[9px] before:border-t before:border-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
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
    </div>
  );
}
