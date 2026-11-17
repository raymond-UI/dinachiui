"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AgentProvider, useAgent, type AgentComponent } from "@/components/ui/agent";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CopyButton, FoldedCode, Knob, Toggle } from "./shared";
import type { Control, PlaygroundDef, Values, WorkbenchShell } from "./workbench-types";

/*
 * The hero of every component page: the real component on a stage, seen four ways. Use
 * (its props), Anatomy (its parts, found by their `data-slot`), Agent (the bridge, live)
 * and Source. Everything the Agent view shows comes from `agent.snapshot()` and every
 * change from `agent.act()`, so it cannot claim anything the component does not do.
 */

type View = "use" | "anatomy" | "agent" | "source";
interface Line { id: number; ask: string; ok?: boolean; note?: string }
interface Box { part: string; x: number; y: number; w: number; h: number }

/** `otp-field-input` and `OTPFieldInput` are the same part: compare without case or hyphens. */
const flat = (s: string) => s.replace(/-/g, "").toLowerCase();
const reduced = () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

function initial(controls: Control[]): Values {
  return Object.fromEntries(controls.map((c) => [c.name, c.default]));
}

function formatArg(a: unknown) {
  return typeof a === "string" ? `"${a}"` : JSON.stringify(a);
}

/** Wraps a playground so the server can render it with nothing but serialisable props. */
export function playground<V extends Values>(def: PlaygroundDef<V>) {
  function Playground(shell: WorkbenchShell) {
    return <Workbench shell={shell} def={def as unknown as PlaygroundDef} />;
  }
  return Playground;
}

