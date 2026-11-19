import { dayIndex, freeByDay, ROOM_TYPES, WINDOW_DAYS, WINDOW_END, type HotelId, type RoomTypeId } from "@/lib/data/hotel";
import { addDays, daysBetween, rng, TODAY } from "@/lib/data/seed";

export const MIN_STAY = TODAY;
export const MAX_STAY = WINDOW_END;

/** Same seasonal shape the dataset books against, so prices track how full a night is. */
const SEASON = [0.55, 0.62, 0.7, 0.78, 0.84, 0.92, 0.97, 0.98, 0.86, 0.78, 0.7, 0.88];

export function nightlyRate(type: RoomTypeId, night: Date) {
  const base = ROOM_TYPES.find((t) => t.id === type)!.base;
  const weekend = night.getDay() === 5 || night.getDay() === 6 ? 0.1 : 0;
  const demand = Math.min(0.99, SEASON[night.getMonth()] + weekend);
  return Math.round(base * (0.8 + demand * 0.45));
}

export interface Availability {
  free: Int16Array;
  /** True for a night with no room of this type left, or outside the data window. */
  soldOut: (night: Date) => boolean;
  soldOutCount: number;
}

export function availability(hotel: HotelId, type: RoomTypeId): Availability {
  const free = freeByDay(hotel, type);
  let soldOutCount = 0;
  for (let i = dayIndex(TODAY); i < WINDOW_DAYS; i++) if (free[i] <= 0) soldOutCount++;
  const soldOut = (night: Date) => {
    const i = dayIndex(night);
    return i < 0 || i >= WINDOW_DAYS || free[i] <= 0;
  };
  return { free, soldOut, soldOutCount };
}

/** Every night of a stay, first to last. */
export function nightsOf(from: Date, to: Date) {
  // Counted in calendar days: where DST starts at midnight a day begins at 01:00, so
  // comparing Date objects drops the last night.
  return Array.from({ length: Math.max(0, daysBetween(from, to) + 1) }, (_, i) => addDays(from, i));
}

/** Half-hour arrival slots from 14:00, the last one at 23:30. */
export const ARRIVAL_MIN = 14 * 60;
export const ARRIVAL_MAX = 24 * 60;

/** Slots the desk has already promised to other arrivals that evening. */
export function fullArrivalSlots(hotel: HotelId, day: Date) {
  const seed = dayIndex(day) * 31 + hotel.charCodeAt(0) * 7 + hotel.charCodeAt(1);
  const r = rng(seed);
  const out: { start: number; end: number }[] = [];
  for (let m = ARRIVAL_MIN; m < ARRIVAL_MAX; m += 30) if (r.chance(0.28)) out.push({ start: m, end: m + 30 });
  return out;
}
