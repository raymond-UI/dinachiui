"use client";

import * as React from "react";
import Link from "next/link";
import {
  AgentProvider,
  useAgent,
  type AgentComponent,
} from "@/components/ui/agent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { HoldToConfirm } from "@/components/ui/hold-to-confirm";
import { NumberTicker } from "@/components/ui/number-ticker";
import { OTPField, OTPFieldInput } from "@/components/ui/otp-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Slider,
  SliderControl,
  SliderRange,
  SliderThumb,
  SliderTrack,
} from "@/components/ui/slider";
import {
  Sortable,
  SortableHandle,
  SortableItem,
} from "@/components/ui/sortable";
import { Switch, SwitchThumb } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { components } from "@/lib/component-metadata";
import { cn } from "@/lib/utils";
import {
  Digits,
  useCountOnView,
  useInView,
  useReducedMotion,
} from "./primitives";

/** Component folders that import the bridge. `inventory:check` keeps the folder list honest. */
const AGENT_READY = 33;
const ROLES = ["Viewer", "Editor", "Admin"].map((r) => ({
  value: r,
  label: r,
}));

interface Cell {
  name: string;
  /** The accessible name the bridge reads. Absent for what it reads as plain text. */
  label?: string;
  text?: string;
  body: React.ReactNode;
}

function Grip() {
  return (
    <SortableHandle className="mr-1.5 inline-flex text-[var(--faint)]">
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <circle cx="9" cy="6" r="1.6" />
        <circle cx="15" cy="6" r="1.6" />
        <circle cx="9" cy="12" r="1.6" />
        <circle cx="15" cy="12" r="1.6" />
        <circle cx="9" cy="18" r="1.6" />
        <circle cx="15" cy="18" r="1.6" />
      </svg>
    </SortableHandle>
  );
}

