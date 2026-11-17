"use client";

import { Field, FieldControl, FieldLabel } from "@/components/ui/field";
import { Fieldset, FieldsetLegend } from "@/components/ui/fieldset";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = { FieldsetLegend: string; disabled: boolean };

function Demo({ values: v }: DemoProps<V>) {
  return (
    <Fieldset className="w-full max-w-sm" disabled={v.disabled}>
      <FieldsetLegend>{v.FieldsetLegend}</FieldsetLegend>
      <Field>
        <FieldLabel>First Name</FieldLabel>
        <FieldControl placeholder="John" />
      </Field>
      <Field>
        <FieldLabel>Last Name</FieldLabel>
        <FieldControl placeholder="Doe" />
      </Field>
    </Fieldset>
  );
}

const jsx = (s: string) => (/[{}<>]/.test(s) ? `{${JSON.stringify(s)}}` : s);

function code(v: V): string {
  return [
    `import { Field, FieldControl, FieldLabel } from "@/components/ui/field"`,
    `import { Fieldset, FieldsetLegend } from "@/components/ui/fieldset"`,
    "",
    "export function NameFields() {",
    "  return (",
    `    <Fieldset className="w-full max-w-sm"${v.disabled ? " disabled" : ""}>`,
    `      <FieldsetLegend>${jsx(v.FieldsetLegend)}</FieldsetLegend>`,
    "      <Field>",
    "        <FieldLabel>First Name</FieldLabel>",
    `        <FieldControl placeholder="John" />`,
    "      </Field>",
    "      <Field>",
    "        <FieldLabel>Last Name</FieldLabel>",
    `        <FieldControl placeholder="Doe" />`,
    "      </Field>",
    "    </Fieldset>",
    "  )",
    "}",
  ].join("\n");
}

export default playground<V>({
  file: "name-fields.tsx",
  controls: [
    { name: "FieldsetLegend", type: "text", default: "Personal Information" },
    { name: "disabled", type: "boolean", default: false },
  ],
  Demo,
  code,
});
