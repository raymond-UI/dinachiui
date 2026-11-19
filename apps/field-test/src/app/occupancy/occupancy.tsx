"use client";

import * as React from "react";
import { format } from "date-fns";
import { HeatTable, type HeatCell, type HeatRow } from "@/components/ui/heat-table";
import { MonthPicker } from "@/components/ui/month-picker";
import { YearView } from "@/components/ui/year-view";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  HOTELS,
  ROOM_TYPES,
  WINDOW_DAYS,
  WINDOW_END,
  WINDOW_START,
  dayIndex,
  hotel,
  occupancyByDay,
  type HotelId,
  type Room,
  type RoomTypeId,
} from "@/lib/data/hotel";
import { TODAY, addDays, iso } from "@/lib/data/seed";

const NIGHTS = 90;
type Scope = HotelId | "all";

const SCOPES: { value: Scope; label: string }[] = [
  { value: "all", label: "All hotels" },
  ...HOTELS.map((h) => ({ value: h.id as Scope, label: h.name })),
];
const TYPE_SHORT: Record<RoomTypeId, string> = { std: "STD", sup: "SUP", twn: "TWN", jrs: "JRS", gdn: "GDN", pnt: "PNT" };

/* ---- perf probes: read from the browser as window.__prof ---- */
type Probe = { id: string; phase: string; ms: number; at: number };
declare global {
  interface Window {
    __prof?: Probe[];
  }
}
const onRender: React.ProfilerOnRenderCallback = (id, phase, actualDuration) => {
  (window.__prof ??= []).push({ id, phase, ms: Math.round(actualDuration), at: Math.round(performance.now()) });
};

/* ---- the cell under the pointer or focus, kept out of React so the grid does not re-render for it ---- */
let pointed: { r: number; c: number } | null = null;
const listeners = new Set<() => void>();
const point = (next: { r: number; c: number } | null) => {
  if (next?.r === pointed?.r && next?.c === pointed?.c) return;
  pointed = next;
  listeners.forEach((l) => l());
};
const usePointed = () =>
  React.useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => pointed,
    () => null
  );
const useMounted = () =>
  React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

type RoomRow = HeatRow & { room: Room; res: number[] };

function roomRows(scope: Scope, start: Date, NIGHTS: number): RoomRow[] {
  const { rooms, nights } = hotel();
  const s = dayIndex(start);
  const out: RoomRow[] = [];
  rooms.forEach((room, ri) => {
    if (scope !== "all" && room.hotel !== scope) return;
    const res: number[] = new Array(NIGHTS);
    const values: (number | null)[] = new Array(NIGHTS);
    for (let i = 0; i < NIGHTS; i++) {
      const d = s + i;
      if (d < 0 || d >= WINDOW_DAYS) {
        res[i] = -1;
        values[i] = null;
        continue;
      }
      res[i] = nights[ri][d];
      values[i] = res[i] >= 0 ? 1 : 0;
    }
    out.push({
      label: scope === "all" ? `${room.hotel.toUpperCase()} ${room.number}` : room.number,
      meta: TYPE_SHORT[room.type],
      room,
      res,
      values,
    });
  });
  return out;
}

function typeRows(scope: Scope, start: Date) {
  const { rooms, nights } = hotel();
  const s = dayIndex(start);
  const occ = ROOM_TYPES.map(() => new Array<number>(NIGHTS).fill(0));
  const count = ROOM_TYPES.map(() => 0);
  const all = new Array<number>(NIGHTS).fill(0);
  let total = 0;
  rooms.forEach((room, ri) => {
    if (scope !== "all" && room.hotel !== scope) return;
    const t = ROOM_TYPES.findIndex((x) => x.id === room.type);
    count[t]++;
    total++;
    for (let i = 0; i < NIGHTS; i++) {
      const d = s + i;
      if (d < WINDOW_DAYS && nights[ri][d] >= 0) {
        occ[t][i]++;
        all[i]++;
      }
    }
  });
  const inWindow = (i: number) => s + i < WINDOW_DAYS;
  const rows: HeatRow[] = ROOM_TYPES.map((t, ti) => ({
    label: t.name,
    meta: count[ti],
    values: occ[ti].map((n, i) => (inWindow(i) && count[ti] ? Math.round((100 * n) / count[ti]) : null)),
  }));
  const footer = all.map((n, i) => (inWindow(i) ? `${Math.round((100 * n) / (total || 1))}` : ""));
  return { rows, footer };
}

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("");

const compact = [
  "[&_[data-slot=heat-table-cell]]:h-6 [&_[data-slot=heat-table-cell]]:w-7 [&_[data-slot=heat-table-cell]]:text-[10px]",
  "[&_thead_th]:px-0 [&_thead_th]:text-[10px]",
].join(" ");

