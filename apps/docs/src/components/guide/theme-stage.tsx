"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Stage, StageSwitch, useCopied } from "./stage";

export const themeTokens = [
  "background",
  "foreground",
  "card",
  "primary",
  "secondary",
  "muted",
  "accent",
  "border",
  "input",
  "ring",
  "success",
  "destructive",
] as const;
type Token = (typeof themeTokens)[number];

const MODES = ["light", "dark"] as const;
type Mode = (typeof MODES)[number];

const ON = { light: "oklch(0.985 0 0)", dark: "oklch(0.15 0 0)" };
type Accent = { name: string; light: string; dark: string };
const ACCENTS: Accent[] = [
  { name: "Blue", light: "oklch(0.55 0.2 255)", dark: "oklch(0.7 0.15 255)" },
  { name: "Violet", light: "oklch(0.53 0.22 295)", dark: "oklch(0.72 0.16 295)" },
  { name: "Orange", light: "oklch(0.64 0.19 45)", dark: "oklch(0.75 0.16 50)" },
  { name: "Rose", light: "oklch(0.57 0.21 10)", dark: "oklch(0.72 0.17 10)" },
];

const noop = () => () => {};

/**
 * The value as written in globals.css. The computed value won't do: the browser hands
 * back registered colors converted to lab().
 */
function declared(mode: Mode, token: string) {
  const selector = mode === "dark" ? ".dark" : ":root";
  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      continue;
    }
    for (const rule of Array.from(rules)) {
      if (!(rule instanceof CSSStyleRule)) continue;
      if (!rule.selectorText.split(",").some((s) => s.trim() === selector)) continue;
      const v = rule.style.getPropertyValue(`--${token}`).trim();
      if (v) return v;
    }
  }
  return "";
}

/**
 * A small piece of real UI painted from the real tokens. Pointing at a token outlines
 * where it lands; an accent rewrites --primary and --ring and the whole piece follows.
 */
