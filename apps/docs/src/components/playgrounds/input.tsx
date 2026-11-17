"use client";

import * as React from "react";
import { isAgentChange } from "@/components/ui/agent";
import { Input } from "@/components/ui/input";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

const TYPES = ["text", "email", "password"] as const;

type V = {
  placeholder: string;
  type: (typeof TYPES)[number];
  disabled: boolean;
  "aria-invalid": boolean;
};

function Demo({ values: v, refuse }: DemoProps<V>) {
  const id = React.useId();
  return (
    <div className="w-full max-w-sm space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        Username
      </label>
      <Input
        id={id}
        type={v.type}
        placeholder={v.placeholder}
        disabled={v.disabled}
        aria-invalid={v["aria-invalid"] || undefined}
        onValueChange={(_, details) => {
          if (refuse && isAgentChange(details)) details.cancel();
        }}
      />
      <p className="text-sm text-muted-foreground">This is your public display name.</p>
    </div>
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const props = [`id="username"`];
  if (v.type !== "text") props.push(`type="${v.type}"`);
  props.push(`placeholder=${JSON.stringify(v.placeholder)}`);
  if (v.disabled) props.push("disabled");
  if (v["aria-invalid"]) props.push("aria-invalid");
  const L: string[] = [];
  L.push(`import { Input } from "@/components/ui/input"`);
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push("", "export function UsernameField() {", "  return (", `    <div className="w-full max-w-sm space-y-2">`);
  L.push(`      <label htmlFor="username" className="text-sm font-medium">`, "        Username", "      </label>");
  L.push("      <Input");
  props.forEach((p) => L.push(`        ${p}`));
  if (refuse) L.push("        onValueChange={(value, details) => {", "          if (isAgentChange(details)) details.cancel()", "        }}");
  L.push("      />");
  L.push(`      <p className="text-sm text-muted-foreground">This is your public display name.</p>`, "    </div>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "username-field.tsx",
  refusable: true,
  controls: [
    { name: "placeholder", type: "text", default: "Enter your username" },
    { name: "type", type: "select", options: TYPES, default: "text" },
    { name: "disabled", type: "boolean", default: false },
    { name: "aria-invalid", type: "boolean", default: false },
  ],
  tries: [
    { label: "Type ada", action: "setValue", args: ["ada"] },
    { label: "Clear", action: "clear" },
  ],
  Demo,
  code,
});