export function AgentWall() {
  const reduced = useReducedMotion();
  const [root, setRoot] = React.useState<HTMLDivElement | null>(null);
  const agent = useAgent({ root: root ?? undefined });
  const [wallRef, wallOn] = useInView<HTMLDivElement>({ threshold: 0.3 });
  const [countRef, all] = useCountOnView(components.length);
  const ready = all === null ? null : AGENT_READY;
  const [seenRef, seen] = useInView<HTMLDivElement>({
    threshold: 0.12,
    once: true,
  });

  const [tab, setTab] = React.useState("preview");
  const [volume, setVolume] = React.useState(62);
  const [airplane, setAirplane] = React.useState(true);
  const [terms, setTerms] = React.useState(true);
  const [style, setStyle] = React.useState<string[]>(["bold"]);
  const [order, setOrder] = React.useState(["review", "ship"]);
  const [role, setRole] = React.useState<string | null>("Editor");

  const cells: Cell[] = [
    {
      name: "Button",
      label: "Get started",
      body: (
        <>
          <Button size="sm">Get started</Button>
          <Button size="sm" variant="outline" aria-label="Docs">
            Docs
          </Button>
        </>
      ),
    },
    {
      name: "Tabs",
      label: "View",
      body: (
        <Tabs
          aria-label="View"
          value={tab}
          onValueChange={(v) => setTab(v as string)}
        >
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
        </Tabs>
      ),
    },
    {
      name: "Slider",
      label: "Volume",
      body: (
        <Slider
          aria-label="Volume"
          value={volume}
          onValueChange={(v) => setVolume(v as number)}
          className="w-full"
        >
          <SliderControl>
            <SliderTrack>
              <SliderRange />
              <SliderThumb aria-label="Volume" />
            </SliderTrack>
          </SliderControl>
        </Slider>
      ),
    },
    {
      name: "OTP field",
      label: "Code",
      body: (
        <OTPField length={4} aria-label="Code" defaultValue="482">
          {[0, 1, 2, 3].map((i) => (
            <OTPFieldInput
              key={i}
              className="size-9"
            />
          ))}
        </OTPField>
      ),
    },
    {
      name: "Switch",
      label: "Airplane mode",
      body: (
        <Switch
          aria-label="Airplane mode"
          checked={airplane}
          onCheckedChange={setAirplane}
        >
          <SwitchThumb />
        </Switch>
      ),
    },
    {
      name: "Hold to confirm",
      label: "Hold to delete",
      body: (
        <HoldToConfirm confirmedLabel="Deleted">Hold to delete</HoldToConfirm>
      ),
    },
    {
      name: "Checkbox",
      label: "Terms",
      body: (
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            aria-label="Terms"
            checked={terms}
            onCheckedChange={setTerms}
          />
          Accept terms
        </label>
      ),
    },
    {
      name: "Badge",
      text: '"Default" "Shipped" "Beta"',
      body: (
        <>
          <Badge variant="secondary">Default</Badge>
          <Badge variant="success">Shipped</Badge>
          <Badge variant="warning">Beta</Badge>
        </>
      ),
    },
    {
      name: "Toggle group",
      label: "Text style",
      body: (
        <ToggleGroup
          multiple
          aria-label="Text style"
          value={style}
          onValueChange={(v) => setStyle(v as string[])}
        >
          <ToggleGroupItem value="bold" aria-label="Bold">
            <b>B</b>
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic">
            <i>I</i>
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline">
            <u>U</u>
          </ToggleGroupItem>
        </ToggleGroup>
      ),
    },
    {
      name: "Sortable",
      label: "Roadmap",
      body: (
        <Sortable
          aria-label="Roadmap"
          value={order}
          onValueChange={setOrder}
          className="flex w-full flex-col gap-1.5 text-sm"
        >
          {order.map((id) => (
            <SortableItem
              key={id}
              id={id}
              label={id === "review" ? "Design review" : "Ship 1.0"}
              className="flex items-center rounded-lg border border-[var(--border)] bg-[var(--card)] px-2.5 py-1.5"
            >
              <Grip />
              {id === "review" ? "Design review" : "Ship 1.0"}
            </SortableItem>
          ))}
        </Sortable>
      ),
    },
    {
      name: "Number ticker",
      text: `"${components.length}"`,
      body: (
        <NumberTicker
          value={components.length}
          startOnView
          once
          className="big"
        />
      ),
    },
    {
      name: "Select",
      label: "Role",
      body: (
        <Select
          items={ROLES}
          value={role}
          onValueChange={(v) => setRole(v as string)}
        >
          <SelectTrigger aria-label="Role" className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROLES.map((r) => (
              <SelectItem key={r.value} value={r.value}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
  ];

  /* ---------- inspect ---------- */
  const [cur, setCur] = React.useState<number | null>(null);
  const [entry, setEntry] = React.useState<AgentComponent | null>(null);
  const [box, setBox] = React.useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);
  const cellEls = React.useRef<(HTMLDivElement | null)[]>([]);
  const user = React.useRef(false);

  const measure = React.useCallback(
    (i: number) => {
      const bd = cellEls.current[i]?.querySelector(".bd");
      if (!bd || !root) return;
      const w = root.getBoundingClientRect();
      const r = Array.from(bd.children)
        // Skip the visually hidden inputs Base UI renders beside some controls.
        .filter((k) => {
          const q = k.getBoundingClientRect();
          return q.width > 2 && q.height > 2;
        })
        .reduce(
        (a, k) => {
          const q = k.getBoundingClientRect();
          return {
            l: Math.min(a.l, q.left),
            t: Math.min(a.t, q.top),
            r: Math.max(a.r, q.right),
            b: Math.max(a.b, q.bottom),
          };
        },
        { l: Infinity, t: Infinity, r: -Infinity, b: -Infinity },
      );
      const p = 8;
      setBox({
        x: r.l - w.left - p,
        y: r.t - w.top - p,
        w: r.r - r.l + p * 2,
        h: r.b - r.t + p * 2,
      });
    },
    [root],
  );

  const inspect = React.useCallback(
    (i: number) => {
      setCur(i);
      const label = cells[i].label;
      setEntry(
        label
          ? (agent.snapshot().find((c) => c.label === label) ?? null)
          : null,
      );
      measure(i);
    },
    // `cells` is rebuilt each render; only its labels matter here and they never change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [agent, measure],
  );

  // Keep the readout in step when a specimen is used.
  React.useEffect(() => {
    if (cur === null) return;
    const f = requestAnimationFrame(() => inspect(cur));
    return () => cancelAnimationFrame(f);
  }, [tab, volume, airplane, terms, style, order, role, cur, inspect]);

  // Walk the wall on its own until someone points at it.
  React.useEffect(() => {
    if (!wallOn || reduced) return;
    const t = setInterval(() => {
      if (!user.current) inspect(((cur ?? -1) + 1) % cells.length);
    }, 1700);
    return () => clearInterval(t);
  }, [wallOn, reduced, cur, inspect, cells.length]);

  React.useEffect(() => {
    if (!reduced || !root || cur !== null) return;
    const f = requestAnimationFrame(() => inspect(1));
    return () => cancelAnimationFrame(f);
  }, [reduced, root, cur, inspect]);

  React.useEffect(() => {
    const onResize = () => cur !== null && measure(cur);
    addEventListener("resize", onResize);
    return () => removeEventListener("resize", onResize);
  }, [cur, measure]);

  const cell = cur === null ? null : cells[cur];
  const action = entry?.actions[0];

  return (
    <section className="sec blk">
      <div className="wallhead">
        <h2 ref={countRef}>
          <Digits value={all} cols={2} /> components.{" "}
          <span className="pixel">
            <Digits value={ready} cols={2} /> speak agent.
          </span>
        </h2>
        <Link href="/docs/components">Browse all {components.length}</Link>
      </div>
      <div
        ref={(el) => {
          setRoot(el);
          wallRef(el);
          seenRef(el);
        }}
        className={cn("wall rv", seen && "vis")}
        onPointerLeave={() => (user.current = false)}
      >
        <AgentProvider agent={agent}>
          {cells.map((c, i) => (
            <div
              key={c.name}
              ref={(el) => {
                cellEls.current[i] = el;
              }}
              className={cn("cell", cur === i && "cur")}
              onPointerEnter={() => {
                user.current = true;
                inspect(i);
              }}
              onFocus={() => {
                user.current = true;
                inspect(i);
              }}
            >
              <div className="cn">{c.name}</div>
              <div className="bd">{c.body}</div>
            </div>
          ))}
        </AgentProvider>
        <div className="inspect" aria-live="polite">
          <span className="k">agent.snapshot()</span>
          {cell && (
            <span
              className="row"
              key={`${cur}-${entry?.ref}-${String(entry?.value)}-${String(entry?.checked)}`}
            >
              {entry ? (
                <>
                  <span className="dim">{entry.ref}</span>
                  <span className="dim">{entry.component}</span>
                  <span className="lab">&quot;{entry.label}&quot;</span>
                  {entry.checked !== undefined && (
                    <span>{entry.checked ? "on" : "off"}</span>
                  )}
                  {entry.value !== undefined && (
                    <span>
                      {typeof entry.value === "string"
                        ? `"${entry.value}"`
                        : JSON.stringify(entry.value)}
                    </span>
                  )}
                  {entry.confirm && (
                    <span className="c-wait">needs approval</span>
                  )}
                  {action && <span className="dim">{action}()</span>}
                </>
              ) : (
                <>
                  <span className="dim">text</span>
                  <span className="lab">{cell.text ?? cell.label}</span>
                  <span className="dim">read as text</span>
                </>
              )}
            </span>
          )}
        </div>
        <div
          className={cn("wring", box && "on", cell && !entry && "off-agent")}
          style={
            box
              ? {
                  width: box.w,
                  height: box.h,
                  transform: `translate(${box.x}px, ${box.y}px)`,
                }
              : undefined
          }
          aria-hidden
        />
      </div>
    </section>
  );
}
