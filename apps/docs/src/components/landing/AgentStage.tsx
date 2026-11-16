"use client";

import * as React from "react";
import {
  AgentProvider,
  isAgentChange,
  useAgent,
  type AgentAction,
  type AgentComponent,
} from "@/components/ui/agent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Switch, SwitchThumb } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Digits, useInView, useReducedMotion } from "./primitives";

/*
 * The demo app on the left is real Dinachi components on a real bridge, scoped to the
 * pane. The script only decides what to ask for: every value in the snapshot comes from
 * `agent.snapshot()`, every change goes through `agent.act()`, the refusal is the app's
 * own `onValueChange` cancelling it, and "Send invite" waits on the bridge's `allow`.
 */

const ROLES = ["Viewer", "Editor", "Admin"].map((r) => ({
  value: r,
  label: r,
}));
const PRICE = { monthly: 12, yearly: 10 };
const STALE = Symbol("stale");

type Mode = "run" | "wait" | "bad";
type Status = "idle" | "run" | "wait" | "done" | "bad";
type Mark = "ok" | "wait" | "bad";
interface Row {
  ref: string;
  kind: string;
  label: string;
  value: React.ReactNode;
  extra?: React.ReactNode;
  key: string;
}
interface Line {
  id: number;
  kind: "step" | "info";
  label?: string;
  action?: string;
  arg?: React.ReactNode;
  mark?: Mark;
  note?: string;
  html?: React.ReactNode;
  cls?: string;
}
interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

const quote = (s: unknown) => (
  <span className="str">&quot;{String(s)}&quot;</span>
);

function display(c: AgentComponent): Pick<Row, "value" | "extra"> {
  switch (c.component) {
    case "input":
      return {
        value: quote(c.value ?? ""),
        extra: c.required ? "required" : undefined,
      };
    case "select":
    case "tabs":
      return {
        value: quote(c.value ?? ""),
        extra: c.items ? `${c.items.length} options` : undefined,
      };
    case "switch":
    case "checkbox":
      return { value: c.checked ? "on" : "off" };
    case "slider":
      return { value: String(c.value), extra: `${c.min} to ${c.max}` };
    case "button":
      return {
        value: c.confirm ? (
          <span className="warn">needs approval</span>
        ) : (
          "ready"
        ),
      };
    default:
      return { value: c.value === undefined ? "" : String(c.value) };
  }
}

function RoleSelect({
  label,
  className,
  ...props
}: { label: string; className: string } & Pick<
  React.ComponentProps<typeof Select>,
  "value" | "onValueChange"
>) {
  return (
    <Select items={ROLES} {...props}>
      <SelectTrigger aria-label={label} className={className}>
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
  );
}

const SCENARIOS = [
  { name: "Invite a teammate", D: 12500, icon: <path d="M12 5v14M5 12h14" /> },
  {
    name: "Refuse a change",
    D: 10500,
    icon: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="m6.5 6.5 11 11" />
      </>
    ),
  },
  {
    name: "Change the plan",
    D: 11500,
    icon: <path d="M4 12h12M12 6l6 6-6 6" />,
  },
];

