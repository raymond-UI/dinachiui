"use client";

import { SidebarNavigation } from "./sidebar-navigation";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

interface DocsLayoutProps {
  children: React.ReactNode;
}

// Inner component that can use useSidebar hook
function DocsLayoutContent({ children }: DocsLayoutProps) {
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();

  // Listen for global sidebar toggle event from PublicHeader (mobile menu)
  useEffect(() => {
    const handleGlobalToggle = () => {
      toggleSidebar();
    };

    window.addEventListener("sidebar-toggle", handleGlobalToggle);
    return () =>
      window.removeEventListener("sidebar-toggle", handleGlobalToggle);
  }, [toggleSidebar]);

  // Scroll to hash target or top on route change
  useEffect(() => {
    const scrollContainer = document.querySelector("main");
    if (!scrollContainer) return;

    const hash = window.location.hash;
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: "instant" });
        return;
      }
    }
    scrollContainer.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-[calc(100vh-var(--header-height))] w-full flex md:grid md:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] docs-sidebar-wrapper">
      <SidebarNavigation />

      {/* Clip rather than hide the overflow, so nothing inside gets a scroll container it
          didn't ask for, and the index spotlight and the guide rail can stick. */}
      <div className="flex-1 flex flex-col w-full min-w-0 overflow-x-clip">
        <main className="flex-1 mx-auto w-full min-w-0 max-w-6xl px-4 pb-24 pt-6 md:px-8 md:pt-10">
          {children}
        </main>
      </div>
    </div>
  );
}

export function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <SidebarProvider>
      <DocsLayoutContent>{children}</DocsLayoutContent>
    </SidebarProvider>
  );
}
