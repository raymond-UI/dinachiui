"use client"

import * as React from "react";
import { format, type Locale } from "date-fns";
import { cn } from "@/lib/utils";
import { changeAsAgent, useAgentControl, useAgentState, useHasAgent, useMergedRef } from "@/components/ui/agent";

/** Minutes since midnight, end exclusive. 10:45 to 12:00 is `{ start: 645, end: 720 }`. */
export interface TimeSlot {
  start: number;
  end: number;
}

export interface TimeSlotsChangeDetails {
  reason: string;
  event?: Event;
  isCanceled: boolean;
  cancel(): void;
}

function changeDetails(reason: string, event?: Event): TimeSlotsChangeDetails {
  const details: TimeSlotsChangeDetails = {
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

/** `horizontal` from 768px up, `vertical` below, unless one is asked for. */
function useLayout(layout: "auto" | "horizontal" | "vertical"): "horizontal" | "vertical" {
  const wide = React.useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia?.(WIDE);
      query?.addEventListener("change", onChange);
      return () => query?.removeEventListener("change", onChange);
    },
    () => window.matchMedia?.(WIDE).matches ?? true,
    () => true
  );
  return layout === "auto" ? (wide ? "horizontal" : "vertical") : layout;
}

const pad = (n: number) => String(n).padStart(2, "0");
/** 24-hour HH:MM, the form an agent reads and sends. */
const hhmm = (m: number) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
const length = (n: number) => (n < 60 ? `${n} min` : `${Math.floor(n / 60)} h${n % 60 ? ` ${n % 60} min` : ""}`);

/** "10:45", "9", "2pm" or minutes, as minutes since midnight. */
function readTime(t: unknown): number | null {
  if (typeof t === "number") return Number.isInteger(t) ? t : null;
  const m = /^(\d{1,2})(?::(\d{2}))?\s*(?:([ap])\.?m\.?)?$/i.exec(String(t).trim());
  if (!m) return null;
  const [h, min] = [+m[1], +(m[2] ?? 0)];
  if (min > 59 || (m[3] ? h < 1 || h > 12 : h > 24 || (h === 24 && min))) return null;
  return ((m[3] ? h % 12 : h) + (m[3]?.toLowerCase() === "p" ? 12 : 0)) * 60 + min;
}

const BUSY = "color-mix(in srgb, var(--foreground) 13%, var(--background))";
const PAST = "color-mix(in srgb, var(--foreground) 4%, transparent)";

export interface TimeSlotsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange" | "dir"> {
  /** The booking, in minutes since midnight. */
  value?: TimeSlot | null;
  defaultValue?: TimeSlot | null;
  onValueChange?: (value: TimeSlot | null, details: TimeSlotsChangeDetails) => void;
  /** Named beside the booking. Times are shown as given; nothing converts between zones. */
  timeZone: string;
  /** Where the day starts, in minutes. Defaults to 08:00. */
  min?: number;
  /** Where the day ends, in minutes. Defaults to 20:00. */
  max?: number;
  /** Minutes a booking snaps to. Defaults to 15. */
  step?: number;
  /** Taken time. A booking can't cross it. */
  busy?: TimeSlot[];
  /** The time now, in minutes. Time before it is shaded and can't be booked. */
  now?: number;
  /** Defaults to one step. */
  minDuration?: number;
  maxDuration?: number;
  /** The day being booked, named above the track. */
  date?: Date;
  /** How a time reads. Defaults to 24-hour HH:MM. */
  formatTime?: (minutes: number) => string;
  /** `horizontal`: a track to drag across. `vertical`: half-hour rows to tap. `auto` switches at 768px. */
  layout?: "auto" | "horizontal" | "vertical";
  /** A date-fns locale, for the day's name. */
  locale?: Locale;
  dir?: "ltr" | "rtl";
  disabled?: boolean;
  /** Submits the booking as HH:MM/HH:MM. */
  name?: string;
  required?: boolean;
  /** Sits beside the readout, such as a Book button. */
  children?: React.ReactNode;
}

/**
 * A day as a track. Drag across free time to book it, drag either end to resize it. Busy
 * time and time already past stop the drag. Below 768px the day turns into rows to tap.
 */
