"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Reveal, Words, useInView, useReducedMotion } from "./primitives";

const COMMAND = "npx @dinachi/cli add agent";
const OUTPUT: React.ReactNode[] = [
  <React.Fragment key="a"><span className="c-ok">✓</span> Wrote components/ui/agent/agent.tsx</React.Fragment>,
  <React.Fragment key="b"><span className="c-ok">✓</span> Wrote components/ui/agent/index.ts</React.Fragment>,
  <React.Fragment key="c"><span className="c-ok">✓</span> No new dependencies</React.Fragment>,
  <React.Fragment key="d">&nbsp;</React.Fragment>,
  <span key="e" className="ps">Wrap your app in AgentProvider to switch it on.</span>,
];


type Diff = { add?: boolean; code: React.ReactNode };
const DIFF: Diff[] = [
  { code: <><span className="at">&quot;use client&quot;</span></> },
  { code: " " },
  { add: true, code: <><span className="kw">import</span> {"{"} <span className="pr">AgentProvider</span>, <span className="pr">useAgent</span> {"}"} <span className="kw">from</span> <span className="at">&quot;@/components/ui/agent&quot;</span></> },
  { code: " " },
  { code: <><span className="kw">export function</span> <span className="pr">Providers</span>({"{"} children {"}"}) {"{"}</> },
  { add: true, code: <>{"  "}<span className="kw">const</span> agent = <span className="pr">useAgent</span>({"{"} allow: askAPerson {"}"})</> },
  { code: <>{"  "}<span className="kw">return</span> (</> },
  { add: true, code: <>{"    "}<span className="tag">&lt;AgentProvider</span> <span className="at">agent</span>={"{"}agent{"}"}<span className="tag">&gt;</span></> },
  { code: <>{"      "}{"{"}children{"}"}</> },
  { add: true, code: <>{"    "}<span className="tag">&lt;/AgentProvider&gt;</span></> },
  { code: <>{"  "})</> },
  { code: "}" },
];

const ADDS = DIFF.filter((d) => d.add).length;

const FILES = [
  { id: "term", name: "terminal" },
  { id: "providers", name: "app/providers.tsx" },
] as const;
type File = (typeof FILES)[number]["id"];

export function InstallStory() {
  const reduced = useReducedMotion();
  const [ref, seen] = useInView<HTMLDivElement>({ threshold: 0.5, once: true });
  const [file, setFile] = React.useState<File>("term");
  const [typed, setTyped] = React.useState(0);
  const [shown, setShown] = React.useState(0);
  const [lit, setLit] = React.useState(0);
  const [ind, setInd] = React.useState({ left: 0, width: 0 });
  const tabs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  React.useLayoutEffect(() => {
    const place = () => {
      const b = tabs.current[file];
      if (b) setInd({ left: b.offsetLeft, width: b.offsetWidth });
    };
    place();
    document.fonts?.ready.then(place);
  }, [file]);

  React.useEffect(() => {
    if (!seen || reduced) return;
    let live = true;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      await wait(700);
      for (let i = 1; i <= COMMAND.length && live; i++) {
        setTyped(i);
        await wait(34 + Math.random() * 30);
      }
      for (let i = 1; i <= OUTPUT.length && live; i++) {
        await wait(260);
        setShown(i);
      }
      await wait(1600);
      if (live) openFile("providers");
    })();
    return () => {
      live = false;
    };
  }, [seen, reduced]);

  // Light the added lines one after another whenever the diff comes into view.
  React.useEffect(() => {
    if (file !== "providers" || reduced) return;
    let n = 0;
    const t = setInterval(() => {
      n++;
      setLit(n);
      if (n >= ADDS) clearInterval(t);
    }, 220);
    return () => clearInterval(t);
  }, [file, reduced]);

  function openFile(next: File) {
    setLit(0);
    setFile(next);
  }
  // Reduced motion shows every state at its end.
  const typedN = reduced ? COMMAND.length : typed;
  const shownN = reduced ? OUTPUT.length : shown;
  const litN = reduced ? ADDS : lit;

  let addIndex = 0;
  return (
    <section className="sec blk center">
      <Words parts={[["The bridge is"], ["one file", "pixel"], ["you own."]]} />
      <Reveal as="p" className="sub">
        No runtime package, no account, no network calls of its own.
      </Reveal>
      <Reveal className="ide">
        <div ref={ref}>
          <div className="tb">
            <div className="lights" aria-hidden>
              <i />
              <i />
              <i />
            </div>
            <div className="ftabs" role="tablist" aria-label="Install">
              <span className="ind" style={{ left: ind.left, width: ind.width }} />
              {FILES.map((f) => (
                <button
                  key={f.id}
                  ref={(el) => {
                    tabs.current[f.id] = el;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={file === f.id}
                  onClick={() => openFile(f.id)}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>
          <div className="body">
            <div className={cn("fpane term", file === "term" && "on")} role="tabpanel" aria-label="terminal">
              <div className="tl in">
                <span className="ps">$ </span>
                <span className="ty">{COMMAND.slice(0, typedN)}</span>
                <span className="caret" style={{ opacity: typedN < COMMAND.length ? 1 : 0 }} />
              </div>
              {OUTPUT.map((line, i) => (
                <div key={i} className={cn("tl", i < shownN && "in")}>
                  {line}
                </div>
              ))}
            </div>
            <div className={cn("fpane", file === "providers" && "on")} role="tabpanel" aria-label="app/providers.tsx">
              {DIFF.map((d, i) => {
                const on = d.add && addIndex++ < litN;
                return (
                  <div key={i} className={cn("ln", d.add && "add", on && "in")}>
                    <span className="no">{i + 1}</span>
                    <span className="pm">{d.add ? "+" : ""}</span>
                    <span>{d.code}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
