"use client"

import * as React from "react";
import { format, type Locale } from "date-fns";
import { CalendarDays, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Agent, AgentProvider, changeAsAgent, useAgentControl, useAgentState, useMergedRef } from "@/components/ui/agent";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  type CalendarChangeDetails,
  type DateRange,
  addDays,
  dayFirst,
  daysBetween,
  fromISODate,
  isSameDay,
  parseDate,
  startOfDay,
  toISODate,
} from "@/components/ui/calendar";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Popover, PopoverPopup, PopoverPortal, PopoverPositioner, PopoverTrigger } from "@/components/ui/popover";

/** The picker is one control to an agent, so the parts inside it don't register their own. */
const Unlisted = ({ children }: { children: React.ReactNode }) => (
  <AgentProvider agent={null as unknown as Agent}>{children}</AgentProvider>
);

const WIDE = "(min-width: 768px)";
const EMPTY: DateRange = { from: null, to: null };

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

const sameRange = (a: DateRange, b: DateRange) => isSameDay(a.from, b.from) && isSameDay(a.to, b.to);

export interface DateRangePreset {
  label: string;
  value: DateRange;
}

/** Today, yesterday, the last 7 and 30 days, this month so far and last month. */
export function pastPresets(today: Date): DateRangePreset[] {
  const t = startOfDay(today);
  const y = t.getFullYear();
  const m = t.getMonth();
  return [
    { label: "Today", value: { from: t, to: t } },
    { label: "Yesterday", value: { from: addDays(t, -1), to: addDays(t, -1) } },
    { label: "Last 7 days", value: { from: addDays(t, -6), to: t } },
    { label: "Last 30 days", value: { from: addDays(t, -29), to: t } },
    { label: "This month", value: { from: new Date(y, m, 1), to: t } },
    { label: "Last month", value: { from: new Date(y, m - 1, 1), to: new Date(y, m, 0) } },
  ];
}

export interface DateRangePickerProps
  extends Omit<React.ComponentProps<"button">, "value" | "defaultValue" | "onChange" | "dir" | "children" | "type"> {
  value?: DateRange;
  defaultValue?: DateRange;
  /** Called on Apply, not while a range is being picked. */
  onValueChange?: (value: DateRange, details: CalendarChangeDetails) => void;
  min?: Date;
  max?: Date;
  isDateDisabled?: (date: Date) => boolean;
  weekNumbers?: boolean;
  locale?: Locale;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  dir?: "ltr" | "rtl";
  /** Defaults to the current day. */
  today?: Date;
  /** Ranges one press away. Defaults to `pastPresets(today)`; pass `[]` for none. */
  presets?: DateRangePreset[];
  /** How a range reads on the trigger and in the footer. Defaults to `11 to 17 Nov 2026`. */
  formatRange?: (range: { from: Date; to: Date }) => string;
  /** `auto` uses a popover from 768px up and a drawer below. */
  presentation?: "auto" | "popover" | "drawer";
  /** Names the popover and titles the drawer. */
  label?: string;
  placeholder?: string;
  /** Submits the range as YYYY-MM-DD/YYYY-MM-DD. */
  name?: string;
  required?: boolean;
}

/**
 * A button that names the range it holds, opening presets beside a calendar. Nothing
 * changes until Apply; Cancel, Esc and a click outside leave the range as it was.
 */
