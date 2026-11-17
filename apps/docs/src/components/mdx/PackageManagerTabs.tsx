"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Copy } from "lucide-react";
import { MANAGERS, nextManager, usePackageManager, type Manager as PM } from "@/lib/package-manager";

type ShorthandProps = {
  type: "exec" | "install" | "run" | "global";
  command: string;
};

type ExplicitProps = {
  npm: string;
  pnpm: string;
  yarn: string;
  bun: string;
};

type PackageManagerTabsProps = ShorthandProps | ExplicitProps;

function generateCommands(
  type: ShorthandProps["type"],
  command: string,
): Record<PM, string> {
  switch (type) {
    case "exec":
      return {
        npm: `npx ${command}`,
        pnpm: `pnpm dlx ${command}`,
        yarn: `npx ${command}`,
        bun: `bunx ${command}`,
      };
    case "install":
      return {
        npm: `npm install ${command}`,
        pnpm: `pnpm add ${command}`,
        yarn: `yarn add ${command}`,
        bun: `bun add ${command}`,
      };
    case "run":
      return {
        npm: `npm run ${command}`,
        pnpm: `pnpm ${command}`,
        yarn: `yarn ${command}`,
        bun: `bun ${command}`,
      };
    case "global":
      return {
        npm: `npm install -g ${command}`,
        pnpm: `pnpm add -g ${command}`,
        yarn: `yarn global add ${command}`,
        bun: `bun add -g ${command}`,
      };
  }
}

function isExplicit(props: PackageManagerTabsProps): props is ExplicitProps {
  return "npm" in props;
}

export function PackageManagerTabs(props: PackageManagerTabsProps) {
  const [active, setActive] = usePackageManager();
  const [copied, setCopied] = useState(false);

  const commands: Record<PM, string> = isExplicit(props)
    ? { npm: props.npm, pnpm: props.pnpm, yarn: props.yarn, bun: props.bun }
    : generateCommands(props.type, props.command);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(commands[active]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const icon = copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />;

  return (
    <>
      {/* Phone: one full-bleed line, and consecutive commands stack into one block. The chip
          cycles the manager for every command on the site; tapping the command copies it. */}
      <div className="my-4 -mx-4 flex h-12 w-[calc(100%+2rem)] max-w-none items-stretch border-y border-border bg-muted sm:hidden [.pm-wide+&]:-mt-4 [.pm-wide+&]:border-t-0">
        <button
          type="button"
          onClick={() => setActive(nextManager(active))}
          aria-label={`Package manager: ${active}. Tap to switch.`}
          className="flex shrink-0 items-center gap-1 border-r border-border pl-4 pr-2.5 font-mono text-xs text-muted-foreground active:bg-foreground/5"
        >
          {active}
          <ChevronsUpDown className="size-3 opacity-60" />
        </button>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy command"
          className="relative flex min-w-0 flex-1 items-center active:bg-foreground/5"
        >
          <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap pl-3 pr-14 text-left font-mono text-[12.5px] text-foreground [scrollbar-width:none]">
            {commands[active]}
          </code>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center bg-gradient-to-r from-transparent to-muted to-45% pl-8 pr-4 text-muted-foreground">
            {icon}
          </span>
        </button>
      </div>

      <div className="pm-wide my-4 max-sm:hidden">
        <div className="flex items-center border-b border-border">
          {MANAGERS.map((pm) => (
            <button
              key={pm}
              onClick={() => setActive(pm)}
              className={`px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                active === pm
                  ? "border-b-2 border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {pm}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between gap-4 rounded-b-xl border border-t-0 border-border bg-muted px-4 py-3">
          <code className="text-sm text-foreground font-mono">{commands[active]}</code>
          <button
            onClick={handleCopy}
            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Copy command"
          >
            {icon}
          </button>
        </div>
      </div>
    </>
  );
}
