"use client";

import * as React from "react";
import Link from "next/link";
import "./specimens.css";
import { cn } from "@/lib/utils";
import { ComponentIcon } from "@/components/component-icon";
import { SectionIcon } from "@/components/layout/section-icons";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Toggle } from "@/components/ui/toggle";
import { Input } from "@/components/ui/input";
import type { NavSectionId } from "@/lib/docs-nav";
import { specimens } from "./specimens";
import { jobs, synonyms } from "./summaries";

export type IndexItem = {
  slug: string;
  title: string;
  summary: string;
  isNew: boolean;
  motion: boolean;
};
export type IndexSection = { id: NavSectionId; title: string; items: IndexItem[] };

type View = "specimens" | "list";
const VIEW_KEY = "dinachi:components-view";
const SEG = "h-7 gap-1.5 rounded-md px-2 text-xs";
const href = (slug: string) => `/docs/components/${slug}`;

// The chosen view lives in localStorage; the server and first paint show specimens.
const viewListeners = new Set<() => void>();
const viewStore = {
  subscribe: (fn: () => void) => (viewListeners.add(fn), () => void viewListeners.delete(fn)),
  get: (): View => (localStorage.getItem(VIEW_KEY) === "list" ? "list" : "specimens"),
  getServer: (): View => "specimens",
  set: (next: View) => {
    localStorage.setItem(VIEW_KEY, next);
    viewListeners.forEach((fn) => fn());
  },
};

function matches(query: string, item: IndexItem, section: string) {
  if (!query) return true;
  const text = `${item.title} ${item.slug} ${item.summary} ${section}`.toLowerCase();
  return query
    .split(/\s+/)
    .flatMap((word) => [word, ...(synonyms[word]?.split(" ") ?? [])])
    .some((word) => text.includes(word));
}

export function ComponentsIndex({ sections, total }: { sections: IndexSection[]; total: number }) {
  const view = React.useSyncExternalStore(viewStore.subscribe, viewStore.get, viewStore.getServer);
  const [query, setQuery] = React.useState("");
  const [job, setJob] = React.useState<number | null>(null);
  const search = React.useRef<HTMLInputElement>(null);
  const body = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key !== "/" || t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      e.preventDefault();
      search.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const q = query.trim().toLowerCase();
  const visible = sections
    .map((s) => ({
      ...s,
      items: s.items.filter((i) => (job === null ? matches(q, i, s.title) : jobs[job][1].includes(i.slug))),
    }))
    .filter((s) => s.items.length > 0);

  // Arrow keys walk the links in reading order, in either view.
  const walk = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const links = [...(body.current?.querySelectorAll<HTMLElement>("[data-entry]") ?? [])];
    if (!links.length) return;
    e.preventDefault();
    const at = links.indexOf(document.activeElement as HTMLElement);
    const step = e.key === "ArrowDown" ? 1 : -1;
    links[at < 0 ? 0 : Math.max(0, Math.min(links.length - 1, at + step))]?.focus();
  };

  return (
    <div className="font-sans" onKeyDown={walk}>
      <header className="mb-8 flex flex-col gap-3">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:items-end">
          <div className="flex flex-col gap-2">
            <h1 className="text-[28px] font-semibold leading-none tracking-tight">{total} components</h1>
            <p className="text-sm text-muted-foreground max-sm:hidden">
              The animated ones install with{" "}
              <code className="whitespace-nowrap font-mono text-[0.92em]">add --motion</code>.
            </p>
          </div>
          <ToggleGroup
            aria-label="View"
            className="gap-0.5 rounded-lg border border-border p-0.5"
            value={[view]}
            onValueChange={(v) => v[0] && viewStore.set(v[0] as View)}
          >
            <ToggleGroupItem value="specimens" aria-label="Specimens" variant="default" className={SEG}>
              <GridGlyph />
              <span className="max-sm:sr-only">Specimens</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List" variant="default" className={SEG}>
              <ListGlyph />
              <span className="max-sm:sr-only">List</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="relative">
          <Input
            ref={search}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setJob(null);
            }}
            placeholder="Search, or name a job"
            aria-label="Search components"
            className="pr-9 [&::-webkit-search-cancel-button]:hidden"
          />
          <kbd className="pointer-events-none absolute max-sm:hidden right-2.5 top-1/2 -translate-y-1/2 rounded border border-border px-1 font-mono text-[10px] text-muted-foreground/60">
            /
          </kbd>
        </div>

        <div className="-mx-4 flex gap-1 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {jobs.map(([label], n) => (
            <Toggle
              key={label}
              size="sm"
              variant="outline"
              pressed={job === n}
              onPressedChange={() => {
                setJob(job === n ? null : n);
                setQuery("");
              }}
              className="h-7 shrink-0 rounded-full px-2.5 font-normal text-muted-foreground"
            >
              {label}
            </Toggle>
          ))}
        </div>
      </header>

      <div ref={body}>
        {visible.length === 0 ? (
          <p className="py-10 text-muted-foreground">Nothing matches. Try a job, like “loading” or “confirm”.</p>
        ) : view === "specimens" ? (
          <SpecimenWall sections={visible} />
        ) : (
          <IndexList sections={visible} />
        )}
      </div>
    </div>
  );
}

