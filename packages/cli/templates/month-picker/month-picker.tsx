"use client"

import * as React from "react";
import { format, type Locale } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { changeAsAgent, useAgentControl, useAgentState, useHasAgent, useMergedRef } from "@/components/ui/agent";
import { type CalendarChangeDetails, type DateRange, addMonths, fromISODate, monthsBetween, parseDate } from "@/components/ui/calendar";

/** A month is a Date on its first day, at local midnight. Forms carry it as YYYY-MM. */
const toISOMonth = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
const monthOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const sameMonth = (a: Date | null | undefined, b: Date | null | undefined) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

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

const EMPTY: DateRange = { from: null, to: null };

interface MonthPickerBaseProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange" | "dir"> {
  /** The earliest month that can be picked. */
  min?: Date;
  /** The latest month that can be picked. */
  max?: Date;
  /** Months that can't be picked, besides those outside `min` and `max`. Called with the first of the month. */
  isMonthDisabled?: (month: Date) => boolean;
  disabled?: boolean;
  /** A date-fns locale, for month names. */
  locale?: Locale;
  dir?: "ltr" | "rtl";
  /** Defaults to the current day. Its month carries a ring. */
  today?: Date;
  /** Submits YYYY-MM, or YYYY-MM/YYYY-MM for a range. */
  name?: string;
  required?: boolean;
}

export type MonthPickerProps = MonthPickerBaseProps &
  (
    | {
        mode?: "single";
        value?: Date | null;
        defaultValue?: Date | null;
        onValueChange?: (value: Date | null, details: CalendarChangeDetails) => void;
      }
    | {
        mode: "range";
        value?: DateRange;
        defaultValue?: DateRange;
        onValueChange?: (value: DateRange, details: CalendarChangeDetails) => void;
      }
  );

type Value = Date | null | DateRange;

const KEYS: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -3, ArrowDown: 3, PageUp: -12, PageDown: 12 };

/**
 * A year of months in three columns, for billing and reporting periods where days are
 * noise. In range mode two picks make a span, banded the way Calendar bands days.
 */