const DateRangePicker = React.forwardRef<HTMLButtonElement, DateRangePickerProps>((props, ref) => {
  const {
    value: valueProp,
    defaultValue,
    onValueChange,
    min,
    max,
    isDateDisabled,
    weekNumbers,
    locale,
    weekStartsOn = locale?.options?.weekStartsOn ?? 1,
    dir,
    today: todayProp,
    presets: presetsProp,
    formatRange,
    presentation: presentationProp = "auto",
    label = "Date range",
    placeholder = "Pick dates",
    name,
    required,
    disabled,
    className,
    "aria-label": name_,
    ...buttonProps
  } = props;

  const today = React.useMemo(() => startOfDay(todayProp ?? new Date()), [todayProp ? toISODate(todayProp) : null]);
  const presentation = usePresentation(presentationProp);
  const [value, change] = useAgentState<DateRange, CalendarChangeDetails>(valueProp, defaultValue ?? EMPTY, onValueChange);
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<DateRange>(value);
  const [custom, setCustom] = React.useState(false);
  const trigger = React.useRef<HTMLButtonElement>(null);

  const fmtDay = (d: Date) => format(d, "d MMM", { locale });
  const fmt =
    formatRange ??
    (({ from, to }: { from: Date; to: Date }) => {
      const end = format(to, "d MMM yyyy", { locale });
      if (isSameDay(from, to)) return format(to, "EEE, d MMM yyyy", { locale });
      if (from.getFullYear() !== to.getFullYear()) return `${format(from, "d MMM yyyy", { locale })} to ${end}`;
      return `${format(from, from.getMonth() === to.getMonth() ? "d" : "d MMM", { locale })} to ${end}`;
    });

  /** Why `d` can't be in a range. */
  const refusal = (d: Date): string | null => {
    if (min && d < startOfDay(min)) return `The earliest is ${toISODate(startOfDay(min))}.`;
    if (max && d > startOfDay(max)) return `The latest is ${toISODate(startOfDay(max))}.`;
    if (isDateDisabled?.(d)) return `${toISODate(d)} can't be picked.`;
    return null;
  };
  const rangeRefusal = (r: DateRange): string | null => {
    const ends = refusal(r.from!) ?? refusal(r.to!);
    if (ends) return ends;
    for (let d = addDays(r.from!, 1); d < r.to!; d = addDays(d, 1)) {
      if (isDateDisabled?.(d)) return `The range can't run across ${toISODate(d)}, which can't be picked.`;
    }
    return null;
  };
  const presets = (presetsProp ?? pastPresets(today)).filter((p) => p.value.from && p.value.to && !rangeRefusal(p.value));

  const presetOf = (r: DateRange) => presets.find((p) => sameRange(p.value, r));
  const picked = custom ? undefined : presetOf(draft);
  const applied = presetOf(value);
  const complete = !!(value.from && value.to);

  const openWith = (next: boolean) => {
    if (next) {
      setDraft(value);
      setCustom(complete && !applied);
    }
    setOpen(next);
  };
  const apply = () => {
    if (!sameRange(draft, value)) change(draft, changeDetails("apply"));
    setOpen(false);
  };
  const pickPreset = (p?: DateRangePreset) => {
    setCustom(!p);
    setDraft(p ? p.value : EMPTY);
  };

  /* ---- agent ---- */
  const read = (text: string) =>
    fromISODate(text) ?? parseDate(text, { today, order: dayFirst(locale) ? "day-first" : "month-first", weekStartsOn });
  const commit = (r: DateRange, details: CalendarChangeDetails) => change(r, details);
  useAgentControl(() => ({
    kind: "date",
    element: trigger.current,
    value: complete ? [toISODate(value.from!), toISODate(value.to!)] : undefined,
    multiple: true,
    disabled,
    required,
    items: presets.map((p) => p.label),
    actions: {
      setValue: (wanted: unknown) => {
        const preset = typeof wanted === "string" && presets.find((p) => p.label.toLowerCase() === wanted.trim().toLowerCase());
        if (preset) return changeAsAgent(commit, preset.value);
        const parts = Array.isArray(wanted)
          ? wanted
          : typeof wanted === "string"
            ? /^\d{4}-\d\d-\d\d\/\d{4}-\d\d-\d\d$/.test(wanted.trim()) ? wanted.split("/") : wanted.split(/\s*,\s*|\s+to\s+/i)
            : [];
        const [from, to] = parts.map((p) => (p instanceof Date ? (isNaN(p.getTime()) ? null : startOfDay(p)) : typeof p === "string" ? read(p) : null));
        if (parts.length !== 2 || !from || !to)
          return `Send two dates, as ["YYYY-MM-DD", "YYYY-MM-DD"] or "21 nov to 24 nov", or one of: ${presets.map((p) => p.label).join(", ")}.`;
        if (to < from) return `The end, ${toISODate(to)}, has to be on or after the start, ${toISODate(from)}.`;
        return rangeRefusal({ from, to }) ?? changeAsAgent(commit, { from, to });
      },
      clear: () => changeAsAgent(commit, EMPTY),
    },
  }));

  /* ---- render ---- */
  const triggerButton = (
    <button
      {...buttonProps}
      ref={useMergedRef(ref, trigger)}
      type="button"
      disabled={disabled}
      data-slot="date-range-picker"
      data-agent-label={name_}
      className={cn(
        "inline-flex h-9 max-w-full items-center gap-2 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs dark:bg-input/30",
        "hover:bg-accent focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
    >
      <CalendarDays className="size-4 shrink-0 text-muted-foreground" aria-hidden />
      {/* Named this way, the button still reads out the range it holds. */}
      {name_ && <span className="sr-only">{name_}:</span>}{" "}
      <span className={cn("truncate font-medium", !complete && "font-normal text-muted-foreground")}>
        {applied ? applied.label : complete ? fmt({ from: value.from!, to: value.to! }) : placeholder}
      </span>{" "}
      {applied && <span className="truncate text-muted-foreground">{fmt({ from: value.from!, to: value.to! })}</span>}
      <ChevronDown className="ms-auto size-4 shrink-0 text-muted-foreground" aria-hidden />
    </button>
  );

  const [hover, setHover] = React.useState<DateRange | null>(null);
  const shown = draft.from && !draft.to && hover?.from && hover.to ? hover : draft;
  const count = shown.from && shown.to ? daysBetween(shown.from, shown.to) + 1 : 0;
  const readout = !shown.from ? (
    <span className="text-muted-foreground">Pick a start</span>
  ) : !shown.to ? (
    <>
      {fmtDay(shown.from)} <span className="text-muted-foreground">to ...</span>
    </>
  ) : (
    <>
      {fmt({ from: shown.from, to: shown.to })}
      {presentation === "drawer" ? <br /> : " "}
      <span className="text-muted-foreground">
        {presentation === "popover" && "· "}
        {count} {count === 1 ? "day" : "days"}
      </span>
    </>
  );

  const choices = [...presets, { label: "Custom", value: EMPTY }].map((p, i) => {
    const isCustom = i === presets.length;
    return (
      <button
        key={p.label}
        type="button"
        aria-pressed={isCustom ? !picked && (custom || !!draft.from) : picked === p}
        data-slot="date-range-picker-preset"
        onClick={() => pickPreset(isCustom ? undefined : p)}
        className={cn(
          "shrink-0 whitespace-nowrap text-[0.8125rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          presentation === "popover"
            ? "rounded-md px-2.5 py-1.5 text-start hover:bg-accent aria-pressed:bg-secondary aria-pressed:font-medium"
            : "rounded-full border border-border bg-background px-3 py-1.5 aria-pressed:border-transparent aria-pressed:bg-primary aria-pressed:text-primary-foreground"
        )}
      >
        {p.label}
      </button>
    );
  });

  const calendar = (height: string) => (
    <Calendar
      mode="range"
      min={min}
      max={max}
      isDateDisabled={isDateDisabled}
      weekNumbers={weekNumbers}
      locale={locale}
      weekStartsOn={weekStartsOn}
      dir={dir}
      today={today}
      value={draft}
      onValueChange={(r) => {
        setCustom(true);
        setDraft(r);
      }}
      onPreview={setHover}
      className={cn("w-full", height)}
    />
  );

  return (
    <>
      <Unlisted>
        {presentation === "popover" ? (
          <Popover open={open} onOpenChange={openWith}>
            <PopoverTrigger render={triggerButton} />
            <PopoverPortal>
              <PopoverPositioner align="start" sideOffset={6}>
                <PopoverPopup aria-label={label} data-slot="date-range-picker-popup" dir={dir} className="grid grid-cols-[9.375rem_18.75rem] p-0">
                  <div data-slot="date-range-picker-presets" className="flex flex-col gap-0.5 border-e p-2">
                    {choices}
                  </div>
                  <div className="p-2">{calendar("[--calendar-height:20rem]")}</div>
                  <div className="col-span-2 flex items-center gap-2 border-t px-3 py-2.5">
                    <p data-slot="date-range-picker-readout" aria-live="polite" className="me-auto text-[0.8125rem]">
                      {readout}
                    </p>
                    <Button variant="ghost" size="sm" data-slot="date-range-picker-cancel" onClick={() => setOpen(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" data-slot="date-range-picker-apply" disabled={!draft.to} onClick={apply}>
                      Apply
                    </Button>
                  </div>
                </PopoverPopup>
              </PopoverPositioner>
            </PopoverPortal>
          </Popover>
        ) : (
          <Drawer open={open} onOpenChange={openWith}>
            <DrawerTrigger render={triggerButton} />
            <DrawerContent side="bottom" data-slot="date-range-picker-popup" dir={dir} className="max-h-[92dvh] gap-0 rounded-t-2xl px-0 pb-0 pt-4">
              <DrawerTitle className="px-5 pb-3 text-[1.0625rem] font-semibold">{label}</DrawerTitle>
              {presets.length > 0 && (
                <div data-slot="date-range-picker-presets" className="flex gap-2 overflow-x-auto px-5 pb-3 [scrollbar-width:none]">
                  {choices}
                </div>
              )}
              <div className="px-3">{calendar("[--calendar-bg:var(--background)] [--calendar-cell:2.75rem] [--calendar-height:23.75rem]")}</div>
              <div className="mt-1 flex items-center gap-3 border-t px-5 py-3">
                <p data-slot="date-range-picker-readout" aria-live="polite" className="me-auto text-sm">
                  {readout}
                </p>
                <Button data-slot="date-range-picker-apply" disabled={!draft.to} onClick={apply}>
                  Apply
                </Button>
              </div>
            </DrawerContent>
          </Drawer>
        )}
      </Unlisted>
      {(name || required) && (
        <input
          aria-hidden
          tabIndex={-1}
          name={name}
          required={required}
          disabled={disabled}
          value={complete ? `${toISODate(value.from!)}/${toISODate(value.to!)}` : ""}
          onChange={() => {}}
          onFocus={() => trigger.current?.focus()}
          className="pointer-events-none absolute size-px opacity-0"
        />
      )}
    </>
  );
});
DateRangePicker.displayName = "DateRangePicker";

export { DateRangePicker };
