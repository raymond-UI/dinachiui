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
import { SearchTrigger } from "@/components/search";
import { cn } from "@/lib/utils";
import { Github, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const PublicHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isDocsPage = pathname?.startsWith("/docs");

  const handleMobileMenuClick = () => {
    if (isDocsPage) {
      window.dispatchEvent(new CustomEvent("sidebar-toggle"));
    } else {
      setIsMobileMenuOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-muted *:text-muted-foreground">
      <div className="mx-auto flex h-14 w-full items-center px-4 sm:px-5 md:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Image src="/dinachi-logo.svg" alt="DinachiUI" width={24} height={24} />
          <span className="font-bold">Dinachi</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                render={<Link href="/docs/components" />}
                className="px-4 py-2 text-sm font-medium transition-colors hover:text-primary"
              >
                Docs
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex-1" />

        {/* Search (desktop) */}
        <div className="hidden sm:flex mr-2">
          <SearchTrigger variant="header" />
        </div>

        {/* Social Icons (Desktop) */}
        <div className="hidden flex-row gap-x-1 md:flex">
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                render={
                  <a
                    href="https://github.com/raymond-UI/dinachiUI"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                  />
                }
              >
                <Github className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View on GitHub</p>
            </TooltipContent>
          </Tooltip>

        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-1 md:hidden">
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
                    render={<Link href="/templates" />}
                  >
                    Templates
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-base"
                    onClick={() => setIsMobileMenuOpen(false)}
                    render={<Link href="/docs/components" />}
                  >
                    Documentation
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
