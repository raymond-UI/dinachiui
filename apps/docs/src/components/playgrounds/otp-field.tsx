"use client";

import * as React from "react";
import { isAgentChange } from "@/components/ui/agent";
import { OTPField, OTPFieldGroup, OTPFieldInput, OTPFieldSeparator } from "@/components/ui/otp-field";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = {
  length: string;
  OTPFieldSeparator: boolean;
  validationType: string;
  mask: boolean;
  disabled: boolean;
};

type Validation = "numeric" | "alphanumeric";

const slots = (n: number) => Array.from({ length: n }, (_, i) => <OTPFieldInput key={i} />);

function Demo({ values: v, refuse }: DemoProps<V>) {
  const length = Number(v.length);
  const half = length / 2;
  return (
    <OTPField
      // A new length is a new field, so the old code does not linger.
      key={length}
      length={length}
      aria-label="Verification code"
      validationType={v.validationType as Validation}
      mask={v.mask}
      disabled={v.disabled}
      onValueChange={(_, details) => {
        if (refuse && isAgentChange(details)) details.cancel();
      }}
    >
      {v.OTPFieldSeparator ? (
        <>
          <OTPFieldGroup>{slots(half)}</OTPFieldGroup>
          <OTPFieldSeparator>-</OTPFieldSeparator>
          <OTPFieldGroup>{slots(half)}</OTPFieldGroup>
        </>
      ) : (
        <OTPFieldGroup>{slots(length)}</OTPFieldGroup>
      )}
    </OTPField>
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const length = Number(v.length);
  const parts = ["OTPField", "OTPFieldGroup", "OTPFieldInput"];
  if (v.OTPFieldSeparator) parts.push("OTPFieldSeparator");

  const props = [`length={${length}}`, 'aria-label="Verification code"'];
  if (v.validationType !== "numeric") props.push(`validationType="${v.validationType}"`);
  if (v.mask) props.push("mask");
  if (v.disabled) props.push("disabled");

  const L: string[] = [`import { ${parts.join(", ")} } from "@/components/ui/otp-field"`];
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push("", "export function VerificationCode() {", "  return (");
  if (refuse) {
    L.push("    <OTPField");
    props.forEach((p) => L.push(`      ${p}`));
    L.push("      onValueChange={(value, details) => {", "        if (isAgentChange(details)) details.cancel()", "      }}", "    >");
  } else {
    L.push(`    <OTPField ${props.join(" ")}>`);
  }
  const group = (n: number) => {
    L.push("      <OTPFieldGroup>");
    for (let i = 0; i < n; i++) L.push("        <OTPFieldInput />");
    L.push("      </OTPFieldGroup>");
  };
  if (v.OTPFieldSeparator) {
    group(length / 2);
    L.push("      <OTPFieldSeparator>-</OTPFieldSeparator>");
    group(length / 2);
  } else {
    group(length);
  }
  L.push("    </OTPField>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "verification-code.tsx",
  refusable: true,
  controls: [
    { name: "length", type: "select", options: ["4", "6"], default: "6" },
    { name: "OTPFieldSeparator", type: "boolean", default: false },
    { name: "validationType", type: "select", options: ["numeric", "alphanumeric"], default: "numeric" },
    { name: "mask", type: "boolean", default: false },
    { name: "disabled", type: "boolean", default: false },
  ],
  tries: [
    { label: "Fill 482913", action: "setValue", args: ["482913"] },
    { label: "Fill AB12CD", action: "setValue", args: ["AB12CD"] },
    { label: "Clear", action: "clear" },
  ],
  Demo,
  code,
});
