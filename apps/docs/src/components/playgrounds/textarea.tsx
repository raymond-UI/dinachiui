"use client";

import * as React from "react";
import { isAgentChange } from "@/components/ui/agent";
import { Textarea } from "@/components/ui/textarea";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = {
  placeholder: string;
  rows: number;
  disabled: boolean;
  readOnly: boolean;
};

function Demo({ values: v, refuse }: DemoProps<V>) {
  const id = React.useId();
  return (
    <div className="w-full max-w-md space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        Bio
      </label>
      <Textarea
        id={id}
        placeholder={v.placeholder}
        rows={v.rows}
        disabled={v.disabled}
        readOnly={v.readOnly}
        onValueChange={(_, details) => {
          if (refuse && isAgentChange(details)) details.cancel();
        }}
      />
      <p className="text-sm text-muted-foreground">This appears on your public profile.</p>
    </div>
  );
}

// JSX attribute strings take no escapes, so a quote needs an expression.
const attr = (s: string) => (s.includes('"') ? `{${JSON.stringify(s)}}` : `"${s}"`);

function code(v: V, { refuse }: { refuse: boolean }): string {
  const props = ['id="bio"'];
  if (v.placeholder) props.push(`placeholder=${attr(v.placeholder)}`);
  props.push(`rows={${v.rows}}`);
  if (v.disabled) props.push("disabled");
  if (v.readOnly) props.push("readOnly");

  const L: string[] = [`import { Textarea } from "@/components/ui/textarea"`];
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push("", "export function BioField() {", "  return (", "    <div>", '      <label htmlFor="bio">Bio</label>', "      <Textarea");
  props.forEach((p) => L.push(`        ${p}`));
  if (refuse) {
    L.push("        onValueChange={(value, details) => {", "          if (isAgentChange(details)) details.cancel()", "        }}");
  }
  L.push("      />", "      <p>This appears on your public profile.</p>", "    </div>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "bio-field.tsx",
  refusable: true,
  controls: [
    { name: "placeholder", type: "text", default: "A sentence or two about yourself" },
    { name: "rows", type: "number", default: 4, min: 2, max: 10 },
    { name: "disabled", type: "boolean", default: false },
    { name: "readOnly", type: "boolean", default: false },
  ],
  tries: [
    { label: "Write a bio", action: "setValue", args: ["Designer in Lagos."] },
    { label: "Clear", action: "clear" },
  ],
  Demo,
  code,
});
