"use client"

import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DetailList, DetailListDetails, DetailListItem, DetailListTerm, type DetailListDetailsProps, type DetailListItemProps } from "@/components/ui/detail-list"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { hotelName, roomTypeName, STATUSES, type Reservation, type Status } from "@/lib/data/hotel"
import { date, money, STATUS_VARIANT } from "./format"

export interface ReservationDrawerProps {
  reservation: Reservation | undefined
  onClose: () => void
  onChange: (id: string, patch: Partial<Reservation>) => void
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <h3 className="mb-1 text-[13px] font-medium">{title}</h3>
      <DetailList>{children}</DetailList>
    </section>
  )
}

function Row({ term, children, ...item }: { term: string; children?: DetailListDetailsProps["children"] } & Omit<DetailListItemProps, "children">) {
  return (
    <DetailListItem {...item}>
      <DetailListTerm>{term}</DetailListTerm>
      <DetailListDetails>{children}</DetailListDetails>
    </DetailListItem>
  )
}

export function ReservationDrawer({ reservation: r, onClose, onChange }: ReservationDrawerProps) {
  return (
    <Drawer open={r !== undefined} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent side="right" className="w-[440px] max-w-[92vw] gap-0 p-0 sm:max-w-[440px]">
        {r && (
          <div className="px-5 pb-8 pt-5">
            <div className="flex items-start gap-2">
              <div className="mr-auto min-w-0">
                <DrawerTitle className="text-[17px] font-semibold">{r.guest}</DrawerTitle>
                <DrawerDescription className="mt-1 font-mono text-[12.5px]">{r.id}</DrawerDescription>
              </div>
              <Badge variant={STATUS_VARIANT[r.status]} size="sm" className="mt-0.5 font-normal">
                {r.status}
              </Badge>
              <DrawerClose
                aria-label="Close"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="h-4 w-4" />
              </DrawerClose>
            </div>

            <Section title="Guest">
              <Row term="Name" value={r.guest} />
              <Row term="Tier" value={r.tier} />
              <Row term="Party" value={`${r.adults} adult${r.adults === 1 ? "" : "s"}${r.children ? `, ${r.children} child${r.children === 1 ? "" : "ren"}` : ""}`} />
            </Section>

            <Section title="Contact">
              <Row
                term="Email"
                value={r.email}
                copyable
                editable
                validate={(v) => (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) ? undefined : "Enter an email address")}
                onValueChange={(email) => onChange(r.id, { email })}
              />
              <Row term="Phone" value={r.phone} copyable editable onValueChange={(phone) => onChange(r.id, { phone })} />
            </Section>

            <Section title="Stay">
              <Row term="Hotel" value={hotelName(r.hotel)} />
              <Row term="Room" value={`${r.room}, ${roomTypeName(r.roomType)}`} />
              <Row term="Dates" value={`${date(r.checkIn)} to ${date(r.checkOut)}`} />
              <Row term="Nights" value={String(r.nights)} />
              <Row term="Arrival" value={r.arrival ?? "None"} />
              <Row term="Status">
                <Select
                  items={STATUSES.map((s) => ({ value: s, label: s }))}
                  value={r.status}
                  onValueChange={(status) => status && onChange(r.id, { status: status as Status })}
                >
                  <SelectTrigger aria-label="Status" className="h-8 w-44 text-[13px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s} className="text-[13px]">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Row>
            </Section>

            <Section title="Payment">
              <Row term="Rate plan" value={r.ratePlan} />
              <Row term="Channel" value={r.channel} />
              <Row term="Nightly" value={money(r.nightly)} />
              <Row term="Total" value={money(r.total)} />
              <Row term="Paid" value={money(r.paid)} />
              <Row term="Balance" value={money(r.total - r.paid)} />
            </Section>

            <Section title="Notes">
              <Row
                term="Notes"
                value={r.notes}
                editable
                copyable
                multiline
                validate={(v) => (v.length > 2000 ? "Keep notes under 2,000 characters" : undefined)}
                onValueChange={(notes) => onChange(r.id, { notes })}
              >
                {(v) => v || <span className="text-muted-foreground">None</span>}
              </Row>
            </Section>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  )
}
