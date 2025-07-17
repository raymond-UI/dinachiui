"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { categories, getComponentsByCategory } from "@/lib/components-registry";
import {
  BookOpen,
  Grid3x3,
  Layers,
  Monitor,
  Package,
  Palette,
  Search,
  Settings,
  Space,
  Sparkles,
  Type,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { Badge } from "../ui";
import { useSidebar } from "../ui/sidebar";

interface SidebarSection {
  title: string;
  items: SidebarItem[];
  icon?: React.ElementType;
}

interface SidebarItem {
  title: string;
  href: string;
  badge?: string;
  icon?: React.ElementType;
}

const sectionIcons: Record<string, React.ElementType> = {
  "Getting Started": BookOpen,
  Foundations: Palette,
  Layout: Grid3x3,
  Forms: Settings,
  Navigation: Layers,
  Feedback: Sparkles,
  "Data Display": Monitor,
  Overlay: Package,
};

const itemIcons: Record<string, React.ElementType> = {
  Colors: Palette,
  Typography: Type,
  Spacing: Space,
  Breakpoints: Monitor,
};

export function SidebarNavigation() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const { state } = useSidebar();
  // Filter sections based on search query
  const filteredSections = useMemo(() => {
    const gettingStarted: SidebarItem[] = [
      { title: "Introduction", href: "/docs", icon: BookOpen },
      { title: "Installation", href: "/docs/installation", icon: Package },
      { title: "CLI", href: "/docs/cli", icon: Settings },
      { title: "Theming", href: "/docs/theming", icon: Palette },
    ];

    const foundations: SidebarItem[] = [
      {
        title: "Colors",
        href: "/docs/foundations/colors",
        icon: itemIcons.Colors,
      },
      {
        title: "Typography",
        href: "/docs/foundations/typography",
        icon: itemIcons.Typography,
      },
      {
        title: "Spacing",
        href: "/docs/foundations/spacing",
        icon: itemIcons.Spacing,
      },
      {
        title: "Breakpoints",
        href: "/docs/foundations/breakpoints",
        icon: itemIcons.Breakpoints,
      },
    ];

    // Generate component sections dynamically
    const componentSections: SidebarSection[] = categories
      .map((category) => {
        const categoryComponents = getComponentsByCategory(category);
        return {
          title: category,
          icon: sectionIcons[category],
          items: categoryComponents.map((component) => ({
            title: component.name,
            href: `/docs/components/${component.name.toLowerCase()}`,
            badge: component.dependencies.length > 0 ? "deps" : undefined,
          })),
        };
      })
      .filter((section) => section.items.length > 0);

    const sections: SidebarSection[] = [
      {
        title: "Getting Started",
        items: gettingStarted,
        icon: sectionIcons["Getting Started"],
      },
      {
        title: "Foundations",
        items: foundations,
        icon: sectionIcons["Foundations"],
      },
      ...componentSections,
    ];

    if (!searchQuery) return sections;

    return sections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter((section) => section.items.length > 0);
  }, [searchQuery]);

  return (
    <Sidebar
      className={`${state === "collapsed" ? "max-w-14" : "max-w-52"}`}
      collapsible="icon"
    >
      <SidebarHeader className="px-4 py-3 border-b border-border">
        {state === "collapsed" ? (
          <div className="flex items-center gap-2">
            <SidebarTrigger />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-foreground">
                DinachiUI
              </span>
              <Badge variant="info">v1.0.0</Badge>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <SidebarInput
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </>
        )}
      </SidebarHeader>

      <SidebarContent className="h-full overflow-y-auto">
        {filteredSections.map((section, index) => (
          <div key={section.title}>
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-2">
                {section.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        className="w-full"
                        isActive={pathname === item.href}
                        tooltip={
                          item.badge
                            ? `${item.title} - Has dependencies`
                            : item.title
                        }
                      >
                        <Link
                          href={item.href}
                          className="flex items-center justify-between w-full"
                        >
                          <div className="w-full flex items-center gap-2">
                            {item.icon && <item.icon className="h-4 w-4" />}
                            <span>{item.title}</span>
                          </div>
                          {item.badge && (
                            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                              {item.badge}
                            </span>
                          )}
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