export function Occupancy() {
  const mounted = useMounted();
  const [scope, setScope] = React.useState<Scope>("hbr");
  const [start, setStart] = React.useState(() => new Date(TODAY.getFullYear(), TODAY.getMonth(), 1));

  // Test hooks for the room grid only: ?scope=all, ?nights=180, ?auto (no min or max).
  const test = React.useMemo(() => (mounted ? new URLSearchParams(window.location.search) : null), [mounted]);
  const n = Number(test?.get("nights")) || NIGHTS;
  const auto = !!test?.has("auto");
  React.useEffect(() => {
    const s = test?.get("scope");
    if (s && SCOPES.some((x) => x.value === s)) setScope(s as Scope);
  }, [test]);
  const dates = React.useMemo(() => Array.from({ length: NIGHTS }, (_, i) => addDays(start, i)), [start]);
  const columns = React.useMemo(() => dates.map((d) => String(d.getDate())), [dates]);
  const roomDates = React.useMemo(() => Array.from({ length: n }, (_, i) => addDays(start, i)), [start, n]);
  const roomColumns = React.useMemo(() => roomDates.map((d) => String(d.getDate())), [roomDates]);
  const rows = React.useMemo(() => (mounted ? roomRows(scope, start, n) : []), [mounted, scope, start, n]);
  const types = React.useMemo(() => typeRows(scope, start), [scope, start]);

  const portfolio = React.useMemo(() => {
    const occ = occupancyByDay();
    const out: Record<string, number> = {};
    for (let d = 0; d < WINDOW_DAYS; d++) out[iso(addDays(WINDOW_START, d))] = Math.round(occ[d] * 100);
    return out;
  }, []);

  const { reservations } = hotel();
  const roomFormat = React.useCallback(
    (v: number, cell: HeatCell<RoomRow>) => (v ? initials(reservations[cell.row.res[cell.columnIndex]].guest) : ""),
    [reservations]
  );
  const roomLabel = React.useCallback(
    (cell: HeatCell<RoomRow>) => {
      const r = cell.row.res[cell.columnIndex];
      return `Room ${cell.row.label}, ${format(roomDates[cell.columnIndex], "EEE d MMM yyyy")}: ${r >= 0 ? reservations[r].guest : "free"}`;
    },
    [roomDates, reservations]
  );
  const typeLabel = React.useCallback(
    (cell: HeatCell) => `${cell.row.label}, ${format(dates[cell.columnIndex], "EEE d MMM yyyy")}: ${cell.value}% occupied`,
    [dates]
  );

  const lastStart = addDays(WINDOW_END, -NIGHTS + 1);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-4">
        <h1 className="text-xl font-semibold">Occupancy</h1>
        <Select
          items={SCOPES}
          value={scope}
          onValueChange={(v) => {
            if (v) setScope(v as Scope);
          }}
        >
          <SelectTrigger aria-label="Hotel" className="ms-auto w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SCOPES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <section className="grid gap-8 md:grid-cols-[18rem_minmax(0,1fr)]">
        <div>
          <h2 className="mb-3 text-sm font-medium">Start month</h2>
          <MonthPicker
            value={start}
            onValueChange={(m) => {
              if (m) setStart(m);
            }}
            min={WINDOW_START}
            max={lastStart}
            today={TODAY}
            aria-label="Start month"
          />
          <p className="mt-3 text-sm text-muted-foreground">
            {format(start, "d MMM yyyy")} to {format(addDays(start, NIGHTS - 1), "d MMM yyyy")}
          </p>
        </div>
        <div className="min-w-0">
          <YearView
            counts={portfolio}
            end={WINDOW_END}
            // Days after `today` can't be picked, and the bookings run past it.
            today={WINDOW_END}
            value={start}
            onValueChange={(d) => {
              if (d) setStart(d);
            }}
            thresholds={[50, 60, 65, 70]}
            formatCount={(n) => `${n}% occupied`}
            heading={() => "Portfolio occupancy"}
            aria-label="Portfolio occupancy by day"
          />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-medium">By room type</h2>
        <React.Profiler id="types" onRender={onRender}>
          <HeatTable
            aria-label="Occupancy by room type"
            rowHeader="Type"
            columns={columns}
            rows={types.rows}
            min={0}
            max={100}
            label={typeLabel}
            footer={{ label: "All", values: types.footer }}
            className={compact}
          />
        </React.Profiler>
      </section>

      <section>
        <div className="mb-3 flex items-baseline gap-3">
          <h2 className="text-sm font-medium">By room</h2>
          <span className="text-sm text-muted-foreground">{rows.length} rooms</span>
        </div>
        <Readout rows={rows} dates={roomDates} />
        {mounted && (
          <React.Profiler id="rooms" onRender={onRender}>
            <HeatTable<RoomRow>
              aria-label="Rooms by night"
              rowHeader="Room"
              columns={roomColumns}
              rows={rows}
              min={auto ? undefined : 0}
              max={auto ? undefined : 1}
              format={roomFormat}
              label={roomLabel}
              density="compact"
              virtualize
              maxHeight={620}
              onCellHover={(c) => point(c && { r: c.rowIndex, c: c.columnIndex })}
              onCellFocus={(c) => point({ r: c.rowIndex, c: c.columnIndex })}
            />
          </React.Profiler>
        )}
      </section>
    </div>
  );
}

function Readout({ rows, dates }: { rows: RoomRow[]; dates: Date[] }) {
  const at = usePointed();
  const { reservations } = hotel();
  const row = at ? rows[at.r] : undefined;
  const r = row && at ? row.res[at.c] : -1;
  const res = r >= 0 ? reservations[r] : null;
  return (
    <div data-testid="occupancy-readout" className="mb-2 min-h-6 text-sm">
      {row && at ? (
        <>
          <span className="font-medium">Room {row.label}</span>
          <span className="text-muted-foreground"> · {format(dates[at.c], "EEE d MMM")} · </span>
          {res ? (
            <>
              {res.guest} <span className="text-muted-foreground">· {res.id} · {res.checkIn} to {res.checkOut}</span>
            </>
          ) : (
            "Free"
          )}
        </>
      ) : (
        <span className="text-muted-foreground">Point at or focus a night</span>
      )}
    </div>
  );
}
