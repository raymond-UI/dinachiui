"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { MenuSeparator } from "@/components/ui/menu";
import {
  DataTable,
  DataTableAction,
  DataTableRowTrigger,
  createColumnHelper,
  type DataTableProps,
  type DataTableState,
} from "@/components/ui/data-table";

export interface Order {
  id: number;
  customer: string;
  status: "Paid" | "Pending" | "Failed" | "Refunded";
  channel: "Web" | "iOS" | "Android" | "In store";
  items: number;
  placed: Date;
  amount: number;
  lines: { product: string; price: number }[];
}

function seed(n: number) {
  const x = Math.sin(n * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

const NAMES = ["Ada Okafor", "Tomás Herrera", "Mei Lin", "Priya Raman", "Jonah Weiss", "Amara Diallo", "Lukas Berg", "Sofia Russo", "Kenji Watanabe", "Hana Novak", "Olu Adeyemi", "Grace Kim", "Mateo Silva", "Inês Duarte", "Felix Wagner", "Zara Ahmed", "Noah Fischer", "Leila Haddad", "Sam Carter", "Elena Petrova"];
const PRODUCTS: [string, number][] = [["Linen shirt", 64], ["Wool scarf", 38], ["Canvas tote", 24], ["Leather belt", 52], ["Cotton tee", 22], ["Merino jumper", 118], ["Denim jacket", 140], ["Socks, 3 pack", 15]];
const COUNTS = { Paid: 201, Pending: 31, Failed: 9, Refunded: 7 } as const;
const CHANNELS = ["Web", "iOS", "Android", "In store"] as const;
const TODAY = new Date(2026, 10, 17, 16, 0).getTime();

/** Orders the same on every render and every machine, so the server and client agree. */
export function makeOrders(count = 248): Order[] {
  const statuses = (Object.entries(COUNTS) as [Order["status"], number][])
    .flatMap(([status, n]) => Array<Order["status"]>(n).fill(status))
    .map((status, i) => [status, seed(i + 300)] as const)
    .sort((a, b) => a[1] - b[1])
    .map(([status]) => status);
  // The newest few are still pending, as they would be in a live shop.
  for (let i = 0; i < 3; i++) {
    if (statuses[i] === "Pending") continue;
    const j = statuses.indexOf("Pending", 3);
    statuses[j] = statuses[i];
    statuses[i] = "Pending";
  }
  const top = Math.max(4821, count);
  return Array.from({ length: count }, (_, i) => {
    const n = 1 + Math.floor(seed(i + 7) * 3);
    const lines = Array.from({ length: n }, (_, k) => {
      const [product, price] = PRODUCTS[Math.floor(seed(i * 5 + k) * PRODUCTS.length)];
      return { product, price };
    });
    return {
      id: top - i,
      customer: i === 0 ? "Ada Okafor" : NAMES[Math.floor(seed(i + 1) * NAMES.length)],
      status: statuses[i % statuses.length],
      channel: CHANNELS[Math.floor(seed(i + 90) * 4)],
      items: lines.length,
      placed: new Date(TODAY - i * 2.9 * 36e5 - seed(i + 50) * 2 * 36e5),
      amount: lines.reduce((sum, l) => sum + l.price, 0) + (seed(i + 3) > 0.6 ? 4.95 : 0),
      lines,
    };
  });
}

export const ORDERS = makeOrders();

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const money = (n: number) => "£" + n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const day = (d: Date) => `${d.getDate()} ${MON[d.getMonth()]}`;
const time = (d: Date) => `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

const DOT: Record<Order["status"], string> = {
  Paid: "bg-[var(--success)]",
  Pending: "bg-[var(--warning)]",
  Failed: "bg-destructive",
  Refunded: "shadow-[inset_0_0_0_1.5px_var(--muted-foreground)]",
};

export function StatusDot({ status }: { status: Order["status"] }) {
  return (
    <span className="inline-flex items-center gap-[7px] whitespace-nowrap">
      <span aria-hidden className={`h-[7px] w-[7px] shrink-0 rounded-full ${DOT[status]}`} />
      {status}
    </span>
  );
}

const col = createColumnHelper<Order>();

export const orderColumns = [
  col.accessor("id", {
    header: "Order",
    size: 84,
    enableHiding: false,
    meta: { pin: "left", phone: "meta", phoneOrder: 0 },
    cell: (c) => <DataTableRowTrigger>#{c.getValue()}</DataTableRowTrigger>,
  }),
  col.accessor("customer", { header: "Customer", meta: { phone: "title" } }),
  col.accessor("status", { header: "Status", size: 100, meta: { phone: "meta", phoneOrder: 2 }, cell: (c) => <StatusDot status={c.getValue()} /> }),
  col.accessor("channel", { header: "Channel", size: 84 }),
  col.accessor("items", { header: "Items", size: 72, meta: { numeric: true } }),
  col.accessor("placed", {
    header: "Placed",
    size: 116,
    sortingFn: "datetime",
    meta: { phone: "meta", phoneOrder: 1, phoneCell: (c) => day(c.getValue()), sortLabels: ["Oldest", "Newest"] },
    cell: (c) => (
      <>
        {day(c.getValue())}
        <span className="text-muted-foreground">, {time(c.getValue())}</span>
      </>
    ),
  }),
  col.accessor("amount", {
    header: "Amount",
    size: 96,
    meta: { numeric: true, phone: "value", sortLabels: ["Lowest", "Highest"] },
    cell: (c) => money(c.getValue()),
  }),
];

export const orderNoun = { singular: "order", plural: "orders" };

export function orderActions(order: Order) {
  return (
    <>
      <DataTableAction onClick={() => navigator.clipboard?.writeText(`ord_8f2kq${order.id}`)}>Copy order ID</DataTableAction>
      <DataTableAction>Duplicate order</DataTableAction>
      <MenuSeparator />
      <DataTableAction destructive>Refund</DataTableAction>
    </>
  );
}

export function orderSelectionActions() {
  return (
    <>
      <Button variant="outline" size="sm" className="h-8">
        Export
      </Button>
      <Button variant="outline" size="sm" className="h-8">
        Refund
      </Button>
    </>
  );
}

export function OrderLines({ order }: { order: Order }) {
  return (
    <ul className="m-0 grid list-none gap-1 py-2 pl-[88px] pr-3 text-[12.5px] text-muted-foreground">
      {order.lines.map((line, i) => (
        <li key={i} className="flex justify-between">
          <span>{line.product}</span>
          <span className="tabular-nums">{money(line.price)}</span>
        </li>
      ))}
    </ul>
  );
}

export const ordersCard = "w-full max-w-[860px]";

type OrdersProps = Partial<DataTableProps<Order>>;

export function Orders(props: OrdersProps) {
  return (
    <DataTable<Order>
      data={ORDERS}
      columns={orderColumns}
      getRowId={(o) => String(o.id)}
      getRowLabel={(o) => `Order #${o.id}`}
      noun={orderNoun}
      facet={{ column: "status", options: ["Paid", "Pending", "Failed", "Refunded"] }}
      defaultSorting={[{ id: "placed", desc: true }]}
      rowActions={orderActions}
      selectionActions={orderSelectionActions}
      className={ordersCard}
      {...props}
    />
  );
}

