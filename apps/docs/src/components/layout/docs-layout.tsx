"use client";

import { HeaderNavigation } from "./header-navigation";
import { SidebarNavigation } from "./sidebar-navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";

interface DocsLayoutProps {
  children: React.ReactNode;
}

export function DocsLayout({ children }: DocsLayoutProps) {
  const { state, isMobile } = useSidebar();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className={`min-h-screen w-full flex`}>
        <div className={`${isMobile ? "w-auto" : state === "collapsed" ? "w-auto" : "w-52"}`}>
          <SidebarNavigation />
        </div>
        <div className="flex-1 flex flex-col w-full">
          <div className="relative w-full">
            <HeaderNavigation />
          </div>
          <main className="flex-1 w-full bg-dot overflow-y-auto md:pt-8 p-2 md:pl-8">
            <div className="grid grid-cols-[1fr_auto] w-full md:pr-8">
              {children}
              <div className="hidden md:block sticky top-0 w-48 p-8 border-[0.5px] bg-muted/25 border-border">
                <span>Content Navigation</span>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
