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
import { Github, Menu, Twitter } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const PublicHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isDocsPage = pathname?.startsWith("/docs");

  // Toggle the docs sidebar via custom event
  const handleMobileMenuClick = () => {
    if (isDocsPage) {
      window.dispatchEvent(new CustomEvent("sidebar-toggle"));
    } else {
      setIsMobileMenuOpen(true);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-muted *:text-muted-foreground">
      <div className="container mx-auto flex h-14 items-center px-4 md:px-6">
        {/* Logo/Brand Name */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Image src="/dinachi-logo.svg" alt="DinachiUI" width={24} height={24} />
          <span className="font-bold">DinachiUI</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                render={<Link href="/templates" />}
                className="px-4 py-2 text-sm font-medium transition-colors hover:text-primary"
              >
                Templates
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                render={<Link href="/docs/components" />}
                className="px-4 py-2 text-sm font-medium transition-colors hover:text-primary"
              >
                Documentation
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Spacer to push social icons to the right on desktop */}
        <div className="flex-1 hidden md:block"></div>

        {/* Social Icons (Desktop) */}
        <div className="hidden flex-row gap-x-2 md:flex">
          <Tooltip>
            <TooltipTrigger>
              <a
                href="https://github.com/your-github-profile"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </TooltipTrigger>
            <TooltipContent>
              <p>View on GitHub</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <a
                href="https://twitter.com/your-twitter-profile"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </TooltipTrigger>
            <TooltipContent>
              <p>Follow on Twitter</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="flex flex-1 items-center justify-end md:hidden">
	          {/* On docs pages, trigger the sidebar; otherwise, open the drawer */}
          {isDocsPage ? (
            <button
              onClick={handleMobileMenuClick}
              className="p-2 hover:bg-accent rounded-md"
              aria-label="Toggle navigation"
            >
              <Menu className="h-6 w-6" />
            </button>
          ) : (
	          <Drawer open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
	            <DrawerTrigger>
	              <Menu className="h-6 w-6" />
	            </DrawerTrigger>
	            <DrawerContent side="right">
	              <DrawerHeader>
	                <DrawerTitle>DinachiUI</DrawerTitle>
	              </DrawerHeader>
	              <div className="grid gap-4 py-4">
                <Link
                  href="/templates"
                  className="block text-lg font-medium hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
                >
                  Templates
                </Link>
                <Link
                  href="/docs/components"
                  className="block text-lg font-medium hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
                >
                  Documentation
                </Link>
                <div className="mt-4 flex flex-row gap-x-4">
                  <Tooltip>
                    <TooltipTrigger>
                      <a
                        href="https://github.com/your-github-profile"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub"
                      >
                        <Github className="h-6 w-6" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View on GitHub</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger>
                      <a
                        href="https://twitter.com/your-twitter-profile"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Twitter"
                      >
                        <Twitter className="h-6 w-6" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Follow on Twitter</p>
                    </TooltipContent>
                  </Tooltip>
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
