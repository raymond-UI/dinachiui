"use client";

import { Field, FieldControl, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = { invalid: boolean; disabled: boolean; FieldDescription: boolean };

function Demo({ values: v, anatomy }: DemoProps<V>) {
  // Anatomy shows the error too. `match` renders it, as `invalid` alone does not.
  const invalid = v.invalid || anatomy;
  return (
    <Field className="w-full max-w-sm" invalid={invalid || undefined} disabled={v.disabled}>
      <FieldLabel>Email</FieldLabel>
      <FieldControl type="email" placeholder="Enter your email" />
      {v.FieldDescription && <FieldDescription>We&apos;ll never share your email.</FieldDescription>}
      {invalid && <FieldError match>Enter a valid email address.</FieldError>}
    </Field>
  );
}

function code(v: V): string {
  const parts = ["Field", "FieldControl", "FieldLabel"];
  if (v.FieldDescription) parts.push("FieldDescription");
  if (v.invalid) parts.push("FieldError");
  parts.sort();
  const rootProps = [`className="w-full max-w-sm"`];
  if (v.invalid) rootProps.push("invalid");
  if (v.disabled) rootProps.push("disabled");
  const L = [
    `import { ${parts.join(", ")} } from "@/components/ui/field"`,
    "",
    "export function EmailField() {",
    "  return (",
    `    <Field ${rootProps.join(" ")}>`,
    "      <FieldLabel>Email</FieldLabel>",
    `      <FieldControl type="email" placeholder="Enter your email" />`,
  ];
  if (v.FieldDescription) L.push("      <FieldDescription>We'll never share your email.</FieldDescription>");
  if (v.invalid) L.push("      <FieldError match>Enter a valid email address.</FieldError>");
  L.push("    </Field>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "email-field.tsx",
  controls: [
    { name: "invalid", type: "boolean", default: false },
    { name: "disabled", type: "boolean", default: false },
    { name: "FieldDescription", type: "boolean", default: true },
  ],
  Demo,
  code,
});
