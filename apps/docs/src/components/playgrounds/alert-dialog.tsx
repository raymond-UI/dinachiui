"use client";

import { isAgentChange } from "@/components/ui/agent";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = {
  AlertDialogTitle: string;
  AlertDialogDescription: boolean;
  AlertDialogAction: string;
  variant: string;
};

const DESCRIPTION = "This action cannot be undone. This will permanently delete your account.";

// The dialog stays closed in Anatomy: open, it would cover the page and trap focus.
function Demo({ values: v, refuse }: DemoProps<V>) {
  return (
    <AlertDialog
      onOpenChange={(_, details) => {
        if (refuse && isAgentChange(details)) details.cancel();
      }}
    >
      <AlertDialogTrigger render={<Button variant={v.variant as "destructive" | "outline" | "default"} />}>
        Delete Account
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{v.AlertDialogTitle}</AlertDialogTitle>
          {v.AlertDialogDescription && <AlertDialogDescription>{DESCRIPTION}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>{v.AlertDialogAction}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const parts = [
    "AlertDialog",
    "AlertDialogAction",
    "AlertDialogCancel",
    "AlertDialogContent",
    "AlertDialogFooter",
    "AlertDialogHeader",
    "AlertDialogTitle",
    "AlertDialogTrigger",
  ];
  if (v.AlertDialogDescription) parts.push("AlertDialogDescription");
  parts.sort();

  const L: string[] = [];
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push(`import { ${parts.join(", ")} } from "@/components/ui/alert-dialog"`);
  L.push(`import { Button } from "@/components/ui/button"`);
  L.push("", "export function DeleteAccount() {", "  return (");
  if (refuse) {
    L.push("    <AlertDialog", "      onOpenChange={(open, details) => {", "        if (isAgentChange(details)) details.cancel()", "      }}", "    >");
  } else {
    L.push("    <AlertDialog>");
  }
  const variant = v.variant === "default" ? "" : ` variant="${v.variant}"`;
  L.push(`      <AlertDialogTrigger render={<Button${variant} />}>Delete Account</AlertDialogTrigger>`);
  L.push("      <AlertDialogContent>", "        <AlertDialogHeader>");
  L.push(`          <AlertDialogTitle>${v.AlertDialogTitle}</AlertDialogTitle>`);
  if (v.AlertDialogDescription) {
    L.push("          <AlertDialogDescription>", `            ${DESCRIPTION}`, "          </AlertDialogDescription>");
  }
  L.push("        </AlertDialogHeader>", "        <AlertDialogFooter>");
  L.push("          <AlertDialogCancel>Cancel</AlertDialogCancel>");
  L.push(`          <AlertDialogAction>${v.AlertDialogAction}</AlertDialogAction>`);
  L.push("        </AlertDialogFooter>", "      </AlertDialogContent>", "    </AlertDialog>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "delete-account.tsx",
  refusable: true,
  controls: [
    { name: "AlertDialogTitle", type: "text", default: "Are you absolutely sure?" },
    { name: "AlertDialogDescription", type: "boolean", default: true },
    { name: "AlertDialogAction", type: "text", default: "Continue" },
    { name: "variant", type: "select", options: ["destructive", "outline", "default"], default: "destructive" },
  ],
  tries: [{ label: "Open", action: "open" }],
  Demo,
  code,
});
