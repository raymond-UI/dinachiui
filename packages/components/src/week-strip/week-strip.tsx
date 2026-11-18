"use client"

import * as React from "react";
import { format, type Locale } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@dinachi/core";
import { changeAsAgent, useAgentControl, useAgentState, useHasAgent } from "../agent";
import {
  type CalendarChangeDetails,
  addDays,
  dayFirst,
  daysBetween,
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

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const startOfWeek = (d: Date, weekStartsOn: number) => addDays(d, -((d.getDay() - weekStartsOn + 7) % 7));

const events = (n: number) => `${n} ${n === 1 ? "event" : "events"}`;

export interface WeekStripProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange" | "dir"> {
  /** The selected day. Defaults to today. */
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (value: Date, details: CalendarChangeDetails) => void;
  /** The first day in the strip. Defaults to the start of last week. */
  min?: Date;
  /** The last day in the strip. Defaults to the end of the third week ahead. */
  max?: Date;
  /** How busy each day is, keyed YYYY-MM-DD. Up to three dots show under the date. */
  counts?: Record<string, number>;
  /** How a day's count reads to screen readers. Defaults to `2 events`. */
  formatCount?: (count: number) => string;
  /** A date-fns locale, for day names and the first day of the week. */
  locale?: Locale;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  dir?: "ltr" | "rtl";
  /** Defaults to the current day. */
  today?: Date;
  disabled?: boolean;
  /** Submits the day as YYYY-MM-DD. */
  name?: string;
  /** What the content under the strip shows for the selected day. */
  children?: React.ReactNode;
}

/**
 * Days in a row that snaps a week at a time, for schedules and bookings where the week
 * matters more than the month. The content under it follows the selected day.
 */
