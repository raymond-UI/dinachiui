"use client";

import Link from "next/link";
import { useState } from "react";
import { Sun, Moon, Github } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function HeaderNavigation() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  return (
    <header className="bg-dot backdrop-blur-sm border border-border text-foreground shadow-md p-2 sticky top-0 z-50 w-full">
      <div className="container bg-background/80 mx-auto flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="lg:hidden" />
          <Link href="/" className="text-xl font-bold">
            Dinachi<span className="text-primary">UI</span>
          </Link>
        </div>
        <nav className="flex items-center gap-6">
          <Link
            href="/docs"
            className="hover:text-muted-foreground hidden sm:block"
          >
            Docs
          </Link>
          <Link
            href="/blog"
            className="hover:text-muted-foreground hidden sm:block"
          >
            Blog
          </Link>
          <Link
            href="/showcase"
            className="hover:text-muted-foreground hidden sm:block"
          >
            Showcase
          </Link>
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
