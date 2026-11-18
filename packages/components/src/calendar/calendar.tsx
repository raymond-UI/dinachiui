import * as React from "react";
import { DayPicker, type DayButtonProps, type DayProps, type MonthCaptionProps, type MonthGridProps, type MonthProps, type Matcher } from "react-day-picker";
import { format, type Locale } from "date-fns";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@dinachi/core";
import { changeAsAgent, useAgentControl, useAgentState, useMergedRef } from "../agent";

/* ----------------------------------------------------------------------------------------
 * Dates. A day is a Date at local midnight, so it means the same calendar day wherever it
 * is read, and forms carry it as YYYY-MM-DD. Nothing here converts time zones.
 * ------------------------------------------------------------------------------------- */

const DAY_MS = 86_400_000;

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function isSameDay(a: Date | null | undefined, b: Date | null | undefined): boolean {
  return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

/** Whole days from `a` to `b`, counted on the calendar so daylight saving never shifts it. */
function daysBetween(a: Date, b: Date): number {
  return Math.round((Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / DAY_MS);
}

function monthsBetween(a: Date, b: Date): number {
  return (b.getFullYear() - a.getFullYear()) * 12 + b.getMonth() - a.getMonth();
}

/** The ISO 8601 week number: weeks start on Monday, and week 1 holds the year's first Thursday. */
function isoWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  return Math.ceil(((d.getTime() - Date.UTC(d.getUTCFullYear(), 0, 1)) / DAY_MS + 1) / 7);
}

const pad = (n: number) => String(n).padStart(2, "0");

/** `YYYY-MM-DD`, the form a day is submitted and reported in. */
function toISODate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** The day a real calendar date names, or null when the parts don't make one (31 Feb). */
function makeDate(year: number, month: number, day: number): Date | null {
  const d = new Date(year, month, day);
  return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day ? d : null;
}

function fromISODate(text: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text.trim());
  return m ? makeDate(+m[1], +m[2] - 1, +m[3]) : null;
}

const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
const WEEKDAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

/** The index of the name `word` spells or shortens to three letters or more, else -1. */
const nameIn = (names: string[], word: string) => (word.length < 3 ? -1 : names.findIndex((n) => n.startsWith(word)));

export interface ParseDateOptions {
  /** The day relative phrases count from. Defaults to today. */
  today?: Date;
  /** How a numeric date such as 3/12 is read. Defaults to the order the browser's language writes dates in. */
  order?: "day-first" | "month-first";
  /** The day a week starts on, which decides what "next fri" means. Defaults to Monday. */
  weekStartsOn?: number;
}

/** Whether `locale` writes the day before the month, read off how it formats a known date. */
function dayFirst(locale?: Locale): boolean {
  const code = locale?.code ?? (typeof navigator !== "undefined" ? navigator.language : "en-GB");
  try {
    const parts = new Intl.DateTimeFormat(code, { day: "numeric", month: "numeric" }).formatToParts(new Date(2000, 10, 22));
    return parts.findIndex((p) => p.type === "day") < parts.findIndex((p) => p.type === "month");
  } catch {
    return true;
  }
}

/** A year as typed: two digits land within 50 years of `base`, so 99 is 1999 and 30 is 2030. */
function fullYear(text: string | undefined, base: Date): number {
  if (!text) return base.getFullYear();
  if (text.length === 4) return +text;
  const year = 2000 + +text;
  return year > base.getFullYear() + 50 ? year - 100 : year;
}

/**
 * Reads what a person types into a date field: today, tomorrow, yesterday, in 3 days, in
 * 2 weeks, fri, next fri, 21 nov, nov 21, 21/11, 2026-11-21. Returns null when the text
 * isn't a date. English words only; pass your own parser to the pickers for other languages.
 */
