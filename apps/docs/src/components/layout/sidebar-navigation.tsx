"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { getAllComponentsMeta } from "@/lib/component-metadata";
import { SearchTrigger } from "@/components/search";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useSidebar } from "../ui/sidebar";

interface SidebarSection {
  title: string;
  items: { title: string; href: string }[];
}

export function SidebarNavigation() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

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
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader className="px-3 py-3 border-b border-border">
        <SearchTrigger variant="sidebar" />
      </SidebarHeader>
      <SidebarContent className="h-full overflow-y-auto">
        {sections.map((section, index) => (
          <div key={section.title} className="w-full">
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-2">
                {section.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        className="w-full justify-start text-muted-foreground"
                        isActive={pathname === item.href}
                        tooltip={item.title}
                        render={<Link href={item.href} onClick={handleLinkClick} />}
                      >
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            {index < sections.length - 1 && <SidebarSeparator />}
          </div>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