export function AgentStage() {
  const reduced = useReducedMotion();
  const [stageRef, stageVisible] = useInView<HTMLDivElement>({
    threshold: 0.3,
  });
  const [revealRef, revealed] = useInView<HTMLDivElement>({
    threshold: 0.12,
    once: true,
  });

  /* ---------- the app ---------- */
  const [view, setView] = React.useState<"team" | "billing">("team");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<string | null>("Viewer");
  const [digest, setDigest] = React.useState(false);
  const [alanRole, setAlanRole] = React.useState<string | null>("Viewer");
  const [invited, setInvited] = React.useState(false);
  const [period, setPeriod] = React.useState("monthly");
  const [seats, setSeats] = React.useState(3);
  const [shake, setShake] = React.useState(0);

  /* ---------- what the visitor watches ---------- */
  const [ring, setRing] = React.useState<{
    box: Box;
    label: string;
    mode: Mode;
  } | null>(null);
  const [approve, setApprove] = React.useState<"off" | "on" | "nudge">("off");
  const [toast, setToast] = React.useState<{
    text: string;
    bad?: boolean;
    on: boolean;
  }>({ text: "", on: false });
  const [cursor, setCursor] = React.useState<{
    x: number;
    y: number;
    on: boolean;
    move: boolean;
    down: boolean;
    flip: boolean;
  }>({ x: 0, y: 0, on: false, move: false, down: false, flip: false });
  const [okDown, setOkDown] = React.useState(false);
  const [prompt, setPrompt] = React.useState({
    text: "",
    typing: false,
    enter: false,
  });
  const [status, setStatus] = React.useState<{ s: Status; t: string }>({
    s: "idle",
    t: "idle",
  });
  const [rows, setRows] = React.useState<{
    list: Row[];
    more: number;
    hot: string | null;
  }>({ list: [], more: 0, hot: null });
  const [lines, setLines] = React.useState<Line[]>([]);
  const [code, setCode] = React.useState({ on: false, fire: 0 });
  const [reply, setReply] = React.useState<{ words: string[]; shown: number }>({
    words: [],
    shown: 0,
  });
  const [current, setCurrent] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  const [pane, setPane] = React.useState<HTMLDivElement | null>(null);
  const ringTarget = React.useRef<Element | null>(null);
  const decide = React.useRef<((yes: boolean) => void) | null>(null);
  const run = React.useRef({
    token: 0,
    elapsed: 0,
    D: 0,
    done: false,
    waiting: false,
    started: false,
    paused: false,
    visible: false,
    reduced: false,
  });
  const tabEls = React.useRef<(HTMLButtonElement | null)[]>([]);
  const stripRef = React.useRef<HTMLDivElement>(null);
  const okRef = React.useRef<HTMLButtonElement>(null);
  const scope = React.useRef<string>("");
  React.useEffect(() => {
    run.current.paused = paused;
    run.current.visible = stageVisible;
    run.current.reduced = reduced;
  }, [paused, stageVisible, reduced]);

  const agent = useAgent({
    root: pane ?? undefined,
    // Every step comes through here. Only one with `data-agent-confirm` waits on a person.
    allow: (step: AgentAction) => (step.confirm ? askPerson(step) : true),
  });

  /* ---------- helpers ---------- */
  const sleep = (ms: number, id: number) =>
    new Promise<void>((res, rej) =>
      setTimeout(
        () => (id === run.current.token ? res() : rej(STALE)),
        run.current.reduced ? 0 : ms,
      ),
    );
  const alive = (id: number) => {
    if (id !== run.current.token) throw STALE;
  };
  const frame = () => new Promise((r) => requestAnimationFrame(() => r(null)));

  const boxOf = React.useCallback(
    (el: Element, pad = 5): Box => {
      const a = pane!.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      return {
        x: r.left - a.left - pad,
        y: r.top - a.top - pad,
        w: r.width + pad * 2,
        h: r.height + pad * 2,
      };
    },
    [pane],
  );
  const target = (name: string) =>
    pane?.querySelector(`[data-ring="${name}"]`) ?? null;
  const focus = (name: string, label: string, mode: Mode = "run") => {
    const el = target(name);
    if (!el) return;
    ringTarget.current = el;
    setRing({ box: boxOf(el), label, mode });
  };
  const unfocus = () => {
    ringTarget.current = null;
    setRing((r) =>
      r ? { ...r, label: r.label, mode: r.mode, box: r.box } : r,
    );
    setRing(null);
  };

  React.useEffect(() => {
    const onResize = () => {
      const el = ringTarget.current;
      if (el && pane) setRing((r) => (r ? { ...r, box: boxOf(el) } : r));
    };
    addEventListener("resize", onResize);
    return () => removeEventListener("resize", onResize);
  }, [pane, boxOf]);

  /** Reads the bridge and shows the controls in the container the scenario is about. */
  const read = (hot?: string) => {
    const all = agent.snapshot();
    const mine = all.filter((c) => c.in === scope.current);
    setRows({
      list: mine.map((c) => ({
        ref: c.ref,
        kind: c.component,
        label: c.label,
        key: c.label,
        ...display(c),
      })),
      more: all.length - mine.length,
      hot: hot ?? null,
    });
    return mine;
  };
  const refOf = (label: string) =>
    agent.snapshot().find((c) => c.label === label)?.ref ?? "";
  const override = (label: string, value: React.ReactNode) =>
    setRows((r) => ({
      ...r,
      list: r.list.map((row) =>
        row.label === label ? { ...row, value } : row,
      ),
      hot: label,
    }));

  const lineId = React.useRef(0);
  const step = (label: string, action: string, arg?: React.ReactNode) => {
    const id = ++lineId.current;
    setLines((l) => [...l, { id, kind: "step", label, action, arg }]);
    return id;
  };
  const mark = (id: number, m: Mark, note?: string) =>
    setLines((l) => l.map((x) => (x.id === id ? { ...x, mark: m, note } : x)));
  const info = (html: React.ReactNode, cls?: string) =>
    setLines((l) => [...l, { id: ++lineId.current, kind: "info", html, cls }]);

  async function act(label: string, action: string, args: unknown[]) {
    return agent.act({ steps: [{ ref: refOf(label), action, args }] });
  }

  async function typePrompt(text: string, id: number) {
    setPrompt({ text: "", typing: true, enter: false });
    await sleep(350, id);
    for (let i = 1; i <= text.length; i++) {
      setPrompt({ text: text.slice(0, i), typing: true, enter: false });
      await sleep(24 + ((i * 37) % 22), id);
    }
    await sleep(380, id);
    setPrompt({ text, typing: true, enter: true });
    await sleep(160, id);
    setPrompt({ text, typing: false, enter: false });
  }

  async function say(text: string, id: number) {
    const words = text.split(" ");
    setReply({ words, shown: 0 });
    for (let i = 1; i <= words.length; i++) {
      setReply({ words, shown: i });
      await sleep(45, id);
    }
  }

  function showToast(text: string, bad?: boolean) {
    setToast({ text, bad, on: true });
  }

  /* ---------- a person approves ---------- */
  function askPerson(_step: AgentAction): Promise<boolean> {
    const id = run.current.token;
    setApprove("on");
    const nudge = setTimeout(
      () => setApprove((a) => (a === "on" ? "nudge" : a)),
      3200,
    );
    let decided = false;
    const human = new Promise<{ yes: boolean; who: string }>(
      (res) => (decide.current = (yes) => res({ yes, who: "you" })),
    );
    const person = graceApproves(id, () => decided).catch(
      () => new Promise<never>(() => {}),
    );
    return Promise.race([human, person]).then(({ yes, who }) => {
      decided = true;
      decide.current = null;
      clearTimeout(nudge);
      setApprove("off");
      setTimeout(
        () => setCursor((c) => ({ ...c, on: false })),
        who === "you" ? 0 : 450,
      );
      if (id === run.current.token) approvedBy.current = { yes, who };
      return yes;
    });
  }
  const approvedBy = React.useRef<{ yes: boolean; who: string } | null>(null);

  async function graceApproves(id: number, over: () => boolean) {
    await sleep(1400, id);
    while (run.current.paused) await sleep(200, id);
    if (over() || !pane || !okRef.current) throw STALE;
    const a = pane.getBoundingClientRect();
    const b = okRef.current.getBoundingClientRect();
    const tx = b.left - a.left + b.width * 0.55;
    const ty = b.top - a.top + b.height * 0.5;
    const sx = Math.min(tx + 150, a.width - 40);
    const sy = Math.min(ty + 90, a.height - 30);
    const flip = tx > a.width - 90;
    setCursor({ x: sx, y: sy, on: false, move: false, down: false, flip });
    await frame();
    await frame();
    setCursor({ x: tx, y: ty, on: true, move: true, down: false, flip });
    await sleep(1100, id);
    if (over()) throw STALE;
    setCursor((c) => ({ ...c, down: true }));
    setOkDown(true);
    await sleep(150, id);
    setCursor((c) => ({ ...c, down: false }));
    setOkDown(false);
    if (over()) throw STALE;
    return { yes: true, who: "Grace" };
  }

  /* ---------- scenarios ---------- */
  async function invite(id: number) {
    setView("team");
    scope.current = "Invite member";
    await typePrompt(
      "Invite ada@lovelace.dev as an editor, with the weekly digest on.",
      id,
    );
    setStatus({ s: "run", t: "reading" });
    read();
    await sleep(700, id);
    setStatus({ s: "run", t: "acting" });

    focus("Email", "setValue");
    await sleep(450, id);
    const address = "ada@lovelace.dev";
    const a = step("Email", "setValue", quote(address));
    for (let i = 1; i <= address.length; i++) {
      await act("Email", "setValue", [address.slice(0, i)]);
      alive(id);
      await sleep(26 + ((i * 29) % 20), id);
    }
    read("Email");
    mark(a, "ok");
    await sleep(480, id);

    focus("Role", "select");
    await sleep(450, id);
    const b = step("Role", "select", quote("Editor"));
    const rb = await act("Role", "select", ["Editor"]);
    alive(id);
    read("Role");
    mark(b, rb.ok ? "ok" : "bad");
    await sleep(480, id);

    focus("Weekly digest", "setChecked");
    await sleep(450, id);
    const c = step(
      "Weekly digest",
      "setChecked",
      <span className="num">true</span>,
    );
    const rc = await act("Weekly digest", "setChecked", [true]);
    alive(id);
    read("Weekly digest");
    mark(c, rc.ok ? "ok" : "bad");
    await sleep(520, id);

    focus("Send invite", "press · asking you", "wait");
    await sleep(380, id);
    const d = step("Send invite", "press");
    mark(d, "wait");
    setStatus({ s: "wait", t: "waiting on you" });
    override("Send invite", <span className="warn">waiting on a person</span>);
    run.current.waiting = true;
    approvedBy.current = null;
    const rd = await act("Send invite", "press", []);
    run.current.waiting = false;
    alive(id);
    const who = (approvedBy.current as { who: string } | null)?.who ?? "you";

    if (rd.ok) {
      mark(d, "ok");
      info(`approved by ${who}`, "c-ok");
      setRing((r) => (r ? { ...r, label: "press", mode: "run" } : r));
      read("Send invite");
      await sleep(240, id);
      unfocus();
      info(
        <>
          <span className="m">appeared</span>{" "}
          <span className="s">&quot;Ada Lovelace&quot;</span>
        </>,
      );
      setStatus({ s: "done", t: "done" });
      await say("Invited Ada as an editor. Her weekly digest is on.", id);
    } else {
      mark(d, "bad");
      info(`declined by ${who}`, "c-bad");
      unfocus();
      read();
      showToast("Nothing was sent", true);
      setStatus({ s: "bad", t: "stopped by you" });
      await say("You declined, so the invite wasn't sent.", id);
    }
    await sleep(2400, id);
    setToast((t) => ({ ...t, on: false }));
  }

  async function refuse(id: number) {
    setView("team");
    scope.current = "Team";
    await typePrompt("Make Alan an admin.", id);
    setStatus({ s: "run", t: "reading" });
    read();
    await sleep(700, id);
    setStatus({ s: "run", t: "acting" });
    focus("Alan", "select");
    await sleep(500, id);
    const a = step("Role, Alan Turing", "select", quote("Admin"));
    const result = await act("Role, Alan Turing", "select", ["Admin"]);
    alive(id);
    await sleep(520, id);
    setCode({ on: true, fire: 0 });
    await sleep(260, id);
    setCode({ on: true, fire: 1 });
    await sleep(260, id);
    setCode({ on: true, fire: 2 });
    focus("Alan", "select · refused", "bad");
    setShake((n) => n + 1);
    mark(a, result.ok ? "ok" : "bad", result.error?.message);
    read("Role, Alan Turing");
    setStatus({ s: "bad", t: "refused by your app" });
    await sleep(900, id);
    unfocus();
    await say(
      "I can't make Alan an admin here. Someone with access has to do that.",
      id,
    );
  }

  async function plan(id: number) {
    setView("billing");
    scope.current = "Plan";
    await typePrompt("Move us to yearly billing with 12 seats.", id);
    setStatus({ s: "run", t: "reading" });
    read();
    await sleep(700, id);
    setStatus({ s: "run", t: "acting" });

    focus("Billing", "select");
    await sleep(450, id);
    const a = step("Billing", "select", quote("Yearly"));
    const ra = await act("Billing", "select", ["Yearly"]);
    alive(id);
    read("Billing");
    mark(a, ra.ok ? "ok" : "bad");
    await sleep(700, id);

    focus("Seats", "setValue");
    await sleep(450, id);
    const b = step("Seats", "setValue", <span className="num">12</span>);
    const rb = await act("Seats", "setValue", [12]);
    alive(id);
    read("Seats");
    mark(b, rb.ok ? "ok" : "bad");
    await sleep(1000, id);

    focus("Save plan", "press");
    await sleep(420, id);
    const c = step("Save plan", "press");
    const rc = await act("Save plan", "press", []);
    alive(id);
    mark(c, rc.ok ? "ok" : "bad");
    await sleep(200, id);
    unfocus();
    info(
      <>
        <span className="m">appeared</span>{" "}
        <span className="s">&quot;Plan saved&quot;</span>
      </>,
    );
    setStatus({ s: "done", t: "done" });
    await say("Done. 12 seats on yearly billing, $120 a month.", id);
    await sleep(2200, id);
    setToast((t) => ({ ...t, on: false }));
  }

  const runners = [invite, refuse, plan];

  function reset() {
    const r = run.current;
    r.token++;
    decide.current?.(false);
    decide.current = null;
    ringTarget.current = null;
    setRing(null);
    setApprove("off");
    setToast((t) => ({ ...t, on: false }));
    setCursor((c) => ({ ...c, on: false, move: false, down: false }));
    setOkDown(false);
    setPrompt({ text: "", typing: false, enter: false });
    setRows({ list: [], more: 0, hot: null });
    setLines([]);
    setCode({ on: false, fire: 0 });
    setReply({ words: [], shown: 0 });
    setStatus({ s: "idle", t: "idle" });
    setEmail("");
    setRole("Viewer");
    setDigest(false);
    setAlanRole("Viewer");
    setInvited(false);
    setPeriod("monthly");
    setSeats(3);
    return r.token;
  }

  async function go(i: number) {
    const id = reset();
    const r = run.current;
    r.elapsed = 0;
    r.done = false;
    r.D = SCENARIOS[i].D;
    r.waiting = false;
    setCurrent(i);
    tabEls.current.forEach((t) => t?.style.setProperty("--p", "0"));
    const strip = stripRef.current;
    const tab = tabEls.current[i];
    if (strip && tab)
      strip.scrollTo({
        left: tab.offsetLeft - strip.offsetLeft - 8,
        behavior: r.reduced ? "auto" : "smooth",
      });
    await frame();
    try {
      await runners[i](id);
    } catch (e) {
      if (e !== STALE) throw e;
      return;
    }
    if (id !== r.token) return;
    r.done = true;
    r.D = Math.max(r.D, r.elapsed + 2600);
  }
  const goRef = React.useRef(go);
  const currentRef = React.useRef(current);
  React.useLayoutEffect(() => {
    goRef.current = go;
    currentRef.current = current;
  });

  // Start once the stage is seen, after the bridge has its root.
  React.useEffect(() => {
    const r = run.current;
    if (!stageVisible || r.started || !pane) return;
    r.started = true;
    const t = setTimeout(() => goRef.current(0), r.reduced ? 0 : 500);
    return () => clearTimeout(t);
  }, [stageVisible, pane]);

  // Progress bar under the current scenario, and the move to the next one.
  React.useEffect(() => {
    let last = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const r = run.current;
      const dt = Math.min(64, t - last);
      last = t;
      if (r.started && r.visible && !r.paused && !r.waiting && !r.reduced)
        r.elapsed += dt;
      if (r.started) {
        let p = r.D ? r.elapsed / r.D : 0;
        if (!r.done) p = Math.min(p, 0.94);
        tabEls.current[currentRef.current]?.style.setProperty(
          "--p",
          String(Math.min(1, p)),
        );
        if (
          r.done &&
          r.elapsed >= r.D &&
          !r.paused &&
          !r.reduced &&
          r.visible
        ) {
          goRef.current((currentRef.current + 1) % SCENARIOS.length);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const r = run.current;
    return () => {
      cancelAnimationFrame(raf);
      r.token++;
    };
  }, []);

  /* ---------- app handlers ---------- */
  function sendInvite() {
    setInvited(true);
    showToast(`Invite sent to ${email || "ada@lovelace.dev"}`);
  }

  const total = seats * PRICE[period as keyof typeof PRICE];

  return (
    <div
      className={cn("stage rv", revealed && "vis")}
      ref={(el) => {
        stageRef(el);
        revealRef(el);
      }}
    >
      <div className="bar">
        <div className="lights" aria-hidden>
          <i />
          <i />
          <i />
        </div>
        <div
          className="strip"
          role="tablist"
          aria-label="Agent scenarios"
          ref={stripRef}
          onKeyDown={(e) => {
            if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
            const n =
              (current + (e.key === "ArrowRight" ? 1 : SCENARIOS.length - 1)) %
              SCENARIOS.length;
            tabEls.current[n]?.focus();
            go(n);
          }}
        >
          {SCENARIOS.map((s, i) => (
            <button
              key={s.name}
              ref={(el) => {
                tabEls.current[i] = el;
              }}
              type="button"
              className="sc"
              role="tab"
              aria-selected={current === i}
              aria-label={s.name}
              tabIndex={current === i ? 0 : -1}
              onClick={() => go(i)}
            >
              <span className="ix" aria-hidden>
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                >
                  {s.icon}
                </svg>
              </span>
              {s.name}
              <span className="prog" />
            </button>
          ))}
        </div>
        <button
          type="button"
          className="pause"
          aria-pressed={paused}
          aria-label={paused ? "Play" : "Pause"}
          onClick={() => setPaused((p) => !p)}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            aria-hidden
          >
            {paused ? (
              <path d="M7 4.5v15l12-7.5z" fill="currentColor" stroke="none" />
            ) : (
              <path d="M9 5v14M15 5v14" />
            )}
          </svg>
          <span className="lbl">{paused ? "Play" : "Pause"}</span>
        </button>
      </div>

      <div className="panes">
        <AgentProvider agent={agent}>
          <div className="pane app" ref={setPane}>
            <div className="crumb">
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                aria-hidden
              >
                <rect x="4" y="11" width="16" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
              acme.app / settings / <b>{view}</b>
            </div>
            <div className="views">
              <div
                className={cn("view", view === "team" && "on")}
                inert={view !== "team"}
              >
                <h3>Team</h3>
                <div className="members" data-agent-in="Team">
                  <div className="member">
                    <div
                      className="av"
                      style={{ background: "oklch(0.8 0.1 70)" }}
                    >
                      GH
                    </div>
                    <div>
                      <div className="nm">Grace Hopper</div>
                      <div className="em">grace@acme.app</div>
                    </div>
                    <span className="role">Owner</span>
                  </div>
                  <div className="member">
                    <div
                      className="av"
                      style={{ background: "oklch(0.78 0.09 250)" }}
                    >
                      AT
                    </div>
                    <div>
                      <div className="nm">Alan Turing</div>
                      <div className="em">alan@acme.app</div>
                    </div>
                    <div
                      data-ring="Alan"
                      key={shake}
                      className={cn(shake > 0 && "shake")}
                    >
                      <RoleSelect
                        label="Role, Alan Turing"
                        className="h-7 w-[96px] rounded-lg px-2.5 text-xs"
                        value={alanRole}
                        onValueChange={(v, details) => {
                          // Only a person with access can make someone an admin.
                          if (v === "Admin" && isAgentChange(details))
                            return details.cancel();
                          setAlanRole(v as string);
                        }}
                      />
                    </div>
                  </div>
                  {invited && (
                    <div className="member new">
                      <div
                        className="av"
                        style={{ background: "var(--agent)" }}
                      >
                        AL
                      </div>
                      <div>
                        <div className="nm">Ada Lovelace</div>
                        <div className="em">
                          {email || "ada@lovelace.dev"} · invited
                        </div>
                      </div>
                      <span className="role">{role}</span>
                    </div>
                  )}
                </div>

                <div className="form" data-agent-in="Invite member">
                  <h3>Invite member</h3>
                  <div className="field" data-ring="Email">
                    <label htmlFor="ld-email">Email</label>
                    <Input
                      id="ld-email"
                      aria-label="Email"
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={email}
                      onValueChange={(v) => setEmail(v)}
                      className="h-10 rounded-[10px]"
                    />
                  </div>
                  <div className="row2">
                    <div className="field" data-ring="Role">
                      <span className="fl">Role</span>
                      <RoleSelect
                        label="Role"
                        className="h-10 rounded-[10px]"
                        value={role}
                        onValueChange={(v) => setRole(v as string)}
                      />
                    </div>
                    <div className="field">
                      <span className="fl">Notifications</span>
                      <label className="switchrow" data-ring="Weekly digest">
                        Weekly digest
                        <Switch
                          aria-label="Weekly digest"
                          checked={digest}
                          onCheckedChange={setDigest}
                        >
                          <SwitchThumb />
                        </Switch>
                      </label>
                    </div>
                  </div>
                  <div className="endrow">
                    <Button
                      data-ring="Send invite"
                      data-agent-confirm="Sends an email to someone outside the team"
                      onClick={sendInvite}
                    >
                      Send invite
                    </Button>
                  </div>
                </div>
              </div>

              <div
                className={cn("view", view === "billing" && "on")}
                inert={view !== "billing"}
              >
                <h3>Plan</h3>
                <div className="plan" data-agent-in="Plan">
                  <div className="prow">
                    Billing
                    <span className="flex items-center gap-2">
                      <Tabs
                        aria-label="Billing"
                        value={period}
                        onValueChange={(v) => setPeriod(v as string)}
                        className="w-auto"
                        data-ring="Billing"
                      >
                        <TabsList>
                          <TabsTrigger value="monthly">Monthly</TabsTrigger>
                          <TabsTrigger value="yearly">Yearly</TabsTrigger>
                        </TabsList>
                      </Tabs>
                      <em>save 17%</em>
                    </span>
                  </div>
                  <div className="prow">
                    Seats
                    <Digits value={seats} cols={2} className="seats" />
                  </div>
                  <div data-ring="Seats">
                    <Slider
                      aria-label="Seats"
                      min={1}
                      max={50}
                      value={seats}
                      onValueChange={(v) => setSeats(v as number)}
                    >
                      <SliderControl>
                        <SliderTrack>
                          <SliderRange />
                          <SliderThumb aria-label="Seats" />
                        </SliderTrack>
                      </SliderControl>
                    </Slider>
                    <div className="range-lb">
                      <span>1</span>
                      <span>50</span>
                    </div>
                  </div>
                  <div className="total">
                    Total
                    <span className="amt">
                      $<Digits value={total} cols={3} />
                      <small>
                        {period === "yearly"
                          ? "/ month, billed yearly"
                          : "/ month"}
                      </small>
                    </span>
                  </div>
                  <div className="endrow">
                    <Button
                      data-ring="Save plan"
                      onClick={() => showToast("Plan saved")}
                    >
                      Save plan
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={cn(
                "aring",
                ring && "on",
                ring?.mode === "wait" && "wait",
                ring?.mode === "bad" && "bad",
              )}
              style={
                ring
                  ? {
                      width: ring.box.w,
                      height: ring.box.h,
                      transform: `translate(${ring.box.x}px, ${ring.box.y}px)`,
                    }
                  : undefined
              }
              aria-hidden
            >
              <span className="chip">{ring?.label}</span>
            </div>

            {/* The person's side. Hidden from the bridge: an agent cannot approve itself. */}
            <div
              className={cn(
                "approve",
                approve !== "off" && "on",
                approve === "nudge" && "nudge",
              )}
              role="alertdialog"
              aria-label="Agent approval"
              data-agent-hidden
              inert={approve === "off"}
            >
              <div className="ic" aria-hidden>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <path d="M12 3 2 21h20L12 3Z" />
                  <path d="M12 10v4M12 18h.01" />
                </svg>
              </div>
              <div className="t">
                The agent wants to <b>Send invite</b>
              </div>
              <div className="acts">
                <button
                  type="button"
                  className="deny"
                  onClick={() => decide.current?.(false)}
                >
                  Deny
                </button>
                <button
                  type="button"
                  ref={okRef}
                  className={cn("yes", okDown && "down")}
                  onClick={() => decide.current?.(true)}
                >
                  Approve
                </button>
              </div>
            </div>
            <div
              className={cn("toast", toast.on && "on", toast.bad && "bad")}
              role="status"
              data-agent-hidden
            >
              {toast.text}
            </div>
            <div
              className={cn(
                "cursor",
                cursor.on && "on",
                cursor.move && "move",
                cursor.down && "down",
                cursor.flip && "flip",
              )}
              style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }}
              aria-hidden
              data-agent-hidden
            >
              <svg width="20" height="22" viewBox="0 0 20 22">
                <path
                  d="M3 2.5v15.2l4.1-3.9 2.7 6.1 2.6-1.1-2.6-6h5.7L3 2.5Z"
                  fill="white"
                  stroke="oklch(0.15 0 0)"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="tag">Grace</span>
            </div>
          </div>
        </AgentProvider>

        <div className="pane agent">
          <div className="ahead">
            What the agent sees
            <span className="status" data-s={status.s}>
              <span className="dot" />
              {status.t}
            </span>
          </div>
          <div className="abody">
            <div className={cn("bubble prompt", prompt.typing && "typing")}>
              <span className="who">you</span>
              <span className="txt">
                {prompt.text}
                <span className="caret" />
              </span>
              <kbd className={cn(prompt.enter && "press")}>↵</kbd>
            </div>
            <div className="k">agent.snapshot()</div>
            <div className="snap">
              {rows.list.map((r, i) => (
                <div
                  key={r.ref}
                  className={cn("r", rows.hot === r.label && "hot")}
                  style={{ animationDelay: `${i * 55}ms` }}
                >
                  <span className="ref">{r.ref}</span>
                  <span className="kind">{r.kind}</span>
                  <span className="lab">&quot;{r.label}&quot;</span>
                  <span className="st">
                    <span className="v" key={String(rows.hot === r.label) + i}>
                      {r.value}
                    </span>
                    {r.extra ? <span className="ex"> {r.extra}</span> : null}
                  </span>
                </div>
              ))}
              {rows.more > 0 && (
                <div
                  className="r more"
                  style={{ animationDelay: `${rows.list.length * 55}ms` }}
                >
                  + {rows.more} more controls on the page
                </div>
              )}
            </div>
            <div className="k">agent.act()</div>
            <div className="log">
              {lines.map((l) =>
                l.kind === "step" ? (
                  <div className="l" key={l.id}>
                    <span className="m">›</span>
                    <span>
                      <span className="s">{l.label}</span>
                      <span className="m">.</span>
                      {l.action}
                      <span className="m">(</span>
                      {l.arg}
                      <span className="m">)</span>
                    </span>
                    <span
                      key={l.mark}
                      className={cn("mk", l.mark && `c-${l.mark}`)}
                    >
                      {l.mark === "ok"
                        ? "✓"
                        : l.mark === "wait"
                          ? "⏸"
                          : l.mark === "bad"
                            ? "✕"
                            : ""}
                    </span>
                    {l.note && <span className="note">{l.note}</span>}
                  </div>
                ) : (
                  <div className="l" key={l.id}>
                    <span className="m">·</span>
                    <span className={l.cls}>{l.html}</span>
                    <span />
                  </div>
                ),
              )}
            </div>
            {code.on && (
              <div className="codecard">
                <div className="cf">members.tsx</div>
                <pre>
                  <span className="ln">
                    <span>
                      <span className="fn">onValueChange</span>={"{"}(value,
                      details) =&gt; {"{"}
                    </span>
                  </span>
                  <span className={cn("ln", code.fire >= 1 && "fire")}>
                    <span>
                      {"  "}
                      <span className="kw">if</span> (value ==={" "}
                      <span className="str">&quot;Admin&quot;</span> &amp;&amp;{" "}
                      <span className="fn">isAgentChange</span>(details))
                    </span>
                  </span>
                  <span className={cn("ln", code.fire >= 2 && "fire")}>
                    <span>
                      {"    "}
                      <span className="kw">return</span> details.
                      <span className="fn">cancel</span>()
                    </span>
                  </span>
                  <span className="ln">
                    <span>{"}}"}</span>
                  </span>
                </pre>
              </div>
            )}
            {reply.words.length > 0 && (
              <div className="bubble reply">
                <span className="who">agent</span>
                <span>
                  {reply.words.map((w, i) => (
                    <React.Fragment key={i}>
                      <span className={cn("w2", i < reply.shown && "in")}>
                        {w}
                      </span>{" "}
                    </React.Fragment>
                  ))}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
