"use client";

import { HeaderNavigation } from "./header-navigation";
import { SidebarNavigation } from "./sidebar-navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";

interface DocsLayoutProps {
  children: React.ReactNode;
}


export function DocsLayout({ children }: DocsLayoutProps) {
  const { state } = useSidebar();

  return (
    <SidebarProvider defaultOpen={true}>
      <div
        className={`min-h-screen w-screen flex flex-col md:grid ${
          state === "collapsed" ? "md:grid-cols-[56px_1fr]" : "md:grid-cols-[208px_1fr]"
        }`}
      >
        <SidebarNavigation />
        <div className="flex flex-col w-full">
          <HeaderNavigation />
          <SidebarInset>
            <main className="w-full bg-dot overflow-y-auto p-6">
              {children}
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
