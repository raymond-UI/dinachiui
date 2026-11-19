"use client";

import * as React from "react";
import { Invoice, invoiceCard } from "@/components/examples/table-examples";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = {
  density: string;
  dividers: string;
  stack: boolean;
};

const phone = "(max-width: 767px)";

function useNarrow() {
  return React.useSyncExternalStore(
    (on) => {
      const m = window.matchMedia(phone);
      m.addEventListener("change", on);
      return () => m.removeEventListener("change", on);
    },
    () => window.matchMedia(phone).matches,
    () => false,
  );
}

// `stack` answers to the viewport, not the stage, so on a wide screen the stacked table
// is shown in a phone-width frame.
function PhoneFrame({ density, dividers }: { density: string; dividers: string }) {
  const [height, setHeight] = React.useState(300);
  const ref = React.useRef<HTMLIFrameElement>(null);
  React.useEffect(() => {
    const frame = ref.current;
    if (!frame) return;
    let observer: ResizeObserver | undefined;
    const measure = () => {
      const content = frame.contentDocument?.querySelector<HTMLElement>("[data-frame]");
      if (!content) return;
      observer?.disconnect();
      observer = new ResizeObserver(() => setHeight(content.offsetHeight));
      observer.observe(content);
    };
    frame.addEventListener("load", measure);
    measure();
    return () => {
      frame.removeEventListener("load", measure);
      observer?.disconnect();
    };
  }, []);
  return (
    <iframe
      ref={ref}
      title="Stacked table at phone width"
      src={`/frame/table?density=${density}&dividers=${dividers}`}
      style={{ height }}
      className="w-[390px] max-w-full rounded-[28px] border bg-background shadow-sm"
    />
  );
}

function Demo({ values: v, anatomy }: DemoProps<V>) {
  const narrow = useNarrow();
  if (v.stack && !anatomy && !narrow) return <PhoneFrame density={v.density} dividers={v.dividers} />;
  return (
    <div className={invoiceCard}>
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