const TimeSlots = React.forwardRef<HTMLDivElement, TimeSlotsProps>((props, ref) => {
  const {
    value: valueProp,
    defaultValue,
    onValueChange,
    timeZone,
    min = 8 * 60,
    max = 20 * 60,
    step: stepProp = 15,
    busy = [],
    now,
    minDuration = 0,
    maxDuration = max - min,
    date,
    formatTime = hhmm,
    layout: layoutProp = "auto",
    locale,
    dir,
    disabled,
    name,
    required,
    children,
    className,
    "aria-label": ariaLabel = "Booking",
    ...rest
  } = props;
  const hasAgent = useHasAgent();
  const layout = useLayout(layoutProp);
  const [value, change] = useAgentState<TimeSlot | null, TimeSlotsChangeDetails>(valueProp, defaultValue ?? null, onValueChange);
  const root = React.useRef<HTMLDivElement>(null);
  const track = React.useRef<HTMLDivElement>(null);
  const list = React.useRef<HTMLDivElement>(null);

  const span = max - min;
  // Everything a booking can touch sits on the step grid, so the track and an agent agree.
  const step = Math.max(1, Math.round(stepProp));
  const snapDown = (m: number) => min + Math.floor((m - min) / step) * step;
  const snapUp = (m: number) => min + Math.ceil((m - min) / step) * step;
  const top = snapDown(max);
  const minDur = Math.max(step, snapUp(min + minDuration) - min);
  const maxDur = Math.max(minDur, snapDown(min + maxDuration) - min);
  const blocks: [number, number][] = busy.map((b) => [snapDown(b.start), snapUp(b.end)]);
  if (now !== undefined && now > min) blocks.push([min, snapUp(now)]);
  const fits = (a: number, b: number) =>
    a >= min && b <= top && b - a >= minDur && b - a <= maxDur && !blocks.some(([x, y]) => a < y && b > x);
  /** The free stretch around a minute. */
  const gap = (at: number): [number, number] => {
    let lo = min;
    let hi = top;
    for (const [x, y] of blocks) {
      if (y <= at) lo = Math.max(lo, y);
      if (x > at) hi = Math.min(hi, x);
    }
    return [lo, hi];
  };
  /** The nearest start, from `from` in `dir`, where `len` fits. */
  const seek = (from: number, len: number, way: number) => {
    for (let s = from; s >= min && s + len <= top; s += way * step) if (fits(s, s + len)) return s;
    return null;
  };

  const set = (next: TimeSlot | null, reason: string, event?: Event) => {
    if (disabled || (next ? next.start === value?.start && next.end === value?.end : !value)) return;
    change(next, changeDetails(reason, event));
  };

  const read = value ? `${formatTime(value.start)} to ${formatTime(value.end)} ${timeZone}` : "";
  const pct = (m: number) => `${((m - min) / span) * 100}%`;

  const isRtl = () => root.current?.closest("[dir]")?.getAttribute("dir") === "rtl";

  /* ---- horizontal: drag ---- */
  const drag = React.useRef<{ anchor: number; lo: number; hi: number } | null>(null);
  const at = (e: React.PointerEvent) => {
    const r = track.current!.getBoundingClientRect();
    const rtl = isRtl();
    const x = (rtl ? r.right - e.clientX : e.clientX - r.left) / r.width;
    return Math.max(min, Math.min(top, min + Math.round((x * span) / step) * step));
  };
  const onPointerDown = (e: React.PointerEvent) => {
    if (disabled || e.button !== 0) return;
    const edge = (e.target as Element).closest("[data-edge]")?.getAttribute("data-edge");
    if (value && edge) {
      const anchor = edge === "start" ? value.end : value.start;
      const [lo, hi] = gap(edge === "start" ? anchor - 1 : anchor);
      drag.current = { anchor, lo, hi };
    } else {
      const m = at(e);
      // Near the end of a free stretch, the booking runs back from the press instead.
      const back = !fits(m, m + minDur);
      if (back && !fits(m - minDur, m)) return;
      const [lo, hi] = gap(back ? m - 1 : m);
      drag.current = { anchor: m, lo, hi };
      set(back ? { start: m - minDur, end: m } : { start: m, end: m + minDur }, "drag", e.nativeEvent);
    }
    e.currentTarget.setPointerCapture?.(e.pointerId);
    (e.currentTarget as HTMLElement).focus();
    e.preventDefault();
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const m = Math.max(d.lo, Math.min(d.hi, at(e)));
    const len = Math.min(maxDur, Math.max(minDur, Math.abs(m - d.anchor)));
    const next = m >= d.anchor ? { start: d.anchor, end: Math.min(d.hi, d.anchor + len) } : { start: Math.max(d.lo, d.anchor - len), end: d.anchor };
    if (fits(next.start, next.end)) set(next, "drag", e.nativeEvent);
  };
  const endDrag = () => (drag.current = null);

  /* ---- horizontal: keys ---- */
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    const rtl = isRtl();
    const hour = Math.max(step, Math.round(60 / step) * step);
    const n = { ArrowLeft: rtl ? step : -step, ArrowRight: rtl ? -step : step, ArrowDown: -step, ArrowUp: step, PageDown: -hour, PageUp: hour }[e.key];
    // A value set from outside may be off the grid; the keys bring it back on.
    const base = value && snapDown(value.start + step / 2);
    const len = value ? Math.min(maxDur, Math.max(minDur, Math.round((value.end - value.start) / step) * step)) : minDur;
    let start: number | null | undefined;
    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      return set(null, "keyboard", e.nativeEvent);
    }
    if (e.key === "Home") start = seek(min, len, 1);
    else if (e.key === "End") start = seek(snapDown(top - len), len, -1);
    else if (n === undefined) return;
    else if (base === null) start = seek(min, len, 1);
    else if (e.shiftKey && Math.abs(n) === step) {
      e.preventDefault();
      const end = base + len + n;
      return fits(base, end) && set({ start: base, end }, "keyboard", e.nativeEvent);
    } else start = seek(base + n, len, Math.sign(n));
    e.preventDefault();
    if (start != null) set({ start, end: start + len }, "keyboard", e.nativeEvent);
  };

  /* ---- vertical: rows ---- */
  const row = Math.ceil(30 / step) * step;
  const rows: number[] = [];
  for (let m = min; m < top; m += row) rows.push(m);
  /** What tapping a row books: the row, stretched or cut to the allowed length. */
  const rowEnd = (m: number) => Math.min(top, m + Math.min(maxDur, Math.max(row, minDur)));
  const busyAt = (m: number) => busy.find((b) => m < b.end && m + row > b.start);
  const pastAt = (m: number) => now !== undefined && m < now;
  const onAt = (m: number) => !!value && m < value.end && m + row > value.start;
  const press = (m: number, e: React.MouseEvent) => {
    // A booking no longer than one tap makes is cleared by tapping it.
    if (onAt(m) && value!.end - value!.start <= Math.max(row, minDur)) return set(null, "row-press", e.nativeEvent);
    // A later row stretches the booking to it, if nothing is in the way.
    if (value && m >= value.end && fits(value.start, Math.min(top, m + row))) {
      return set({ start: value.start, end: Math.min(top, m + row) }, "row-press", e.nativeEvent);
    }
    if (fits(m, rowEnd(m))) set({ start: m, end: rowEnd(m) }, "row-press", e.nativeEvent);
  };
  const free = rows.filter((m) => fits(m, rowEnd(m)));
  const rowStop = (value && rows.find((m) => m + row > value.start)) ?? free[0] ?? rows[0];
  const onRowKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const n = { ArrowUp: -1, ArrowDown: 1, Home: -rows.length, End: rows.length }[e.key];
    if (n === undefined) return;
    e.preventDefault();
    const all = [...e.currentTarget.querySelectorAll<HTMLElement>("[data-slot=time-slots-row] button")];
    const i = all.indexOf(document.activeElement as HTMLElement);
    all[Math.max(0, Math.min(all.length - 1, i + n))]?.focus();
  };
  // Opens on the booking, or on now.
  React.useLayoutEffect(() => {
    const at = value?.start ?? now ?? min;
    const el = list.current?.querySelector<HTMLElement>(`[data-minute="${rows.find((m) => m + row > at) ?? min}"]`)?.parentElement?.parentElement;
    if (list.current && el) list.current.scrollTop = el.offsetTop - list.current.offsetTop;
  }, [layout]);

  /* ---- agent ---- */
  useAgentControl(() => ({
    kind: "slider",
    element: root.current,
    value: value ? [hhmm(value.start), hhmm(value.end)] : undefined,
    disabled,
    actions: {
      setValue: (wanted: unknown) => {
        if (wanted === null || wanted === "") return changeAsAgent((_: null, d: TimeSlotsChangeDetails) => value && change(null, d), null);
        const pair =
          wanted && typeof wanted === "object" && !Array.isArray(wanted)
            ? [(wanted as TimeSlot).start, (wanted as TimeSlot).end]
            : Array.isArray(wanted) ? [...wanted] : String(wanted).split(/\s*(?:to|until|-|–|\/)\s*/i);
        // "2 to 3pm": the start takes the end's am or pm.
        const mer = /[ap]\.?m\.?$/i.exec(String(pair[1]))?.[0];
        if (mer && typeof pair[0] === "string" && !/[ap]/i.test(pair[0])) pair[0] += mer;
        const [a, b] = pair.map(readTime);
        if (pair.length !== 2 || a == null || b == null || b <= a) return `${JSON.stringify(wanted)} is not a span of time. Send ["10:45", "12:00"].`;
        if (a < min || b > top) return `The day runs ${hhmm(min)} to ${hhmm(top)}.`;
        if ((a - min) % step || (b - min) % step) return `Times go in steps of ${step} min.`;
        if (now !== undefined && a < now) return `${hhmm(a)} has passed. It is ${hhmm(now)}.`;
        const hit = busy.find((x) => a < x.end && b > x.start);
        if (hit) return `${hhmm(hit.start)} to ${hhmm(hit.end)} is busy.`;
        if (!fits(a, b)) return `A booking runs ${length(minDur)} to ${length(maxDur)}.`;
        return changeAsAgent((next: TimeSlot, d: TimeSlotsChangeDetails) => {
          if (next.start !== value?.start || next.end !== value?.end) change(next, d);
        }, { start: a, end: b });
      },
    },
  }));

  /* ---- render ---- */
  const hours: number[] = [];
  for (let h = Math.ceil((min + 1) / 60) * 60; h < max; h += 60) hours.push(h);
  const every = span > 6 * 60 ? 120 : 60;
  const ticks: number[] = [];
  for (let t = Math.ceil(min / every) * every; t <= max; t += every) ticks.push(t);
  const pastShown = now !== undefined && now > min;
  const nowShown = pastShown && now < max;
  const shownBusy = busy.filter((b) => b.end > min && b.start < max);

  return (
    <div
      {...rest}
      ref={useMergedRef(ref, root)}
      role="group"
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      dir={dir}
      data-slot="time-slots"
      data-layout={layout}
      className={cn("relative flex w-full flex-col", layout === "vertical" && "max-h-[28rem]", disabled && "opacity-50", className)}
    >
      {date && (
        <div data-slot="time-slots-heading" className="mb-3.5 text-[0.9375rem] font-semibold">
          {format(date, "EEEE d MMMM", { locale })}
        </div>
      )}
      {layout === "horizontal" ? (
        <>
          <div
            ref={track}
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-label={ariaLabel}
            aria-orientation="horizontal"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value?.start ?? min}
            aria-valuetext={value ? `${read}, ${length(value.end - value.start)}` : "No time picked"}
            aria-disabled={disabled || undefined}
            data-slot="time-slots-track"
            data-agent-part={hasAgent ? "" : undefined}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onKeyDown={onKeyDown}
            className={cn(
              "relative h-16 cursor-crosshair touch-none select-none rounded-[0.625rem] border bg-background",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              disabled && "cursor-not-allowed"
            )}
          >
            {hours.map((h) => (
              <span key={h} aria-hidden className="absolute inset-y-0 w-px bg-border" style={{ insetInlineStart: pct(h) }} />
            ))}
            {pastShown && (
              <span
                aria-hidden
                data-slot="time-slots-past"
                className="absolute inset-y-0 start-0 cursor-not-allowed rounded-s-[0.5625rem]"
                style={{ width: pct(Math.min(now, max)), background: PAST }}
              />
            )}
            {shownBusy.map((b, i) => (
              <span
                key={i}
                aria-hidden
                data-slot="time-slots-busy"
                className="absolute inset-y-1.5 cursor-not-allowed rounded-md"
                style={{ insetInlineStart: pct(Math.max(min, b.start)), width: pct(min + Math.min(max, b.end) - Math.max(min, b.start)), background: BUSY }}
              />
            ))}
            {nowShown && (
              <span aria-hidden data-slot="time-slots-now" className="absolute -inset-y-1 w-0.5 rounded-sm bg-destructive" style={{ insetInlineStart: pct(now) }} />
            )}
            {value && (
              <span
                aria-hidden
                data-slot="time-slots-pick"
                className="absolute inset-y-1 rounded-lg bg-primary transition-[inset-inline-start,width] duration-[60ms] ease-linear motion-reduce:transition-none"
                style={{ insetInlineStart: pct(value.start), width: pct(min + value.end - value.start) }}
              >
                {(["start", "end"] as const).map((edge) => (
                  <span
                    key={edge}
                    data-edge={edge}
                    data-slot="time-slots-handle"
                    // Overhanging the ends, so a short booking keeps both handles.
                    className={cn("absolute inset-y-0 flex w-3 cursor-ew-resize items-center", edge === "start" ? "-start-1 justify-end" : "-end-1 justify-start")}
                  >
                    <span className="h-4 w-[3px] rounded-sm bg-primary-foreground/60" />
                  </span>
                ))}
              </span>
            )}
          </div>
          <div aria-hidden className="relative mt-1.5 h-[1.125rem] text-[0.6875rem] tabular-nums text-muted-foreground">
            {ticks.map((t) => (
              <span
                key={t}
                className={cn(
                  "absolute",
                  t === min ? "" : t === max ? "-translate-x-full rtl:translate-x-full" : "-translate-x-1/2 rtl:translate-x-1/2"
                )}
                style={{ insetInlineStart: pct(t) }}
              >
                {formatTime(t)}
              </span>
            ))}
          </div>
        </>
      ) : (
        <div ref={list} data-slot="time-slots-rows" onKeyDown={onRowKey} className="min-h-0 flex-1 overflow-y-auto">
          {rows.map((m) => {
            const past = pastAt(m);
            const taken = !past && busyAt(m);
            const on = onAt(m);
            // Free but too short to book, and not a stretch of the booking either.
            const held =
              !on && !past && !taken && !fits(m, rowEnd(m)) && !(value && m >= value.end && fits(value.start, Math.min(top, m + row)));
            // Neighbours in the same run join into one block.
            const joins = (n: number) =>
              n >= min && n < top && (on ? onAt(n) : !!taken && busyAt(n) === taken && !pastAt(n));
            const up = (on || taken) && joins(m - row);
            const down = (on || taken) && joins(m + row);
            return (
              <div key={m} data-slot="time-slots-row" className="grid h-11 grid-cols-[3.25rem_1fr]">
                <span aria-hidden className={cn("pt-0.5 text-xs tabular-nums text-muted-foreground", past && "opacity-50")}>
                  {m % 60 ? "" : formatTime(m)}
                </span>
                <div className="relative border-t">
                  <button
                    type="button"
                    data-minute={m}
                    data-agent-part={hasAgent ? "" : undefined}
                    data-state={on ? "on" : past || held ? "past" : taken ? "busy" : "free"}
                    aria-label={`${formatTime(m)}, ${on ? "booked" : past ? "past" : taken ? "busy" : held ? "unavailable" : "free"}`}
                    aria-pressed={on}
                    aria-disabled={(!on && (past || !!taken || held)) || disabled || undefined}
                    tabIndex={m === rowStop ? 0 : -1}
                    onClick={(e) => (on || !(past || taken || held)) && press(m, e)}
                    className={cn(
                      "absolute inset-x-0 inset-y-[3px] rounded-lg px-2.5 text-start text-[0.8125rem] text-muted-foreground",
                      "hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
                      "data-[state=busy]:cursor-not-allowed data-[state=past]:inset-0 data-[state=past]:cursor-not-allowed data-[state=past]:rounded-none",
                      up && "-top-px rounded-t-none",
                      down && "-bottom-px rounded-b-none"
                    )}
                    style={on ? undefined : taken ? { background: BUSY } : past || held ? { background: PAST } : undefined}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div data-slot="time-slots-footer" className={cn("mt-3.5 flex items-center gap-2.5", layout === "vertical" && "mt-2 border-t pt-3")}>
        {/* The slider announces its own value; rows have no value, so the readout speaks for them. */}
        <p data-slot="time-slots-readout" aria-live={layout === "vertical" ? "polite" : undefined} className="min-h-5 flex-1 text-[0.8125rem]">
          {value ? (
            <>
              {read}
              {layout === "vertical" ? <br /> : " "}
              <span className="text-muted-foreground">
                {layout === "horizontal" && "· "}
                {length(value.end - value.start)}
              </span>
            </>
          ) : (
            <span className="text-muted-foreground">{layout === "horizontal" ? "Drag across free time" : `Tap a free ${row === 30 ? "half hour" : length(row)}`}</span>
          )}
        </p>
        {children}
      </div>
      {(name || required) && (
        <input
          aria-hidden
          tabIndex={-1}
          name={name}
          required={required}
          disabled={disabled}
          value={value ? `${hhmm(value.start)}/${hhmm(value.end)}` : ""}
          onChange={() => {}}
          onFocus={() => root.current?.querySelector<HTMLElement>("[role=slider], [data-minute][tabindex='0']")?.focus()}
          className="pointer-events-none absolute bottom-0 start-0 size-px opacity-0"
        />
      )}
    </div>
  );
});
TimeSlots.displayName = "TimeSlots";

export { TimeSlots };
