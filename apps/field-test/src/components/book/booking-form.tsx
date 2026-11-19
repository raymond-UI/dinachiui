"use client";

import * as React from "react";
import { format } from "date-fns";
import { enGB } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar, parseDate, type DateRange } from "@/components/ui/calendar";
import { DatePicker } from "@/components/ui/date-picker";
import { DateRangePicker, type DateRangePreset } from "@/components/ui/date-range-picker";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TimeSlots, type TimeSlot } from "@/components/ui/time-slots";
import { HOTELS, ROOM_TYPES, hotelName, roomTypeName, type HotelId, type RoomTypeId } from "@/lib/data/hotel";
import { addDays, daysBetween, iso, TODAY } from "@/lib/data/seed";
import { cn } from "@/lib/utils";
import {
  ARRIVAL_MAX,
  ARRIVAL_MIN,
  MAX_STAY,
  MIN_STAY,
  availability,
  fullArrivalSlots,
  nightlyRate,
  nightsOf,
} from "./availability";

/*
 * The range the pickers hold is the nights booked, first to last. Check-out is the day
 * after the last night. See findings/book.md: the calendar can't let a check-out land on a
 * sold-out night, so the range can't be check-in to check-out.
 */

const EMPTY: DateRange = { from: null, to: null };
const DOB_MIN = new Date(1920, 0, 1);
const DOB_MAX = new Date(TODAY.getFullYear() - 18, TODAY.getMonth(), TODAY.getDate());
const BLACKOUT = Array.from({ length: 900 }, (_, i) => addDays(TODAY, i - 100)).filter((_, i) => i % 5 !== 0);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** A birth date is in the past, so a two-digit year is the latest one not after today. */
function parseBirthDate(text: string, { today }: { today: Date }) {
  const pastYear = text.trim().replace(/^(\d{1,2}[/.\- ]\d{1,2}[/.\- ]|\d{1,2} [a-z]+\.? )(\d{2})$/i, (_, head: string, yy: string) => {
    const y = 2000 + Number(yy);
    return `${head}${y > today.getFullYear() ? y - 100 : y}`;
  });
  return parseDate(pastYear, { today, order: "day-first" });
}
const gbp = (n: number) => `£${n.toLocaleString("en-GB")}`;
const day = (d: Date) => format(d, "EEE d MMM yyyy");
const short = (d: Date) => format(d, "d MMM");
const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

declare global {
  interface Window {
    __book?: { renders: { id: string; phase: string; ms: number }[]; soldOut: number; setStress: (on: boolean) => void };
  }
}

function stayLabel({ from, to }: { from: Date; to: Date }) {
  const out = addDays(to, 1);
  const n = daysBetween(from, out);
  const start = from.getFullYear() === out.getFullYear() ? short(from) : `${short(from)} ${from.getFullYear()}`;
  return `${start} to ${short(out)} ${out.getFullYear()}, ${n} ${n === 1 ? "night" : "nights"}`;
}

function futurePresets(): DateRangePreset[] {
  const friday = addDays(TODAY, (5 - TODAY.getDay() + 7) % 7);
  const monday = addDays(TODAY, ((1 - TODAY.getDay() + 7) % 7) || 7);
  return [
    { label: "Tonight", value: { from: TODAY, to: TODAY } },
    { label: "This weekend", value: { from: friday, to: addDays(friday, 1) } },
    { label: "Next week", value: { from: monday, to: addDays(monday, 6) } },
  ];
}

type Errors = Partial<Record<"stay" | "arrival" | "name" | "email" | "dob" | "guests", string>>;

interface Confirmed {
  ref: string;
  hotel: HotelId;
  type: RoomTypeId;
  from: Date;
  to: Date;
  arrival: TimeSlot;
  name: string;
  total: number;
}

