"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/reservations", label: "Reservations" },
  { href: "/book", label: "New booking" },
  { href: "/occupancy", label: "Occupancy" },
  { href: "/housekeeping", label: "Housekeeping" },
  { href: "/rates", label: "Rates" },
];

export function Nav() {
  const path = usePathname();
  const [dark, setDark] = React.useState(false);
  React.useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  const toggle = () => {
    document.documentElement.classList.toggle("dark", !dark);
    setDark(!dark);
  };
  return (
    <nav aria-label="Main" className="sticky top-0 flex h-screen w-52 shrink-0 flex-col gap-1 border-r border-border px-3 py-5">
      <Link href="/reservations" className="mb-4 px-2 text-sm font-semibold">Saltmarsh Hotels</Link>
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          aria-current={path.startsWith(l.href) ? "page" : undefined}
          className={cn(
            "rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "aria-[current=page]:bg-accent aria-[current=page]:font-medium aria-[current=page]:text-foreground",
          )}
        >
          {l.label}
        </Link>
      ))}
      <button type="button" onClick={toggle} aria-pressed={dark} className="mt-auto rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        Dark mode
      </button>
    </nav>
  );
}