function parseDate(input: string, { today = new Date(), order, weekStartsOn = 1 }: ParseDateOptions = {}): Date | null {
  const base = startOfDay(today);
  const s = input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/(\d)(st|nd|rd|th)\b/, "$1")
    // A weekday before a full date, as in "Fri, 21 Nov 2026", says nothing the date doesn't.
    .replace(/^([a-z]+)\.?,? (?=\d|[a-z]+\.? \d)/, (all, word: string) => (nameIn(WEEKDAYS, word) < 0 ? all : ""));
  if (!s) return null;
  if (s === "today" || s === "now") return base;
  if (s === "tomorrow" || s === "tmr") return addDays(base, 1);
  if (s === "yesterday") return addDays(base, -1);
  let m: RegExpMatchArray | null;
  if ((m = s.match(/^in (\d+) (day|week|month)s?$/))) {
    const n = +m[1];
    if (m[2] === "month") {
      const target = new Date(base.getFullYear(), base.getMonth() + n, 1);
      const last = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
      return new Date(target.getFullYear(), target.getMonth(), Math.min(base.getDate(), last));
    }
    return addDays(base, m[2] === "week" ? n * 7 : n);
  }
  if ((m = s.match(/^(next |this )?([a-z]+)$/)) && nameIn(WEEKDAYS, m[2]) >= 0) {
    const ahead = (nameIn(WEEKDAYS, m[2]) - base.getDay() + 7) % 7;
    // "this tue" on a Tuesday is today; a bare "tue" is the next one.
    let diff = ahead || (m[1] === "this " ? 0 : 7);
    // "next fri" is the Friday of next week, not the coming one.
    if (m[1] === "next " && diff <= 6 - ((base.getDay() - weekStartsOn + 7) % 7)) diff += 7;
    return addDays(base, diff);
  }
  if ((m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/))) return makeDate(+m[1], +m[2] - 1, +m[3]);
  if ((m = s.match(/^(\d{1,2})[/.\- ](\d{1,2})(?:[/.\- ](\d{2}|\d{4}))?$/))) {
    const [day, month] = (order ?? (dayFirst() ? "day-first" : "month-first")) === "day-first" ? [+m[1], +m[2]] : [+m[2], +m[1]];
    return makeDate(fullYear(m[3], base), month - 1, day);
  }
  if ((m = s.match(/^(\d{1,2}) ([a-z]+)\.?,?(?: (\d{2}|\d{4}))?$/)) && nameIn(MONTHS, m[2]) >= 0) {
    return makeDate(fullYear(m[3], base), nameIn(MONTHS, m[2]), +m[1]);
  }
  if ((m = s.match(/^([a-z]+)\.? (\d{1,2}),?(?: (\d{2}|\d{4}))?$/)) && nameIn(MONTHS, m[1]) >= 0) {
    return makeDate(fullYear(m[3], base), nameIn(MONTHS, m[1]), +m[2]);
  }
  return null;
}

/* ----------------------------------------------------------------------------------------
 * Calendar
 * ------------------------------------------------------------------------------------- */

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export type CalendarMode = "single" | "multiple" | "range";

/** Base UI's change details shape, so a handler can cancel a change the same way. */
export interface CalendarChangeDetails {
  reason: "day-press" | "imperative-action" | (string & {});
  event: Event | undefined;
  isCanceled: boolean;
  cancel(): void;
}

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

type ValueOf<M extends CalendarMode> = M extends "range" ? DateRange : M extends "multiple" ? Date[] : Date | null;

interface CalendarBaseProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange" | "dir"> {
  /** `scroll`: months as one column you scroll. `paged`: arrows and months side by side. */
  layout?: "scroll" | "paged";
  /** Months side by side in the paged layout. */
  numberOfMonths?: number;
  /** `dropdown` turns the month heading into month and year selects, for jumping far. */
  captionLayout?: "label" | "dropdown";
  /** The earliest day that can be picked. Scrolling stops at its month. */
  min?: Date;
  /** The latest day that can be picked. */
  max?: Date;
  /** Days that can't be picked, besides those outside `min` and `max`. */
  isDateDisabled?: (date: Date) => boolean;
  disabled?: boolean;
  /** Shows ISO week numbers in a column before each week. */
  weekNumbers?: boolean;
  /** A date-fns locale, for month and weekday names and the first day of the week. */
  locale?: Locale;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  dir?: "ltr" | "rtl";
  /** Defaults to the current day. */
  today?: Date;
  /** Submits the value with a form: a day as YYYY-MM-DD, a range as YYYY-MM-DD/YYYY-MM-DD. */
  name?: string;
  required?: boolean;
  /** The day under the pointer while a range waits for its end, for a live readout. */
  onPreview?: (range: DateRange | null) => void;
  /** Moves focus to the selected day, or today, when the calendar mounts. */
  autoFocus?: boolean;
}

