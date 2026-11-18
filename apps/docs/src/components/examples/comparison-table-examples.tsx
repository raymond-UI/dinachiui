"use client";

import { useState } from "react";
import {
  ComparisonTable,
  type ComparisonBilling,
  type ComparisonGroup,
  type ComparisonPlan,
} from "@/components/ui/comparison-table";

const perSeat = { monthly: "a month", yearly: "a month, billed yearly" };

export const PLANS: ComparisonPlan[] = [
  { id: "starter", name: "Starter", price: { monthly: "£0", yearly: "£0" }, cta: { label: "Start free" } },
  { id: "team", name: "Team", price: { monthly: "£24", yearly: "£20" }, per: perSeat, highlighted: true },
  { id: "business", name: "Business", price: { monthly: "£79", yearly: "£66" }, per: perSeat },
];

export const GROUPS: ComparisonGroup[] = [
  {
    label: "Usage",
    features: [
      { label: "Projects", values: { starter: "3", team: "Unlimited", business: "Unlimited" } },
      { label: "Seats", values: { starter: "1", team: "Up to 20", business: "Unlimited" } },
      { label: "Storage", values: { starter: "5 GB", team: "100 GB", business: "1 TB" } },
      { label: "Builds a month", values: { starter: "100", team: "3,000", business: "Unlimited" } },
      { label: "Bandwidth", values: { starter: "100 GB", team: "1 TB", business: "1 TB" } },
    ],
  },
  {
    label: "Collaboration",
    features: [
      { label: "Comments", values: { starter: true, team: true, business: true } },
      { label: "Preview links", values: { starter: true, team: true, business: true } },
      { label: "Roles and permissions", values: { starter: false, team: true, business: true } },
      { label: "Single sign-on", values: { starter: false, team: false, business: true } },
      { label: "Audit log", values: { starter: false, team: false, business: true } },
    ],
  },
  {
    label: "Support",
    features: [
      { label: "Help centre", values: { starter: true, team: true, business: true } },
      { label: "Email support", values: { starter: false, team: true, business: true } },
      { label: "Response time", values: { starter: "None", team: "1 day", business: "4 hours" } },
      { label: "Uptime SLA", values: { starter: false, team: false, business: "99.9%" } },
    ],
  },
];

export function DefaultComparisonTableExample() {
  return (
    <ComparisonTable
      plans={PLANS}
      groups={GROUPS}
      note="Prices per seat, ex. VAT"
      maxHeight={470}
      className="max-w-[820px] shadow-sm"
    />
  );
}

export function ControlledComparisonTableExample() {
  const [billing, setBilling] = useState<ComparisonBilling>("yearly");
  const [only, setOnly] = useState(true);
  return (
    <div className="grid w-full max-w-[820px] gap-3">
      <p className="text-[13px] text-muted-foreground">
        {billing === "yearly" ? "Billed yearly" : "Billed monthly"}, {only ? "differences only" : "every feature"}
      </p>
      <ComparisonTable
        plans={PLANS}
        groups={GROUPS}
        note="Prices per seat, ex. VAT"
        billing={billing}
        onBillingChange={setBilling}
        onlyDifferences={only}
        onOnlyDifferencesChange={setOnly}
        maxHeight={470}
        className="shadow-sm"
      />
    </div>
  );
}
