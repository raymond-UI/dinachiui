"use client"

import * as React from "react"
import type { ColumnFiltersState, PaginationState, RowSelectionState, SortingState } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { DataTable, DataTableAction } from "@/components/ui/data-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { CHANNELS, HOTELS, hotel, STATUSES, type Reservation } from "@/lib/data/hotel"
import { iso, TODAY } from "@/lib/data/seed"
import { reservationColumns } from "./columns"
import { ACCESSORS, fetchPage, type PageResult } from "./query"
import { ReservationDrawer } from "./reservation-drawer"

type Mode = "client" | "server"
const NOUN = { singular: "reservation", plural: "reservations" }
const TODAY_ISO = iso(TODAY)
const HOTEL_NAMES = HOTELS.map((h) => h.name)

declare global {
  interface Window {
    __resvPerf?: { generate: number; mounted?: number }
  }
}

function loadRows() {
  const t = performance.now()
  const rows = hotel().reservations.slice()
  if (typeof window !== "undefined") window.__resvPerf ??= { generate: performance.now() - t }
  return rows
}

const canCheckIn = (r: Reservation) =>
  (r.status === "Confirmed" || r.status === "Pending") && r.checkIn <= TODAY_ISO && r.checkOut > TODAY_ISO
const canCancel = (r: Reservation) => r.status === "Confirmed" || r.status === "Pending"

