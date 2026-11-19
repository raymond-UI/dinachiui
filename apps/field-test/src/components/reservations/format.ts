import { fromIso } from "@/lib/data/seed"
import type { Status } from "@/lib/data/hotel"

const gbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 })
const day = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" })

export const money = (n: number) => gbp.format(n)
export const date = (s: string) => day.format(fromIso(s))

export const STATUS_VARIANT: Record<Status, "info" | "success" | "secondary" | "warning" | "outline" | "destructive"> = {
  Pending: "warning",
  Confirmed: "info",
  "Checked in": "success",
  "Checked out": "secondary",
  Cancelled: "outline",
  "No-show": "destructive",
}
