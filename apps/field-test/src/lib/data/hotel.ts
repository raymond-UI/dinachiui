import { addDays, daysBetween, iso, rng, TODAY } from "./seed";

export const HOTELS = [
  { id: "hbr", name: "Saltmarsh Harbour", city: "Whitby", floors: 6 },
  { id: "cly", name: "Saltmarsh Clyde", city: "Glasgow", floors: 9 },
  { id: "avn", name: "Saltmarsh Avon", city: "Bath", floors: 4 },
  { id: "tyn", name: "Saltmarsh Quayside", city: "Newcastle", floors: 8 },
  { id: "lks", name: "Saltmarsh Fells", city: "Keswick", floors: 3 },
  { id: "cor", name: "Saltmarsh Cove", city: "St Ives", floors: 4 },
] as const;
export type HotelId = (typeof HOTELS)[number]["id"];

export const ROOM_TYPES = [
  { id: "std", name: "Standard Queen", base: 112, sleeps: 2, share: 0.34 },
  { id: "sup", name: "Superior King", base: 148, sleeps: 2, share: 0.26 },
  { id: "twn", name: "Deluxe Twin", base: 156, sleeps: 3, share: 0.16 },
  { id: "jrs", name: "Junior Suite", base: 228, sleeps: 3, share: 0.12 },
  { id: "gdn", name: "Garden Suite", base: 296, sleeps: 4, share: 0.08 },
  { id: "pnt", name: "Penthouse", base: 540, sleeps: 4, share: 0.04 },
] as const;
export type RoomTypeId = (typeof ROOM_TYPES)[number]["id"];

export const RATE_PLANS = ["Flexible", "Advance saver", "Bed and breakfast", "Corporate", "Member"] as const;
export const CHANNELS = ["Direct web", "Phone", "Travel agent", "Corporate", "Online agency", "Walk-in"] as const;
export const STATUSES = ["Pending", "Confirmed", "Checked in", "Checked out", "Cancelled", "No-show"] as const;
export type Status = (typeof STATUSES)[number];
export const TIERS = ["None", "Silver", "Gold", "Platinum"] as const;

export interface Room {
  id: string;
  number: string;
  hotel: HotelId;
  type: RoomTypeId;
  floor: number;
}

export interface Reservation {
  id: string;
  guest: string;
  email: string;
  phone: string;
  hotel: HotelId;
  room: string;
  roomType: RoomTypeId;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  status: Status;
  channel: (typeof CHANNELS)[number];
  ratePlan: (typeof RATE_PLANS)[number];
  nightly: number;
  total: number;
  paid: number;
  tier: (typeof TIERS)[number];
  created: string;
  arrival: string | null;
  notes: string;
}

const FIRST = ["Ada", "Ben", "Chioma", "Dev", "Elif", "Farah", "Gus", "Hana", "Ivo", "Jun", "Kemi", "Liam", "Mira", "Nnamdi", "Orla", "Pia", "Quinn", "Ravi", "Saoirse", "Tomas", "Uma", "Viktor", "Wen", "Xavi", "Yara", "Zeb", "Amara", "Bram", "Cleo", "Dara", "Emeka", "Fenna", "Grace", "Hugo", "Ines", "Joss", "Kai", "Lena", "Mateo", "Noor"];
const LAST = ["Okafor", "Lindqvist", "Patel", "Murphy", "Nakamura", "Adeyemi", "Fischer", "O'Neill", "Kowalski", "Haddad", "Reyes", "MacLeod", "Sato", "Mensah", "Novak", "Byrne", "Costa", "Ibrahim", "Larsen", "Chen", "Doyle", "Eze", "Moreau", "Silva", "Walsh", "Akhtar", "Brennan", "Duarte", "Fraser", "Gallagher"];
const NOTES = ["", "", "", "", "", "Late arrival, after 22:00", "Cot in room", "Anniversary, flowers on arrival", "Allergic to feathers", "Quiet room away from lift", "Early check-in requested", "Dog, small", "Accessible room needed", "Airport transfer booked", "Invoice to company"];

export const WINDOW_START = new Date(2026, 0, 1);
export const WINDOW_END = new Date(2027, 5, 30);
export const WINDOW_DAYS = daysBetween(WINDOW_START, WINDOW_END) + 1;

/** Seasonal pull for a night: summer and December fill up, January doesn't. */
function demand(d: Date) {
  const m = d.getMonth();
  const season = [0.55, 0.62, 0.7, 0.78, 0.84, 0.92, 0.97, 0.98, 0.86, 0.78, 0.7, 0.88][m];
  const weekend = d.getDay() === 5 || d.getDay() === 6 ? 0.1 : 0;
  return Math.min(0.99, season + weekend);
}

export interface Hotel {
  rooms: Room[];
  reservations: Reservation[];
  /** Per room, the reservation index holding each night of the window, or -1. */
  nights: Int32Array[];
}

let cache: Hotel | null = null;

