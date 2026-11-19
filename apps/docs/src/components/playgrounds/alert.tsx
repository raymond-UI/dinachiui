"use client";

import * as React from "react";
import { RefreshCw } from "lucide-react";
import { isAgentChange } from "@/components/ui/agent";
import {
  Alert,
  AlertAction,
  AlertContent,
  AlertDescription,
  AlertDismiss,
  AlertIcon,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type Variant = "default" | "info" | "success" | "warning" | "destructive";
type V = { variant: Variant; AlertTitle: boolean; AlertAction: boolean; AlertDismiss: boolean; phone: boolean };

const COPY: Record<Variant, { title: string; description: string; action: string }> = {
  default: { title: "Rates sync every 15 minutes", description: "Last synced 10:42. Changes made in Booking.com show here on the next sync.", action: "Sync now" },
  info: { title: "New cancellation policy from 1 December", description: "Bookings made after that date get 48 hours of free cancellation.", action: "Review policy" },
  success: { title: "Rates published to 4 channels", description: "Booking.com, Expedia, Airbnb and direct now show £148 for 12 to 18 Dec.", action: "View rates" },
  warning: { title: "Sea View Double is under your floor", description: "£162 on Wed 14 is below the £170 floor. It publishes to all channels at 18:00.", action: "Raise to £170" },
  destructive: { title: "Payout failed", description: "Barclays declined the £12,480.00 transfer. Update the account to retry.", action: "Update account" },
};

function Demo({ values: v, refuse }: DemoProps<V>) {
  const [open, setOpen] = React.useState(true);
  const [pressed, setPressed] = React.useState(0);
  const c = COPY[v.variant];
  const action = (
    <AlertAction size={v.phone ? "default" : "sm"} onClick={() => setPressed((n) => n + 1)}>
      {c.action}
    </AlertAction>
  );
  return (
    <div className={cn("grid w-full gap-3", v.phone ? "max-w-[390px]" : "max-w-[560px]")}>
      <Alert
        variant={v.variant}
        open={open}
        onOpenChange={(next, details) => {
          if (refuse && isAgentChange(details)) return details.cancel();
          setOpen(next);
        }}
        className={v.phone ? "rounded-none border-x-0 px-[18px] pb-4 pt-3.5" : undefined}
      >
        <AlertIcon>{v.variant === "default" ? <RefreshCw /> : undefined}</AlertIcon>
        <AlertContent>
          {v.AlertTitle && <AlertTitle className={v.phone ? "text-[15px]" : undefined}>{c.title}</AlertTitle>}
          <AlertDescription className={v.phone ? "text-sm" : undefined}>
            {v.AlertTitle ? c.description : c.title}
          </AlertDescription>
          {v.phone && v.AlertAction && action}
        </AlertContent>
        {!v.phone && v.AlertAction && action}
        {v.AlertDismiss && <AlertDismiss className={v.phone ? "h-9 w-9" : undefined} />}
      </Alert>
      <div className="flex h-9 items-center justify-between gap-3 text-[13px] text-muted-foreground">
        <span aria-live="polite">{pressed ? `${c.action} pressed ${pressed === 1 ? "once" : `${pressed} times`}` : ""}</span>
        {!open && (
          <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
            Show again
          </Button>
        )}
      </div>
    </div>
  );
}

const str = (s: string) => (s.includes('"') ? `{${JSON.stringify(s)}}` : `"${s}"`);

function code(v: V, { refuse }: { refuse: boolean }): string {
  const c = COPY[v.variant];
  const parts = ["Alert", "AlertContent", "AlertDescription", "AlertIcon"];
  if (v.AlertTitle) parts.push("AlertTitle");
  if (v.AlertAction) parts.push("AlertAction");
  if (v.AlertDismiss) parts.push("AlertDismiss");
  parts.sort();

  const L: string[] = [];
  if (v.AlertDismiss) L.push(`import { useState } from "react"`);
  if (v.variant === "default") L.push(`import { RefreshCw } from "lucide-react"`);
  L.push(`import { ${parts.join(", ")} } from "@/components/ui/alert"`);
  if (refuse && v.AlertDismiss) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push("", "export function RatesAlert() {");
  if (v.AlertDismiss) L.push("  const [open, setOpen] = useState(true)");
  L.push("  return (");

  const props: string[] = [];
  if (v.variant !== "default") props.push(`variant="${v.variant}"`);
  if (v.AlertDismiss) {
    props.push("open={open}");
    props.push(
      refuse
        ? "onOpenChange={(next, details) => {\n        if (isAgentChange(details)) return details.cancel()\n        setOpen(next)\n      }}"
        : "onOpenChange={setOpen}"
    );
  }
  if (v.phone) props.push('className="rounded-none border-x-0 px-[18px] pb-4 pt-3.5"');
  L.push(props.length > 2 || refuse ? `    <Alert\n${props.map((p) => `      ${p}`).join("\n")}\n    >` : `    <Alert${props.map((p) => ` ${p}`).join("")}>`);

  L.push(v.variant === "default" ? "      <AlertIcon><RefreshCw /></AlertIcon>" : "      <AlertIcon />");
  L.push("      <AlertContent>");
  if (v.AlertTitle) L.push(`        <AlertTitle${v.phone ? ' className="text-[15px]"' : ""}>${c.title}</AlertTitle>`);
  L.push(`        <AlertDescription${v.phone ? ' className="text-sm"' : ""}>${v.AlertTitle ? c.description : c.title}</AlertDescription>`);
  const action = (pad: string) => `${pad}<AlertAction${v.phone ? ' size="default"' : ""}>${c.action}</AlertAction>`;
  if (v.phone && v.AlertAction) L.push(action("        "));
  L.push("      </AlertContent>");
  if (!v.phone && v.AlertAction) L.push(action("      "));
  if (v.AlertDismiss) L.push(`      <AlertDismiss${v.phone ? ` className=${str("h-9 w-9")}` : ""} />`);
  L.push("    </Alert>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "rates-alert.tsx",
  refusable: true,
  controls: [
    { name: "variant", type: "select", options: ["default", "info", "success", "warning", "destructive"], default: "warning" },
    { name: "AlertTitle", type: "boolean", default: true },
    { name: "AlertAction", type: "boolean", default: true },
    { name: "AlertDismiss", type: "boolean", default: true },
    { name: "phone", type: "boolean", default: false },
  ],
  tries: [
    { label: "Press the action", action: "press" },
    { label: "Dismiss", action: "dismiss" },
  ],
  Demo,
  code,
});
