"use client"

import * as React from "react";
import { Input as BaseInput } from "@base-ui/react/input";
import { format, type Locale } from "date-fns";
import { CalendarDays } from "lucide-react";
import { cn } from "@dinachi/core";
import { type Agent, AgentProvider, changeAsAgent, useAgentControl, useAgentState, useMergedRef } from "../agent";
import { Button } from "../button";
import {
  Calendar,
  type CalendarChangeDetails,
  addDays,
  dayFirst,
  daysBetween,
  fromISODate,
  isSameDay,
  parseDate as readDate,
  startOfDay,
  toISODate,
} from "../calendar";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "../drawer";
import { Popover, PopoverPopup, PopoverPortal, PopoverPositioner, PopoverTrigger } from "../popover";

/** The picker is one control to an agent, so the parts inside it don't register their own. */
const Unlisted = ({ children }: { children: React.ReactNode }) => (
  <AgentProvider agent={null as unknown as Agent}>{children}</AgentProvider>
);

const WIDE = "(min-width: 768px)";

/** `popover` from 768px up, `drawer` below, unless one is asked for. */
function usePresentation(presentation: "auto" | "popover" | "drawer"): "popover" | "drawer" {
  const wide = React.useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia?.(WIDE);
      query?.addEventListener("change", onChange);
      return () => query?.removeEventListener("change", onChange);
    },
    () => window.matchMedia?.(WIDE).matches ?? true,
    () => true
  );
  return presentation === "auto" ? (wide ? "popover" : "drawer") : presentation;
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

/** How far `day` is from today in words the browser's language uses: tomorrow, in 4 days. */
function relative(day: Date, today: Date, locale?: Locale): string {
  const n = daysBetween(today, day);
  const words = new Intl.RelativeTimeFormat(locale?.code, { numeric: "auto" });
  if (Math.abs(n) < 60) return words.format(n, "day");
  if (Math.abs(n) < 730) return words.format(Math.round(n / 30.44), "month");
  return words.format(Math.round(n / 365.25), "year");
}

export interface DatePickerPreset {
  label: string;
  value: Date;
}

export interface DatePickerProps
  extends Omit<React.ComponentProps<"input">, "value" | "defaultValue" | "onChange" | "min" | "max" | "type" | "dir" | "children" | "size"> {
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date | null, details: CalendarChangeDetails) => void;
  /** The earliest day that can be picked or typed. */
  min?: Date;
  /** The latest day that can be picked or typed. */
  max?: Date;
  /** Days that can't be picked, besides those outside `min` and `max`. */
  isDateDisabled?: (date: Date) => boolean;
  weekNumbers?: boolean;
  /** A date-fns locale, for names, the first day of the week and how 3/12 is read. */
  locale?: Locale;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  dir?: "ltr" | "rtl";
  /** Defaults to the current day. */
  today?: Date;
  /** Replaces the parser, for other languages or formats. Return null for text that isn't a date. */
  parseDate?: (text: string, options: { today: Date }) => Date | null;
  /** How a committed day reads in the field. Defaults to `Fri, 21 Nov 2026`. */
  formatDate?: (date: Date) => string;
  /** One-tap answers shown on phones. Defaults to today, tomorrow, Saturday, next Monday and in a week. */
  presets?: DatePickerPreset[];
  /** `auto` uses a popover from 768px up and a drawer below. */
  presentation?: "auto" | "popover" | "drawer";
  /** Names the calendar's popover and titles the drawer. */
  label?: string;
  /** The drawer's confirm button. */
  confirmLabel?: string;
}

interface Reading {
  kind: "empty" | "set" | "preview" | "error";
  date?: Date;
  message?: string;
}

/**
 * A date field you type into first: next fri, 21 nov and in 2 weeks all read. The day it
 * reads shows under the field before it commits, on Enter or on leaving the field. The
 * calendar is one button away, in a popover on wide screens and a drawer on phones.
 */