const MonthPicker = React.forwardRef<HTMLDivElement, MonthPickerProps>((props, ref) => {
  const {
    mode = "single",
    value: valueProp,
    defaultValue,
    onValueChange,
    min: minProp,
    max: maxProp,
    isMonthDisabled,
    disabled,
    locale,
    dir,
    today: todayProp,
    name,
    required,
    className,
    "aria-label": ariaLabel = mode === "range" ? "Months" : "Month",
    ...rest
  } = props;
  const range = mode === "range";
  const hasAgent = useHasAgent();

  const thisMonth = monthOf(todayProp ?? new Date());
  const min = minProp && monthOf(minProp);
  const max = maxProp && monthOf(maxProp);
  const [value, change] = useAgentState<Value, CalendarChangeDetails>(
    valueProp as Value | undefined,
    (defaultValue as Value | undefined) ?? (range ? EMPTY : null),
    onValueChange as ((v: Value, d: CalendarChangeDetails) => void) | undefined
  );
  const from = range ? (value as DateRange).from && monthOf((value as DateRange).from!) : value && monthOf(value as Date);
  const to = range ? (value as DateRange).to && monthOf((value as DateRange).to!) : from;

  const outside = (m: Date) => (!!min && m < min) || (!!max && m > max);
  const blocked = (m: Date) => !!disabled || outside(m) || !!isMonthDisabled?.(m);
  const clamp = (m: Date) => (min && m < min ? min : max && m > max ? max : m);

  /* ---- which month has focus; its year is the one on screen ---- */
  const anchor = () => clamp(from ?? thisMonth);
  const [focus, setFocus] = React.useState(anchor);
  const key = `${from ? toISOMonth(from) : ""}/${to ? toISOMonth(to) : ""}`;
  const [seen, setSeen] = React.useState(key);
  if (seen !== key) {
    setSeen(key);
    // A value set from outside brings its year into view, unless one end is already on screen.
    if (from && ![from, to].some((m) => m?.getFullYear() === focus.getFullYear())) setFocus(anchor());
  }
  const year = focus.getFullYear();

  const root = React.useRef<HTMLDivElement>(null);
  const moved = React.useRef(false);
  React.useEffect(() => {
    if (!moved.current) return;
    moved.current = false;
    root.current?.querySelector<HTMLElement>(`[data-month="${toISOMonth(focus)}"]`)?.focus();
  }, [focus.getTime()]);

  const commit = (next: Value, details: CalendarChangeDetails) => {
    const eq = (a: Date | null | undefined, b: Date | null | undefined) => (!a && !b) || sameMonth(a, b);
    const same = range ? eq((next as DateRange).from, from) && eq((next as DateRange).to, to) : eq(next as Date | null, from);
    if (!same) change(next, details);
  };

  const pick = (m: Date, event?: Event) => {
    if (blocked(m)) return;
    setFocus(m);
    if (!range) return commit(m, changeDetails("month-press", event));
    const r = value as DateRange;
    // A third pick, or one before the start, starts a new span.
    const next = !r.from || r.to || m < from! ? { from: m, to: null } : { from: r.from, to: m };
    commit(next, changeDetails("month-press", event));
  };

  /* ---- agent ---- */
  const monthNames = React.useMemo(
    () => Array.from({ length: 12 }, (_, i) => [format(new Date(2000, i, 1), "MMMM", { locale }).toLowerCase(), "january february march april may june july august september october november december".split(" ")[i]]),
    [locale]
  );
  const readMonth = (item: unknown): Date | null => {
    if (item instanceof Date) return isNaN(item.getTime()) ? null : monthOf(item);
    if (typeof item !== "string") return null;
    const t = item.trim().toLowerCase();
    const iso = /^(\d{4})-(\d{1,2})$/.exec(t);
    if (iso && +iso[2] >= 1 && +iso[2] <= 12) return new Date(+iso[1], +iso[2] - 1, 1);
    const named = /^([^\d\s.,]+)\.?,?\s*(\d{4})?$/.exec(t);
    if (named && named[1].length >= 3) {
      const i = monthNames.findIndex((names) => names.some((n) => n.startsWith(named[1])));
      if (i >= 0) return new Date(named[2] ? +named[2] : thisMonth.getFullYear(), i, 1);
    }
    const day = fromISODate(t) ?? parseDate(t, { today: todayProp ?? new Date() });
    return day && monthOf(day);
  };
  const refusal = (m: Date): string | null => {
    if (min && m < min) return `The earliest is ${toISOMonth(min)}.`;
    if (max && m > max) return `The latest is ${toISOMonth(max)}.`;
    if (isMonthDisabled?.(m)) return `${toISOMonth(m)} can't be picked.`;
    return null;
  };

  useAgentControl(() => ({
    kind: "date",
    element: root.current,
    value: range ? (from ? [toISOMonth(from), ...((value as DateRange).to ? [toISOMonth(to!)] : [])] : undefined) : from ? toISOMonth(from) : undefined,
    multiple: range,
    disabled,
    required,
    actions: {
      setValue: (wanted: unknown) => {
        if (wanted === null || wanted === "") return changeAsAgent(commit, range ? EMPTY : null);
        const parts = !range
          ? [wanted]
          : Array.isArray(wanted)
            ? wanted
            : typeof wanted === "string"
              ? // "jun to nov 2026": a month with no year takes the one after it.
                wanted.split(/\s*(?:\/|,| to )\s*/i).map((p, _, all) => (/\d/.test(p) ? p : `${p} ${/\d{4}$/.exec(all[all.length - 1])?.[0] ?? ""}`))
              : [wanted];
        const months = parts.map(readMonth);
        const bad = parts.findIndex((_, i) => !months[i]);
        if (bad >= 0) return `"${String(parts[bad])}" is not a month. Send YYYY-MM, or a name such as jun 2026.`;
        const why = months.map((m) => refusal(m!)).find(Boolean);
        if (why) return why;
        if (!range) return changeAsAgent(commit, months[0]);
        if (months.length !== 2) return "Send two months, from and to.";
        if (months[1]! < months[0]!) return "The span must end on or after its start.";
        return changeAsAgent(commit, { from: months[0], to: months[1] });
      },
      clear: () => changeAsAgent(commit, range ? EMPTY : null),
    },
  }));

  /* ---- render ---- */
  const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
  const done = range && from && (value as DateRange).to;
  const count = done ? monthsBetween(from!, to!) + 1 : 0;
  const short = (d: Date) => format(d, "MMM", { locale });
  const submitted = range ? (done ? `${toISOMonth(from!)}/${toISOMonth(to!)}` : "") : from ? toISOMonth(from) : "";
  const step = (n: number) => setFocus((f) => clamp(new Date(f.getFullYear() + n, f.getMonth(), 1)));

  const navButton = (n: -1 | 1) => (
    <button
      type="button"
      aria-label={n < 0 ? "Previous year" : "Next year"}
      data-agent-part={hasAgent ? "" : undefined}
      disabled={disabled || (n < 0 ? !!min && year <= min.getFullYear() : !!max && year >= max.getFullYear())}
      onClick={() => step(n)}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-md text-muted-foreground",
        "hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-40"
      )}
    >
      {n < 0 ? <ChevronLeft className="size-4 rtl:rotate-180" aria-hidden /> : <ChevronRight className="size-4 rtl:rotate-180" aria-hidden />}
    </button>
  );

  return (
    <div
      {...rest}
      ref={useMergedRef(ref, root)}
      role="group"
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      dir={dir}
      data-slot="month-picker"
      className={cn("relative w-full max-w-80", className)}
    >
      <div data-slot="month-picker-header" className="mb-2.5 flex items-center">
        {navButton(-1)}
        <div data-slot="month-picker-year" aria-live="polite" className="flex-1 text-center text-sm font-semibold tabular-nums">
          {year}
        </div>
        {navButton(1)}
      </div>
      <div
        data-slot="month-picker-grid"
        className="grid grid-cols-3 gap-y-1.5"
        onKeyDown={(e) => {
          let n = KEYS[e.key];
          if (e.key === "Home") n = -focus.getMonth();
          if (e.key === "End") n = 11 - focus.getMonth();
          if (n === undefined) return;
          if ((e.key === "ArrowLeft" || e.key === "ArrowRight") && root.current?.closest("[dir]")?.getAttribute("dir") === "rtl") n = -n;
          e.preventDefault();
          const home = e.key === "Home" || e.key === "End";
          const next = home ? clamp(addMonths(focus, n)) : addMonths(focus, n);
          if (outside(next)) return;
          moved.current = true;
          setFocus(next);
        }}
      >
        {months.map((m) => {
          const ends = sameMonth(m, from) || sameMonth(m, to);
          const within = !!done && m >= from! && m <= to!;
          const col = m.getMonth() % 3;
          return (
            <span
              key={m.getMonth()}
              data-range={done && within ? (sameMonth(m, from) ? "start" : sameMonth(m, to) ? "end" : "middle") : undefined}
              className={cn(
                "grid h-11 place-items-center",
                done && within && from! < to! && "bg-secondary",
                done && within && (sameMonth(m, from) || col === 0) && "rounded-s-xl",
                done && within && (sameMonth(m, to) || col === 2) && "rounded-e-xl"
              )}
            >
              <button
                type="button"
                data-slot="month-picker-month"
                data-month={toISOMonth(m)}
                data-agent-part={hasAgent ? "" : undefined}
                data-selected={ends || undefined}
                data-current={sameMonth(m, thisMonth) || undefined}
                tabIndex={sameMonth(m, focus) ? 0 : -1}
                aria-label={format(m, "MMMM yyyy", { locale })}
                aria-current={sameMonth(m, thisMonth) ? "date" : undefined}
                aria-pressed={ends || within}
                aria-disabled={blocked(m) || undefined}
                onClick={(e) => pick(m, e.nativeEvent)}
                className={cn(
                  "h-10 w-full max-w-[5.25rem] rounded-[0.625rem] border border-transparent text-[0.8125rem] outline-none transition-colors duration-150 motion-reduce:transition-none",
                  "hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  // This month is ringed with a border, so the focus ring stays free for focus.
                  "data-[current]:border-muted-foreground",
                  "data-[selected]:border-transparent data-[selected]:bg-primary data-[selected]:font-medium data-[selected]:text-primary-foreground",
                  "aria-disabled:pointer-events-none aria-disabled:opacity-30"
                )}
              >
                {short(m)}
              </button>
            </span>
          );
        })}
      </div>
      {range && (
        <p data-slot="month-picker-readout" aria-live="polite" className="mt-3 min-h-5 border-t pt-3 text-[0.8125rem]">
          {done ? (
            <>
              {short(from!)}
              {from!.getFullYear() !== to!.getFullYear() && ` ${from!.getFullYear()}`} to {short(to!)} {to!.getFullYear()}{" "}
              <span className="text-muted-foreground">
                · {count} {count === 1 ? "month" : "months"}
              </span>
            </>
          ) : from ? (
            <>
              {short(from)} {from.getFullYear()} <span className="text-muted-foreground">to ...</span>
            </>
          ) : null}
        </p>
      )}
      {(name || required) && (
        <input
          aria-hidden
          tabIndex={-1}
          name={name}
          required={required}
          disabled={disabled}
          value={submitted}
          onChange={() => {}}
          onFocus={() => root.current?.querySelector<HTMLElement>("[data-month][tabindex='0']")?.focus()}
          className="pointer-events-none absolute bottom-0 start-0 size-px opacity-0"
        />
      )}
    </div>
  );
});
MonthPicker.displayName = "MonthPicker";

export { MonthPicker };
