import type { ColumnFiltersState, SortingState } from "@tanstack/react-table"
import { hotelName, STATUSES, type Reservation } from "@/lib/data/hotel"

export const balanceOf = (r: Reservation) => r.total - r.paid

/** What each sortable or searchable column reads, shared by the columns and the fake server. */
export const ACCESSORS: Record<string, (r: Reservation) => string | number> = {
  id: (r) => r.id,
  guest: (r) => r.guest,
  hotel: (r) => hotelName(r.hotel),
  room: (r) => r.room,
  checkIn: (r) => r.checkIn,
  checkOut: (r) => r.checkOut,
  nights: (r) => r.nights,
  status: (r) => r.status,
  channel: (r) => r.channel,
  ratePlan: (r) => r.ratePlan,
  total: (r) => r.total,
  balance: balanceOf,
  created: (r) => r.created,
}

export interface Query {
  sorting: SortingState
  columnFilters: ColumnFiltersState
  globalFilter: string
  pageIndex: number
  pageSize: number
}

export interface PageResult {
  rows: Reservation[]
  rowCount: number
  statusCounts: Record<string, number>
}

function matches(r: Reservation, filters: ColumnFiltersState, needle: string, skip?: string) {
  for (const f of filters) {
    if (f.id === skip) continue
    const v = ACCESSORS[f.id]?.(r)
    if (Array.isArray(f.value)) {
      if (f.value.length && !f.value.includes(v)) return false
    } else if (f.value != null && f.value !== "" && String(v) !== String(f.value)) return false
  }
  if (!needle) return true
  for (const key in ACCESSORS) if (String(ACCESSORS[key](r)).toLowerCase().includes(needle)) return true
  return false
}

export function runQuery(all: Reservation[], q: Query): PageResult {
  const needle = q.globalFilter.trim().toLowerCase()
  const statusCounts: Record<string, number> = Object.fromEntries(STATUSES.map((s) => [s, 0]))
  const hits: Reservation[] = []
  for (const r of all) {
    if (!matches(r, q.columnFilters, needle, "status")) continue
    statusCounts[r.status]++
    if (matches(r, q.columnFilters, "", undefined)) hits.push(r)
  }
  if (q.sorting.length) {
    const keys = q.sorting.map((s) => ({ get: ACCESSORS[s.id], dir: s.desc ? -1 : 1 }))
    hits.sort((a, b) => {
      for (const k of keys) {
        const x = k.get(a)
        const y = k.get(b)
        if (x < y) return -k.dir
        if (x > y) return k.dir
      }
      return 0
    })
  }
  const start = q.pageIndex * q.pageSize
  return { rows: hits.slice(start, start + q.pageSize), rowCount: hits.length, statusCounts }
}

declare global {
  interface Window {
    __resv?: { failNext: boolean; failRate: number; latency: number }
  }
}

/** A pretend API: about 300ms away, and failing now and then. */
export function fetchPage(all: () => Reservation[], q: Query): Promise<PageResult> {
  const knobs = (typeof window !== "undefined" && window.__resv) || { failNext: false, failRate: 0.08, latency: 300 }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (knobs.failNext || Math.random() < knobs.failRate) {
        knobs.failNext = false
        reject(new Error("503"))
        return
      }
      resolve(runQuery(all(), q))
    }, knobs.latency * (0.8 + Math.random() * 0.4))
  })
}
