"use client";

import * as React from "react";
import { isAgentChange } from "@/components/ui/agent";
import { Pagination, type PaginationChangeDetails } from "@/components/ui/pagination";
import { OrderList } from "@/components/examples/pagination-examples";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = {
  variant: string;
  size: string;
  count: number;
  disabled: boolean;
};

function Demo({ values: v, refuse }: DemoProps<V>) {
  const [page, setPage] = React.useState(6);
  const count = Math.max(1, Math.floor(v.count));
  const shown = Math.min(page, count);
  const change = (next: number, details: PaginationChangeDetails) => {
    if (refuse && isAgentChange(details)) return details.cancel();
    setPage(next);
  };
  return (
    <div className="w-full max-w-md">
      <OrderList page={shown} per={4} />
      <Pagination
        aria-label="Orders"
        variant={v.variant as "full" | "compact"}
        size={v.size as "default" | "lg"}
        count={count}
        disabled={v.disabled}
        page={shown}
        onPageChange={change}
        className={v.variant === "compact" ? "mt-3 flex w-full justify-between" : "mt-3"}
      />
    </div>
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const props = ['aria-label="Orders"'];
  if (v.variant !== "full") props.push(`variant="${v.variant}"`);
  if (v.size !== "default") props.push(`size="${v.size}"`);
  props.push(`count={${v.count}}`);
  if (v.disabled) props.push("disabled");
  props.push("page={page}");
  const L = [`import { useState } from "react"`, `import { Pagination } from "@/components/ui/pagination"`];
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push("", "export function Orders() {", "  const [page, setPage] = useState(6)", "  return (", "    <Pagination");
  props.forEach((p) => L.push(`      ${p}`));
  if (refuse) {
    L.push("      onPageChange={(next, details) => {", "        if (isAgentChange(details)) return details.cancel()", "        setPage(next)", "      }}");
  } else {
    L.push("      onPageChange={setPage}");
  }
  L.push("    />", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "orders.tsx",
  refusable: true,
  controls: [
    { name: "variant", type: "select", options: ["full", "compact"], default: "full" },
    { name: "size", type: "select", options: ["default", "lg"], default: "default" },
    { name: "count", type: "number", default: 25, min: 1, max: 500 },
    { name: "disabled", type: "boolean", default: false },
  ],
  tries: [
    { label: "Set 12", action: "setValue", args: [12], target: "Orders" },
    { label: "Increment", action: "increment", args: [1], target: "Orders" },
    { label: "Set 99", action: "setValue", args: [99], target: "Orders" },
  ],
  Demo,
  code,
});
