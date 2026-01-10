"use client";

import { SidebarNavigation } from "./sidebar-navigation";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { useEffect } from "react";

interface DocsLayoutProps {
  children: React.ReactNode;
}

// Inner component that can use useSidebar hook
function DocsLayoutContent({ children }: DocsLayoutProps) {
  const { toggleSidebar } = useSidebar();

  // Listen for global sidebar toggle event from PublicHeader
  useEffect(() => {
    const handleGlobalToggle = () => {
      toggleSidebar();
    };

    window.addEventListener("sidebar-toggle", handleGlobalToggle);
    return () => window.removeEventListener("sidebar-toggle", handleGlobalToggle);
  }, [toggleSidebar]);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] w-full flex docs-sidebar-wrapper">
      <SidebarNavigation />
      
      <div className="flex-1 flex flex-col w-full min-w-0">
        <main className="flex-1 max-w-screen-md mx-auto w-full bg-dot overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <DocsLayoutContent>{children}</DocsLayoutContent>
    </SidebarProvider>
  );
}
