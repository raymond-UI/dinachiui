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

  // Scroll to top on route change
  useEffect(() => {
    document.querySelector("main")?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] w-full flex md:grid md:grid-cols-[var(--sidebar-width)_minmax(0,1fr)] docs-sidebar-wrapper">
      <SidebarNavigation />

      <div className="flex-1 flex flex-col w-full min-w-0 overflow-x-hidden">
        <main className="flex-1 max-w-3xl mx-auto w-full min-w-0 bg-dot overflow-y-auto p-2 md:p-6">
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