export function Workbench({ shell, def }: { shell: WorkbenchShell; def: PlaygroundDef }) {
  const hasAgent = Boolean(shell.agent || def.tries?.length);
  const views: View[] = ["use", "anatomy", ...(hasAgent ? (["agent"] as const) : []), "source"];
  const [view, setView] = React.useState<View>("use");
  const [values, setValues] = React.useState<Values>(() => initial(def.controls));
  const [refuse, setRefuse] = React.useState(false);
  const partOf = React.useMemo(() => new Map(shell.parts.map((p) => [flat(p.name), p.name])), [shell.parts]);
  const summary = React.useMemo(() => Object.fromEntries(shell.parts.map((p) => [p.name, p.summary])), [shell.parts]);

  /* ----- stage and agent ----- */
  const [stage, setStage] = React.useState<HTMLDivElement | null>(null);
  // The bridge reads the stage and the popups the demo portals to <body>, not the docs around it.
  const root = React.useMemo(() => (stage ? stageAndPortals(stage) : undefined), [stage]);
  const agent = useAgent({ root });
  const [snap, setSnap] = React.useState<AgentComponent[]>([]);
  const [lines, setLines] = React.useState<Line[]>([]);
  const [flash, setFlash] = React.useState<"" | "ok" | "bad">("");
  const busy = React.useRef(false);
  const seq = React.useRef(0);

  React.useEffect(() => {
    if (view !== "agent") return;
    const read = () => setSnap(agent.snapshot());
    read();
    const id = setInterval(read, 300);
    return () => clearInterval(id);
  }, [agent, view]);

  async function tryStep(t: NonNullable<PlaygroundDef["tries"]>[number]) {
    if (busy.current) return;
    busy.current = true;
    const id = ++seq.current;
    const ask = `${t.action}(${(t.args ?? []).map(formatArg).join(", ")})`;
    setLines((l) => [{ id, ask }, ...l].slice(0, 4));
    setFlash("ok");
    await new Promise((r) => setTimeout(r, reduced() ? 0 : 350));
    const all = agent.snapshot();
    const target =
      (t.target ? all.find((c) => c.label === t.target) : undefined) ??
      all.find((c) => c.component === shell.agent?.kind && c.actions.includes(t.action)) ??
      all.find((c) => c.actions.includes(t.action)) ??
      // Nothing offers the action right now (Close while closed): ask anyway, so the log
      // shows the bridge's own reason.
      all.find((c) => c.component === shell.agent?.kind) ??
      all[0];
    const result = target
      ? await agent.act({ steps: [{ ref: target.ref, action: t.action, args: t.args }] })
      : { ok: false, error: { step: 0, message: `nothing on stage takes ${t.action}` } };
    const note = result.error?.message;
    setLines((l) => l.map((x) => (x.id === id ? { ...x, ok: result.ok, note } : x)));
    setFlash(result.ok ? "" : "bad");
    setSnap(agent.snapshot());
    setTimeout(() => {
      setFlash("");
      busy.current = false;
    }, result.ok ? 200 : 900);
  }

  /* ----- anatomy: every part on the page that this component exports ----- */
  const [picked, setHot] = React.useState<string | null>(null);
  const [measured, setBoxes] = React.useState<Box[]>([]);
  React.useEffect(() => {
    if (view !== "anatomy" || !stage) return;
    const measure = () => {
      const seen = new Set<string>();
      const next: Box[] = [];
      const els = [
        ...stage.querySelectorAll<HTMLElement>("[data-slot]"),
        ...document.querySelectorAll<HTMLElement>(`${PORTAL} [data-slot]`),
      ];
      for (const el of els) {
        const part = partOf.get(flat(el.dataset.slot!));
        if (!part || seen.has(part) || el.closest("[hidden],[data-agent-hidden]")) continue;
        let { left, top, right, bottom } = el.getBoundingClientRect();
        if (stage.contains(el)) {
          // Clip to the stage, so content taller than its scroll area stays inside it.
          const s = stage.getBoundingClientRect();
          left = Math.max(left, s.left);
          top = Math.max(top, s.top);
          right = Math.min(right, s.right);
          bottom = Math.min(bottom, s.bottom);
        }
        if (right - left < 1 || bottom - top < 1) continue;
        seen.add(part);
        next.push({ part, x: left, y: top, w: right - left, h: bottom - top });
      }
      setBoxes((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
    };
    measure();
    const id = setInterval(measure, 200);
    const hover = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-slot]");
      const part = el && partOf.get(flat(el.dataset.slot!));
      if (part && (stage.contains(el) || el.closest("[data-base-ui-portal]"))) setHot(part);
    };
    addEventListener("scroll", measure, true);
    addEventListener("resize", measure);
    addEventListener("pointermove", hover);
    return () => {
      clearInterval(id);
      removeEventListener("scroll", measure, true);
      removeEventListener("resize", measure);
      removeEventListener("pointermove", hover);
    };
  }, [view, stage, partOf]);
  const boxes = view === "anatomy" && stage ? measured : [];
  const found = new Set(boxes.map((b) => b.part));
  // Until someone points at a part, name the first one that is on stage.
  const hot = picked ?? boxes[0]?.part ?? shell.parts[0]?.name ?? "";
  const hotBox = boxes.find((b) => b.part === hot);

  /* ----- code for the current view ----- */
  const main = shell.files[0] ?? `components/ui/${shell.slug}.tsx`;
  const code =
    view === "source"
      ? { file: main, text: shell.source }
      : view === "agent" && shell.agent
        ? { file: "agent.ts", text: shell.agent.example }
        : view === "anatomy" && shell.anatomy
          ? { file: "anatomy", text: shell.anatomy }
          : { file: def.file, text: def.code(values, { refuse }) };
  const lineCount = code.text.split("\n").length;

  const Demo = def.Demo;
  const set = (name: string) => (v: string | number | boolean) => setValues((s) => ({ ...s, [name]: v }));

  return (
    <Tabs
      value={view}
      onValueChange={(v) => setView(v as View)}
      className={cn(
        "rounded-2xl border bg-card md:grid md:grid-cols-[minmax(0,1fr)_300px] md:overflow-hidden",
        def.tall ? "md:grid-rows-[auto_440px]" : "md:grid-rows-[auto_360px]",
      )}
    >
      <div className="flex flex-col md:contents">
        {/* stage */}
        <div
          ref={setStage}
          className={cn(
            "cp-stage relative flex justify-center overflow-hidden rounded-t-2xl px-6 transition-shadow duration-200 md:col-start-1 md:row-start-2 md:rounded-none md:border-r",
            def.tall ? "h-[400px] items-start pt-10 md:h-full md:pt-16" : "min-h-[280px] items-center py-12 md:h-full md:min-h-0",
            flash === "ok" && "shadow-[inset_0_0_0_1.5px_var(--agent)]",
            flash === "bad" && "shadow-[inset_0_0_0_1.5px_var(--destructive)]",
          )}
        >
          <AgentProvider agent={agent}>
            <div className={cn("flex w-full max-w-full justify-center", flash === "bad" && "cp-shake")}>
              <Demo values={values} anatomy={view === "anatomy"} refuse={refuse} />
            </div>
          </AgentProvider>
        </div>

        {/* view switcher */}
        <div className="border-t px-3 py-2 md:col-span-2 md:row-start-1 md:flex md:items-center md:justify-between md:border-b md:border-t-0">
          <TabsList
            className={cn(
              "relative grid h-11 w-full rounded-lg border bg-background p-1 md:inline-flex md:h-9 md:w-auto",
              views.length === 4 ? "grid-cols-4" : "grid-cols-3",
            )}
          >
            <TabsIndicator className="bottom-auto left-0 top-0 z-0 h-[var(--active-tab-height)] translate-y-[var(--active-tab-top)] rounded-md bg-muted" />
            {views.map((v) => (
              <TabsTrigger
                key={v}
                value={v}
                className={cn(
                  "relative z-10 h-full rounded-md px-3 text-[13px] capitalize focus-visible:ring-offset-0 data-[active]:bg-transparent data-[active]:shadow-none",
                  v === "agent" && "data-[active]:text-[var(--agent)]",
                )}
              >
                {v}
              </TabsTrigger>
            ))}
          </TabsList>
          {view === "agent" && <span className="hidden text-xs text-[var(--agent)] md:inline">Runs on the real bridge</span>}
        </div>
      </div>

      {/* controls for the current view */}
      <div className="px-4 py-3 md:col-start-2 md:row-start-2 md:min-h-0 md:overflow-y-auto md:bg-background/40 md:px-5 md:py-4">
        <TabsContent value="use" className="mt-0">
          {def.controls.map((c) => (
            <Knob key={c.name} name={c.name}>
              <ControlInput control={c} value={values[c.name]} onChange={set(c.name)} />
            </Knob>
          ))}
        </TabsContent>

        <TabsContent value="anatomy" className="mt-0">
          <div className="flex flex-wrap gap-1.5 md:flex-col md:gap-0.5">
            {shell.parts.map(({ name }) => (
              <button
                key={name}
                type="button"
                onPointerEnter={() => setHot(name)}
                onFocus={() => setHot(name)}
                onClick={() => setHot(name)}
                className={cn(
                  "h-9 rounded-md border px-2.5 text-left font-mono text-[12.5px] transition-colors md:h-8 md:border-0",
                  name === hot
                    ? "border-[var(--part)]/40 bg-[var(--part-soft)] text-[var(--part)]"
                    : found.has(name)
                      ? "text-muted-foreground hover:text-foreground"
                      : "text-muted-foreground/50 hover:text-muted-foreground",
                )}
              >
                {name}
              </button>
            ))}
          </div>
          {hot && (
            <p className="mt-4 text-sm text-muted-foreground">
              <code className="font-mono text-foreground">{hot}</code> {lower(summary[hot])}
              {!found.has(hot) && <span className="mt-1 block text-xs">Not on stage right now.</span>}
            </p>
          )}
        </TabsContent>

        {hasAgent && (
          <TabsContent value="agent" className="mt-0 space-y-4">
            <div>
              <div className="mb-2 font-mono text-xs text-muted-foreground">agent.snapshot()</div>
              <div className="space-y-2">
                {snap.length ? (
                  snap.slice(0, 4).map((c) => <SnapCard key={c.ref} c={c} />)
                ) : (
                  <div className="rounded-lg border bg-background px-3 py-2.5 font-mono text-[12.5px] text-muted-foreground">
                    Reading the bridge
                  </div>
                )}
                {snap.length > 4 && <div className="font-mono text-xs text-muted-foreground">+{snap.length - 4} more</div>}
              </div>
            </div>
            {def.tries?.length ? (
              <div>
                <div className="mb-2 font-mono text-xs text-muted-foreground">agent.act()</div>
                {/* A press here is not a press outside the demo's popup, or it closes before a try can act on it. */}
                <div
                  className="grid grid-cols-2 gap-1.5 md:flex md:flex-wrap"
                  onPointerDown={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {def.tries.map((t) => (
                    <Button
                      key={t.label}
                      variant="outline"
                      size="sm"
                      onClick={() => tryStep(t)}
                      className="h-10 px-2.5 text-[13px] hover:border-[var(--agent)] hover:bg-[var(--agent-soft)] md:h-8"
                    >
                      {t.label}
                    </Button>
                  ))}
                </div>
              </div>
            ) : null}
            {def.refusable && (
              <Knob name="Refuse agent changes" plain>
                <Toggle label="Refuse agent changes" checked={refuse} onChange={setRefuse} />
              </Knob>
            )}
            <ol aria-live="polite" className="min-h-12 space-y-1 font-mono text-xs text-muted-foreground">
              {lines.map((l) => (
                <li key={l.id}>
                  › {l.ask}{" "}
                  {l.ok === undefined ? "…" : l.ok ? <span className="text-[var(--agent)]">✓</span> : <span className="text-destructive">✕</span>}
                  {l.note && <span className="block pl-3.5 opacity-80">{l.note}</span>}
                </li>
              ))}
            </ol>
          </TabsContent>
        )}

        <TabsContent value="source" className="mt-0 font-mono text-[12.5px]">
          <div className="mb-2 font-sans text-xs text-muted-foreground">Added to your project</div>
          <div className="leading-7">
            {shell.files.map((f, i) => (
              <div key={f} className={cn("break-all", i > 0 && "text-muted-foreground")}>
                {f}
                {i === 0 && <span className="text-muted-foreground"> · {shell.source.split("\n").length} lines</span>}
              </div>
            ))}
            {shell.usesAgent && (
              <div className="text-muted-foreground">
                components/ui/agent/ <span className="font-sans text-xs">the bridge, shared</span>
              </div>
            )}
          </div>
          <div className="mb-1 mt-4 font-sans text-xs text-muted-foreground">Installs</div>
          {[...shell.dependencies.map((d) => [d.name, d.version]), ["@/lib/utils", "cn"]].map(([n, v]) => (
            <div key={n} className="flex justify-between gap-3 border-t py-2">
              <span className="break-all">{n}</span>
              <span className="shrink-0 text-muted-foreground">{v}</span>
            </div>
          ))}
        </TabsContent>
      </div>

      {/* code: inline on desktop, a sheet on phones */}
      <div className="cp-code hidden min-h-[350px] border-t md:col-span-2 md:block">
        <div className="flex items-center justify-between px-4 py-1.5">
          <span className="font-mono text-xs text-muted-foreground">{code.file}</span>
          <CopyButton text={code.text} />
        </div>
        <FoldedCode key={code.file} code={code.text} />
      </div>
      <div className="border-t p-3 md:hidden">
        <Drawer>
          <DrawerTrigger render={<Button variant="outline" className="h-11 w-full justify-between font-normal" />}>
            <span className="font-mono text-[13px]">{code.file}</span>
            <span className="text-xs text-muted-foreground">{lineCount} lines</span>
          </DrawerTrigger>
          <DrawerContent side="bottom" className="max-h-[85dvh] gap-0 rounded-t-2xl p-0">
            <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-border" />
            <div className="flex items-center justify-between px-4 py-2">
              <DrawerTitle className="font-mono text-[13px] font-normal">{code.file}</DrawerTitle>
              <CopyButton text={code.text} />
            </div>
            <div className="cp-code overflow-x-auto px-2 pb-6">
              <FoldedCode code={code.text} fold={Infinity} />
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {view === "anatomy" &&
        typeof document !== "undefined" &&
        createPortal(
          <div aria-hidden className="pointer-events-none fixed inset-0 z-[60]">
            {boxes.map((b) => (
              <div
                key={b.part}
                className={cn(
                  "absolute rounded-md border border-dashed border-[var(--part)] bg-[var(--part-soft)] transition-opacity duration-150",
                  b.part === hot ? "opacity-100" : "opacity-30",
                )}
                style={{ left: b.x - 3, top: b.y - 3, width: b.w + 6, height: b.h + 6 }}
              />
            ))}
            {hotBox && (
              <div
                className="absolute hidden -translate-y-full rounded border border-[var(--part)]/40 bg-background px-1.5 font-mono text-[11px] leading-5 text-[var(--part)] md:block"
                style={{ left: hotBox.x - 3, top: hotBox.y - 7 }}
              >
                {hot}
              </div>
            )}
          </div>,
          document.body,
        )}
    </Tabs>
  );
}

const PORTAL = "[data-base-ui-portal]";

/** A root covering the stage and Base UI's portals: what `querySelectorAll` and `contains` need. */
function stageAndPortals(stage: HTMLElement): ParentNode {
  const portals = () => Array.from(document.querySelectorAll<HTMLElement>(PORTAL));
  return {
    querySelectorAll: (sel: string) => [
      ...stage.querySelectorAll(sel),
      ...portals().flatMap((p) => [...(p.matches(sel) ? [p] : []), ...p.querySelectorAll(sel)]),
    ],
    contains: (node: Node | null) =>
      !!node && (stage.contains(node) || portals().some((p) => p.contains(node))),
  } as unknown as ParentNode;
}

function lower(s?: string) {
  return s ? s.charAt(0).toLowerCase() + s.slice(1) : "";
}

function ControlInput({ control: c, value, onChange }: { control: Control; value: Values[string]; onChange: (v: string | number | boolean) => void }) {
  if (c.type === "boolean") return <Toggle label={c.name} checked={value as boolean} onChange={onChange} />;
  if (c.type === "select" && (c.options.length > 3 || c.options.join("").length > 18))
    return (
      <Select items={c.options.map((o) => ({ value: o, label: o }))} value={value as string} onValueChange={(v) => v != null && onChange(v as string)}>
        <SelectTrigger aria-label={c.name} className="h-9 w-40 bg-background font-mono text-[12px] md:h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {c.options.map((o) => (
            <SelectItem key={o} value={o} className="font-mono text-[12px]">
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  if (c.type === "select")
    return (
      <div role="radiogroup" aria-label={c.name} className="flex flex-wrap justify-end gap-1">
        {c.options.map((o) => (
          <button
            key={o}
            type="button"
            role="radio"
            aria-checked={value === o}
            onClick={() => onChange(o)}
            className={cn(
              "h-8 rounded-md border px-2 font-mono text-[12px] transition-colors md:h-7",
              value === o ? "border-foreground/30 bg-muted text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {o}
          </button>
        ))}
      </div>
    );
  if (c.type === "number")
    return (
      <Input
        type="number"
        value={value as number}
        min={c.min}
        max={c.max}
        step={c.step}
        onChange={(e) => onChange(e.target.value === "" ? c.default : Number(e.target.value))}
        aria-label={c.name}
        className="h-9 w-24 font-sans text-[13px] md:h-8"
      />
    );
  return (
    <Input
      value={value as string}
      onChange={(e) => onChange(e.target.value)}
      aria-label={c.name}
      className="h-9 w-44 font-sans text-[13px] md:h-8"
    />
  );
}

function SnapCard({ c }: { c: AgentComponent }) {
  const skip = new Set(["ref", "component", "actions", "label"]);
  const rows = Object.entries(c).filter(([k, v]) => !skip.has(k) && v !== undefined);
  const show = (v: unknown) =>
    Array.isArray(v) ? (v.length > 3 ? `[${v.slice(0, 3).map(formatArg).join(", ")}, …${v.length - 3}]` : JSON.stringify(v)) : formatArg(v);
  return (
    <dl className="grid grid-cols-[76px_1fr] gap-x-2 rounded-lg border bg-background px-3 py-2 font-mono text-[12px] leading-[1.75]">
      <dt className="text-muted-foreground">{c.component}</dt>
      <dd className="truncate">&quot;{c.label}&quot;</dd>
      {rows.map(([k, v]) => (
        <React.Fragment key={k}>
          <dt className="text-muted-foreground">{k}</dt>
          <dd className={cn("truncate", (k === "value" || k === "checked") && "text-[var(--agent)]")}>{show(v)}</dd>
        </React.Fragment>
      ))}
      <dt className="text-muted-foreground">actions</dt>
      <dd className="truncate">{c.actions.join(", ")}</dd>
    </dl>
  );
}
