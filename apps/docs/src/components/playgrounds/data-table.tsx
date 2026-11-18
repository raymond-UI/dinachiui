"use client";

import * as React from "react";
import { isAgentChange } from "@/components/ui/agent";
import type { DataTableChangeDetails } from "@/components/ui/data-table";
import { OrderLines, Orders } from "@/components/examples/data-table-examples";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = {
  density: string;
  state: string;
  expandable: boolean;
  selectable: boolean;
  disabled: boolean;
};

function Demo({ values: v, refuse }: DemoProps<V>) {
  const guard = (details: DataTableChangeDetails) => {
    if (refuse && isAgentChange(details)) details.cancel();
  };
  const handlers = {
    onSortingChange: (_: unknown, d: DataTableChangeDetails) => guard(d),
    onColumnFiltersChange: (_: unknown, d: DataTableChangeDetails) => guard(d),
    onGlobalFilterChange: (_: unknown, d: DataTableChangeDetails) => guard(d),
    onPaginationChange: (_: unknown, d: DataTableChangeDetails) => guard(d),
    onRowSelectionChange: (_: unknown, d: DataTableChangeDetails) => guard(d),
  };
  return (
    <Orders
      key={v.state}
      // The stage is a fixed height, so the rows scroll under the header and the footer stays in view.
      title={null}
      maxHeight={236}
      {...handlers}
      density={v.density as "comfortable" | "compact"}
      loading={v.state === "loading"}
      error={v.state === "error"}
      onRetry={() => {}}
      {...(v.state === "empty" ? { data: [] } : {})}
      selectable={v.selectable}
      disabled={v.disabled}
      renderSubComponent={v.expandable ? (row) => <OrderLines order={row.original} /> : undefined}
    />
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const props = [
    "data={orders}",
    "columns={columns}",
    'noun={{ singular: "order", plural: "orders" }}',
    'facet={{ column: "status" }}',
    'defaultSorting={[{ id: "placed", desc: true }]}',
    "getRowLabel={(o) => `Order #${o.id}`}",
  ];
  if (v.density !== "comfortable") props.push(`density="${v.density}"`);
  if (v.state === "loading") props.push("loading");
  if (v.state === "error") props.push("error", "onRetry={refetch}");
  if (!v.selectable) props.push("selectable={false}");
  if (v.disabled) props.push("disabled");
  if (v.expandable) props.push("renderSubComponent={(row) => <OrderLines order={row.original} />}");
  props.push("rowActions={(order) => (", "  <>", "    <DataTableAction>Copy order ID</DataTableAction>", "    <DataTableAction destructive>Refund</DataTableAction>", "  </>", ")}");
  if (refuse) {
    props.push("onSortingChange={(sorting, details) => {", "  if (isAgentChange(details)) details.cancel()", "}}");
  }
  const L = [
    `import { DataTable, DataTableAction, createColumnHelper } from "@/components/ui/data-table"`,
  ];
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push(
    "",
    "const col = createColumnHelper<Order>()",
    "",
    "const columns = [",
    '  col.accessor("id", { header: "Order", size: 84, meta: { pin: "left", phone: "meta" } }),',
    '  col.accessor("customer", { header: "Customer", meta: { phone: "title" } }),',
    '  col.accessor("status", { header: "Status", size: 100, meta: { phone: "meta" } }),',
    '  col.accessor("channel", { header: "Channel", size: 84 }),',
    '  col.accessor("items", { header: "Items", size: 64, meta: { numeric: true } }),',
    '  col.accessor("placed", { header: "Placed", size: 116, meta: { phone: "meta", sortLabels: ["Oldest", "Newest"] } }),',
    '  col.accessor("amount", { header: "Amount", size: 96, meta: { numeric: true, phone: "value", sortLabels: ["Lowest", "Highest"] } }),',
    "]",
    "",
    "export function Orders({ orders }: { orders: Order[] }) {",
    "  return (",
    "    <DataTable"
  );
  props.forEach((p) => L.push(`      ${p}`));
  L.push("    />", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "orders.tsx",
  refusable: true,
  tall: true,
  controls: [
    { name: "density", type: "select", options: ["comfortable", "compact"], default: "comfortable" },
    { name: "state", type: "select", options: ["rows", "loading", "empty", "error"], default: "rows" },
    { name: "expandable", type: "boolean", default: false },
    { name: "selectable", type: "boolean", default: true },
    { name: "disabled", type: "boolean", default: false },
  ],
  tries: [
    { label: "Sort by amount", action: "select", args: ["Amount descending"], target: "Sort orders" },
    { label: "Oldest first", action: "select", args: ["Oldest"], target: "Sort orders" },
    { label: "Only failed", action: "select", args: ["Failed"], target: "Filter orders by Status" },
    { label: "Search Ada", action: "setValue", args: ["Ada"], target: "Search orders" },
    { label: "Select #4821", action: "select", args: ["Order #4821"], target: "Select orders" },
    { label: "Page 3", action: "setValue", args: [3], target: "Pages of orders" },
    { label: "Sort by colour", action: "select", args: ["Colour"], target: "Sort orders" },
  ],
  Demo,
  code,
});
