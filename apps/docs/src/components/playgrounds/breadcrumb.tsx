"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { isAgentChange } from "@/components/ui/agent";
import { Breadcrumb, type BreadcrumbItem, type BreadcrumbNavigateDetails } from "@/components/ui/breadcrumb";
import { PageHead, payoutTrail, roomTrail } from "@/components/examples/breadcrumb-examples";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = {
  trail: string;
  presentation: "auto" | "trail" | "back";
  hideCurrent: boolean;
  floating: boolean;
  width: number;
  disabled: boolean;
};

const trails: Record<string, BreadcrumbItem[]> = { "6 levels": roomTrail, "3 levels": payoutTrail };

const wideQuery = "(min-width: 768px)";
/** Null until the client knows the width, as the breadcrumb's own `auto` does. */
function useWide() {
  return React.useSyncExternalStore<boolean | null>(
    (on) => {
      const mq = window.matchMedia(wideQuery);
      mq.addEventListener("change", on);
      return () => mq.removeEventListener("change", on);
    },
    () => window.matchMedia(wideQuery).matches,
    () => null
  );
}

function Demo({ values: v, refuse }: DemoProps<V>) {
  const full = trails[v.trail] ?? roomTrail;
  const wide = useWide();
  const [trail, setTrail] = React.useState(full);
  const [from, setFrom] = React.useState(full);
  if (from !== full) {
    setFrom(full);
    setTrail(full);
  }
  const onNavigate = (item: BreadcrumbItem, details: BreadcrumbNavigateDetails) => {
    if (refuse && isAgentChange(details)) return details.cancel();
    const at = trail.findIndex((t) => t.label === item.label);
    if (at >= 0) setTrail([...trail.slice(0, at), { label: item.label }]);
  };
  // The demo's links stay on this page. React events reach here from the portalled menu and sheet too.
  const stay = (e: React.MouseEvent) => {
    if ((e.target as Element).closest('a[href^="#"]')) e.preventDefault();
  };
  const reset = trail.length !== full.length ? () => setTrail(full) : undefined;
  const crumb = (phone: boolean) => (
    <Breadcrumb
      items={trail}
      presentation={v.presentation}
      hideCurrent={v.hideCurrent}
      floating={v.floating}
      disabled={v.disabled}
      onNavigate={onNavigate}
      className={phone && v.floating ? "absolute inset-x-3 top-3" : undefined}
    />
  );

  const current = trail[trail.length - 1].label;
  const phoneView = (only?: string) => (
      <div onClick={stay} className={cn("w-[300px] overflow-hidden rounded-[28px] border bg-background shadow-sm", only)}>
        {v.floating ? (
          <div className="relative h-[200px] bg-[linear-gradient(160deg,color-mix(in_oklab,var(--info)_34%,var(--muted)),color-mix(in_oklab,var(--info)_8%,var(--muted)))]">
            {crumb(true)}
          </div>
        ) : (
          <div className="px-2 pt-2">{crumb(true)}</div>
        )}
        <div className="px-[18px] pb-5 pt-3">
          <div className="text-[22px] font-bold leading-tight tracking-[-0.02em]">{current}</div>
          {reset && (
            <button type="button" onClick={reset} className="mt-3 text-[13px] text-muted-foreground underline underline-offset-4">
              Reset
            </button>
          )}
        </div>
      </div>
  );
  const wideView = (only?: string) => (
    <div onClick={stay} className={cn("w-full max-w-[640px]", only)}>
      <div style={{ width: `${v.width}%` }} className="min-w-0">
        {crumb(false)}
      </div>
      <PageHead trail={trail} onReset={reset} />
    </div>
  );

  if (v.presentation === "back") return phoneView();
  if (v.presentation === "trail" || wide) return wideView();
  if (wide === false) return phoneView();
  return (
    <>
      {phoneView("md:hidden")}
      {wideView("max-md:hidden")}
    </>
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const full = trails[v.trail] ?? roomTrail;
  const props: string[] = ["items={trail}"];
  if (v.presentation !== "auto") props.push(`presentation="${v.presentation}"`);
  if (v.hideCurrent) props.push("hideCurrent");
  if (v.floating) props.push("floating");
  if (v.disabled) props.push("disabled");
  const L = [`import { Breadcrumb } from "@/components/ui/breadcrumb"`];
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push("", "const trail = [");
  full.forEach((t) => L.push(t.href ? `  { label: "${t.label}", href: "/${t.href.slice(1)}" },` : `  { label: "${t.label}" },`));
  L.push("]", "", "export function RoomPath() {", "  return (", "    <Breadcrumb");
  props.forEach((p) => L.push(`      ${p}`));
  if (refuse) L.push("      onNavigate={(item, details) => {", "        if (isAgentChange(details)) details.cancel()", "      }}");
  L.push("    />", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "room-path.tsx",
  refusable: true,
  height: 440,
  controls: [
    { name: "trail", type: "select", options: ["6 levels", "3 levels"], default: "6 levels" },
    { name: "presentation", type: "select", options: ["auto", "trail", "back"], default: "auto" },
    { name: "hideCurrent", type: "boolean", default: false },
    { name: "floating", type: "boolean", default: false },
    { name: "width", type: "number", default: 60, min: 30, max: 100, step: 5 },
    { name: "disabled", type: "boolean", default: false },
  ],
  tries: [
    { label: "Go to Harbour House", action: "goTo", args: ["Harbour House"], target: "Breadcrumb" },
    { label: "Go to level 2", action: "goTo", args: [2], target: "Breadcrumb" },
    { label: "Go to Lobby", action: "goTo", args: ["Lobby"], target: "Breadcrumb" },
  ],
  Demo,
  code,
});
