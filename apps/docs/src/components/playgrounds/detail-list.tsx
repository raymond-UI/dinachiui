"use client";

import { isAgentChange } from "@/components/ui/agent";
import type { DetailListChangeDetails } from "@/components/ui/detail-list";
import { OrderDetails } from "@/components/examples/detail-list-examples";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = {
  layout: string;
  editable: boolean;
  disabled: boolean;
};

function Demo({ values: v, refuse }: DemoProps<V>) {
  const guard = (_: string, details: DetailListChangeDetails) => {
    if (refuse && isAgentChange(details)) details.cancel();
  };
  return (
    <OrderDetails
      brief
      layout={v.layout as "side" | "stacked"}
      editable={v.editable}
      disabled={v.disabled}
      onEmailChange={guard}
      onNoteChange={guard}
    />
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const L = [
    `import { DetailList, DetailListDetails, DetailListItem, DetailListTerm } from "@/components/ui/detail-list"`,
  ];
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push("", "export function Order({ order, save }) {", "  return (");
  L.push(v.layout === "stacked" ? `    <DetailList layout="stacked">` : "    <DetailList>");
  const editable = v.editable ? " editable" : "";
  const disabled = v.disabled ? " disabled" : "";
  const handler = (field: string) =>
    refuse
      ? [
          `        onValueChange={(${field}, details) => {`,
          "          if (isAgentChange(details)) return details.cancel()",
          `          save({ ${field} })`,
          "        }}",
        ]
      : [`        onValueChange={(${field}) => save({ ${field} })}`];
  L.push(
    "      <DetailListItem>",
    "        <DetailListTerm>Customer</DetailListTerm>",
    "        <DetailListDetails>{order.customer}</DetailListDetails>",
    "      </DetailListItem>",
    "      <DetailListItem",
    `        copyable${editable}${disabled}`,
    "        defaultValue={order.email}",
    `        validate={(v) => (v.includes("@") ? undefined : "Enter an email address.")}`,
    ...handler("email"),
    "      >",
    "        <DetailListTerm>Email</DetailListTerm>",
    "        <DetailListDetails />",
    "      </DetailListItem>",
    `      <DetailListItem copyable${editable}${disabled} multiline defaultValue={order.address}>`,
    "        <DetailListTerm>Delivery to</DetailListTerm>",
    "        <DetailListDetails />",
    "      </DetailListItem>",
    "      <DetailListItem",
    `        ${`${editable}${disabled} multiline`.trim()}`,
    "        defaultValue={order.note}",
    ...handler("note"),
    "      >",
    "        <DetailListTerm>Note</DetailListTerm>",
    "        <DetailListDetails />",
    "      </DetailListItem>",
    "      <DetailListItem copyable defaultValue={order.id}>",
    "        <DetailListTerm>Order ID</DetailListTerm>",
    '        <DetailListDetails>{(id) => <span className="font-mono">{id}</span>}</DetailListDetails>',
    "      </DetailListItem>",
    "    </DetailList>",
    "  )",
    "}"
  );
  return L.join("\n");
}

export default playground<V>({
  file: "order.tsx",
  refusable: true,
  tall: true,
  controls: [
    { name: "layout", type: "select", options: ["side", "stacked"], default: "side" },
    { name: "editable", type: "boolean", default: true },
    { name: "disabled", type: "boolean", default: false },
  ],
  tries: [
    { label: "New email", action: "setValue", args: ["ada@okafor.dev"], target: "Email" },
    { label: "Add to note", action: "setValue", args: ["Ring twice, then leave with the concierge."], target: "Note" },
    { label: "Bad email", action: "setValue", args: ["ada at okafor"], target: "Email" },
  ],
  Demo,
  code,
});