export type CalendarProps = CalendarBaseProps &
  (
    | {
        mode?: "single";
        value?: Date | null;
        defaultValue?: Date | null;
        onValueChange?: (value: Date | null, details: CalendarChangeDetails) => void;
      }
    | {
        mode: "multiple";
        value?: Date[];
        defaultValue?: Date[];
        onValueChange?: (value: Date[], details: CalendarChangeDetails) => void;
      }
    | {
        mode: "range";
        value?: DateRange;
        defaultValue?: DateRange;
        onValueChange?: (value: DateRange, details: CalendarChangeDetails) => void;
      }
  );

const EMPTY_RANGE: DateRange = { from: null, to: null };

function emptyFor(mode: CalendarMode): ValueOf<CalendarMode> {
  return mode === "range" ? EMPTY_RANGE : mode === "multiple" ? [] : null;
}

/** The day the calendar opens on: the selection, else today, kept inside the bounds. */
function anchorOf(mode: CalendarMode, value: ValueOf<CalendarMode>, today: Date, min?: Date, max?: Date): Date {
  const picked =
    mode === "range" ? (value as DateRange).from : mode === "multiple" ? (value as Date[])[0] : (value as Date | null);
  let day = picked ?? today;
  if (min && day < min) day = min;
  if (max && day > max) day = max;
  return day;
}

/** Months rendered either side of the anchor in the scroll layout, before scrolling adds more. */
const WINDOW = 6;
const GROW = 6;

/** Reads a typed value an agent sent: one day, a list of days, or a from and to. */
function agentValue(
  mode: CalendarMode,
  wanted: unknown,
  parse: ParseDateOptions,
  blocked: (d: Date) => boolean,
  valid: (d: Date) => string | null
): ValueOf<CalendarMode> | string {
  const one = (item: unknown): Date | string => {
    const d = item instanceof Date ? (isNaN(item.getTime()) ? null : startOfDay(item)) : typeof item === "string" ? parseDate(item, parse) : null;
    if (!d) return `"${String(item)}" is not a date. Send YYYY-MM-DD.`;
    return valid(d) ?? d;
  };
  if (mode === "single") return wanted === null || wanted === "" ? null : one(wanted);
  let list: unknown[] = [wanted];
  if (Array.isArray(wanted)) list = wanted;
  else if (typeof wanted === "string") {
    // "/" also separates the parts of 21/11, so it splits only an ISO pair.
    list = /^\s*\d{4}-\d\d-\d\d\s*\/\s*\d{4}-\d\d-\d\d\s*$/.test(wanted) ? wanted.split("/") : wanted.split(/\s*(?:,| to )\s*/);
  }
  const days = list.map(one);
  const wrong = days.find((d) => typeof d === "string");
  if (wrong) return wrong as string;
  const dates = days as Date[];
  if (mode === "multiple") return dates.sort((a, b) => a.getTime() - b.getTime());
  if (dates.length !== 2) return "Send two dates, from and to.";
  if (dates[1] < dates[0]) return "The range must end on or after its start.";
  for (let d = addDays(dates[0], 1); d < dates[1]; d = addDays(d, 1)) {
    if (blocked(d)) return `The range can't run across ${toISODate(d)}, which can't be picked.`;
  }
  return { from: dates[0], to: dates[1] };
}

function agentReport(mode: CalendarMode, value: ValueOf<CalendarMode>): string | string[] | undefined {
  if (mode === "single") return value ? toISODate(value as Date) : undefined;
  if (mode === "multiple") return (value as Date[]).map(toISODate);
  const { from, to } = value as DateRange;
  return from ? [toISODate(from), ...(to ? [toISODate(to)] : [])] : undefined;
}

/** The cell for `day`, not the hidden copy RDP keeps in the neighbouring month's grid. */
const dayCell = (day: Date) => `[data-day="${toISODate(day)}"]:not([data-outside])`;

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** A function whose identity never changes but which always runs the latest render's code. */
function useStable<A extends unknown[], R>(fn: (...args: A) => R): (...args: A) => R {
  const latest = React.useRef(fn);
  React.useLayoutEffect(() => {
    latest.current = fn;
  });
  return React.useCallback((...args: A) => latest.current(...args), []);
}

const noop = () => {};

const PreviewContext = React.createContext<(day: Date | null) => void>(() => {});
const ModeContext = React.createContext<CalendarMode>("single");

/*
 * RDP's parts, replaced so they carry our data-slots and classes. They live outside the
 * component so their identity is stable: a new one each render would remount every day.
 */
