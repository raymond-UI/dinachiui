"use client";

import * as React from "react";
import NextLink from "next/link";
import { Breadcrumb, type BreadcrumbItem, type BreadcrumbNavigateDetails } from "@/components/ui/breadcrumb";

export const roomTrail: BreadcrumbItem[] = [
  { label: "Saltmarsh Hotels", href: "#hotels" },
  { label: "Properties", href: "#properties" },
  { label: "Harbour House", href: "#harbour-house" },
  { label: "Second floor", href: "#second-floor" },
  { label: "Rooms", href: "#rooms" },
  { label: "214 Sea View Double with Balcony and Freestanding Bath" },
];

export const payoutTrail: BreadcrumbItem[] = [
  { label: "Saltmarsh Hotels", href: "#hotels" },
  { label: "Payouts", href: "#payouts" },
  { label: "November 2026" },
];

const META: Record<string, string> = {
  "214 Sea View Double with Balcony and Freestanding Bath": "Sleeps 2 · £148 tonight",
  "November 2026": "£48,210.00 across 31 transfers",
};

/**
 * A trail that follows its own links, so the demos move without leaving the page. Going
 * up a level drops everything below it; `reset` puts the full trail back.
 */
export function useDemoTrail(full: BreadcrumbItem[]) {
  const [trail, setTrail] = React.useState(full);
  const onNavigate = (item: BreadcrumbItem, details: BreadcrumbNavigateDetails) => {
    details.event?.preventDefault();
    const at = trail.findIndex((t) => t.label === item.label);
    if (at >= 0) setTrail([...trail.slice(0, at), { label: item.label }]);
  };
  return { trail, onNavigate, reset: () => setTrail(full), moved: trail.length !== full.length };
}

export function PageHead({ trail, onReset }: { trail: BreadcrumbItem[]; onReset?: () => void }) {
  const current = trail[trail.length - 1]?.label ?? "";
  return (
    <div className="mt-3.5 flex items-end justify-between gap-4">
      <div className="min-w-0">
        <h3 className="m-0 text-[22px] font-semibold tracking-[-0.02em]">{current}</h3>
        <p className="mt-1 text-[13px] text-muted-foreground">{META[current] ?? "Opened from the trail"}</p>
      </div>
      {onReset && (
        <button type="button" onClick={onReset} className="shrink-0 text-[13px] text-muted-foreground underline underline-offset-4 hover:text-foreground">
          Reset
        </button>
      )}
    </div>
  );
}

export function DefaultBreadcrumbExample() {
  const { trail, onNavigate, reset, moved } = useDemoTrail(payoutTrail);
  return (
    <div className="w-full max-w-[560px]">
      <Breadcrumb items={trail} presentation="trail" hideCurrent onNavigate={onNavigate} />
      <PageHead trail={trail} onReset={moved ? reset : undefined} />
    </div>
  );
}

export function CollapseBreadcrumbExample() {
  const { trail, onNavigate, reset, moved } = useDemoTrail(roomTrail);
  return (
    <div className="w-full max-w-[640px]">
      <div className="w-[min(100%,420px)] min-w-[180px] max-w-full resize-x overflow-hidden rounded-lg border border-dashed p-2">
        <Breadcrumb items={trail} presentation="trail" onNavigate={onNavigate} />
      </div>
      <p className="mt-2 text-[12px] text-muted-foreground">Drag the corner to narrow or widen the box.</p>
      {moved && <PageHead trail={trail} onReset={reset} />}
    </div>
  );
}

export function PhoneBreadcrumbExample() {
  const { trail, onNavigate, reset, moved } = useDemoTrail(roomTrail);
  return (
    <div className="w-[300px] overflow-hidden rounded-[28px] border bg-background shadow-sm">
      <div className="relative h-[220px] bg-[linear-gradient(160deg,color-mix(in_oklab,var(--info)_34%,var(--muted)),color-mix(in_oklab,var(--info)_8%,var(--muted)))]">
        <Breadcrumb items={trail} presentation="back" floating onNavigate={onNavigate} className="absolute inset-x-3 top-3" />
      </div>
      <div className="px-[18px] pb-5 pt-4">
        <div className="text-[22px] font-bold leading-tight tracking-[-0.02em]">{trail[trail.length - 1].label}</div>
        <div className="mt-1.5 text-sm text-muted-foreground">{META[trail[trail.length - 1].label] ?? "Opened from the trail"}</div>
        {moved && (
          <button type="button" onClick={reset} className="mt-3 text-[13px] text-muted-foreground underline underline-offset-4">
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

export function RouterBreadcrumbExample() {
  return (
    <Breadcrumb
      presentation="trail"
      items={[
        { label: "Docs", href: "/docs", render: <NextLink href="/docs" /> },
        { label: "Components", href: "/docs/components", render: <NextLink href="/docs/components" /> },
        { label: "Breadcrumb" },
      ]}
    />
  );
}
