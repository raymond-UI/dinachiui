"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  type TableProps,
} from "@/components/ui/table";

export const invoiceLines = [
  { item: "Merino jumper", variant: "Charcoal, M", qty: 1, price: 118 },
  { item: "Linen shirt", variant: "Sand, L", qty: 2, price: 64 },
  { item: "Wool scarf", variant: "Rust", qty: 1, price: 38 },
  { item: "Socks, 3 pack", variant: "Grey marl", qty: 2, price: 15 },
];

export const money = (n: number) => "£" + n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const delivery = 4.95;

/** Invoice 2048. `brief` keeps three lines and the total, to fit the playground's stage. */
export function Invoice({ brief, ...props }: Omit<TableProps, "children"> & { brief?: boolean }) {
  const compact = props.density === "compact";
  const lines = brief ? invoiceLines.slice(0, 3) : invoiceLines;
  const sum = lines.reduce((n, l) => n + l.qty * l.price, 0) + (brief ? 0 : delivery);
  return (
    <Table {...props}>
      <TableCaption>
        <span className="flex items-baseline justify-between gap-4">
          <span className="text-base font-semibold text-foreground">Invoice 2048</span>
          <span>Due 1 Dec 2026</span>
        </span>
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead numeric>Qty</TableHead>
          <TableHead numeric>Price</TableHead>
          <TableHead numeric>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {lines.map((l) => (
          <TableRow key={l.item}>
            <TableCell stack="title">
              {l.item}
              {!compact && <span className="block text-xs font-normal text-muted-foreground">{l.variant}</span>}
            </TableCell>
            <TableCell numeric stack="meta">
              {l.qty}
              <span className="md:hidden"> ×</span>
            </TableCell>
            <TableCell numeric stack="meta">{money(l.price)}</TableCell>
            <TableCell numeric stack="value">{money(l.qty * l.price)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        {!brief && (
          <>
            <TableRow>
              <TableCell colSpan={3} className="text-muted-foreground">Delivery</TableCell>
              <TableCell numeric>{money(delivery)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3} className="text-muted-foreground">VAT included</TableCell>
              <TableCell numeric className="text-muted-foreground">{money(sum / 6)}</TableCell>
            </TableRow>
          </>
        )}
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell numeric>{money(sum)}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}

export const invoiceCard = "w-full max-w-[560px] rounded-xl border bg-card px-3 pb-2.5 pt-[22px] shadow-sm max-md:border-0 max-md:bg-transparent max-md:px-0 max-md:shadow-none";

export function InvoiceTableExample() {
  return (
    <div className={invoiceCard}>
      <Invoice stack />
    </div>
  );
}

const usage = [
  { region: "Frankfurt", requests: 48210, errors: 0.12, p95: 182 },
  { region: "London", requests: 39875, errors: 0.08, p95: 164 },
  { region: "Virginia", requests: 61402, errors: 0.31, p95: 211 },
  { region: "Singapore", requests: 17336, errors: 0.05, p95: 238 },
];

export function CompactTableExample() {
  return (
    <div className="w-full max-w-[560px]">
      <Table density="compact" dividers="none">
        <TableCaption>Requests by region, last 24 hours</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Region</TableHead>
            <TableHead numeric>Requests</TableHead>
            <TableHead numeric>Errors</TableHead>
            <TableHead numeric>p95</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usage.map((r) => (
            <TableRow key={r.region}>
              <TableCell>{r.region}</TableCell>
              <TableCell numeric>{r.requests.toLocaleString("en-GB")}</TableCell>
              <TableCell numeric>{r.errors.toFixed(2)}%</TableCell>
              <TableCell numeric>{r.p95} ms</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
