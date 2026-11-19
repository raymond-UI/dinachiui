"use client";

import * as React from "react";
import { format } from "date-fns";
import { WeekStrip } from "@/components/ui/week-strip";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  HOTELS,
  WINDOW_DAYS,
  WINDOW_END,
  WINDOW_START,
  dayIndex,
  hotel,
  roomTypeName,
  type HotelId,
  type Reservation,
} from "@/lib/data/hotel";
import { TODAY, addDays, iso } from "@/lib/data/seed";

type Day = { arr: number[]; dep: number[] };

/** Arrivals and departures by date, cancellations left out. */
function byDate() {
  const { reservations } = hotel();
  const out = new Map<string, Day>();
  const at = (k: string) => {
    let d = out.get(k);
    if (!d) out.set(k, (d = { arr: [], dep: [] }));
    return d;
  };
  reservations.forEach((r, i) => {
    if (r.status === "Cancelled") return;
    at(r.checkIn).arr.push(i);
    at(r.checkOut).dep.push(i);
  });
  return out;
}

/** Rooms whose guest stays on from the night before, per hotel. */
function stayOvers(day: Date) {
  const { rooms, nights } = hotel();
  const d = dayIndex(day);
  const out = Object.fromEntries(HOTELS.map((h) => [h.id, 0])) as Record<HotelId, number>;
  const occupied = { ...out };
  const total = { ...out };
  rooms.forEach((room, ri) => {
    total[room.hotel]++;
    if (d < 0 || d >= WINDOW_DAYS) return;
    const tonight = nights[ri][d];
    if (tonight >= 0) occupied[room.hotel]++;
    if (d > 0 && tonight >= 0 && nights[ri][d - 1] === tonight) out[room.hotel]++;
  });
  return { stay: out, occupied, total };
}

const LEVELS = ["Quiet", "Busy", "Very busy", "Peak"];

export function Housekeeping() {
  const index = React.useMemo(byDate, []);
  const { reservations } = hotel();
  const [day, setDay] = React.useState(TODAY);

  // Up to three dots: turnovers at or above the 50th, 75th and 90th percentile.
  const busy = React.useMemo(() => {
    const turns: [string, number][] = [];
    for (let d = 0; d < WINDOW_DAYS; d++) {
      const k = iso(addDays(WINDOW_START, d));
      const x = index.get(k);
      turns.push([k, (x?.arr.length ?? 0) + (x?.dep.length ?? 0)]);
    }
    const sorted = turns.map(([, n]) => n).sort((a, b) => a - b);
    const q = (p: number) => sorted[Math.floor(p * (sorted.length - 1))];
    const steps = [q(0.5), q(0.75), q(0.9)];
    return Object.fromEntries(turns.map(([k, n]) => [k, steps.filter((s) => n >= s).length]));
  }, [index]);

  const key = iso(day);
  const today = index.get(key) ?? { arr: [], dep: [] };
  const { stay, occupied, total } = React.useMemo(() => stayOvers(day), [day]);
  const per = (list: number[], h: HotelId) => list.filter((i) => reservations[i].hotel === h);

  const sum = { arr: 0, dep: 0, stay: 0, free: 0 };
  const rows = HOTELS.map((h) => {
    const r = {
      h,
      arr: per(today.arr, h.id).length,
      dep: per(today.dep, h.id).length,
      stay: stay[h.id],
      free: total[h.id] - occupied[h.id],
    };
    sum.arr += r.arr;
    sum.dep += r.dep;
    sum.stay += r.stay;
    sum.free += r.free;
    return r;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Housekeeping</h1>
      <WeekStrip
        value={day}
        onValueChange={setDay}
        min={WINDOW_START}
        max={WINDOW_END}
        today={TODAY}
        counts={busy}
        formatCount={(n) => LEVELS[n] ?? LEVELS[3]}
        aria-label="Day"
        className="rounded-xl border pt-3"
      />

      <section>
        <h2 className="mb-2 text-sm font-medium">{format(day, "EEEE d MMMM yyyy")}</h2>
        <Table aria-label="Room moves by hotel">
          <TableHeader>
            <TableRow>
              <TableHead>Hotel</TableHead>
              <TableHead numeric>Arrivals</TableHead>
              <TableHead numeric>Departures</TableHead>
              <TableHead numeric>Stay-overs</TableHead>
              <TableHead numeric>Free tonight</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.h.id}>
                <TableHead scope="row" className="font-medium text-foreground">
                  {r.h.name}
                </TableHead>
                <TableCell numeric>{r.arr}</TableCell>
                <TableCell numeric>{r.dep}</TableCell>
                <TableCell numeric>{r.stay}</TableCell>
                <TableCell numeric>{r.free}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableHead scope="row">All hotels</TableHead>
              <TableCell numeric>{sum.arr}</TableCell>
              <TableCell numeric>{sum.dep}</TableCell>
              <TableCell numeric>{sum.stay}</TableCell>
              <TableCell numeric>{sum.free}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </section>

      <Tabs defaultValue={HOTELS[0].id}>
        <TabsList className="h-auto flex-wrap justify-start">
          {HOTELS.map((h) => (
            <TabsTrigger key={h.id} value={h.id}>
              {h.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {HOTELS.map((h) => (
          <TabsContent key={h.id} value={h.id} className="grid gap-6 lg:grid-cols-2">
            <List title="Arrivals" items={per(today.arr, h.id).map((i) => reservations[i])} time="arrival" />
            <List title="Departures" items={per(today.dep, h.id).map((i) => reservations[i])} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function List({ title, items, time }: { title: string; items: Reservation[]; time?: "arrival" }) {
  const sorted = [...items].sort((a, b) => a.room.localeCompare(b.room));
  return (
    <section>
      <h3 className="mb-2 text-sm font-medium">
        {title} <span className="font-normal text-muted-foreground">{items.length}</span>
      </h3>
      {sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground">None</p>
      ) : (
        <Table density="compact" aria-label={title}>
          <TableHeader>
            <TableRow>
              <TableHead>Room</TableHead>
              <TableHead>Guest</TableHead>
              <TableHead>Type</TableHead>
              <TableHead numeric>Nights</TableHead>
              {time && <TableHead>ETA</TableHead>}
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="tabular-nums">{r.room}</TableCell>
                <TableCell>{r.guest}</TableCell>
                <TableCell className="text-muted-foreground">{roomTypeName(r.roomType)}</TableCell>
                <TableCell numeric>{r.nights}</TableCell>
                {time && <TableCell className="tabular-nums">{r.arrival ?? ""}</TableCell>}
                <TableCell className="text-muted-foreground">{r.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  );
}