function CalendarDayButton({ day, modifiers: m, className: _c, ...buttonProps }: DayButtonProps) {
  const preview = React.useContext(PreviewContext);
  const ref = React.useRef<HTMLButtonElement>(null);
  // RDP moves focus by flagging the day, and its own button focuses itself; so must this one.
  React.useEffect(() => {
    if (m.focused) ref.current?.focus();
  }, [m.focused]);
  return (
    <button
      {...buttonProps}
      ref={ref}
      data-slot="calendar-day"
      data-today={m.today || undefined}
      data-selected={m.selected || undefined}
      data-range={m.band_start ? "start" : m.band_end ? "end" : m.band ? "middle" : undefined}
      className={cn(
        "relative mx-auto flex size-[var(--calendar-cell)] items-center justify-center rounded-[calc(var(--radius)-2px)] text-sm tabular-nums outline-none",
        "transition-colors duration-150 motion-reduce:transition-none",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        m.band && !m.selected && "hover:bg-transparent",
        (m.selected || m.band_start || m.band_end) && "bg-primary font-medium text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        m.today && "after:absolute after:bottom-1 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-current",
        m.disabled && "pointer-events-none text-muted-foreground opacity-50",
        m.outside && "text-muted-foreground"
      )}
      onPointerEnter={() => preview(day.date)}
    />
  );
}

/**
 * Every day of a picked range is selected, not only its ends; a previewed one is not. RDP
 * keeps a hidden copy of each neighbouring month's days, which never take part.
 */
function CalendarDay({ day: _d, modifiers: m, className, ...cellProps }: DayProps) {
  const band = m.band && !m.hidden;
  return (
    <td
      {...cellProps}
      className={cn(
        className,
        band && "bg-secondary first-of-type:rounded-s-[calc(var(--radius)-2px)] last-of-type:rounded-e-[calc(var(--radius)-2px)]",
        band && m.band_start && "rounded-s-[calc(var(--radius)-2px)]",
        band && m.band_end && "rounded-e-[calc(var(--radius)-2px)]"
      )}
      aria-selected={(!m.hidden && (m.selected || m.chosen)) || undefined}
    />
  );
}

/** RDP is always told `multiple`, so the grid says multiselectable only when it is. */
function CalendarMonthGrid(props: MonthGridProps) {
  const mode = React.useContext(ModeContext);
  return <table {...props} aria-multiselectable={mode !== "single" || undefined} />;
}

function CalendarMonth({ calendarMonth: _m, displayIndex: _i, ...monthProps }: MonthProps) {
  return <div {...monthProps} data-slot="calendar-month" />;
}

function CalendarChevron({ orientation }: { orientation?: "up" | "down" | "left" | "right" }) {
  return orientation === "left" ? <ChevronLeft className="size-4 rtl:rotate-180" /> : <ChevronRight className="size-4 rtl:rotate-180" />;
}

function CaptionSelect({
  value,
  onChange,
  children,
  ...props
}: Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "value" | "onChange"> & {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <span className="relative inline-flex items-center">
      <select
        {...props}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          "h-8 cursor-pointer appearance-none rounded-md bg-transparent pe-6 ps-1.5 text-sm font-semibold text-foreground",
          "hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default disabled:opacity-50"
        )}
      >
        {children}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute end-1.5 size-3.5 text-muted-foreground" />
    </span>
  );
}

/**
 * A month grid for picking a day, several days or a range. Months scroll as one column by
 * default, with a Today button that appears once today is out of view.
 */