function SectionHeading({ section }: { section: IndexSection }) {
  return (
    <h2 id={section.id} className="mb-3 flex scroll-mt-20 items-baseline gap-2.5 text-xl text-foreground">
      <SectionIcon id={section.id} className="translate-y-[5px] self-start [--icon-fill:.26]" />
      <span className="font-serif italic">{section.title}</span>
      <span className="min-w-4 flex-1 border-b border-dotted border-border" />
      <span className="font-mono text-[10px] tabular-nums text-muted-foreground/60">{section.items.length}</span>
    </h2>
  );
}

function Tags({ item }: { item: IndexItem }) {
  return (
    <>
      {item.motion && <span className="font-mono text-[10px] text-muted-foreground/60">motion</span>}
      {item.isNew && <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-success">New</span>}
    </>
  );
}

function SpecimenWall({ sections }: { sections: IndexSection[] }) {
  return (
    <div className="flex flex-col gap-10">
      {sections.map((section) => (
        <section key={section.id}>
          <SectionHeading section={section} />
          <div className="grid grid-cols-2 gap-x-3.5 gap-y-5 sm:grid-cols-3 xl:grid-cols-4">
            {section.items.map((item) => (
              <Link
                key={item.slug}
                href={href(item.slug)}
                data-entry
                title={item.summary}
                className="spx spx-h group flex flex-col gap-2.5 rounded-[14px] outline-none"
              >
                <div
                  className="stage h-32 group-focus-visible:ring-2 group-focus-visible:ring-ring/40"
                  // Static markup from specimens.ts, never user input.
                  dangerouslySetInnerHTML={{ __html: specimens[item.slug] ?? "" }}
                />
                <span className="flex items-baseline gap-2 pl-0.5 text-[14.5px] font-medium tracking-tight text-muted-foreground transition-colors duration-150 group-hover:text-foreground group-focus-visible:text-foreground">
                  {item.title}
                  <Tags item={item} />
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function IndexList({ sections }: { sections: IndexSection[] }) {
  const all = sections.flatMap((s) => s.items);
  const [active, setActive] = React.useState<string | null>(null);
  const shown = all.find((i) => i.slug === active) ?? all[0];

  return (
    <div className="grid items-start gap-10 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex flex-col gap-7">
        {sections.map((section) => (
          <section key={section.id}>
            <SectionHeading section={section} />
            {section.items.map((item) => (
              <Link
                key={item.slug}
                href={href(item.slug)}
                data-entry
                onMouseEnter={() => setActive(item.slug)}
                onFocus={() => setActive(item.slug)}
                className={cn(
                  "group/row grid grid-cols-[18px_minmax(0,1fr)] items-center gap-x-3.5 rounded-lg px-2 py-2 outline-none transition-colors duration-150 focus-visible:ring-1 focus-visible:ring-ring/40 sm:grid-cols-[18px_190px_minmax(0,1fr)]",
                  shown?.slug === item.slug && "bg-card",
                )}
              >
                <ComponentIcon
                  slug={item.slug}
                  className={cn(
                    "size-[18px] text-muted-foreground/60 transition-colors duration-150",
                    shown?.slug === item.slug && "text-foreground [--icon-fill:.26]",
                  )}
                />
                <span className="flex items-baseline gap-2 text-[15.5px] font-medium tracking-tight text-foreground">
                  {item.title}
                  <Tags item={item} />
                </span>
                <span className="col-start-2 truncate text-[13.5px] text-muted-foreground sm:col-start-3">
                  {item.summary}
                </span>
              </Link>
            ))}
          </section>
        ))}
      </div>
      <aside aria-hidden className="sticky top-20 hidden xl:block">
        {shown && <Spotlight key={shown.slug} slug={shown.slug} />}
      </aside>
    </div>
  );
}

/** Plays one specimen from rest. Keyed by slug, so each new row replays from the start. */
function Spotlight({ slug }: { slug: string }) {
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    // Two frames: the resting state has to paint before the pinned one can transition from it.
    let id = requestAnimationFrame(() => {
      id = requestAnimationFrame(() => setOn(true));
    });
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div className={cn("spx spx-h", on && "spx-on")}>
      <div className="stage h-[250px]">
        <div
          className="zoom scale-[1.45]"
          // Static markup from specimens.ts, never user input.
          dangerouslySetInnerHTML={{ __html: specimens[slug] ?? "" }}
        />
      </div>
    </div>
  );
}

function GridGlyph() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="size-3.5 fill-none stroke-current [stroke-width:1.25]">
      <rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1" />
      <rect x="9" y="2.5" width="4.5" height="4.5" rx="1" />
      <rect x="2.5" y="9" width="4.5" height="4.5" rx="1" />
      <rect x="9" y="9" width="4.5" height="4.5" rx="1" />
    </svg>
  );
}

function ListGlyph() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="size-3.5 fill-none stroke-current [stroke-width:1.25] [stroke-linecap:round]">
      <path d="M2.5 4h11M2.5 8h11M2.5 12h11" />
    </svg>
  );
}