function useDebounced<T>(value: T, ms: number) {
  const [v, setV] = React.useState(value)
  React.useEffect(() => {
    const t = setTimeout(() => setV(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return v
}

function MultiFilter({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: readonly string[]
  value: string[]
  onChange: (next: string[]) => void
}) {
  return (
    <Select multiple items={options.map((o) => ({ value: o, label: o }))} value={value} onValueChange={(next) => onChange((next ?? []) as string[])}>
      <SelectTrigger aria-label={label} className="h-8 w-auto min-w-36 gap-1.5 text-[13px]">
        <SelectValue>{(v: string[]) => (v.length === 0 ? `${label}: all` : v.length === 1 ? v[0] : `${label}: ${v.length}`)}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o} showIndicator className="text-[13px]">
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function toCsv(rows: Reservation[]) {
  const keys = Object.keys(ACCESSORS)
  const esc = (v: unknown) => {
    const s = String(v ?? "")
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  return [keys.join(","), ...rows.map((r) => keys.map((k) => esc(ACCESSORS[k](r))).join(","))].join("\n")
}

export function ReservationsScreen() {
  const [rows, setRows] = React.useState<Reservation[]>(loadRows)
  const rowsRef = React.useRef(rows)
  rowsRef.current = rows
  const index = React.useMemo(() => new Map(rows.map((r, i) => [r.id, i])), [rows.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const [mode, setMode] = React.useState<Mode>("client")
  const [density, setDensity] = React.useState<"comfortable" | "compact">("comfortable")
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "checkIn", desc: false }])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [pagination, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: 50 })
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [openId, setOpenId] = React.useState<string | null>(null)
  const [notice, setNotice] = React.useState("")

  React.useEffect(() => {
    if (window.__resvPerf) window.__resvPerf.mounted = performance.now()
    window.__resv ??= { failNext: false, failRate: 0.08, latency: 300 }
  }, [])

  /* ---- filters held outside the table ---- */
  const filterOf = (id: string) => (columnFilters.find((f) => f.id === id)?.value as string[] | undefined) ?? []
  const setFilter = (id: string, value: string[]) => {
    setColumnFilters((prev) => {
      const rest = prev.filter((f) => f.id !== id)
      return value.length ? [...rest, { id, value }] : rest
    })
    setPagination((p) => ({ ...p, pageIndex: 0 }))
  }

  /* ---- server mode ---- */
  const search = useDebounced(globalFilter, 250)
  const [page, setPage] = React.useState<PageResult | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(false)
  const [attempt, setAttempt] = React.useState(0)
  const query = JSON.stringify({ sorting, columnFilters, search, pagination })
  React.useEffect(() => {
    if (mode !== "server") return
    let live = true
    const q = JSON.parse(query)
    setLoading(true)
    setError(false)
    fetchPage(() => rowsRef.current, {
      sorting: q.sorting,
      columnFilters: q.columnFilters,
      globalFilter: q.search,
      pageIndex: q.pagination.pageIndex,
      pageSize: q.pagination.pageSize,
    }).then(
      (result) => {
        if (!live) return
        setPage(result)
        setLoading(false)
      },
      () => {
        if (!live) return
        setError(true)
        setLoading(false)
      }
    )
    return () => {
      live = false
    }
  }, [mode, query, attempt])

  /* ---- mutations ---- */
  const patch = React.useCallback(
    (ids: string[], change: (r: Reservation) => Partial<Reservation> | null) => {
      const current = rowsRef.current
      const next = current.slice()
      const changed = new Map<string, Reservation>()
      for (const id of ids) {
        const i = index.get(id)
        if (i === undefined) continue
        const p = change(current[i])
        if (!p) continue
        next[i] = { ...current[i], ...p }
        changed.set(id, next[i])
      }
      if (!changed.size) return 0
      rowsRef.current = next
      setRows(next)
      setPage((pg) => (pg ? { ...pg, rows: pg.rows.map((r) => changed.get(r.id) ?? r) } : pg))
      return changed.size
    },
    [index]
  )

  const act = (label: string, ids: string[], test: (r: Reservation) => boolean, p: Partial<Reservation>) => {
    const n = patch(ids, (r) => (test(r) ? p : null))
    const skipped = ids.length - n
    setNotice(`${label} ${n.toLocaleString()}${skipped ? `, ${skipped.toLocaleString()} skipped` : ""}`)
  }
  const exportCsv = (ids: string[]) => {
    const list = ids.map((id) => rowsRef.current[index.get(id)!]).filter(Boolean)
    const url = URL.createObjectURL(new Blob([toCsv(list)], { type: "text/csv" }))
    const a = document.createElement("a")
    a.href = url
    a.download = `reservations-${TODAY_ISO}.csv`
    a.click()
    URL.revokeObjectURL(url)
    setNotice(`Exported ${list.length.toLocaleString()}`)
  }

  /* ---- table ---- */
  const open = React.useCallback((id: string) => setOpenId(id), [])
  const columns = React.useMemo(() => reservationColumns(open), [open])
  const facet = React.useMemo(
    () => ({
      column: "status",
      options: STATUSES.map((s) => (mode === "server" ? { value: s, count: page?.statusCounts[s] ?? 0 } : s)),
    }),
    [mode, page?.statusCounts]
  )

  const reservation = openId ? rows[index.get(openId) ?? -1] : undefined
  const server = mode === "server"

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
        <h1 className="m-0 text-2xl font-semibold tracking-[-0.015em]">Reservations</h1>
        <span className="text-sm tabular-nums text-muted-foreground">{rows.length.toLocaleString()}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <ToggleGroup
          aria-label="Data source"
          value={[mode]}
          onValueChange={(v) => {
            if (!v.length) return
            setMode(v[v.length - 1] as Mode)
            setPagination((p) => ({ ...p, pageIndex: 0 }))
          }}
          className="gap-0.5"
        >
          <ToggleGroupItem value="client" className="h-8 text-[13px]">All rows</ToggleGroupItem>
          <ToggleGroupItem value="server" className="h-8 text-[13px]">Server pages</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup
          aria-label="Density"
          value={[density]}
          onValueChange={(v) => v.length && setDensity(v[v.length - 1] as typeof density)}
          className="gap-0.5"
        >
          <ToggleGroupItem value="comfortable" className="h-8 text-[13px]">Comfortable</ToggleGroupItem>
          <ToggleGroupItem value="compact" className="h-8 text-[13px]">Compact</ToggleGroupItem>
        </ToggleGroup>
        <span className="mx-1 h-5 w-px bg-border" aria-hidden />
        <MultiFilter label="Hotel" options={HOTEL_NAMES} value={filterOf("hotel")} onChange={(v) => setFilter("hotel", v)} />
        <MultiFilter label="Channel" options={CHANNELS} value={filterOf("channel")} onChange={(v) => setFilter("channel", v)} />
        <span role="status" aria-live="polite" className="ml-auto text-[13px] text-muted-foreground">
          {notice}
        </span>
      </div>

      <div className="[&_tbody_tr[data-row-id]]:cursor-pointer">
        <DataTable<Reservation>
          data={server ? (page?.rows ?? []) : rows}
          columns={columns}
          noun={NOUN}
          title={null}
          getRowLabel={(r) => `${r.id}, ${r.guest}`}
          facet={facet}
          density={density}
          virtualize={!server}
          maxHeight={server ? undefined : 620}
          rowCount={server ? (page?.rowCount ?? 0) : undefined}
          pageSizes={[25, 50, 100]}
          loading={server && loading}
          error={server && error}
          onRetry={() => setAttempt((n) => n + 1)}
          sorting={sorting}
          onSortingChange={(v) => setSorting(v)}
          columnFilters={columnFilters}
          onColumnFiltersChange={(v) => setColumnFilters(v)}
          globalFilter={globalFilter}
          onGlobalFilterChange={(v) => setGlobalFilter(v)}
          pagination={pagination}
          onPaginationChange={(v) => setPagination(v)}
          rowSelection={rowSelection}
          onRowSelectionChange={(v) => setRowSelection(v)}
          emptyState={({ query, clear }) => (
            <div className="grid h-[var(--data-table-state-height)] place-content-center justify-items-center gap-3 text-center">
              <p className="m-0 text-sm">{query ? `No reservations match “${query}”` : "No reservations match these filters"}</p>
              <Button variant="outline" size="sm" className="h-8" onClick={clear}>
                Clear filters
              </Button>
            </div>
          )}
          onRowOpen={(r) => setOpenId(r.id)}
          searchDelay={150}
          selectionActions={(_rows, _clear, selection) => (
            <>
              <Button size="sm" variant="outline" className="h-8" onClick={() => act("Checked in", selection.ids, canCheckIn, { status: "Checked in" })}>
                Check in
              </Button>
              <Button size="sm" variant="outline" className="h-8" onClick={() => act("Cancelled", selection.ids, canCancel, { status: "Cancelled" })}>
                Cancel
              </Button>
              <Button size="sm" variant="outline" className="h-8" onClick={() => exportCsv(selection.ids)}>
                Export CSV
              </Button>
            </>
          )}
          rowActions={(r) => (
            <>
              <DataTableAction onClick={() => setOpenId(r.id)}>Open</DataTableAction>
              <DataTableAction disabled={!canCheckIn(r)} onClick={() => act("Checked in", [r.id], canCheckIn, { status: "Checked in" })}>
                Check in
              </DataTableAction>
              <DataTableAction onClick={() => navigator.clipboard?.writeText(r.id)}>Copy ID</DataTableAction>
              <DataTableAction destructive disabled={!canCancel(r)} onClick={() => act("Cancelled", [r.id], canCancel, { status: "Cancelled" })}>
                Cancel
              </DataTableAction>
            </>
          )}
        />
      </div>

      <ReservationDrawer
        reservation={reservation}
        onClose={() => setOpenId(null)}
        onChange={(id, p) => {
          patch([id], () => p)
        }}
      />
    </div>
  )
}
