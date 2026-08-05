"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * The two ways in. A person runs the CLI; an agent installs the skill. They are the
 * same decision made once, so they share one control rather than sitting in the page
 * as two competing buttons.
 */
const AUDIENCES = [
  {
    id: "you",
    label: "For you",
    command: "npx @dinachi/cli@latest init",
  },
  {
    id: "agent",
    label: "For your agent",
    command:
      "npx skills add https://github.com/raymond-UI/dinachiui --skill dinachi-assistant -y",
  },
] as const;

function CommandPill({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);
  const resetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetRef.current) clearTimeout(resetRef.current);
    },
    [],
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    if (resetRef.current) clearTimeout(resetRef.current);
    resetRef.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copy ${command}`}
        title={command}
        // The pill is a fixed width so switching audience does not resize it, which
        // puts a ceiling on the type: the agent command is 83 characters and has to
        // fit. Named transition properties rather than `transition-all`, which would
        // also animate the icon swap. The press is faster than the release.
        className="group border-input hover:border-muted-foreground/50 flex w-full items-center gap-3 rounded-full border px-5 py-3.5 text-left font-mono text-xs transition-[transform,border-color,background-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-px hover:bg-muted/40 active:scale-[0.995] active:duration-[120ms] motion-reduce:transition-[border-color,background-color] motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 sm:text-[13px]"
      >
        <span className="text-muted-foreground/40 select-none">$</span>
        <span className="text-foreground min-w-0 flex-1 truncate">
          {command}
        </span>
        <span className="text-muted-foreground/50 group-hover:text-foreground shrink-0 transition-colors duration-150">
          {copied ? (
            <Check className="text-success h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </span>
      </button>

      {/* The icon swap is the only confirmation a sighted reader gets. */}
      <p aria-live="polite" className="sr-only">
        {copied ? "Command copied to clipboard" : ""}
      </p>
    </>
  );
}

/**
 * Built on the library's own Tabs rather than two buttons and a piece of state, so the
 * roving focus and the arrow keys come from the component the page is selling.
 */
export function InstallSwitch() {
  return (
    <Tabs defaultValue="you" className="flex flex-col items-center gap-4">
      <TabsList className="h-auto gap-0 rounded-none bg-transparent p-0">
        {AUDIENCES.map((audience, i) => (
          <TabsTrigger
            key={audience.id}
            value={audience.id}
            className={`text-muted-foreground/60 rounded-none bg-transparent px-4 py-0 text-sm font-normal transition-colors duration-150 data-[active]:bg-transparent data-[active]:font-medium data-[active]:shadow-none ${
              i === 0 ? "border-input border-r" : ""
            }`}
          >
            {audience.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {AUDIENCES.map((audience) => (
        <TabsContent key={audience.id} value={audience.id} className="w-full">
          <CommandPill command={audience.command} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