export function BookingForm() {
  const [hotel, setHotel] = React.useState<HotelId>("hbr");
  const [type, setType] = React.useState<RoomTypeId>("std");
  const [range, setRange] = React.useState<DateRange>(EMPTY);
  const [rangeNote, setRangeNote] = React.useState<string | null>(null);
  const [arrival, setArrival] = React.useState<TimeSlot | null>(null);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [dob, setDob] = React.useState<Date | null>(null);
  const [adults, setAdults] = React.useState(1);
  const [children, setChildren] = React.useState(0);
  const [errors, setErrors] = React.useState<Errors>({});
  const [tried, setTried] = React.useState(false);
  const [done, setDone] = React.useState<Confirmed | null>(null);
  const [stress, setStress] = React.useState(false);
  const [nowMin, setNowMin] = React.useState<number | undefined>(undefined);

  const avail = React.useMemo(() => availability(hotel, type), [hotel, type]);
  // Stress: a blackout list of 720 dates matched the naive way, by scanning it per day.
  const isDateDisabled = React.useMemo(() => {
    if (!stress) return avail.soldOut;
    return (d: Date) => avail.soldOut(d) || BLACKOUT.some((b) => b.getTime() === d.getTime());
  }, [avail, stress]);
  const room = ROOM_TYPES.find((t) => t.id === type)!;

  React.useEffect(() => {
    const now = new Date();
    const [h, m] = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(now).split(":").map(Number);
    setNowMin(h * 60 + m);
    let soldOut = 0;
    for (let i = 0; i <= daysBetween(MIN_STAY, MAX_STAY); i++) if (isDateDisabled(addDays(MIN_STAY, i))) soldOut++;
    window.__book = { ...(window.__book ?? { renders: [] }), soldOut, setStress };
  }, [isDateDisabled]);

  const complete = !!(range.from && range.to);
  const nights = complete ? nightsOf(range.from!, range.to!) : [];
  const blockedNight = nights.find((n) => isDateDisabled(n));
  const total = nights.reduce((s, n) => s + nightlyRate(type, n), 0);
  const checkOut = complete ? addDays(range.to!, 1) : null;
  const stayError = blockedNight
    ? `${hotelName(hotel)} has no ${room.name} left on ${day(blockedNight)}. Pick other nights.`
    : null;

  const isToday = range.from && iso(range.from) === iso(TODAY);
  const busy = React.useMemo(() => (range.from ? fullArrivalSlots(hotel, range.from) : []), [hotel, range.from]);
  const arrivalClash = arrival && busy.some((b) => arrival.start < b.end && arrival.end > b.start);
  const arrivalPast = arrival && isToday && nowMin !== undefined && arrival.start < nowMin;

  const validate = (): Errors => {
    const e: Errors = {};
    if (!complete) e.stay = "Pick the nights.";
    else if (stayError) e.stay = stayError;
    if (!arrival) e.arrival = "Pick an arrival time.";
    else if (arrivalClash) e.arrival = `${hhmm(arrival.start)} is full. Pick another time.`;
    else if (arrivalPast) e.arrival = `${hhmm(arrival.start)} has passed.`;
    if (!name.trim()) e.name = "Enter the guest's name.";
    if (!EMAIL.test(email.trim())) e.email = email.trim() ? "Enter a valid email." : "Enter the guest's email.";
    if (!dob) e.dob = "Enter the date of birth.";
    else if (dob > DOB_MAX) e.dob = "The guest must be 18 or over.";
    else if (dob < DOB_MIN) e.dob = "Enter a year from 1920.";
    if (adults + children > room.sleeps) e.guests = `${room.name} sleeps ${room.sleeps}.`;
    return e;
  };
  // Once submit has been tried, errors track every change, hotel and room included.
  const shown = tried ? validate() : errors;

  const submit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const e = validate();
    setTried(true);
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) {
      ev.currentTarget.querySelector<HTMLElement>(`[data-field="${first}"] input:not([type=hidden]):not([aria-hidden]), [data-field="${first}"] button, [data-field="${first}"] [role=slider]`)?.focus();
      return;
    }
    setDone({
      ref: `SM-${200000 + ((daysBetween(TODAY, range.from!) * 97 + name.length * 13) % 99999)}`,
      hotel,
      type,
      from: range.from!,
      to: range.to!,
      arrival: arrival!,
      name: name.trim(),
      total,
    });
  };

  const reset = () => {
    setDone(null);
    setRange(EMPTY);
    setArrival(null);
    setName("");
    setEmail("");
    setDob(null);
    setAdults(1);
    setChildren(0);
    setTried(false);
    setErrors({});
    setRangeNote(null);
  };

  const onInlinePick = (next: DateRange) => {
    // The calendar restarts a range that would cross a closed night without saying so.
    if (range.from && !range.to && next.from && !next.to && next.from > range.from) {
      const hit = nightsOf(addDays(range.from, 1), addDays(next.from, -1)).find((d) => isDateDisabled(d));
      setRangeNote(hit ? `No room on ${day(hit)}, so the stay can't run across it. Started again from ${short(next.from)}.` : null);
    } else setRangeNote(null);
    setRange(next);
  };

  const onProfile: React.ProfilerOnRenderCallback = (id, phase, ms) => {
    const book = (window.__book ??= { renders: [], soldOut: 0, setStress });
    book.renders.push({ id, phase, ms });
    if (book.renders.length > 200) book.renders.shift();
  };

  if (done) {
    return (
      <section aria-labelledby="done-title" className="max-w-lg space-y-4 rounded-xl border border-border bg-card p-6">
        <h2 id="done-title" className="text-lg font-semibold" tabIndex={-1} ref={(el) => el?.focus()}>
          Booked {done.ref}
        </h2>
        <dl className="grid grid-cols-[8rem_1fr] gap-y-1.5 text-sm">
          <dt className="text-muted-foreground">Guest</dt>
          <dd>{done.name}</dd>
          <dt className="text-muted-foreground">Room</dt>
          <dd>{roomTypeName(done.type)}, {hotelName(done.hotel)}</dd>
          <dt className="text-muted-foreground">Stay</dt>
          <dd>{stayLabel({ from: done.from, to: done.to })}</dd>
          <dt className="text-muted-foreground">Arrival</dt>
          <dd>{hhmm(done.arrival.start)}</dd>
          <dt className="text-muted-foreground">Total</dt>
          <dd className="font-medium tabular-nums">{gbp(done.total)}</dd>
        </dl>
        <Button onClick={reset}>New booking</Button>
      </section>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]" aria-labelledby="book-title">
      <div className="min-w-0 space-y-8">
        <section aria-labelledby="room-h" className="space-y-4">
          <h2 id="room-h" className="text-base font-semibold">Room</h2>
          <div className="grid max-w-xl gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel>Hotel</FieldLabel>
              <Select
                value={hotel}
                onValueChange={(v) => v && setHotel(v as HotelId)}
                items={HOTELS.map((h) => ({ value: h.id, label: h.name }))}
              >
                <SelectTrigger data-testid="hotel">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HOTELS.map((h) => (
                    <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Room type</FieldLabel>
              <Select
                value={type}
                onValueChange={(v) => v && setType(v as RoomTypeId)}
                items={ROOM_TYPES.map((t) => ({ value: t.id, label: t.name }))}
              >
                <SelectTrigger data-testid="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROOM_TYPES.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
        </section>

        <section aria-labelledby="stay-h" className="space-y-4">
          <h2 id="stay-h" className="text-base font-semibold">Stay</h2>
          <Field invalid={!!shown.stay} data-field="stay" className="max-w-xl">
            <span id="stay-label" className="block text-sm font-medium leading-none">Nights</span>
            <React.Profiler id="picker" onRender={onProfile}>
              <DateRangePicker
                aria-label="Nights"
                label="Nights"
                placeholder="Pick nights"
                value={complete ? range : EMPTY}
                onValueChange={(r) => {
                  setRangeNote(null);
                  setRange(r);
                }}
                min={MIN_STAY}
                max={MAX_STAY}
                isDateDisabled={isDateDisabled}
                today={TODAY}
                presets={futurePresets()}
                formatRange={stayLabel}
                presentation="popover"
                name="stay"
                className="w-full sm:w-auto"
              />
            </React.Profiler>
            <FieldDescription>Check-out is the morning after the last night.</FieldDescription>
            <FieldError match={!!shown.stay}>{shown.stay}</FieldError>
          </Field>

          <div className="space-y-2">
            <h3 id="avail-h" className="text-sm font-medium">
              Availability, {room.name}, {hotelName(hotel)}
            </h3>
            <div className="overflow-x-auto rounded-xl border border-border bg-card p-3">
              <React.Profiler id="inline" onRender={onProfile}>
                <Calendar
                  aria-labelledby="avail-h"
                  mode="range"
                  layout="paged"
                  numberOfMonths={2}
                  captionLayout="dropdown"
                  value={range}
                  onValueChange={onInlinePick}
                  min={MIN_STAY}
                  max={MAX_STAY}
                  isDateDisabled={isDateDisabled}
                  today={TODAY}
                  className="[--calendar-cell:2.75rem]"
                />
              </React.Profiler>
            </div>
            <p aria-live="polite" className="min-h-5 text-sm text-muted-foreground">
              {rangeNote ??
                (range.from && !range.to ? `First night ${day(range.from)}. Pick the last night.` : "")}
            </p>
          </div>
        </section>

        <section aria-labelledby="arrival-h" className="max-w-2xl space-y-4">
          <h2 id="arrival-h" className="text-base font-semibold">Arrival</h2>
          <div data-field="arrival" className="space-y-2">
            <TimeSlots
              aria-label="Arrival time"
              timeZone="UK time"
              value={arrival}
              onValueChange={setArrival}
              min={ARRIVAL_MIN}
              max={ARRIVAL_MAX}
              step={30}
              minDuration={30}
              maxDuration={30}
              busy={busy}
              now={isToday ? nowMin : undefined}
              date={range.from ?? undefined}
              disabled={!range.from}
              layout="horizontal"
              name="arrival"
            />
            {!range.from && <p className="text-sm text-muted-foreground">Pick the nights first.</p>}
            {shown.arrival && <p role="alert" className="text-sm font-medium text-destructive">{shown.arrival}</p>}
          </div>
        </section>

        <section aria-labelledby="guest-h" className="space-y-4">
          <h2 id="guest-h" className="text-base font-semibold">Guest</h2>
          <div className="grid max-w-xl gap-4 sm:grid-cols-2">
            <Field invalid={!!shown.name} data-field="name" className="sm:col-span-2">
              <FieldLabel>Name</FieldLabel>
              <Input name="name" autoComplete="off" value={name} onValueChange={setName} />
              <FieldError match={!!shown.name}>{shown.name}</FieldError>
            </Field>
            <Field invalid={!!shown.email} data-field="email" className="sm:col-span-2">
              <FieldLabel>Email</FieldLabel>
              <Input name="email" type="email" autoComplete="off" value={email} onValueChange={setEmail} />
              <FieldError match={!!shown.email}>{shown.email}</FieldError>
            </Field>
            <Field invalid={!!shown.dob} data-field="dob" className="sm:col-span-2">
              <FieldLabel>Date of birth</FieldLabel>
              <DatePicker
                name="dob"
                label="Date of birth"
                value={dob}
                onValueChange={setDob}
                min={DOB_MIN}
                max={DOB_MAX}
                today={TODAY}
                locale={enGB}
                parseDate={parseBirthDate}
                presentation="popover"
                placeholder="14 mar 1982"
              />
              <FieldError match={!!shown.dob}>{shown.dob}</FieldError>
            </Field>
            <Field data-field="guests">
              <FieldLabel>Adults</FieldLabel>
              <Select value={adults} onValueChange={(v) => v != null && setAdults(v)} items={range1(1, 4)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {range1(1, 4).map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Children</FieldLabel>
              <Select value={children} onValueChange={(v) => v != null && setChildren(v)} items={range1(0, 3)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {range1(0, 3).map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            {shown.guests && <p role="alert" className="text-sm font-medium text-destructive sm:col-span-2">{shown.guests}</p>}
          </div>
        </section>
      </div>

      <aside aria-labelledby="sum-h" className="h-fit space-y-4 rounded-xl border border-border bg-card p-5 xl:sticky xl:top-6">
        <h2 id="sum-h" className="text-base font-semibold">Summary</h2>
        <dl className="grid grid-cols-[6rem_1fr] gap-y-1.5 text-sm">
          <dt className="text-muted-foreground">Room</dt>
          <dd>{room.name}, sleeps {room.sleeps}</dd>
          <dt className="text-muted-foreground">Check-in</dt>
          <dd>{range.from ? day(range.from) : "Not set"}</dd>
          <dt className="text-muted-foreground">Check-out</dt>
          <dd>{checkOut ? day(checkOut) : "Not set"}</dd>
          <dt className="text-muted-foreground">Nights</dt>
          <dd className="tabular-nums">{nights.length || "None"}</dd>
          <dt className="text-muted-foreground">Arrival</dt>
          <dd>{arrival ? hhmm(arrival.start) : "Not set"}</dd>
          <dt className="text-muted-foreground">Guests</dt>
          <dd>{adults} {adults === 1 ? "adult" : "adults"}{children ? `, ${children} ${children === 1 ? "child" : "children"}` : ""}</dd>
        </dl>
        {nights.length > 0 && (
          <ul aria-label="Price per night" className="max-h-48 space-y-0.5 overflow-y-auto border-t border-border pt-3 text-sm tabular-nums">
            {nights.map((n) => (
              <li key={n.getTime()} className={cn("flex justify-between", isDateDisabled(n) && "text-destructive")}>
                <span>{format(n, "EEE d MMM")}</span>
                <span>{isDateDisabled(n) ? "Sold out" : gbp(nightlyRate(type, n))}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-baseline justify-between border-t border-border pt-3">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-lg font-semibold tabular-nums" aria-live="polite">{complete ? gbp(total) : "£0"}</span>
        </div>
        {stayError && <p role="alert" className="text-sm font-medium text-destructive">{stayError}</p>}
        <Button type="submit" className="w-full">Book</Button>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input type="checkbox" checked={stress} onChange={(e) => setStress(e.target.checked)} />
          Stress: 720-date blackout list
        </label>
      </aside>
    </form>
  );
}

function range1(from: number, to: number) {
  return Array.from({ length: to - from + 1 }, (_, i) => ({ value: from + i, label: String(from + i) }));
}