const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>((props, ref) => {
  const {
    value: valueProp,
    defaultValue,
    onValueChange,
    min: minProp,
    max: maxProp,
    isDateDisabled,
    weekNumbers,
    locale,
    weekStartsOn = locale?.options?.weekStartsOn ?? 1,
    dir,
    today: todayProp,
    parseDate,
    formatDate,
    presets: presetsProp,
    presentation: presentationProp = "auto",
    label = "Choose a date",
    confirmLabel = "Set date",
    name,
    required,
    disabled,
    readOnly,
    placeholder = "next fri or 21 nov",
    className,
    onBlur,
    onKeyDown,
    "aria-describedby": describedBy,
    ...inputProps
  } = props;

  const today = React.useMemo(() => startOfDay(todayProp ?? new Date()), [todayProp ? toISODate(todayProp) : null]);
  const min = minProp && startOfDay(minProp);
  const max = maxProp && startOfDay(maxProp);
  const presentation = usePresentation(presentationProp);
  const [value, change] = useAgentState<Date | null, CalendarChangeDetails>(valueProp, defaultValue ?? null, onValueChange);
  const [open, setOpen] = React.useState(false);
  const input = React.useRef<HTMLInputElement>(null);
  const box = React.useRef<HTMLDivElement>(null);
  const hintId = React.useId();

  const fmt = formatDate ?? ((d: Date) => format(d, "EEE, d MMM yyyy", { locale }));
  const read = (text: string) =>
    parseDate ? parseDate(text, { today }) : readDate(text, { today, order: dayFirst(locale) ? "day-first" : "month-first", weekStartsOn });

  /** Why `d` can't be picked, in the words the field shows. */
  const refusal = (d: Date): string | null => {
    if (min && d < min) return isSameDay(min, today) ? `${fmt(d)} has passed.` : `The earliest is ${fmt(min)}.`;
    if (max && d > max) return `The latest is ${fmt(max)}.`;
    if (isDateDisabled?.(d)) return `${fmt(d)} isn't available.`;
    return null;
  };

  const reading = (text: string, current: Date | null): Reading => {
    const t = text.trim();
    if (!t) return { kind: "empty" };
    if (current && text === fmt(current)) return { kind: "set", date: current };
    const d = read(t);
    // Two letters are a word on its way, not a mistake yet.
    if (!d) return t.length > 2 ? { kind: "error", message: "Not a date. Try 21 nov or next fri." } : { kind: "empty" };
    const why = refusal(d);
    return why ? { kind: "error", message: why } : { kind: "preview", date: d };
  };

  /* ---- the field ---- */
  const [text, setText] = React.useState(() => (value ? fmt(value) : ""));
  // A value set from outside, by the app or an agent, rewrites the field.
  const key = value ? toISODate(value) : "";
  const [seen, setSeen] = React.useState(key);
  if (seen !== key) {
    setSeen(key);
    setText(value ? fmt(value) : "");
  }
  const now = reading(text, value);

  React.useEffect(() => {
    input.current?.setCustomValidity(now.kind === "error" ? now.message! : "");
  }, [now.kind, now.message]);

  const commit = (d: Date | null, details: CalendarChangeDetails) => {
    if (!isSameDay(d, value) && (d || value)) change(d, details);
    setText(d ? fmt(d) : "");
  };

  /** Commits what the field reads, if it reads as a day or as nothing. */
  const settle = (event?: Event): boolean => {
    if (now.kind === "set") return true;
    if (now.kind === "error") return false;
    if (now.kind === "empty" && text.trim()) return false;
    commit(now.date ?? null, changeDetails("input-commit", event));
    return true;
  };

  /* ---- agent ---- */
  useAgentControl(() => ({
    kind: "date",
    element: input.current,
    value: value ? toISODate(value) : undefined,
    disabled,
    required,
    invalid: now.kind === "error" || undefined,
    errors: now.kind === "error" ? [now.message!] : undefined,
    actions: {
      setValue: (wanted: unknown) => {
        if (wanted === null || wanted === "") return changeAsAgent(commit, null);
        const d =
          wanted instanceof Date
            ? isNaN(wanted.getTime()) ? null : startOfDay(wanted)
            : typeof wanted === "string" ? fromISODate(wanted) ?? read(wanted) : null;
        if (!d) return `"${String(wanted)}" is not a date. Send YYYY-MM-DD, or a phrase such as next fri.`;
        return refusal(d) ?? changeAsAgent(commit, d);
      },
      clear: () => changeAsAgent(commit, null),
    },
  }));

  /* ---- render ---- */
  const calendarProps = { min, max, isDateDisabled, weekNumbers, locale, weekStartsOn, dir, today };
  const iconButton = (
    <button
      type="button"
      aria-label={value ? `${label}, ${fmt(value)}` : label}
      disabled={disabled || readOnly}
      data-slot="date-picker-trigger"
      className={cn(
        "me-1 inline-flex size-7 shrink-0 items-center justify-center rounded-[calc(var(--radius)-4px)] text-muted-foreground",
        "hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50"
      )}
    >
      <CalendarDays className="size-4" aria-hidden />
    </button>
  );

  return (
    <div data-slot="date-picker" dir={dir} className={cn("w-full", className)}>
      <div
        ref={box}
        data-slot="date-picker-field"
        data-invalid={now.kind === "error" || undefined}
        data-disabled={disabled || undefined}
        className={cn(
          "flex h-9 items-center rounded-md border border-input bg-transparent shadow-xs dark:bg-input/30",
          "transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
          "data-[invalid]:border-destructive data-[invalid]:focus-within:ring-destructive/20",
          "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
        )}
      >
        <BaseInput
          {...inputProps}
          ref={useMergedRef(ref, input)}
          data-slot="date-picker-input"
          autoComplete="off"
          value={text}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={now.kind === "error" || undefined}
          aria-describedby={cn(describedBy, hintId) || undefined}
          onValueChange={(next) => setText(next)}
          onBlur={(e) => {
            settle(e.nativeEvent);
            onBlur?.(e);
          }}
          onKeyDown={(e) => {
            onKeyDown?.(e);
            if (e.defaultPrevented) return;
            if (e.key === "Enter" && now.kind !== "set") {
              e.preventDefault();
              if (settle(e.nativeEvent)) setOpen(false);
            } else if (e.key === "ArrowDown" && !readOnly) {
              e.preventDefault();
              // Commit first, so the calendar opens on the day the field reads.
              settle(e.nativeEvent);
              setOpen(true);
            } else if (e.key === "Escape" && !open && text !== (value ? fmt(value) : "")) {
              setText(value ? fmt(value) : "");
            }
          }}
          className="h-full min-w-0 flex-1 bg-transparent px-3 text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed md:text-sm"
        />
        <Unlisted>
          {presentation === "popover" ? (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger render={iconButton} />
              <PopoverPortal>
                <PopoverPositioner anchor={box} align="start" sideOffset={6}>
                  <PopoverPopup
                    aria-label={label}
                    data-slot="date-picker-popup"
                    initialFocus={() => focusableDay(document)}
                    finalFocus={input}
                    className="p-2"
                  >
                    <Calendar
                      {...calendarProps}
                      required
                      value={value}
                      onValueChange={(d, details) => {
                        commit(d, details);
                        setOpen(false);
                      }}
                      className="[--calendar-height:18.75rem]"
                    />
                  </PopoverPopup>
                </PopoverPositioner>
              </PopoverPortal>
            </Popover>
          ) : (
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger render={iconButton} />
              <DrawerContent side="bottom" data-slot="date-picker-drawer" className="max-h-[92dvh] gap-0 rounded-t-2xl px-0 pb-6 pt-4">
                {open && (
                  <DrawerPick
                    label={label}
                    confirmLabel={confirmLabel}
                    placeholder={placeholder}
                    initial={value}
                    presets={(presetsProp ?? phonePresets(today)).filter((p) => !refusal(p.value))}
                    reading={reading}
                    fmt={fmt}
                    relative={(d) => relative(d, today, locale)}
                    calendarProps={calendarProps}
                    onConfirm={(d) => {
                      commit(d, changeDetails("confirm"));
                      setOpen(false);
                    }}
                  />
                )}
              </DrawerContent>
            </Drawer>
          )}
        </Unlisted>
      </div>
      <p id={hintId} data-slot="date-picker-hint" aria-live="polite" className={cn("mt-1.5 flex min-h-5 items-center gap-2 text-[0.8125rem] text-muted-foreground", now.kind === "error" && "text-destructive")}>
        {now.kind === "error" && now.message}
        {now.kind === "preview" && (
          <>
            <b className="font-medium text-foreground">{fmt(now.date!)}</b>
            <span>{relative(now.date!, today, locale)}</span>
          </>
        )}
        {now.kind === "set" && <span>{relative(now.date!, today, locale)}</span>}
      </p>
      {name && <input type="hidden" name={name} value={value ? toISODate(value) : ""} />}
    </div>
  );
});
DatePicker.displayName = "DatePicker";