export function BasicDataTableExample() {
  return <Orders />;
}

/** Stands in for an API: sorts, filters and pages on the "server", after a delay. */
function query(state: Pick<DataTableState, "sorting" | "columnFilters" | "globalFilter" | "pagination">) {
  const q = state.globalFilter.trim().toLowerCase();
  const status = state.columnFilters.find((f) => f.id === "status")?.value;
  let rows = ORDERS.filter((o) => (!q || `#${o.id} ${o.customer}`.toLowerCase().includes(q)) && (!status || o.status === status));
  const sort = state.sorting[0];
  if (sort) {
    const key = sort.id as keyof Order;
    rows = [...rows].sort((a, b) => (a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0) * (sort.desc ? -1 : 1));
  }
  const { pageIndex, pageSize } = state.pagination;
  return new Promise<{ rows: Order[]; total: number }>((done) =>
    setTimeout(() => done({ rows: rows.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize), total: rows.length }), 350)
  );
}

export function ServerDataTableExample() {
  const [state, setState] = React.useState({
    sorting: [{ id: "placed", desc: true }],
    columnFilters: [] as DataTableState["columnFilters"],
    globalFilter: "",
    pagination: { pageIndex: 0, pageSize: 10 },
  });
  const [page, setPage] = React.useState<{ rows: Order[]; total: number } | null>(null);
  React.useEffect(() => {
    let live = true;
    query(state).then((result) => live && setPage(result));
    return () => {
      live = false;
    };
  }, [state]);
  return (
    <Orders
      data={page?.rows ?? []}
      rowCount={page?.total ?? 0}
      loading={!page}
      facet={{
        column: "status",
        options: (Object.entries(COUNTS) as [string, number][]).map(([value, count]) => ({ value, count })),
      }}
      sorting={state.sorting}
      columnFilters={state.columnFilters}
      globalFilter={state.globalFilter}
      pagination={state.pagination}
      searchDelay={250}
      onStateChange={(next) => {
        const asked = { sorting: next.sorting, columnFilters: next.columnFilters, globalFilter: next.globalFilter, pagination: next.pagination };
        // Selection and column changes need no new page, so only a change to the query refetches.
        setState((prev) => (JSON.stringify(prev) === JSON.stringify(asked) ? prev : asked));
      }}
    />
  );
}

const MANY = makeOrders(5000);

export function VirtualDataTableExample() {
  return <Orders data={MANY} virtualize maxHeight={452} title="5,000 orders" />;
}