const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>((props, ref) => {
  const {
    mode = "single",
    value: valueProp,
    defaultValue,
    onValueChange,
    layout = "scroll",
    numberOfMonths = 1,
    captionLayout = "label",
    min: minProp,
    max: maxProp,
    isDateDisabled,
    disabled,
    weekNumbers = false,
    locale,
    weekStartsOn = locale?.options?.weekStartsOn ?? 1,
    dir,
    today: todayProp,
    name,
    required,
    onPreview,
    autoFocus,
    className,
    ...rest
  } = props;

  const today = React.useMemo(() => startOfDay(todayProp ?? new Date()), [todayProp ? toISODate(todayProp) : null]);
  const min = minProp && startOfDay(minProp);
  const max = maxProp && startOfDay(maxProp);
  const [value, change] = useAgentState<ValueOf<CalendarMode>, CalendarChangeDetails>(
    valueProp as ValueOf<CalendarMode> | undefined,
    (defaultValue as ValueOf<CalendarMode> | undefined) ?? emptyFor(mode),
    onValueChange as ((v: ValueOf<CalendarMode>, d: CalendarChangeDetails) => void) | undefined
  );
  const [hover, setHover] = React.useState<Date | null>(null);
  const root = React.useRef<HTMLDivElement>(null);
  const scroller = React.useRef<HTMLDivElement>(null);
  const scroll = layout === "scroll";

  const blocked = React.useCallback(
    (d: Date) => !!disabled || (!!min && d < min) || (!!max && d > max) || !!isDateDisabled?.(d),
    [disabled, min?.getTime(), max?.getTime(), isDateDisabled]
  );

  /* ---- the months on screen ---- */
  const anchor = anchorOf(mode, value, today, min, max);
  const clampMonth = (m: Date) => {
    if (min && m < addMonths(min, 0)) return addMonths(min, 0);
    if (max && m > addMonths(max, 0)) return addMonths(max, 0);
    return m;
  };
  const [span, setSpan] = React.useState(() => ({
    start: clampMonth(addMonths(anchor, scroll ? -WINDOW : 0)),
    end: clampMonth(addMonths(anchor, scroll ? WINDOW : numberOfMonths - 1)),
  }));
  const count = monthsBetween(span.start, span.end) + 1;

  // Keeps the reading position when months are added above it.
  const heightBefore = React.useRef<number | null>(null);
  React.useLayoutEffect(() => {
    const sc = scroller.current;
    if (sc && heightBefore.current !== null) {
      sc.scrollTop += sc.scrollHeight - heightBefore.current;
      heightBefore.current = null;
    }
  }, [span.start.getTime()]);

  const grow = React.useCallback(() => {
    const sc = scroller.current;
    if (!sc || !scroll) return;
    const room = sc.clientHeight;
    if (sc.scrollTop < room && (!min || span.start > addMonths(min, 0))) {
      heightBefore.current = sc.scrollHeight;
      setSpan((s) => ({ ...s, start: clampMonth(addMonths(s.start, -GROW)) }));
    } else if (sc.scrollHeight - sc.scrollTop - room < room && (!max || span.end < addMonths(max, 0))) {
      setSpan((s) => ({ ...s, end: clampMonth(addMonths(s.end, GROW)) }));
    }
  }, [scroll, span.start.getTime(), span.end.getTime(), min?.getTime(), max?.getTime()]);

  /** Scrolls `day` into view, keeping its month's heading on top when it fits. */
  const reveal = React.useCallback(
    (day: Date, smooth: boolean) => {
      const sc = scroller.current;
      const cell = sc?.querySelector<HTMLElement>(dayCell(day));
      if (!sc || !cell) return;
      // A popover opens scaled down, and rects carry the scale where scrollTop doesn't.
      const box = sc.getBoundingClientRect();
      const scale = box.height / sc.offsetHeight || 1;
      const offset = (node: Element) => sc.scrollTop + (node.getBoundingClientRect().top - box.top) / scale;
      const month = cell.closest("[data-slot=calendar-month]") ?? cell;
      const top = Math.max(offset(cell) - sc.clientHeight / 2 + cell.offsetHeight / 2, offset(month));
      sc.scrollTo?.({ top, behavior: smooth && !reducedMotion() ? "smooth" : "auto" });
    },
    []
  );

  // A day to scroll to once the months it needs have rendered.
  const pending = React.useRef<Date | null>(null);
  React.useLayoutEffect(() => {
    if (pending.current) reveal(pending.current, false);
    pending.current = null;
  }, [span.start.getTime(), span.end.getTime()]);

  const goTo = React.useCallback(
    (day: Date, smooth: boolean) => {
      const month = addMonths(day, 0);
      if (!scroll) {
        const last = addMonths(span.start, numberOfMonths - 1);
        if (month < span.start || month > last) setSpan({ start: clampMonth(month), end: clampMonth(addMonths(month, numberOfMonths - 1)) });
      } else if (month < span.start || month > span.end) {
        pending.current = day;
        setSpan({ start: clampMonth(addMonths(day, -WINDOW)), end: clampMonth(addMonths(day, WINDOW)) });
      } else reveal(day, smooth);
    },
    [scroll, numberOfMonths, span.start.getTime(), span.end.getTime(), min?.getTime(), max?.getTime(), reveal]
  );

  // A value set from outside, by the app or an agent, brings its day into view.
  const mounted = React.useRef(false);
  React.useEffect(() => {
    if (!mounted.current) return void (mounted.current = true);
    const sc = scroller.current;
    const cell = sc?.querySelector(dayCell(anchor));
    if (scroll && sc && cell) {
      const [a, b] = [sc.getBoundingClientRect(), cell.getBoundingClientRect()];
      if (b.top >= a.top && b.bottom <= a.bottom) return;
    }
    goTo(anchor, true);
  }, [anchor.getTime()]);

  React.useLayoutEffect(() => {
    if (scroll) reveal(anchor, false);
    if (autoFocus) root.current?.querySelector<HTMLElement>("[data-slot=calendar-day][tabindex='0']")?.focus({ preventScroll: true });
  }, []);

  /* ---- Today button: shown while today is out of view ---- */
  const [todayHidden, setTodayHidden] = React.useState(false);
  const todayInRange = (!min || today >= min) && (!max || today <= max);
  React.useEffect(() => {
    const sc = scroller.current;
    const cell = sc?.querySelector(dayCell(today));
    if (!scroll || !sc || typeof IntersectionObserver === "undefined") return;
    if (!cell) {
      setTodayHidden(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => setTodayHidden(!entry.isIntersecting), { root: sc, threshold: 1 });
    io.observe(cell);
    return () => io.disconnect();
  }, [scroll, today.getTime(), span.start.getTime(), span.end.getTime()]);

  /* ---- selection ---- */
  const commit = (next: ValueOf<CalendarMode>, details: CalendarChangeDetails) => change(next, details);

  const pick = (day: Date, event?: React.SyntheticEvent) => {
    const details = changeDetails("day-press", event?.nativeEvent);
    if (mode === "single") return commit(isSameDay(value as Date | null, day) && !required ? null : day, details);
    if (mode === "multiple") {
      const list = value as Date[];
      const has = list.some((d) => isSameDay(d, day));
      return commit(has ? list.filter((d) => !isSameDay(d, day)) : [...list, day].sort((a, b) => a.getTime() - b.getTime()), details);
    }
    const { from, to } = value as DateRange;
    setHover(null);
    onPreview?.(null);
    if (!from || to || day < from) return commit({ from: day, to: null }, details);
    // A range must not run across a day that can't be picked.
    for (let d = addDays(from, 1); d < day; d = addDays(d, 1)) if (blocked(d)) return commit({ from: day, to: null }, details);
    return commit({ from, to: day }, details);
  };

  const waiting = mode === "range" && (value as DateRange).from && !(value as DateRange).to ? (value as DateRange).from : null;
  const preview = useStable((day: Date | null) => {
    if (!waiting) return;
    const end = day && day >= waiting ? day : null;
    setHover(end);
    onPreview?.(end ? { from: waiting, to: end } : null);
  });

  /* ---- what RDP is told ---- */
  const range = mode === "range" ? (value as DateRange) : null;
  const shown: DateRange | null = range && (range.to ? range : waiting && hover ? { from: waiting, to: hover } : range.from ? range : null);
  // RDP is told the picked days as a plain list, which drives aria-selected and where Tab
  // lands. A previewed end is drawn as one but not announced as picked.
  const picked: Date[] =
    mode === "single" ? (value ? [value as Date] : []) : mode === "multiple" ? (value as Date[]) : ([range?.from, range?.to].filter(Boolean) as Date[]);
  const modifiers: Record<string, Matcher | Matcher[] | undefined> = {
    band: shown?.from && shown.to && !isSameDay(shown.from, shown.to) ? { from: shown.from, to: shown.to } : undefined,
    band_start: shown?.from && shown.to && !isSameDay(shown.from, shown.to) ? shown.from : undefined,
    band_end: shown?.from && shown.to && !isSameDay(shown.from, shown.to) ? shown.to : undefined,
    chosen: range?.from && range.to ? { from: range.from, to: range.to } : undefined,
  };

  /* ---- agent ---- */
  useAgentControl(() => ({
    kind: "date",
    element: root.current,
    value: agentReport(mode, value),
    multiple: mode !== "single",
    disabled,
    required,
    actions: {
      setValue: (wanted: unknown) => {
        const parse = { today, order: dayFirst(locale) ? "day-first" : "month-first", weekStartsOn } as const;
        const next = agentValue(mode, wanted, parse, blocked, (d) =>
          blocked(d) ? `${toISODate(d)} can't be picked${min && d < min ? `: the earliest is ${toISODate(min)}` : max && d > max ? `: the latest is ${toISODate(max)}` : ""}.` : null
        );
        if (typeof next === "string") return next;
        const failed = changeAsAgent(change, next);
        if (!failed) goTo(anchorOf(mode, next, today, min, max), false);
        return failed;
      },
      clear: () => changeAsAgent(change, emptyFor(mode)),
    },
  }));

  /* ---- render ---- */
  // Selects reach from min to max, else a century back and twenty years ahead.
  const years = React.useMemo(() => {
    const from = min?.getFullYear() ?? today.getFullYear() - 100;
    const to = max?.getFullYear() ?? today.getFullYear() + 20;
    return Array.from({ length: to - from + 1 }, (_, i) => from + i);
  }, [min?.getFullYear(), max?.getFullYear(), today.getFullYear()]);
  const monthNames = React.useMemo(
    () => Array.from({ length: 12 }, (_, i) => format(new Date(2000, i, 1), "LLL", { locale })),
    [locale]
  );

  // Through a ref, so the caption keeps its identity and a select keeps focus after a jump.
  const jumpTo = React.useRef((_month: Date, _index: number) => {});
  jumpTo.current = (month, index) => {
    if (scroll) return goTo(clampMonth(month), false);
    const start = clampMonth(addMonths(month, -index));
    setSpan({ start, end: addMonths(start, numberOfMonths - 1) });
  };

  const MonthCaption = React.useCallback(
    ({ calendarMonth, displayIndex, className: _c, ...captionProps }: MonthCaptionProps) => {
      const shown = calendarMonth.date;
      const outside = (m: Date) => (!!min && m < addMonths(min, 0)) || (!!max && m > addMonths(max, 0));
      return (
        <div
          {...captionProps}
          data-slot="calendar-caption"
          className={cn(
            "px-1 pb-2 pt-3 text-sm font-semibold",
            scroll && "sticky top-0 z-10 bg-[var(--calendar-bg)]",
            !scroll && "flex h-9 items-center justify-center pt-0",
            captionLayout === "dropdown" && "flex items-center gap-1",
            captionLayout === "dropdown" && scroll && "-ms-1.5"
          )}
        >
          {captionLayout === "dropdown" ? (
            <>
              <CaptionSelect
                data-slot="calendar-month-select"
                aria-label="Month"
                disabled={disabled}
                value={shown.getMonth()}
                onChange={(m) => jumpTo.current(new Date(shown.getFullYear(), m, 1), displayIndex)}
              >
                {monthNames.map((n, i) => (
                  <option key={i} value={i} disabled={outside(new Date(shown.getFullYear(), i, 1))}>
                    {n}
                  </option>
                ))}
              </CaptionSelect>
              <CaptionSelect
                data-slot="calendar-year-select"
                aria-label="Year"
                disabled={disabled}
                value={shown.getFullYear()}
                onChange={(y) => jumpTo.current(new Date(y, shown.getMonth(), 1), displayIndex)}
              >
                {(years.includes(shown.getFullYear()) ? years : [...years, shown.getFullYear()].sort((a, b) => a - b)).map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </CaptionSelect>
            </>
          ) : (
            format(shown, "LLLL y", { locale })
          )}
        </div>
      );
    },
    [scroll, locale, captionLayout, monthNames, years, disabled, min?.getTime(), max?.getTime()]
  );

  const weekdayNames = React.useMemo(() => {
    const monday = new Date(2024, 0, 1);
    return Array.from({ length: 7 }, (_, i) => addDays(monday, ((weekStartsOn + 6) % 7) + i));
  }, [weekStartsOn]);

  const grid = "grid grid-cols-[repeat(7,var(--calendar-cell))] justify-between";
  const gridWithWeeks = "grid grid-cols-[1.5rem_repeat(7,var(--calendar-cell))] justify-between";

  const values =
    mode === "single"
      ? value ? [toISODate(value as Date)] : []
      : mode === "multiple"
        ? (value as Date[]).map(toISODate)
        : range?.from && range.to ? [`${toISODate(range.from)}/${toISODate(range.to)}`] : [];

  return (
    <ModeContext.Provider value={mode}>
    <PreviewContext.Provider value={preview}>
    <div
      ref={useMergedRef(ref, root)}
      data-slot="calendar"
      data-layout={layout}
      data-disabled={disabled || undefined}
      dir={dir}
      className={cn(
        "relative inline-flex flex-col text-foreground [--calendar-bg:var(--card)] [--calendar-cell:2.5rem]",
        scroll && "w-[calc(var(--calendar-cell)*7+1rem)]",
        scroll && weekNumbers && "w-[calc(var(--calendar-cell)*7+2.75rem)]",
        className
      )}
      role="group"
      {...rest}
      onPointerLeave={(e) => {
        preview(null);
        rest.onPointerLeave?.(e);
      }}
    >
      {scroll && (
        <div
          data-slot="calendar-weekdays"
          aria-hidden
          className={cn(weekNumbers ? gridWithWeeks : grid, "border-b border-border px-2 pb-2 text-center text-xs text-muted-foreground")}
        >
          {weekNumbers && <span />}
          {weekdayNames.map((d) => (
            <span key={d.getDay()}>{format(d, "EEEEEE", { locale })}</span>
          ))}
        </div>
      )}
      <div
        ref={scroller}
        data-slot="calendar-scroller"
        onScroll={grow}
        className={cn(scroll && "h-[var(--calendar-height,22.5rem)] overflow-y-auto overflow-x-hidden overscroll-contain px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden")}
      >
        <DayPicker
          mode="multiple"
          selected={picked}
          // RDP only treats `selected` as controlled when it is given an onSelect.
          onSelect={noop}
          month={span.start}
          onMonthChange={(m) => {
            if (scroll) goTo(m, true);
            else setSpan({ start: m, end: addMonths(m, numberOfMonths - 1) });
          }}
          numberOfMonths={scroll ? count : numberOfMonths}
          startMonth={min}
          endMonth={max}
          hideNavigation={scroll}
          hideWeekdays={scroll}
          showOutsideDays={false}
          showWeekNumber={weekNumbers}
          ISOWeek={weekNumbers && weekStartsOn === 1}
          weekStartsOn={weekStartsOn}
          locale={locale}
          dir={dir}
          today={today}
          disabled={blocked}
          modifiers={modifiers}
          onDayClick={(day, m, e) => !m.disabled && pick(day, e)}
          onDayFocus={(day) => preview(day)}
          components={{
            Day: CalendarDay,
            DayButton: CalendarDayButton,
            Month: CalendarMonth,
            MonthCaption,
            MonthGrid: CalendarMonthGrid,
            Chevron: CalendarChevron,
          }}
          classNames={{
            root: "relative",
            months: cn("flex", scroll ? "flex-col" : "gap-6"),
            // The last month before max fills the scroller, so its heading can reach the top.
            month: cn("flex flex-col", scroll && max && span.end >= addMonths(max, 0) && "last:min-h-[var(--calendar-height,22.5rem)]"),
            month_grid: "w-full border-collapse",
            weekdays: weekNumbers ? gridWithWeeks : grid,
            weekday: "pb-2 text-center text-xs font-normal text-muted-foreground",
            weeks: "flex flex-col gap-0.5 pb-2",
            week: cn(weekNumbers ? gridWithWeeks : grid, "[&>td]:p-0"),
            week_number_header: "w-6",
            week_number: "flex items-center justify-center text-[0.6875rem] tabular-nums text-muted-foreground",
            day: "p-0 text-center",
            nav: "pointer-events-none absolute inset-x-0 top-0 flex h-9 items-center justify-between",
            button_previous: "pointer-events-auto inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-40",
            button_next: "pointer-events-auto inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-40",
          }}
        />
      </div>
      {scroll && todayInRange && (
        <button
          type="button"
          data-slot="calendar-today"
          hidden={!todayHidden}
          tabIndex={todayHidden ? 0 : -1}
          onClick={() => goTo(today, true)}
          className={cn(
            "absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium shadow-sm",
            "transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
            "hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
        >
          Today
        </button>
      )}
      {name && (values.length ? values : [""]).map((v, i) => <input key={i} type="hidden" name={name} value={v} required={required} />)}
    </div>
    </PreviewContext.Provider>
    </ModeContext.Provider>
  );
});
Calendar.displayName = "Calendar";

export {
  Calendar,
  parseDate,
  dayFirst,
  startOfDay,
  addDays,
  addMonths,
  isSameDay,
  daysBetween,
  monthsBetween,
  isoWeek,
  toISODate,
  fromISODate,
};
