"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch, SwitchThumb } from "@/components/ui/switch";
import type { Highlighter } from "shiki";
import { cn } from "@/lib/utils";

export function useCopy() {
  const [copied, setCopied] = React.useState<string | null>(null);
  const copy = (key: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 1400);
  };
  return [copied, copy] as const;
}

export function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, copy] = useCopy();
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("h-8 gap-1.5 px-2 text-xs text-muted-foreground", className)}
      onClick={() => copy("code", text)}
    >
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <Switch checked={checked} onCheckedChange={onChange} aria-label={label}>
      <SwitchThumb />
    </Switch>
  );
}

/** One prop row: the name on the left, the control on the right, a thumb's height tall on phones. */
export function Knob({ name, plain, children }: { name: string; plain?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex min-h-12 items-center justify-between gap-4 border-b border-border/60 last:border-0 md:min-h-10 md:border-0">
      {plain ? <span className="text-sm">{name}</span> : <code className="font-mono text-[13px] text-foreground">{name}</code>}
      {children}
    </div>
  );
}

export function AgentTag({ className }: { className?: string }) {
  return (
    <Badge
      variant="outline"
      size="sm"
      rounded="sm"
      className={cn("border-[var(--agent)]/40 px-1.5 font-mono text-[10.5px] font-normal text-[var(--agent)]", className)}
    >
      agent
    </Badge>
  );
}

/**
 * Code that folds to a fixed height with a fade, and opens on request. Pass `html` when
 * the server has already highlighted it; `code` highlights in the browser, for code that
 * changes as someone plays with the page.
 */
export function FoldedCode({
  code,
  html,
  fold = 12,
  height = "max-h-[260px]",
}: {
  code: string;
  html?: string;
  fold?: number;
  height?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const lines = code.trimEnd().split("\n").length;
  const clip = !open && lines > fold;
  return (
    <>
      <div
        data-clip={clip}
        className={cn("overflow-hidden transition-[max-height] duration-300 ease-[var(--motion-ease-out)]", clip ? height : "max-h-[6000px]")}
      >
        {html ? (
          <div className="cp-shiki overflow-x-auto px-4 py-3 font-mono text-[12.5px] leading-[1.7]" dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <LiveCode code={code} />
        )}
      </div>
      {lines > fold && (
        <div className="flex justify-center pb-3">
          <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground" onClick={() => setOpen((o) => !o)}>
            {open ? "Show less" : `Show all ${lines} lines`}
          </Button>
        </div>
      )}
    </>
  );
}

let browserHighlighter: Promise<Highlighter> | null = null;

/** Code that changes in the browser, highlighted the way the server highlights the rest. */
export function LiveCode({ code, lang = "tsx" }: { code: string; lang?: "tsx" | "ts" }) {
  const [html, setHtml] = React.useState<string | null>(null);
  React.useEffect(() => {
    let live = true;
    browserHighlighter ??= import("shiki").then((s) =>
      s.createHighlighter({ themes: ["github-light", "github-dark"], langs: ["tsx", "ts"] }),
    );
    browserHighlighter.then((h) => {
      if (live) setHtml(h.codeToHtml(code, { lang, themes: { light: "github-light", dark: "github-dark" }, defaultColor: false }));
    });
    return () => {
      live = false;
    };
  }, [code, lang]);
  const cls = "cp-shiki overflow-x-auto px-4 py-3 font-mono text-[12.5px] leading-[1.7]";
  return html ? (
    <div className={cls} dangerouslySetInnerHTML={{ __html: html }} />
  ) : (
    <div className={cls}>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