export function hotel(): Hotel {
  if (cache) return cache;
  const r = rng(20261118);
  const rooms: Room[] = [];
  for (const h of HOTELS) {
    const perFloor = r.int(18, 26);
    for (let f = 1; f <= h.floors; f++) {
      for (let n = 1; n <= perFloor; n++) {
        const roll = r.next();
        let acc = 0;
        let type: RoomTypeId = "std";
        for (const t of ROOM_TYPES) if (roll <= (acc += t.share)) { type = t.id; break; }
        if (f === h.floors && n > perFloor - 2) type = "pnt";
        rooms.push({ id: `${h.id}-${f}${String(n).padStart(2, "0")}`, number: `${f}${String(n).padStart(2, "0")}`, hotel: h.id, type, floor: f });
      }
    }
  }

  const reservations: Reservation[] = [];
  const nights = rooms.map(() => new Int32Array(WINDOW_DAYS).fill(-1));
  const todayIdx = daysBetween(WINDOW_START, TODAY);
  let seq = 104_000;

  rooms.forEach((room, ri) => {
    const type = ROOM_TYPES.find((t) => t.id === room.type)!;
    let day = r.int(0, 3);
    while (day < WINDOW_DAYS) {
      const date = addDays(WINDOW_START, day);
      if (!r.chance(demand(date))) { day += 1; continue; }
      const len = r.weighted([[1, 22], [2, 30], [3, 20], [4, 10], [5, 7], [7, 7], [10, 2], [14, 2]] as const);
      const end = Math.min(WINDOW_DAYS, day + len);
      const checkIn = date;
      const checkOut = addDays(WINDOW_START, end);
      const inIdx = day;
      const outIdx = end;
      let status: Status;
      if (outIdx <= todayIdx) status = r.weighted([["Checked out", 90], ["No-show", 3], ["Cancelled", 7]] as const);
      else if (inIdx <= todayIdx) status = inIdx === todayIdx ? r.weighted([["Checked in", 6], ["Confirmed", 4]] as const) : "Checked in";
      else status = r.weighted([["Confirmed", 84], ["Pending", 8], ["Cancelled", 8]] as const);
      const ratePlan = r.pick(RATE_PLANS);
      const factor = ratePlan === "Advance saver" ? 0.85 : ratePlan === "Member" ? 0.9 : ratePlan === "Bed and breakfast" ? 1.12 : ratePlan === "Corporate" ? 0.92 : 1;
      const nightly = Math.round(type.base * factor * (0.8 + demand(checkIn) * 0.45));
      const n = outIdx - inIdx;
      const total = nightly * n;
      const paid = status === "Checked out" ? total : status === "Cancelled" ? 0 : r.chance(0.4) ? total : r.chance(0.5) ? Math.round(total * 0.2) : 0;
      const first = r.pick(FIRST);
      const last = r.pick(LAST);
      const created = addDays(checkIn, -r.int(1, 160));
      const idx = reservations.length;
      reservations.push({
        id: `SM-${seq++}`,
        guest: `${first} ${last}`,
        email: `${first}.${last}`.toLowerCase().replace(/'/g, "") + `${r.int(1, 99)}@example.com`,
        phone: `+44 7${r.int(100, 999)} ${r.int(100000, 999999)}`,
        hotel: room.hotel,
        room: room.number,
        roomType: room.type,
        checkIn: iso(checkIn),
        checkOut: iso(checkOut),
        nights: n,
        adults: r.int(1, Math.min(2, type.sleeps)),
        children: type.sleeps > 2 && r.chance(0.3) ? r.int(1, type.sleeps - 2) : 0,
        status,
        channel: r.pick(CHANNELS),
        ratePlan,
        nightly,
        total,
        paid,
        tier: r.weighted([["None", 70], ["Silver", 16], ["Gold", 10], ["Platinum", 4]] as const),
        created: iso(created),
        arrival: status === "Cancelled" ? null : `${String(r.int(12, 22)).padStart(2, "0")}:${r.pick(["00", "15", "30", "45"])}`,
        notes: r.pick(NOTES),
      });
      if (status !== "Cancelled") for (let d = inIdx; d < outIdx; d++) nights[ri][d] = idx;
      day = end + (r.chance(0.5) ? 0 : r.int(1, 3));
    }
  });

  cache = { rooms, reservations, nights };
  return cache;
}

export const hotelName = (id: HotelId) => HOTELS.find((h) => h.id === id)!.name;
export const roomTypeName = (id: RoomTypeId) => ROOM_TYPES.find((t) => t.id === id)!.name;

/** Occupied share of a hotel's rooms on each night of the window, 0 to 1. */
export function occupancyByDay(hotelId?: HotelId) {
  const { rooms, nights } = hotel();
  const out = new Float32Array(WINDOW_DAYS);
  let count = 0;
  rooms.forEach((room, ri) => {
    if (hotelId && room.hotel !== hotelId) return;
    count++;
    const row = nights[ri];
    for (let d = 0; d < WINDOW_DAYS; d++) if (row[d] >= 0) out[d]++;
  });
  for (let d = 0; d < WINDOW_DAYS; d++) out[d] /= count || 1;
  return out;
}

/** Free rooms of one type, per night of the window. */
export function freeByDay(hotelId: HotelId, type: RoomTypeId) {
  const { rooms, nights } = hotel();
  const out = new Int16Array(WINDOW_DAYS);
  rooms.forEach((room, ri) => {
    if (room.hotel !== hotelId || room.type !== type) return;
    const row = nights[ri];
    for (let d = 0; d < WINDOW_DAYS; d++) if (row[d] < 0) out[d]++;
  });
  return out;
}

export function dayIndex(d: Date) {
  return daysBetween(WINDOW_START, d);
}
