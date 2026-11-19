"use client";

import * as React from "react";
import { Ban, FileText, History, Copy } from "lucide-react";
import { AskBar, AskBarContent, AskBarTrigger, type AskBarProps, type AskPlan } from "@/components/ui/ask-bar";
import type { CommandItem } from "@/components/ui/command-items";

const page = <FileText />;

/** A hotel's rates page: the commands it can still run by name. */
export const RATES_COMMANDS: CommandItem[] = [
  { id: "rates", label: "Rates", description: "Page", icon: page, keywords: ["prices"] },
  { id: "restrictions", label: "Restrictions", description: "Page", icon: page, keywords: ["minimum", "stay"] },
  { id: "history", label: "Rate history", description: "Page", icon: <History /> },
  { id: "copy", label: "Copy last year's rates", description: "Action", icon: <Copy /> },
  { id: "close", label: "Close a room type", description: "Action", icon: <Ban /> },
  { id: "sea-view", label: "Sea View Double", description: "4 rooms", meta: "£162 to £240", keywords: ["room"] },
  { id: "harbour", label: "Harbour Twin", description: "6 rooms", meta: "£138 to £190", keywords: ["room"] },
  { id: "garden", label: "Garden Single", description: "3 rooms", meta: "£96 to £130", keywords: ["room"] },
];

export const RATES_SUGGESTIONS = [
  "raise weekend rates 10% in December",
  "close Garden Single 24 to 26 Dec",
  "2 night minimum over New Year",
];

const num = (s: string, fallback: string) => s.match(/\d+(\.\d+)?/)?.[0] ?? fallback;

/** Turns a request into a plan. A real app would ask its own parser or a model. */
export function resolveRates(query: string): AskPlan | null {
  const q = query.toLowerCase();
  if (/^(raise|increase|put up)\b/.test(q) || (/\brates?\b/.test(q) && /%/.test(q))) {
    return {
      title: "Raise weekend rates",
      sentence: ["Raise ", { field: "rooms" }, " on ", { field: "nights" }, " by ", { field: "pct" }, "%."],
      fields: [
        { id: "nights", label: "Nights", value: "Fri and Sat, 5 to 27 Dec", fixed: true },
        { id: "rooms", label: "Rooms", value: "all 3 room types", fixed: true },
        { id: "pct", label: "Change %", value: num(q, "10"), inputMode: "decimal" },
      ],
      touches: "8 weekend nights across 3 room types. Sea View Double stops at its £240 ceiling on Sat 27.",
      call: (v) => `rates.adjust('2026-12', 'fri,sat', ${Number(v.pct) / 100})`,
      verb: (v) => `Raise 24 rates by ${v.pct || 0}%`,
      run: (v) => ({ message: `Raised 24 rates by ${v.pct}%.`, undo: () => {} }),
    };
  }
  if (/^close\b/.test(q) && /garden|single/.test(q)) {
    return {
      title: "Close Garden Single",
      sentence: ["Close ", { field: "room" }, " for ", { field: "nights" }, " nights from ", { field: "from" }, "."],
      fields: [
        { id: "room", label: "Room type", value: "Garden Single", fixed: true },
        { id: "nights", label: "Nights", value: "3", inputMode: "numeric" },
        { id: "from", label: "From", value: "24 Dec" },
      ],
      touches: "3 rooms stop selling on every channel. 1 booking on 25 Dec is kept.",
      call: (v) => `rates.close('garden-single', '${v.from}', ${v.nights})`,
      verb: (v) => `Close ${v.nights || 0} ${v.nights === "1" ? "night" : "nights"}`,
      run: (v) => ({ message: `Closed Garden Single for ${v.nights} nights.`, undo: () => {} }),
    };
  }
  if (/minimum|min stay/.test(q)) {
    return {
      title: "Set a minimum stay",
      sentence: ["Set a ", { field: "nights" }, " night minimum over ", { field: "when" }, "."],
      fields: [
        { id: "nights", label: "Minimum nights", value: num(q, "2"), inputMode: "numeric" },
        { id: "when", label: "Dates", value: "New Year, 30 Dec to 1 Jan", fixed: true },
      ],
      touches: "Arrivals on 3 nights across 3 room types. Existing bookings are kept.",
      call: (v) => `rates.minStay('2026-12-30', '2027-01-01', ${v.nights})`,
      verb: (v) => `Set ${v.nights || 0} night minimum`,
      run: (v) => ({ message: `Set a ${v.nights} night minimum over New Year.`, undo: () => {} }),
    };
  }
  return null;
}

/**
 * The rates page's bar. `contained` docks it to the nearest positioned box rather than the
 * window; the phone sheet still rises from the screen's edge. `onRan` hears each done line.
 */
export function RatesAskBar({
  contained,
  onRan,
  ...props
}: Partial<AskBarProps> & { contained?: boolean; onRan?: (text: string) => void }) {
  return (
    <AskBar
      resolve={(q) => {
        const plan = resolveRates(q);
        if (!plan) return null;
        return {
          ...plan,
          run: async (v) => {
            const result = await plan.run(v);
            onRan?.(result.message);
            return { ...result, undo: () => onRan?.(`Undid: ${result.message}`) };
          },
        };
      }}
      commands={RATES_COMMANDS}
      suggestions={RATES_SUGGESTIONS}
      onCommand={(item) => onRan?.(`Opened ${item.label}`)}
      {...props}
    >
      <AskBarTrigger className={contained ? "absolute" : undefined} />
      <AskBarContent className={contained ? "sm:absolute" : undefined} />
    </AskBar>
  );
}

/** A stage the bar docks to, in place of the page's bottom edge. */
export function RatesStage({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-[460px] w-full overflow-hidden rounded-xl border bg-muted/30">
      <div className="space-y-2 p-5 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Rates · December</p>
        <p>Sea View Double £162 to £240 · Harbour Twin £138 to £190 · Garden Single £96 to £130</p>
      </div>
      {children}
    </div>
  );
}

export function DefaultAskBarExample() {
  const [ran, setRan] = React.useState<string>();
  return (
    <div className="flex w-full flex-col gap-3">
      {/* The site's own search holds Cmd+K here, so the bar takes no shortcut. */}
      <RatesStage>
        <RatesAskBar contained shortcut={false} onRan={setRan} />
      </RatesStage>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {ran}
      </p>
    </div>
  );
}

export function TypingAskBarExample() {
  return (
    <RatesStage>
      <RatesAskBar contained shortcut={false} suggest="typing" />
    </RatesStage>
  );
}
