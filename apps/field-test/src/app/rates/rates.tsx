"use client";

import * as React from "react";
import { ComparisonTable, type ComparisonGroup, type ComparisonPlan } from "@/components/ui/comparison-table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { HOTELS, RATE_PLANS, ROOM_TYPES, type HotelId, type RoomTypeId } from "@/lib/data/hotel";

const HOTEL_FACTOR: Record<HotelId, number> = { hbr: 1, cly: 0.94, avn: 1.18, tyn: 0.9, lks: 1.06, cor: 1.24 };
const PLAN_FACTOR: Record<(typeof RATE_PLANS)[number], number> = {
  Flexible: 1,
  "Advance saver": 0.85,
  "Bed and breakfast": 1.12,
  Corporate: 0.92,
  Member: 0.9,
};
const SIZE: Record<RoomTypeId, number> = { std: 18, sup: 24, twn: 26, jrs: 36, gdn: 44, pnt: 78 };
const BED: Record<RoomTypeId, string> = {
  std: "Queen",
  sup: "King",
  twn: "Two singles",
  jrs: "King and sofa bed",
  gdn: "King and two singles",
  pnt: "Super king and two singles",
};
const RECOMMENDED: RoomTypeId = "jrs";

const gbp = (n: number) => `£${n.toLocaleString("en-GB")}`;
const has = (from: RoomTypeId) => {
  const order = ROOM_TYPES.map((t) => t.id);
  return Object.fromEntries(order.map((id) => [id, order.indexOf(id) >= order.indexOf(from)]));
};

function build(hotelId: HotelId) {
  const price = (type: (typeof ROOM_TYPES)[number], plan: (typeof RATE_PLANS)[number]) =>
    Math.round(type.base * HOTEL_FACTOR[hotelId] * PLAN_FACTOR[plan]);

  const plans: ComparisonPlan[] = ROOM_TYPES.map((t) => {
    const from = gbp(Math.min(...RATE_PLANS.map((p) => price(t, p))));
    const per = (
      <span className="inline-flex flex-wrap items-center gap-1.5">
        from, a night
        {t.id === RECOMMENDED && <Badge variant="secondary">Recommended</Badge>}
      </span>
    );
    return {
      id: t.id,
      name: t.name,
      // Billing is fixed to monthly and yearly, so both carry the same nightly price.
      price: { monthly: from, yearly: from },
      per: { monthly: per, yearly: per },
      cta: { label: "Book" },
      highlighted: t.id === RECOMMENDED,
    };
  });

  const by = <T,>(f: (t: (typeof ROOM_TYPES)[number]) => T) => Object.fromEntries(ROOM_TYPES.map((t) => [t.id, f(t)]));

  const groups: ComparisonGroup[] = [
    {
      label: "Rate per night",
      features: RATE_PLANS.map((p) => ({ label: p, values: by((t) => gbp(price(t, p))) })),
    },
    {
      label: "Room",
      features: [
        { label: "Sleeps", values: by((t) => t.sleeps) },
        { label: "Size", values: by((t) => `${SIZE[t.id]} m²`) },
        { label: "Beds", values: by((t) => BED[t.id]) },
      ],
    },
    {
      label: "Amenities",
      features: [
        { label: "Wi-Fi", values: by(() => true) },
        { label: "Rain shower", values: by(() => true) },
        { label: "Coffee machine", values: has("sup") },
        { label: "Bathtub", values: has("jrs") },
        { label: "Sitting area", values: has("jrs") },
        { label: "Terrace", values: has("gdn") },
        { label: "Butler service", values: has("pnt") },
      ],
    },
    {
      label: "Cancellation",
      features: [
        { label: "Flexible", values: by(() => "Free until 24 hours before") },
        { label: "Advance saver", values: by(() => false) },
        { label: "Bed and breakfast", values: by(() => "Free until 48 hours before") },
        { label: "Corporate", values: by(() => "Free until 18:00 on arrival") },
        { label: "Member", values: by((t) => (t.id === "pnt" ? "Free until 7 days before" : "Free until 24 hours before")) },
      ],
    },
  ];
  return { plans, groups };
}

export function Rates() {
  const [hotelId, setHotel] = React.useState<HotelId>("hbr");
  const { plans, groups } = React.useMemo(() => build(hotelId), [hotelId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <h1 className="text-xl font-semibold">Rates</h1>
        <ToggleGroup
          aria-label="Hotel"
          value={[hotelId]}
          onValueChange={(v) => {
            if (v[0]) setHotel(v[0] as HotelId);
          }}
          className="flex-wrap justify-start"
        >
          {HOTELS.map((h) => (
            <ToggleGroupItem key={h.id} value={h.id}>
              {h.city}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <ComparisonTable
        plans={plans}
        groups={groups}
        note="Prices in GBP, per room per night"
        // The billing toggle can't be turned off or relabelled, and nightly rates have no period.
        className="[&_[data-slot=comparison-table-billing]]:hidden"
      />
    </div>
  );
}
