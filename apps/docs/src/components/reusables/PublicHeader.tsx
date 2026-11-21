"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SearchTrigger, useSearch } from "@/components/search";
import { cn } from "@/lib/utils";
import { Github, Menu, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { usePathname } from "next/navigation";

const FIGMA_URL = "https://www.figma.com/community/file/1705996135476978795";

const FigmaIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
    <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.097-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-.098z" />
  </svg>
);

const PublicHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isDocsPage = pathname?.startsWith("/docs");
  const { open: openSearch } = useSearch();

  const handleMobileMenuClick = () => {
    if (isDocsPage) {
      window.dispatchEvent(new CustomEvent("sidebar-toggle"));
    } else {
      setIsMobileMenuOpen(true);
    }
  };

  return (
    // The header takes the page's own surface, like the sidebar does, so the hairline
    // is the only thing separating it from the content.
    <header className="sticky top-0 z-50 w-full border-b bg-background *:text-muted-foreground">
      <div className="mx-auto flex h-[var(--header-height)] w-full items-center px-4 sm:px-5 md:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="text-foreground mr-5 flex items-center">
          <span className="font-pixel text-base">Dinachi</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                render={<Link href="/docs/installation" />}
                className="whitespace-nowrap px-2.5 py-1 text-sm transition-colors hover:bg-transparent focus:bg-transparent hover:text-foreground"
              >
                Docs
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                render={<Link href="/docs/components" />}
                className="whitespace-nowrap px-2.5 py-1 text-sm transition-colors hover:bg-transparent focus:bg-transparent hover:text-foreground"
              >
                Components
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                render={<Link href="/docs/agent" />}
                className="whitespace-nowrap px-2.5 py-1 text-sm transition-colors hover:bg-transparent focus:bg-transparent hover:text-foreground"
              >
                Agents 1.0
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex-1" />

        {/* Search (desktop) */}
        <div className="mr-0.5 hidden sm:flex">
          <SearchTrigger variant="inline" />
        </div>

        {/* Social Icons (Desktop) */}
        <div className="hidden flex-row gap-x-0.5 md:flex">
          <ThemeToggle variant="ghost" className="h-8 w-8" />
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  render={
                    <a
                      href="https://github.com/raymond-UI/dinachiUI"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub"
                    />
                  }
                />
              }
            >
              <Github className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>
              <p>View on GitHub</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  render={
                    <a
                      href={FIGMA_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Figma file"
                    />
                  }
                />
              }
            >
              <FigmaIcon className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Open the Figma file</p>
            </TooltipContent>
          </Tooltip>
          {isDocsPage && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMobileMenuClick}
              aria-label="Toggle navigation"
              className="h-8 w-8 lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-1 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={openSearch}
            aria-label="Search"
            className="sm:hidden"
          >
            <Search className="h-5 w-5" />
          </Button>
          <ThemeToggle iconSize="h-5 w-5" />
          {isDocsPage ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMobileMenuClick}
              aria-label="Toggle navigation"
            >
              <Menu className="h-5 w-5" />
            </Button>
          ) : (
            <Drawer open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <DrawerTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
                <Menu className="h-5 w-5" />
              </DrawerTrigger>
              <DrawerContent side="right">
                <DrawerHeader>
                  <DrawerTitle>DinachiUI</DrawerTitle>
                </DrawerHeader>
                <div className="grid gap-2 py-4 px-4">
                  <Button
                    variant="ghost"
                    className="justify-start text-base"
                    onClick={() => setIsMobileMenuOpen(false)}
                    render={<Link href="/docs/components" />}
                  >
                    Components
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-base"
                    onClick={() => setIsMobileMenuOpen(false)}
                    render={<Link href="/docs/installation" />}
                  >
                    Documentation
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-base"
                    onClick={() => setIsMobileMenuOpen(false)}
                    render={<Link href="/docs/agent" />}
                  >
                    Agents 1.0
                  </Button>
                  <Separator className="my-2" />
                  <div className="flex flex-row gap-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      render={
                        <a
                          href="https://github.com/raymond-UI/dinachiUI"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="GitHub"
                        />
                      }
                    >
                      <Github className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      render={
                        <a
                          href={FIGMA_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Figma file"
                        />
                      }
                    >
                      <FigmaIcon className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          )}
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;
