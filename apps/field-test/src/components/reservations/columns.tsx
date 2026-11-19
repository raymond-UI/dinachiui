"use client"

import type { ColumnDef, FilterFn } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { DataTableRowTrigger } from "@/components/ui/data-table"
import { hotelName, type Reservation } from "@/lib/data/hotel"
import { balanceOf } from "./query"
import { date, money, STATUS_VARIANT } from "./format"

const anyOf: FilterFn<Reservation> = (row, id, value: string[]) => !value?.length || value.includes(row.getValue<string>(id))

export function reservationColumns(open: (id: string) => void): ColumnDef<Reservation, any>[] {
  return [
    {
      accessorKey: "id",
      header: "ID",
      size: 116,
      meta: { pin: "left", phone: "meta" },
      cell: ({ row }) => (
        <DataTableRowTrigger
          onClick={(event) => {
            event.preventDefault()
            open(row.original.id)
          }}
        >
          {row.original.id}
        </DataTableRowTrigger>
      ),
    },
    {
      accessorKey: "guest",
      header: "Guest",
      size: 210,
      meta: { phone: "title" },
      cell: ({ row }) => (
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="truncate">{row.original.guest}</span>
          {row.original.tier !== "None" && (
            <Badge variant="outline" size="sm" className="shrink-0 px-1.5 py-0 text-[10.5px] font-normal text-muted-foreground">
              {row.original.tier}
            </Badge>
          )}
        </span>
      ),
    },
    { id: "hotel", accessorFn: (r) => hotelName(r.hotel), header: "Hotel", size: 168, filterFn: anyOf, meta: { phone: "meta" } },
    { accessorKey: "room", header: "Room", size: 72 },
    { accessorKey: "checkIn", header: "Check-in", size: 116, cell: (c) => date(c.getValue()), meta: { sortLabels: ["Earliest arrival", "Latest arrival"] } },
    { accessorKey: "checkOut", header: "Check-out", size: 116, cell: (c) => date(c.getValue()) },
    { accessorKey: "nights", header: "Nights", size: 76, meta: { numeric: true } },
    {
      accessorKey: "status",
      header: "Status",
      size: 116,
      meta: { phone: "value" },
      cell: ({ row }) => (
        <Badge variant={STATUS_VARIANT[row.original.status]} size="sm" className="whitespace-nowrap font-normal">
          {row.original.status}
        </Badge>
      ),
    },
    { accessorKey: "channel", header: "Channel", size: 132, filterFn: anyOf },
    { accessorKey: "ratePlan", header: "Rate plan", size: 150 },
    { accessorKey: "total", header: "Total", size: 96, meta: { numeric: true }, cell: (c) => money(c.getValue()) },
    {
      id: "balance",
      accessorFn: balanceOf,
      header: "Balance",
      size: 96,
      meta: { numeric: true },
      cell: (c) => {
        const v = c.getValue<number>()
        return <span className={v > 0 ? "text-foreground" : "text-muted-foreground"}>{money(v)}</span>
      },
    },
    { accessorKey: "created", header: "Created", size: 116, cell: (c) => date(c.getValue()) },
  ]
}