export function ThemeStage() {
  const { resolvedTheme } = useTheme();
  const site: Mode = resolvedTheme === "dark" ? "dark" : "light";
  // A pick made on the stage holds until the site theme itself changes.
  const [picked, setPicked] = React.useState<{ mode: Mode; under: Mode } | null>(null);
  const mode = picked && picked.under === site ? picked.mode : site;

  const [token, setToken] = React.useState<Token>("primary");
  const [hover, setHover] = React.useState<Token | null>(null);
  const [accent, setAccent] = React.useState<Accent | null>(null);
  const [copied, copy] = useCopied();
  const value = React.useSyncExternalStore(noop, () => declared(mode, token), () => "");

  const shown = hover ?? token;
  const mark = (...uses: Token[]) =>
    uses.includes(shown) && "outline-dashed outline-2 outline-offset-[3px] outline-foreground/60";

  const overridden = accent && (token === "primary" || token === "ring");
  const line = overridden
    ? `--primary: ${accent[mode]}; --primary-foreground: ${ON[mode]}; --ring: ${accent[mode]};`
    : `--${token}: ${value};`;

  const bar = (
    <>
      <div className="mr-auto flex items-center gap-2 pl-1.5" role="group" aria-label="Accent">
        <AccentDot label="Default" active={!accent} onClick={() => setAccent(null)} color="var(--primary)" />
        {ACCENTS.map((a) => (
          <AccentDot
            key={a.name}
            label={a.name}
            active={accent === a}
            color={a[site]}
            onClick={() => {
              setAccent(a);
              setToken("primary");
            }}
          />
        ))}
      </div>
      <StageSwitch capitalize label="Mode" options={MODES} value={mode} onChange={(m) => setPicked({ mode: m, under: site })} />
    </>
  );

  return (
    <Stage bar={bar}>
      <div
        className={cn(mode === "dark" ? "dark" : "theme-light", "grid bg-background text-foreground md:grid-cols-[minmax(0,1fr)_168px]")}
        style={
          accent
            ? ({ "--primary": accent[mode], "--primary-foreground": ON[mode], "--ring": accent[mode] } as React.CSSProperties)
            : undefined
        }
      >
        <div className={cn("p-5 -outline-offset-[8px] sm:p-8", mark("background"))} aria-hidden>
          <div className={cn("mx-auto max-w-sm rounded-xl border bg-card p-4", mark("card", "border"))}>
            <div className="flex items-center justify-between gap-3">
              <span className={cn("rounded-sm text-sm font-medium", mark("foreground"))}>Invite to Acme</span>
              <Badge variant="success" className={cn(mark("success"))}>
                3 seats left
              </Badge>
            </div>

            <div
              className={cn(
                "mt-3 flex h-9 items-center rounded-md border border-input bg-background px-3 text-sm ring-2 ring-ring ring-offset-2 ring-offset-card",
                mark("input", "ring"),
              )}
            >
              ada@acme.dev
            </div>

            <div className="mt-3 space-y-0.5 text-sm">
              <div className={cn("flex items-center justify-between rounded-md bg-accent px-3 py-1.5 text-accent-foreground", mark("accent"))}>
                Editor <Check className="size-3.5" />
              </div>
              <div className="px-3 py-1.5 text-muted-foreground">Viewer</div>
            </div>

            <div className={cn("mt-3 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground", mark("muted"))}>
              The link expires in 7 days.
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span className={cn("mr-auto rounded-sm text-xs text-destructive", mark("destructive"))}>Revoke link</span>
              <Button tabIndex={-1} size="sm" variant="secondary" className={cn("h-8", mark("secondary"))}>
                Cancel
              </Button>
              <Button tabIndex={-1} size="sm" className={cn("h-8", mark("primary"))}>
                Send invite
              </Button>
            </div>
          </div>
        </div>

        <ul
          aria-label="Tokens"
          className="flex gap-1 overflow-x-auto border-t px-4 py-3 [scrollbar-width:none] md:flex-col md:gap-0 md:overflow-visible md:border-l md:border-t-0 md:px-3 md:py-4"
          onMouseLeave={() => setHover(null)}
        >
          {themeTokens.map((t) => (
            <li key={t} className="shrink-0">
              <button
                type="button"
                aria-pressed={token === t}
                onClick={() => setToken(t)}
                onMouseEnter={() => setHover(t)}
                onFocus={() => setHover(t)}
                onBlur={() => setHover(null)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 font-mono md:px-1.5 md:py-1 text-xs transition-colors duration-150 focus-visible:outline-none",
                  shown === t ? "text-foreground" : "text-muted-foreground",
                  token === t && "bg-foreground/[0.06]",
                )}
              >
                <span
                  className="size-3 shrink-0 rounded-full outline outline-1 -outline-offset-1 outline-foreground/15"
                  style={{ background: `var(--${t})` }}
                />
                {t}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={() => copy("token", line)}
        className="flex w-full items-center justify-between gap-4 border-t px-5 py-3 text-left font-mono text-[13px] transition-colors duration-150 hover:bg-foreground/[0.03] focus-visible:bg-foreground/[0.03] focus-visible:outline-none"
      >
        <span className="min-w-0 truncate">{overridden || value ? line : " "}</span>
        <span className={cn("font-sans text-[11px]", copied ? "text-success" : "text-muted-foreground")}>
          {copied ? "Copied" : "Copy"}
        </span>
      </button>
    </Stage>
  );
}

function AccentDot({ label, color, active, onClick }: { label: string; color: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      title={label}
      onClick={onClick}
      className={cn(
        "size-4 rounded-full outline outline-1 -outline-offset-1 outline-foreground/15 transition-transform duration-150 ease-out hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        active && "outline-2 outline-offset-2 outline-foreground",
      )}
      style={{ background: color }}
    />
  );
}
