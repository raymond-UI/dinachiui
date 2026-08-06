"use client";

import * as React from "react";
import { X } from "lucide-react";
import { AnimatedList, AnimatedListItem } from "@/components/ui/animated-list";
import { Button } from "@/components/ui/button";
import { PreviewAction } from "@/components/mdx/preview-action";

interface Row {
  id: string;
  title: string;
  detail: string;
  tone: "info" | "warn" | "ok";
}

const TONE: Record<Row["tone"], string> = {
  info: "bg-primary",
  warn: "bg-amber-500",
  ok: "bg-emerald-500",
};

const SEED: Row[] = [
  { id: "a", title: "Deploy finished", detail: "web · 2m 14s", tone: "ok" },
  { id: "b", title: "Rate limit at 80%", detail: "api · us-east-1", tone: "warn" },
  { id: "c", title: "3 new sign-ups", detail: "since 09:00", tone: "info" },
];

const POOL: Omit<Row, "id">[] = [
  { title: "Build queued", detail: "docs · main", tone: "info" },
  { title: "Certificate renewed", detail: "expires in 90d", tone: "ok" },
  { title: "Slow query detected", detail: "1.8s · orders", tone: "warn" },
  { title: "Invite accepted", detail: "sam@acme.co", tone: "ok" },
];

function useFeed() {
  const [rows, setRows] = React.useState(SEED);
  const [dismissed, setDismissed] = React.useState<string | null>(null);
  const next = React.useRef(0);

  const add = () => {
    const template = POOL[next.current % POOL.length];
    next.current += 1;
    setRows((current) => [{ ...template, id: `n${next.current}` }, ...current]);
  };

  /** The reader closed it. Recorded in the same update that removes it. */
  const dismiss = (id: string) => {
    setDismissed(id);
    setRows((current) => current.filter((row) => row.id !== id));
  };

  /** Removal the reader did not ask for — no `dismissed`, so it collapses in place. */
  const retract = () =>
    setRows((current) =>
      current.length
        ? current.filter((_, i) => i !== Math.floor(current.length / 2))
        : current
    );

  const reset = () => {
    setDismissed(null);
    setRows(SEED);
    next.current = 0;
  };

  return { rows, dismissed, add, dismiss, retract, reset };
}

function RowBody({ row, onDismiss }: { row: Row; onDismiss: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
      <span className={`h-2 w-2 shrink-0 rounded-full ${TONE[row.tone]}`} aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{row.title}</p>
        <p className="truncate text-xs text-muted-foreground">{row.detail}</p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label={`Dismiss ${row.title}`}
        className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function DefaultAnimatedListExample() {
  const feed = useFeed();

  return (
    <div className="w-full max-w-sm">
      <PreviewAction>
        <Button variant="outline" size="sm" onClick={feed.add}>
          Add to top
        </Button>
        <Button variant="outline" size="sm" onClick={feed.reset}>
          Reset
        </Button>
      </PreviewAction>

      <AnimatedList dismissed={feed.dismissed} className="space-y-2">
        {feed.rows.map((row) => (
          <AnimatedListItem key={row.id} itemKey={row.id}>
            <RowBody row={row} onDismiss={() => feed.dismiss(row.id)} />
          </AnimatedListItem>
        ))}
      </AnimatedList>

      {feed.rows.length === 0 ? (
        <p className="py-4 text-center text-xs text-muted-foreground">
          Nothing left.
        </p>
      ) : null}
    </div>
  );
}

export function AnimatedListTwoExitsExample() {
  const feed = useFeed();

  return (
    <div className="w-full max-w-sm">
      <PreviewAction>
        <Button variant="outline" size="sm" onClick={feed.add}>
          Add
        </Button>
        {/* Removal the reader did not ask for, next to the close button that is the
            removal they did. The two exits are only legible side by side. */}
        <Button variant="outline" size="sm" onClick={feed.retract}>
          Retract one
        </Button>
        <Button variant="outline" size="sm" onClick={feed.reset}>
          Reset
        </Button>
      </PreviewAction>

      <AnimatedList dismissed={feed.dismissed} className="space-y-2">
        {feed.rows.map((row) => (
          <AnimatedListItem key={row.id} itemKey={row.id}>
            <RowBody row={row} onDismiss={() => feed.dismiss(row.id)} />
          </AnimatedListItem>
        ))}
      </AnimatedList>
    </div>
  );
}

export function AnimatedListFromBottomExample() {
  const [rows, setRows] = React.useState(SEED.slice(0, 2));
  const next = React.useRef(0);

  const append = () => {
    const template = POOL[next.current % POOL.length];
    next.current += 1;
    setRows((current) => [...current, { ...template, id: `b${next.current}` }]);
  };

  return (
    <div className="w-full max-w-sm">
      <PreviewAction>
        <Button variant="outline" size="sm" onClick={append}>
          Append
        </Button>
      </PreviewAction>

      {/* A log grows downward, so its rows arrive from below. The direction of travel is
          a claim about where a row came from. */}
      <AnimatedList from="bottom" className="space-y-2">
        {rows.map((row) => (
          <AnimatedListItem key={row.id} itemKey={row.id}>
            <RowBody row={row} onDismiss={() => setRows((c) => c.filter((r) => r.id !== row.id))} />
          </AnimatedListItem>
        ))}
      </AnimatedList>
    </div>
  );
}