function focusableDay(root: ParentNode): HTMLElement | true {
  const days = root.querySelectorAll<HTMLElement>("[data-slot=date-picker-popup] [data-slot=calendar-day][tabindex='0']");
  return days[days.length - 1] ?? true;
}

function phonePresets(today: Date): DatePickerPreset[] {
  const saturday = readDate("sat", { today })!;
  const monday = readDate("next mon", { today })!;
  const all = [
    { label: "Today", value: today },
    { label: "Tomorrow", value: addDays(today, 1) },
    { label: "Saturday", value: saturday },
    { label: "Next Mon", value: monday },
    { label: "In a week", value: addDays(today, 7) },
  ];
  return all.filter((p, i) => all.findIndex((q) => isSameDay(q.value, p.value)) === i);
}

/** The drawer's own field, chips and calendar. Nothing commits until its button is pressed. */
function DrawerPick(props: {
  label: string;
  confirmLabel: string;
  placeholder: string;
  initial: Date | null;
  presets: DatePickerPreset[];
  reading: (text: string, current: Date | null) => Reading;
  fmt: (d: Date) => string;
  relative: (d: Date) => string;
  calendarProps: Omit<React.ComponentProps<typeof Calendar>, "mode" | "value" | "defaultValue" | "onValueChange">;
  onConfirm: (d: Date | null) => void;
}) {
  const { label, confirmLabel, placeholder, initial, presets, reading, fmt, relative, calendarProps, onConfirm } = props;
  const [draft, setDraft] = React.useState(initial);
  const [text, setText] = React.useState(initial ? fmt(initial) : "");
  const now = reading(text, draft);
  const hit = presets.findIndex((p) => isSameDay(p.value, draft));
  const set = (d: Date) => {
    setDraft(d);
    setText(fmt(d));
  };
  return (
    <div className="flex min-h-0 flex-col">
      <DrawerTitle className="px-5 pb-3 text-[1.0625rem] font-semibold">{label}</DrawerTitle>
      <div className="px-5 pb-2.5">
        <BaseInput
          aria-label={label}
          autoComplete="off"
          value={text}
          placeholder={placeholder}
          aria-invalid={now.kind === "error" || undefined}
          onValueChange={(next) => {
            setText(next);
            const r = reading(next, null);
            if (r.kind === "preview") setDraft(r.date!);
          }}
          className={cn(
            "h-12 w-full rounded-xl border border-input bg-background px-3.5 text-[1.0625rem] outline-none placeholder:text-muted-foreground",
            "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive"
          )}
        />
        <p aria-live="polite" className={cn("mt-1.5 flex min-h-5 items-center gap-2 text-[0.8125rem] text-muted-foreground", now.kind === "error" && "text-destructive")}>
          {now.kind === "error" && now.message}
          {now.kind === "preview" && hit < 0 && (
            <>
              <b className="font-medium text-foreground">{fmt(now.date!)}</b>
              <span>{relative(now.date!)}</span>
            </>
          )}
          {/* A lit chip already says when it is. */}
          {now.kind === "set" && hit < 0 && <span>{relative(now.date!)}</span>}
        </p>
      </div>
      {presets.length > 0 && (
        <div data-slot="date-picker-presets" className="flex gap-2 overflow-x-auto px-5 pb-3 [scrollbar-width:none]">
          {presets.map((p, i) => (
            <button
              key={p.label}
              type="button"
              aria-pressed={i === hit}
              data-slot="date-picker-preset"
              onClick={() => set(p.value)}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-full border border-border bg-background px-3 py-1.5 text-[0.8125rem]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "aria-pressed:border-transparent aria-pressed:bg-primary aria-pressed:text-primary-foreground"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
      <div className="flex justify-center px-3">
        <Calendar
          {...calendarProps}
          required
          value={draft}
          onValueChange={(d) => d && set(d)}
          className="w-full [--calendar-bg:var(--background)] [--calendar-cell:2.75rem] [--calendar-height:18.75rem]"
        />
      </div>
      <div className="px-5 pt-3">
        <Button className="w-full" data-slot="date-picker-confirm" disabled={now.kind === "error"} onClick={() => onConfirm(draft)}>
          {confirmLabel}
        </Button>
      </div>
    </div>
  );
}

export { DatePicker };
