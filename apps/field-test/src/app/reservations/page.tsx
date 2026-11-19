import type { Metadata } from "next"
import { ReservationsScreen } from "@/components/reservations/reservations-screen"

export const metadata: Metadata = { title: "Reservations" }

export default function ReservationsPage() {
  return <ReservationsScreen />
}
