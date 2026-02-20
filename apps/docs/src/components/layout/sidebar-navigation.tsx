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
import {
  categories,
  getComponentsByCategory,
} from "@/lib/component-metadata";
import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { useSidebar } from "../ui/sidebar";

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

interface SidebarItem {
  title: string;
  href: string;
}

export function SidebarNavigation() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const { isMobile, setOpenMobile } = useSidebar();

  // Close mobile sidebar when navigating
  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  // Filter sections based on search query
  const filteredSections = useMemo(() => {
    const gettingStarted: SidebarItem[] = [
      { title: "Conventions", href: "/docs/conventions" },
      { title: "Installation", href: "/docs/installation" },
      { title: "CLI", href: "/docs/cli" },
    ];

    const foundations: SidebarItem[] = [
      { title: "Colors", href: "/docs/colors" },
      { title: "Theming", href: "/docs/theming" },
    ];

    // Generate component sections dynamically from static metadata
    const componentSections: SidebarSection[] = categories
      .map((category) => {
        const categoryComponents = getComponentsByCategory(category);
        return {
          title: category,
          items: categoryComponents.map((component) => ({
            title: component.name,
            href: `/docs/components/${component.slug}`,
          })),
        };
      })
      .filter((section) => section.items.length > 0);

    const sections: SidebarSection[] = [
      { title: "Getting Started", items: gettingStarted },
      { title: "Foundations", items: foundations },
      ...componentSections,
    ];

    if (!searchQuery) return sections;

    return sections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [searchQuery]);

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader className="px-4 py-3 border-b border-border">
        <span className="text-sm font-semibold">Documentation</span>
      </SidebarHeader>
      <SidebarContent className="h-full overflow-y-auto">
        {filteredSections.map((section, index) => (
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
                        className="w-full text-muted-foreground"
                        isActive={pathname === item.href}
                        tooltip={item.title}
                      >
                        <Link
                          href={item.href}
                          className="flex items-center justify-between w-full"
                          onClick={handleLinkClick}
                        >
                          <div className="w-full flex items-center gap-2">
                            <span>{item.title}</span>
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            {index < filteredSections.length - 1 && <SidebarSeparator />}
          </div>
        ))}

        {filteredSections.length === 0 && searchQuery && (
          <div className="p-4 text-center text-muted-foreground">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No components found for &quot;{searchQuery}&quot;</p>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
