"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DURATION, EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

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
    command: "npx skills add raymond-ui/dinachiui",
  },
] as const;

type AudienceId = (typeof AUDIENCES)[number]["id"];

/** The box the pill and its off-screen twin both wear, so what the twin measures is
 *  what the pill will actually take. */
const PILL_BOX =
  "flex items-center gap-3 rounded-full border px-5 py-3.5 font-mono text-xs sm:text-[13px]";

/**
 * Tracks which command was copied rather than whether one was. The pill outlives the
 * switch, so a boolean would leave a tick standing over a command the reader has already
 * moved on from.
 */
function useCopyCommand(command: string) {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const resetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetRef.current) clearTimeout(resetRef.current);
    },
    [],
  );

  const copy = async () => {
    await navigator.clipboard.writeText(command);
    setCopiedCommand(command);
    if (resetRef.current) clearTimeout(resetRef.current);
    resetRef.current = setTimeout(() => setCopiedCommand(null), 2000);
  };

  return { copied: copiedCommand === command, copy };
}

/**
 * The morph. Width is a layout property and normally the wrong thing to animate, but
 * here it is the animation: the pill hugs its command rather than sitting in a capsule
 * sized for the longer one, so switching has to resize it and a snap reads as a glitch.
 * Nothing sits beside the pill and its height never changes, so the reflow costs one
 * element.
 *
 * Before measurement — server render, or JS off — `w-fit` gives the same width the twin
 * is about to report, so there is nothing to correct on hydration. Reduced motion cuts
 * to the new width, since a resize carries no meaning to preserve more gently.
 */
function morphTo(width: number | undefined, reducedMotion: boolean | null) {
  return {
    initial: false,
    animate: width ? { width } : undefined,
    transition: reducedMotion
      ? { duration: 0 }
      : { duration: DURATION.enter, ease: EASE_OUT },
  };
}

function CommandPill({
  command,
  width,
}: {
  command: string;
  width: number | undefined;
}) {
  const { copied, copy } = useCopyCommand(command);
  const reducedMotion = useReducedMotion();

  return (
    <>
      <motion.button
        type="button"
        onClick={copy}
        aria-label={`Copy ${command}`}
        title={command}
        {...morphTo(width, reducedMotion)}
        // Named transition properties rather than `transition-all`, which would also
        // animate the icon swap. The press is faster than the release.
        className={cn(
          PILL_BOX,
          "group border-input hover:border-muted-foreground/50 mx-auto w-fit max-w-full text-left transition-[transform,border-color,background-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-px hover:bg-muted/40 active:scale-[0.995] active:duration-[120ms] motion-reduce:transition-[border-color,background-color] motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100",
        )}
      >
        <span className="text-muted-foreground/40 select-none">$</span>
        {/* Clipped rather than wrapped, so a growing pill uncovers the command and a
            shrinking one closes over it. */}
        <span className="text-foreground min-w-0 truncate">{command}</span>
        <span className="text-muted-foreground/50 group-hover:text-foreground shrink-0 transition-colors duration-150">
          {copied ? (
            <Check className="text-success h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </span>
      </motion.button>

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
  const [audience, setAudience] = useState<AudienceId>("you");
  const command =
    AUDIENCES.find((a) => a.id === audience)?.command ?? AUDIENCES[0].command;

  const sizerRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState<number>();

  // The pill can only animate to a number, and only the unconstrained twin knows what
  // the command is worth. Re-measured on resize because the type scale has a breakpoint,
  // and once fonts settle because a fallback face measures differently.
  useLayoutEffect(() => {
    let live = true;
    const measure = () => {
      if (live && sizerRef.current) {
        setWidth(sizerRef.current.getBoundingClientRect().width);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => {
      live = false;
      window.removeEventListener("resize", measure);
    };
  }, [command]);

  return (
    <>
      <Tabs
        value={audience}
        onValueChange={(value) => setAudience(value as AudienceId)}
        className="flex flex-col items-center gap-4"
      >
        <TabsList className="h-auto gap-0 rounded-none bg-transparent p-0">
          {AUDIENCES.map((item, i) => (
            <TabsTrigger
              key={item.id}
              value={item.id}
              className={`text-muted-foreground/60 rounded-none bg-transparent px-4 py-0 text-sm font-normal transition-colors duration-150 data-[active]:bg-transparent data-[active]:font-medium data-[active]:shadow-none ${
                i === 0 ? "border-input border-r" : ""
              }`}
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* One panel, following the switch, rather than one per audience. Two panels
            would mean two pills, and a pill that unmounts cannot morph into the next. */}
        <TabsContent value={audience} className="mt-0 w-full">
          <CommandPill command={command} width={width} />
        </TabsContent>
      </Tabs>

      <span
        ref={sizerRef}
        aria-hidden
        className={cn(
          PILL_BOX,
          "pointer-events-none invisible fixed left-0 top-0 whitespace-nowrap",
        )}
      >
        <span>$</span>
        <span>{command}</span>
        <span className="h-4 w-4" />
      </span>
    </>
  );
}
