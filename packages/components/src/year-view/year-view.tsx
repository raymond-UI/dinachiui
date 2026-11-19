"use client"

import * as React from "react";
import { format, type Locale } from "date-fns";
import { cn } from "@dinachi/core";
import { changeAsAgent, useAgentControl, useAgentState, useHasAgent, useMergedRef } from "../agent";
import {
  type CalendarChangeDetails,
  addDays,
  dayFirst,
  fromISODate,
  isSameDay,
  parseDate,
  startOfDay,
  toISODate,
} from "../calendar";

function changeDetails(reason: string, event?: Event): CalendarChangeDetails {
  const details: CalendarChangeDetails = {
    reason,
    event,
    isCanceled: false,
    cancel() {
      details.isCanceled = true;
    },
  };
  return details;
}

const WIDE = "(min-width: 768px)";

/** `weeks` from 768px up, `months` below, unless one is asked for. */
function useLayout(layout: "auto" | "weeks" | "months"): "weeks" | "months" {
  const wide = React.useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia?.(WIDE);
      query?.addEventListener("change", onChange);
      return () => query?.removeEventListener("change", onChange);
    },
    () => window.matchMedia?.(WIDE).matches ?? true,
    () => true
  );
  return layout === "auto" ? (wide ? "weeks" : "months") : layout;
}

const startOfWeek = (d: Date, weekStartsOn: number) => addDays(d, -((d.getDay() - weekStartsOn + 7) % 7));

/** Shade is the only channel: one step per quarter of the busiest day. */
const SHADE = [
  "var(--muted)",
  "color-mix(in oklab, var(--year-view-color, var(--success)) 28%, var(--muted))",
  "color-mix(in oklab, var(--year-view-color, var(--success)) 52%, var(--muted))",
  "color-mix(in oklab, var(--year-view-color, var(--success)) 76%, var(--muted))",
  "var(--year-view-color, var(--success))",
];

export interface YearViewProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange" | "dir"> {
  /** How many things happened each day, keyed YYYY-MM-DD. */
  counts?: Record<string, number>;
  /** The picked day. */
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date | null, details: CalendarChangeDetails) => void;
  /** The last day shown. Defaults to today. */
  end?: Date;
  /** The first day shown. Defaults to 53 weeks before `end`'s week ends. */
  start?: Date;
  /** The last day that can be picked. Defaults to `today`, so later days are outlined. */
  max?: Date;
  /** Pressing the picked day keeps it instead of clearing it. */
  required?: boolean;
  /** Counts at or above each step get shades 1 to 4. Defaults to quarters of the busiest day. */
  thresholds?: [number, number, number, number];
  /** How a count reads in the heading, the readout and each day's name. Defaults to `3 events`. */
  formatCount?: (count: number) => string;
  /** The line above the grid. Defaults to the total over the year. */
  heading?: (total: number) => React.ReactNode;
  /** `weeks`: a year of weeks side by side. `months`: months stacked, squares big enough to tap. `auto` switches at 768px. */
  layout?: "auto" | "weeks" | "months";
  /** A date-fns locale, for day and month names and the first day of the week. */
  locale?: Locale;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  dir?: "ltr" | "rtl";
  /** Defaults to the current day. */
  today?: Date;
  disabled?: boolean;
  /** Submits the picked day as YYYY-MM-DD. */
  name?: string;
}

/**
 * A year of activity in one grid, a square per day shaded by how much happened. Picking
 * a day gives its date and count under the grid.
 */
