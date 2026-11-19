"use client";

import { useState } from "react";
import { Pagination } from "@/components/ui/pagination";

const names = ["Ada Okafor", "Tomás Herrera", "Mei Lin", "Priya Raman", "Jonah Weiss", "Amara Diallo", "Lukas Berg", "Sofia Russo", "Kenji Watanabe", "Hana Novak", "Olu Adeyemi", "Grace Kim"];

/** A page of orders, the same for the same page every time. */
export function ordersOn(page: number, per: number) {
  return Array.from({ length: per }, (_, i) => {
    const n = (page - 1) * per + i;
    return { id: 4821 - n, customer: names[(n * 7) % names.length], amount: 22 + ((n * 37) % 180) + (n % 3 === 0 ? 4.95 : 0) };
  });
}

const money = (n: number) => "£" + n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function OrderList({ page, per = 6 }: { page: number; per?: number }) {
  return (
    <ul className="w-full rounded-xl border bg-card py-1.5 text-[13px] shadow-sm">
      {ordersOn(page, per).map((o) => (
        <li key={o.id} className="grid grid-cols-[70px_1fr_auto] gap-4 border-b px-5 py-3 last:border-b-0">
          <span className="font-mono text-muted-foreground">#{o.id}</span>
          <span>{o.customer}</span>
          <span className="tabular-nums">{money(o.amount)}</span>
        </li>
      ))}
    </ul>
  );
}

export function DefaultPaginationExample() {
  const [page, setPage] = useState(6);
  const per = 6;
  return (
    <div className="grid w-full max-w-[560px] gap-7">
      <OrderList page={page} per={per} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-[13px] tabular-nums text-muted-foreground">
          {(page - 1) * per + 1}–{page * per} of {25 * per}
        </span>
        <Pagination aria-label="Orders" count={25} page={page} onPageChange={setPage} />
      </div>
    </div>
  );
}

export function CompactPaginationExample() {
  const [page, setPage] = useState(6);
  return (
    <div className="grid w-full max-w-[360px] gap-4">
      <OrderList page={page} per={4} />
      <Pagination aria-label="Orders" variant="compact" size="lg" count={25} page={page} onPageChange={setPage} className="w-full justify-between" />
    </div>
  );
}

export function LinksPaginationExample() {
  const [page, setPage] = useState(3);
  return (
    <Pagination
      aria-label="Archive"
      count={12}
      page={page}
      getHref={(p) => `#page-${p}`}
      onPageChange={(next, details) => {
        // This page routes itself, so the browser stays put.
        details.cancel();
        setPage(next);
      }}
    />
  );
}
