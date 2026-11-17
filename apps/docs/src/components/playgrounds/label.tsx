"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = { children: string; disabled: boolean };

function Demo({ values: v }: DemoProps<V>) {
  const id = React.useId();
  return (
    // The input comes first so the label can read it with peer-disabled; the column flips them back.
    <div className="flex w-full max-w-sm flex-col-reverse gap-1.5">
      <Input type="email" id={id} placeholder="Email" disabled={v.disabled} className="peer" />
      <Label htmlFor={id}>{v.children}</Label>
    </div>
  );
}

const jsx = (s: string) => (/[{}<>]/.test(s) ? `{${JSON.stringify(s)}}` : s);

function code(v: V): string {
  return [
    `import { Input } from "@/components/ui/input"`,
    `import { Label } from "@/components/ui/label"`,
    "",
    "export function EmailField() {",
    "  return (",
    "    // The input comes first so the label can read it with peer-disabled.",
    `    <div className="flex w-full max-w-sm flex-col-reverse gap-1.5">`,
    `      <Input type="email" id="email" placeholder="Email"${v.disabled ? " disabled" : ""} className="peer" />`,
    `      <Label htmlFor="email">${jsx(v.children)}</Label>`,
    "    </div>",
    "  )",
    "}",
  ].join("\n");
}

export default playground<V>({
  file: "email-field.tsx",
  controls: [
    { name: "children", type: "text", default: "Email" },
    { name: "disabled", type: "boolean", default: false },
  ],
  Demo,
  code,
});
