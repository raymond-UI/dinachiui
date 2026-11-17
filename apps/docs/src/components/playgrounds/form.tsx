"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldControl, FieldError, FieldLabel } from "@/components/ui/field";
import { Form } from "@/components/ui/form";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

const MODES = ["onSubmit", "onBlur", "onChange"] as const;

type V = { validationMode: (typeof MODES)[number]; password: boolean };

const checkUsername = (value: unknown) => {
  const s = String(value ?? "");
  if (!s) return "Username is required";
  return s.length < 3 ? "At least 3 characters" : null;
};
const checkPassword = (value: unknown) => (String(value ?? "").length < 8 ? "At least 8 characters" : null);

function Demo({ values: v }: DemoProps<V>) {
  const [done, setDone] = React.useState<string | null>(null);
  return (
    <Form
      // A new mode starts the form over, so errors from the last one do not linger.
      key={`${v.validationMode}-${v.password}`}
      validationMode={v.validationMode}
      onFormSubmit={(values) => setDone(String(values.username))}
      className="w-full max-w-sm space-y-4"
    >
      <Field name="username" validate={checkUsername}>
        <FieldLabel>Username</FieldLabel>
        <FieldControl placeholder="Choose a username" />
        <FieldError />
      </Field>
      {v.password && (
        <Field name="password" validate={checkPassword}>
          <FieldLabel>Password</FieldLabel>
          <FieldControl type="password" placeholder="Enter password" />
          <FieldError />
        </Field>
      )}
      <div className="flex items-center gap-3">
        <Button type="submit">Sign Up</Button>
        {done && <span className="text-sm text-muted-foreground">Welcome, {done}.</span>}
      </div>
    </Form>
  );
}

function code(v: V): string {
  const L = [
    `import { useState } from "react"`,
    `import { Button } from "@/components/ui/button"`,
    `import { Field, FieldControl, FieldError, FieldLabel } from "@/components/ui/field"`,
    `import { Form } from "@/components/ui/form"`,
    "",
    "export function SignUpForm() {",
    "  const [done, setDone] = useState<string | null>(null)",
    "",
    "  return (",
    "    <Form",
  ];
  if (v.validationMode !== "onSubmit") L.push(`      validationMode="${v.validationMode}"`);
  L.push(
    "      onFormSubmit={(values) => setDone(String(values.username))}",
    `      className="w-full max-w-sm space-y-4"`,
    "    >",
    "      <Field",
    `        name="username"`,
    "        validate={(value) => {",
    "          const s = String(value ?? \"\")",
    `          if (!s) return "Username is required"`,
    `          return s.length < 3 ? "At least 3 characters" : null`,
    "        }}",
    "      >",
    "        <FieldLabel>Username</FieldLabel>",
    `        <FieldControl placeholder="Choose a username" />`,
    "        <FieldError />",
    "      </Field>",
  );
  if (v.password) {
    L.push(
      "      <Field",
      `        name="password"`,
      `        validate={(value) => (String(value ?? "").length < 8 ? "At least 8 characters" : null)}`,
      "      >",
      "        <FieldLabel>Password</FieldLabel>",
      `        <FieldControl type="password" placeholder="Enter password" />`,
      "        <FieldError />",
      "      </Field>",
    );
  }
  L.push(
    `      <div className="flex items-center gap-3">`,
    `        <Button type="submit">Sign Up</Button>`,
    `        {done && <span className="text-sm text-muted-foreground">Welcome, {done}.</span>}`,
    "      </div>",
    "    </Form>",
    "  )",
    "}",
  );
  return L.join("\n");
}

export default playground<V>({
  file: "sign-up-form.tsx",
  controls: [
    { name: "validationMode", type: "select", options: MODES, default: "onSubmit" },
    { name: "password", type: "boolean", default: true },
  ],
  Demo,
  code,
});
