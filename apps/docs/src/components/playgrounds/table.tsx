"use client";

import { cn } from "@/lib/utils";
import { Invoice, invoiceCard } from "@/components/examples/table-examples";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = {
  density: string;
  dividers: string;
  stack: boolean;
};

function Demo({ values: v }: DemoProps<V>) {
  return (
    // Stacking follows the table's own width, so the stacked demo is given a phone's.
    <div className={cn(invoiceCard, v.stack && "max-w-[390px]")}>
      <Invoice brief density={v.density as "comfortable" | "compact"} dividers={v.dividers as "rows" | "none"} stack={v.stack} />
    </div>
  );
}

function code(v: V): string {
  const props: string[] = [];
  if (v.density !== "comfortable") props.push(`density="${v.density}"`);
  if (v.dividers !== "rows") props.push(`dividers="${v.dividers}"`);
  if (v.stack) props.push("stack");
  const open = props.length ? `<Table ${props.join(" ")}>` : "<Table>";
  return [
    `import {`,
    `  Table,`,
    `  TableBody,`,
    `  TableCaption,`,
    `  TableCell,`,
    `  TableFooter,`,
    `  TableHead,`,
    `  TableHeader,`,
    `  TableRow,`,
    `} from "@/components/ui/table"`,
    ``,
    `export function Invoice({ lines }: { lines: Line[] }) {`,
    `  return (`,
    `    ${open}`,
    `      <TableCaption>Invoice 2048</TableCaption>`,
    `      <TableHeader>`,
    `        <TableRow>`,
    `          <TableHead>Item</TableHead>`,
    `          <TableHead numeric>Qty</TableHead>`,
    `          <TableHead numeric>Price</TableHead>`,
    `          <TableHead numeric>Amount</TableHead>`,
    `        </TableRow>`,
    `      </TableHeader>`,
    `      <TableBody>`,
    `        {lines.map((l) => (`,
    `          <TableRow key={l.item}>`,
    `            <TableCell${v.stack ? ' stack="title"' : ""}>{l.item}</TableCell>`,
    `            <TableCell numeric${v.stack ? ' stack="meta"' : ""}>{l.qty}</TableCell>`,
    `            <TableCell numeric${v.stack ? ' stack="meta"' : ""}>{money(l.price)}</TableCell>`,
    `            <TableCell numeric${v.stack ? ' stack="value"' : ""}>{money(l.qty * l.price)}</TableCell>`,
    `          </TableRow>`,
    `        ))}`,
    `      </TableBody>`,
    `      <TableFooter>`,
    `        <TableRow>`,
    `          <TableCell colSpan={3}>Total</TableCell>`,
    `          <TableCell numeric>{money(total(lines))}</TableCell>`,
    `        </TableRow>`,
    `      </TableFooter>`,
    `    </Table>`,
    `  )`,
    `}`,
  ].join("\n");
}

export default playground<V>({
  file: "invoice.tsx",
  controls: [
    { name: "density", type: "select", options: ["comfortable", "compact"], default: "comfortable" },
    { name: "dividers", type: "select", options: ["rows", "none"], default: "rows" },
    { name: "stack", type: "boolean", default: true },
  ],
  Demo,
  code,
  height: 500,
});
