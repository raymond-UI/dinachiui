"use client";

import Link from "next/link";
import { useState } from "react";
import { Sun, Moon, Github, Search } from "lucide-react";
import { SidebarInput, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import Image from "next/image";
import { Button } from "../ui";

export function HeaderNavigation() {
  const [darkMode, setDarkMode] = useState(false);
  const { state, isMobile } = useSidebar();


  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  const navigation = [
    {
      label: "Docs",
      href: "/docs",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "Showcase",
      href: "/showcase",
    },
  ];
  const social = [
    {
      label: "GitHub",
      href: "https://github.com/dinachi/ui",
    },
  ];

  return (
    <header className="bg-dot backdrop-blur-sm border border-border text-foreground shadow-md p-1 sticky top-0 z-50 w-full">
      <div className="bg-background/80 mx-auto flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          {state === "collapsed" && isMobile && (
            <SidebarTrigger />
          )}
          <Link href="/" className="text-lg font-bold flex items-center gap-2">
            Dinachi
          </Link>
        </div>

        <nav className="flex items-center gap-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Button variant="outline" className="pl-9">
              Search docs...
            </Button>
          </div>
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-muted-foreground hidden sm:block"
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={toggleDarkMode}
            className="hover:text-muted-foreground"
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
          <a
            href="https://github.com/dinachi/ui"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-muted-foreground"
            aria-label="View source on GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
        </nav>
      </div>
    </header>
  );
}
