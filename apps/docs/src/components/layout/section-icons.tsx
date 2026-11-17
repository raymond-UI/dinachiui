import type { ReactNode } from "react";
import type { NavSectionId } from "@/lib/docs-nav";
import { cn } from "@/lib/utils";

/*
  One drawing language for all thirteen: a 1.25 stroke on a 16 grid, a single tinted
  surface (`f`) that deepens when the section opens, and quieter secondary marks (`q`).
*/
const F = "fill-current [fill-opacity:var(--icon-fill,.13)] transition-[fill-opacity] duration-200 ease-out motion-reduce:transition-none";
const Q = "opacity-45";

const paths: Record<NavSectionId, ReactNode> = {
  start: (
    <>
      <rect className={F} x="1.5" y="2.5" width="13" height="11" rx="2" />
      <path d="M4.5 6.25 6.75 8 4.5 9.75" />
      <path d="M8.5 10.25h3" />
    </>
  ),
  "build-with-ai": (
    <>
      <path className={F} d="M6.5 2c.45 2.6 1.4 3.55 4 4-2.6.45-3.55 1.4-4 4-.45-2.6-1.4-3.55-4-4 2.6-.45 3.55-1.4 4-4Z" />
      <path d="M12 10.5v3.5M10.25 12.25h3.5" />
    </>
  ),
  agents: (
    <>
      <path className={F} d="M3 2.5 11 6l-3.4 1.2L6.4 10.6Z" />
      <circle className={Q} cx="11.25" cy="11.25" r="2.75" strokeDasharray="1.2 1.4" />
      <circle cx="11.25" cy="11.25" r=".6" fill="currentColor" stroke="none" />
    </>
  ),
  inputs: (
    <>
      <rect className={F} x="1.5" y="4.5" width="13" height="7" rx="2" />
      <path d="M4.75 6.25v3.5" />
    </>
  ),
  dates: (
    <>
      <rect className={F} x="1.5" y="3" width="13" height="11.5" rx="2" />
      <path d="M1.5 6.75h13M5 1.5V4M11 1.5V4" />
      <circle cx="10.75" cy="10.5" r=".9" fill="currentColor" stroke="none" />
    </>
  ),
  forms: (
    <>
      <path d="M2.5 2.5h3.5M2.5 9.25h3.5" />
      <rect x="2.5" y="4.25" width="11" height="3" rx="1.1" />
      <rect className={F} x="2.5" y="11" width="11" height="3" rx="1.1" />
    </>
  ),
  actions: (
    <>
      <rect className={F} x="1.5" y="3.75" width="13" height="6.75" rx="3.375" />
      <path className={Q} d="M3.75 13h8.5" />
    </>
  ),
  overlays: (
    <>
      <rect className={Q} x="1.5" y="1.5" width="9" height="9" rx="1.75" />
      <rect className={F} x="5.5" y="5.5" width="9" height="9" rx="1.75" />
    </>
  ),
  menus: (
    <>
      <path className={F} d="M2.5 6.5V4A1.5 1.5 0 0 1 4 2.5h3A1.5 1.5 0 0 1 8.5 4v2.5" />
      <path d="M1.5 6.5h13" />
      <path className={Q} d="M3 9.75h10M3 12.75h6.5" />
    </>
  ),
  status: (
    <>
      <circle className={Q} cx="8" cy="8" r="5.75" />
      <path d="M8 2.25A5.75 5.75 0 1 1 2.25 8" />
      <circle className={F} cx="8" cy="8" r="2.25" />
    </>
  ),
  display: (
    <>
      <rect className={F} x="1.5" y="2.5" width="13" height="11" rx="2" />
      <circle cx="5.25" cy="6.5" r="1.5" />
      <path d="M8.25 6h3.5" />
      <path className={Q} d="M8.25 8h2.25M4 10.75h8" />
    </>
  ),
  lists: (
    <>
      <path className={Q} d="M5 3.5h8.5M5 12.5h8.5" />
      <rect className={F} x="3.75" y="6.25" width="10.75" height="3.5" rx="1.2" />
      <path d="M2 3.5h.01M2 12.5h.01" strokeWidth={1.75} />
    </>
  ),
  effects: (
    <>
      <path className={Q} d="M1.75 5.75h4M1.75 10.25h4" />
      <path d="M1.25 8h5.5" />
      <circle className={F} cx="11" cy="8" r="3.25" />
    </>
  ),
};

export function SectionIcon({ id, className }: { id: NavSectionId; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-4 shrink-0", className)}
    >
      {paths[id]}
    </svg>
  );
}
