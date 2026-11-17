"use client";

import * as React from "react";
import { MANAGERS, usePackageManager, type Manager } from "@/lib/package-manager";
import { Stage, StageSwitch, useCopied } from "./stage";

const exec: Record<Manager, string> = { npm: "npx", pnpm: "pnpm dlx", yarn: "npx", bun: "bunx" };

/** The three install steps as one terminal. Comments carry each step; every command copies. */
export const installSteps = [
  { note: "Set up components.json, your theme and cn()", run: "@dinachi/cli@latest init" },
  { note: "Add what you need", run: "@dinachi/cli@latest add button" },
  { note: "It's a file in your project now", code: 'import { Button } from "@/components/ui/button"' },
] as const;

export function InstallStage() {
  const [pm, setPm] = usePackageManager();
  const [copied, copy] = useCopied();

  return (
    <Stage bar={<StageSwitch label="Package manager" options={MANAGERS} value={pm} onChange={setPm} />}>
      <div className="bg-[radial-gradient(circle,var(--border)_1px,transparent_1px)] bg-[length:12px_12px] px-4 py-4 font-mono text-[12px] leading-7 sm:px-6 sm:py-5 sm:text-[13px]">
        {installSteps.map((step, i) => {
          const line = "run" in step ? `${exec[pm]} ${step.run}` : step.code;
          return (
            <div key={step.note} className={i ? "mt-3" : undefined}>
              <div className="text-muted-foreground/70"># {step.note}</div>
              <button
                type="button"
                onClick={() => copy(step.note, line)}
                className="group -mx-2.5 flex w-[calc(100%+1.25rem)] items-center justify-between gap-4 rounded-md px-2.5 text-left transition-colors duration-150 hover:bg-foreground/5 focus-visible:bg-foreground/5 focus-visible:outline-none"
              >
                <span className="min-w-0 overflow-x-auto whitespace-nowrap [scrollbar-width:none]">
                  {"run" in step ? (
                    <>
                      <span className="text-muted-foreground/60">$ </span>
                      <span className="text-foreground">{line}</span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">{line}</span>
                  )}
                </span>
                <span
                  className={
                    copied === step.note
                      ? "font-sans text-[11px] text-success"
                      : "font-sans text-[11px] text-muted-foreground opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
                  }
                >
                  {copied === step.note ? "Copied" : "Copy"}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </Stage>
  );
}