const WeekStrip = React.forwardRef<HTMLDivElement, WeekStripProps>((props, ref) => {
  const {
    value: valueProp,
    defaultValue,
    onValueChange,
    min: minProp,
    max: maxProp,
    counts,
    formatCount = events,
    locale,
    weekStartsOn = locale?.options?.weekStartsOn ?? 1,
    dir,
    today: todayProp,
    disabled,
    name,
    className,
    children,
    "aria-label": ariaLabel = "Day",
    "aria-labelledby": labelledBy,
    ...rest
  } = props;
  const hasAgent = useHasAgent();
  const today = React.useMemo(() => startOfDay(todayProp ?? new Date()), [todayProp ? toISODate(todayProp) : null]);
  const thisWeek = startOfWeek(today, weekStartsOn);
  const min = startOfDay(minProp ?? addDays(thisWeek, -7));
  const max = startOfDay(maxProp ?? addDays(thisWeek, 27));
  const clamp = (d: Date) => (d < min ? min : d > max ? max : d);

  const [raw, change] = useAgentState<Date, CalendarChangeDetails>(valueProp, defaultValue ?? clamp(today), onValueChange);
  const value = startOfDay(raw);
  // A value off the strip still leaves a day to tab to and step from.
  const stop = clamp(value);
  const strip = React.useRef<HTMLDivElement>(null);
  const days = Array.from({ length: daysBetween(min, max) + 1 }, (_, i) => addDays(min, i));

  const select = (d: Date, reason: string, event?: Event) => {
    if (disabled || d < min || d > max || isSameDay(d, value)) return;
    change(d, changeDetails(reason, event));
  };

  /* ---- the selected day's week stays in view ---- */
  // The day a key or Today asked for, focused once it is the value.
  const focusNext = React.useRef<string | null>(null);
  const first = React.useRef(true);
  React.useLayoutEffect(() => {
    const sc = strip.current;
    const pill = sc?.querySelector<HTMLElement>(`[data-day="${toISODate(stop)}"]`);
    const start = sc?.querySelector<HTMLElement>(`[data-day="${toISODate(clamp(startOfWeek(stop, weekStartsOn)))}"]`);
    if (!sc || !pill) return;
    if (start) {
      // Scrolls the strip only; scrollIntoView would move the page too.
      const box = sc.getBoundingClientRect();
      const at = start.getBoundingClientRect();
      const pad = parseFloat(getComputedStyle(sc).scrollPaddingInlineStart) || 0;
      const rtl = getComputedStyle(sc).direction === "rtl";
      const delta = rtl ? at.right - box.right + pad : at.left - box.left - pad;
      sc.scrollTo?.({ left: sc.scrollLeft + delta, behavior: first.current || reducedMotion() ? "auto" : "smooth" });
    }
    first.current = false;
    if (focusNext.current === toISODate(value)) pill.focus({ preventScroll: true });
    focusNext.current = null;
  }, [toISODate(value)]);

  /* ---- agent ---- */
  useAgentControl(() => ({
    kind: "date",
    element: strip.current,
    value: toISODate(value),
    disabled,
    actions: {
      setValue: (wanted: unknown) => {
        const d =
          wanted instanceof Date
            ? isNaN(wanted.getTime()) ? null : startOfDay(wanted)
            : typeof wanted === "string"
              ? fromISODate(wanted) ?? parseDate(wanted, { today, order: dayFirst(locale) ? "day-first" : "month-first", weekStartsOn })
              : null;
        if (!d) return `"${String(wanted)}" is not a date. Send YYYY-MM-DD, or a phrase such as next fri.`;
        if (d < min) return `The strip starts on ${toISODate(min)}.`;
        if (d > max) return `The strip ends on ${toISODate(max)}.`;
        return changeAsAgent((next: Date, details: CalendarChangeDetails) => {
          if (!isSameDay(next, value)) change(next, details);
        }, d);
      },
    },
  }));

  /* ---- render ---- */
  const isToday = isSameDay(value, today);
  const week = (n: -1 | 1) => addDays(stop, 7 * n);
  const iconButton = "inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40";

  return (
    <div {...rest} ref={ref} dir={dir} data-slot="week-strip" data-disabled={disabled || undefined} className={cn("w-full", className)}>
      <div data-slot="week-strip-header" className="flex items-center gap-2 px-[1.125rem] pb-3">
        <div
          data-slot="week-strip-title"
          aria-live="polite"
          className="min-w-0 flex-1 truncate text-[1.625rem] font-semibold tracking-[-0.02em] md:text-[0.9375rem] md:tracking-normal"
        >
          {/* A phone's title is the screen's own, so it is short and says Today when it is. */}
          <span className="md:hidden">{isToday ? "Today" : format(value, "EEE d MMM", { locale })}</span>
          <span className="max-md:hidden">{format(value, "EEEE d MMMM", { locale })}</span>
        </div>
        {!isToday && today >= min && today <= max && (
          <button
            type="button"
            data-slot="week-strip-today"
            data-agent-part={hasAgent ? "" : undefined}
            disabled={disabled}
            onClick={(e) => {
              focusNext.current = toISODate(today);
              select(today, "today-press", e.nativeEvent);
            }}
            className="inline-flex h-8 items-center rounded-md px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Today
          </button>
        )}
        {([-1, 1] as const).map((n) => (
          <button
            key={n}
            type="button"
            aria-label={n < 0 ? "Previous week" : "Next week"}
            data-slot={n < 0 ? "week-strip-previous" : "week-strip-next"}
            data-agent-part={hasAgent ? "" : undefined}
            disabled={disabled || week(n) < min || week(n) > max}
            onClick={(e) => select(week(n), "week-step", e.nativeEvent)}
            className={cn(iconButton, "max-md:hidden")}
          >
            {n < 0 ? <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden /> : <ChevronRight className="size-4 rtl:rotate-180" aria-hidden />}
          </button>
        ))}
      </div>
      <div
        ref={strip}
        role="listbox"
        aria-orientation="horizontal"
        aria-label={ariaLabel}
        aria-labelledby={labelledBy}
        aria-disabled={disabled || undefined}
        data-slot="week-strip-days"
        className={cn(
          "flex snap-x snap-mandatory scroll-px-[1.125rem] gap-1.5 overflow-x-auto px-[1.125rem] pb-2.5 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          // The clipped day fades, so it reads as more to scroll rather than a cut.
          "[mask-image:linear-gradient(to_right,transparent,#000_14px,#000_calc(100%-32px),transparent)]",
          "rtl:[mask-image:linear-gradient(to_left,transparent,#000_14px,#000_calc(100%-32px),transparent)]"
        )}
        onKeyDown={(e) => {
          const rtl = strip.current?.closest("[dir]")?.getAttribute("dir") === "rtl";
          const step: Record<string, number> = { ArrowLeft: rtl ? 1 : -1, ArrowRight: rtl ? -1 : 1, PageUp: -7, PageDown: 7 };
          const next = e.key === "Home" ? today : step[e.key] !== undefined ? addDays(stop, step[e.key]) : null;
          if (!next) return;
          e.preventDefault();
          if (next < min || next > max) return;
          focusNext.current = toISODate(next);
          select(next, "keyboard", e.nativeEvent);
        }}
      >
        {days.map((d) => {
          const n = counts?.[toISODate(d)] ?? 0;
          const selected = isSameDay(d, value);
          return (
            <button
              key={toISODate(d)}
              type="button"
              role="option"
              data-slot="week-strip-day"
              data-day={toISODate(d)}
              data-today={isSameDay(d, today) || undefined}
              aria-selected={selected}
              aria-label={`${format(d, "EEEE d MMMM", { locale })}${counts ? `, ${formatCount(n)}` : ""}`}
              tabIndex={isSameDay(d, stop) ? 0 : -1}
              disabled={disabled}
              onClick={(e) => select(d, "day-press", e.nativeEvent)}
              className={cn(
                "grid w-[2.625rem] shrink-0 snap-start justify-items-center gap-[3px] rounded-[0.875rem] border border-transparent pb-[9px] pt-2 md:w-16",
                "transition-colors duration-150 motion-reduce:transition-none hover:bg-accent",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                "data-[today]:border-muted-foreground",
                "aria-selected:bg-primary aria-selected:text-primary-foreground aria-selected:hover:bg-primary",
                "disabled:pointer-events-none disabled:opacity-50",
                // A gap between weeks shows where each starts.
                d.getDay() === weekStartsOn && !isSameDay(d, min) && "ms-2.5"
              )}
            >
              <span className={cn("text-[0.6875rem] uppercase tracking-[0.04em] text-muted-foreground", selected && "text-current opacity-70")}>
                {format(d, "EEE", { locale })}
              </span>
              <span className="text-[1.0625rem] font-medium tabular-nums md:text-lg">{d.getDate()}</span>
              <span aria-hidden className="flex h-1 gap-[3px]">
                {Array.from({ length: Math.min(n, 3) }, (_, i) => (
                  <i key={i} className={cn("size-1 rounded-full bg-muted-foreground", selected && "bg-primary-foreground")} />
                ))}
              </span>
            </button>
          );
        })}
      </div>
      {children}
      {name && <input type="hidden" name={name} disabled={disabled} value={toISODate(value)} />}
    </div>
  );
});
WeekStrip.displayName = "WeekStrip";

export { WeekStrip };