const YearView = React.forwardRef<HTMLDivElement, YearViewProps>((props, ref) => {
  const {
    counts = {},
    value: valueProp,
    defaultValue,
    onValueChange,
    end: endProp,
    start: startProp,
    max: maxProp,
    required,
    thresholds,
    formatCount: formatCountProp,
    heading,
    layout: layoutProp = "auto",
    locale,
    weekStartsOn = locale?.options?.weekStartsOn ?? 1,
    dir,
    today: todayProp,
    disabled,
    name,
    className,
    "aria-label": ariaLabel = "Activity",
    ...rest
  } = props;
  const hasAgent = useHasAgent();
  const layout = useLayout(layoutProp);
  const today = React.useMemo(() => startOfDay(todayProp ?? new Date()), [todayProp ? toISODate(todayProp) : null]);
  const end = startOfDay(endProp ?? today);
  const last = addDays(startOfWeek(end, weekStartsOn), 6);
  const start = startProp ? startOfDay(startProp) : null;
  const first = start ? startOfWeek(start, weekStartsOn) : addDays(last, -53 * 7 + 1);
  const weeks = Math.max(1, Math.round(((last.getTime() - first.getTime()) / 864e5 + 1) / 7));
  const days = React.useMemo(() => Array.from({ length: weeks * 7 }, (_, i) => addDays(first, i)), [toISODate(first), weeks]);
  const max = maxProp ? startOfDay(maxProp) : today;
  const lo = start ?? first;
  const open = (d: Date) => d >= lo && d <= end && d <= max;
  const lastOpen = end < max ? end : max;

  const formatCount =
    formatCountProp ?? ((n: number) => `${n.toLocaleString(locale?.code ?? "en-US")} ${n === 1 ? "event" : "events"}`);
  const countOf = (d: Date) => counts[toISODate(d)] ?? 0;
  const total = days.reduce((t, d) => t + (open(d) ? countOf(d) : 0), 0);
  const busiest = Math.max(1, ...days.map((d) => (open(d) ? countOf(d) : 0)));
  const shade = (n: number) =>
    n <= 0 ? 0 : thresholds ? thresholds.filter((s) => n >= s).length : Math.min(4, Math.ceil((4 * n) / busiest));

  const [raw, change] = useAgentState<Date | null, CalendarChangeDetails>(valueProp, defaultValue ?? null, onValueChange);
  const value = raw && startOfDay(raw);
  const root = React.useRef<HTMLDivElement>(null);
  const scroller = React.useRef<HTMLDivElement>(null);

  const select = (d: Date | null, reason: string, event?: Event) => {
    if (disabled || (d && !open(d)) || isSameDay(d, value) || (!d && (!value || required))) return;
    change(d, changeDetails(reason, event));
  };

  /* ---- keyboard: arrows move focus, Enter or Space picks ---- */
  const [focused, setFocused] = React.useState<string | null>(null);
  const valueKey = value ? toISODate(value) : null;
  const [seen, setSeen] = React.useState(valueKey);
  if (seen !== valueKey) {
    setSeen(valueKey);
    if (valueKey) setFocused(null);
  }
  const focusNext = React.useRef(false);
  React.useEffect(() => {
    if (!focusNext.current || !focused) return;
    focusNext.current = false;
    root.current?.querySelector<HTMLElement>(`[data-day="${focused}"]`)?.focus();
  }, [focused]);

  const focusedDay = focused ? fromISODate(focused) : null;
  const tabStop = focusedDay && open(focusedDay) ? focusedDay : value && open(value) ? value : lastOpen < lo ? lo : lastOpen;

  // The latest weeks are the ones in view when the grid is too wide for its box.
  React.useLayoutEffect(() => {
    const sc = scroller.current;
    if (sc && layout === "weeks") sc.scrollLeft = getComputedStyle(sc).direction === "rtl" ? -sc.scrollWidth : sc.scrollWidth;
  }, [layout]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const rtl = root.current?.closest("[dir]")?.getAttribute("dir") === "rtl";
    const across = layout === "weeks" ? 7 : 1;
    const down = layout === "weeks" ? 1 : 7;
    const from = tabStop;
    const n = { ArrowLeft: rtl ? across : -across, ArrowRight: rtl ? -across : across, ArrowUp: -down, ArrowDown: down }[e.key];
    const month = (k: number) => {
      const d = new Date(from.getFullYear(), from.getMonth() + k, 1);
      d.setDate(Math.min(from.getDate(), new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()));
      return d < lo ? lo : d > lastOpen ? lastOpen : d;
    };
    const next =
      n !== undefined ? addDays(from, n)
      : e.key === "PageUp" ? month(-1)
      : e.key === "PageDown" ? month(1)
      : e.key === "Home" ? lo
      : e.key === "End" ? lastOpen
      : null;
    if (!next) return;
    e.preventDefault();
    if (!open(next)) return;
    focusNext.current = true;
    setFocused(toISODate(next));
  };

  /* ---- agent ---- */
  const clear = () =>
    required ? "A day is required." : changeAsAgent((_: null, details: CalendarChangeDetails) => value && change(null, details), null);
  useAgentControl(() => ({
    kind: "date",
    element: root.current,
    value: value ? toISODate(value) : undefined,
    disabled,
    actions: {
      setValue: (wanted: unknown) => {
        if (wanted === null || wanted === "") return clear();
        const d =
          wanted instanceof Date
            ? isNaN(wanted.getTime()) ? null : startOfDay(wanted)
            : typeof wanted === "string"
              ? fromISODate(wanted) ?? parseDate(wanted, { today, order: dayFirst(locale) ? "day-first" : "month-first", weekStartsOn })
              : null;
        if (!d) return `"${String(wanted)}" is not a date. Send YYYY-MM-DD.`;
        if (d < lo) return `The view starts on ${toISODate(lo)}.`;
        if (!open(d)) return `${toISODate(d)} is after ${toISODate(lastOpen)}, the last day that can be picked.`;
        return changeAsAgent((next: Date, details: CalendarChangeDetails) => {
          if (!isSameDay(next, value)) change(next, details);
        }, d);
      },
      clear,
    },
  }));

  /* ---- render ---- */
  const square = (d: Date, className: string) => {
    const n = countOf(d);
    const live = open(d);
    const selected = isSameDay(d, value);
    return (
      <button
        key={toISODate(d)}
        type="button"
        data-slot="year-view-day"
        data-day={toISODate(d)}
        data-agent-part={hasAgent ? "" : undefined}
        data-level={live ? shade(n) : undefined}
        data-future={!live || undefined}
        aria-label={`${format(d, "EEEE d MMMM yyyy", { locale })}: ${formatCount(live ? n : 0)}`}
        aria-pressed={selected}
        aria-disabled={!live || disabled || undefined}
        tabIndex={isSameDay(d, tabStop) ? 0 : -1}
        // Pressing the picked day again clears it, so a filter can be lifted.
        onClick={(e) => {
          if (live) setFocused(toISODate(d));
          select(selected ? null : d, "day-press", e.nativeEvent);
        }}
        style={live ? { backgroundColor: SHADE[shade(n)] } : undefined}
        className={cn(
          "p-0 focus-visible:outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
          "aria-pressed:outline aria-pressed:outline-2 aria-pressed:outline-offset-1 aria-pressed:outline-foreground",
          "data-[future]:cursor-default data-[future]:bg-transparent data-[future]:ring-1 data-[future]:ring-inset data-[future]:ring-border",
          className
        )}
      />
    );
  };

  const weekdays = Array.from({ length: 7 }, (_, i) => addDays(first, i));
  const monthsShown: Date[] = [];
  for (let m = new Date(end.getFullYear(), end.getMonth(), 1); m >= new Date(first.getFullYear(), first.getMonth(), 1); m = new Date(m.getFullYear(), m.getMonth() - 1, 1)) {
    monthsShown.push(m);
  }

  return (
    <div
      {...rest}
      ref={useMergedRef(ref, root)}
      role="group"
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      dir={dir}
      data-slot="year-view"
      data-layout={layout}
      className={cn(layout === "weeks" ? "w-full" : "w-full max-w-[22rem]", disabled && "opacity-50", className)}
    >
      <div data-slot="year-view-heading" className="mb-3 text-[0.9375rem] font-semibold">
        {heading
          ? heading(total)
          : start
            ? `${formatCount(total)} from ${format(start, "d MMM yyyy", { locale })} to ${format(end, "d MMM yyyy", { locale })}`
            : `${formatCount(total)} ${isSameDay(end, today) ? "in the last 12 months" : `in the year to ${format(end, "d MMM yyyy", { locale })}`}`}
      </div>
      {layout === "weeks" ? (
        <div className="flex gap-1.5">
          {/* Outside the scroller, so the weekdays stay put while the year scrolls. */}
          <div aria-hidden className="mt-4 grid w-5 shrink-0 grid-rows-[repeat(7,0.6875rem)] gap-y-[3px] text-[0.625rem] leading-[0.6875rem] text-muted-foreground">
            {weekdays.map((d, i) => (
              <span key={i}>{i % 2 === 0 && i < 6 ? format(d, "EEE", { locale }) : null}</span>
            ))}
          </div>
          <div ref={scroller} className="min-w-0 overflow-x-auto pb-1" onKeyDown={onKeyDown}>
            <div className="w-max">
              <div aria-hidden className="grid h-4 auto-cols-[0.6875rem] grid-flow-col gap-x-[3px] text-[0.6875rem] text-muted-foreground">
                {Array.from({ length: weeks }, (_, w) => {
                  const d = addDays(first, w * 7);
                  return (
                    <span key={w} className="overflow-visible whitespace-nowrap">
                      {d.getDate() <= 7 ? format(d, "MMM", { locale }) : null}
                    </span>
                  );
                })}
              </div>
              <div data-slot="year-view-grid" className="grid grid-flow-col grid-rows-[repeat(7,0.6875rem)] auto-cols-[0.6875rem] gap-[3px]">
                {days.map((d) => square(d, "size-[0.6875rem] rounded-[3px]"))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div onKeyDown={onKeyDown}>
          <div aria-hidden className="grid grid-cols-7 gap-1.5 border-b pb-2 text-center text-[0.6875rem] text-muted-foreground">
            {weekdays.map((d, i) => (
              <span key={i}>{format(d, "EEEEE", { locale })}</span>
            ))}
          </div>
          {/* Its own scroll, so a year of months never stretches the page. */}
          <div className="max-h-[var(--year-view-height,22rem)] overflow-y-auto overflow-x-hidden overscroll-contain pt-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {monthsShown.map((m) => {
            const lead = (m.getDay() - weekStartsOn + 7) % 7;
            const length = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
            return (
              <div key={m.getTime()} data-slot="year-view-month" className="mb-[1.125rem]">
                <div data-slot="year-view-month-label" className="mb-2 text-[0.8125rem] font-semibold">{format(m, "MMMM yyyy", { locale })}</div>
                <div data-slot="year-view-grid" className="grid grid-cols-7 gap-1.5">
                  {Array.from({ length: lead }, (_, i) => (
                    <span key={`lead-${i}`} />
                  ))}
                  {Array.from({ length }, (_, i) => {
                    const d = new Date(m.getFullYear(), m.getMonth(), i + 1);
                    return d < lo ? <span key={i} /> : square(d, "aspect-square w-full rounded-[0.4375rem]");
                  })}
                </div>
              </div>
            );
          })}
          </div>
        </div>
      )}
      <p
        data-slot="year-view-readout"
        aria-live="polite"
        className={cn("mt-3.5 min-h-5 text-[0.8125rem]", layout === "months" && "mt-0 border-t pt-3")}
      >
        {value && (
          <>
            {format(value, layout === "weeks" ? "EEEE d MMMM yyyy" : "EEEE d MMMM", { locale })}{" "}
            <span className="text-muted-foreground">· {formatCount(countOf(value))}</span>
          </>
        )}
      </p>
      {name && <input type="hidden" name={name} disabled={disabled} value={value ? toISODate(value) : ""} />}
    </div>
  );
});
YearView.displayName = "YearView";

export { YearView };
