"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = { CardTitle: string; CardDescription: boolean; CardFooter: boolean };

const field = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm";

function Demo({ values: v }: DemoProps<V>) {
  const id = React.useId();
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{v.CardTitle}</CardTitle>
        {v.CardDescription && <CardDescription>Enter your details to create a new account.</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor={`${id}-name`} className="text-sm font-medium">Name</label>
          <input id={`${id}-name`} placeholder="John Doe" className={field} />
        </div>
        <div className="space-y-2">
          <label htmlFor={`${id}-email`} className="text-sm font-medium">Email</label>
          <input id={`${id}-email`} type="email" placeholder="john@example.com" className={field} />
        </div>
      </CardContent>
      {v.CardFooter && (
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Create</Button>
        </CardFooter>
      )}
    </Card>
  );
}

function code(v: V): string {
  const parts = ["Card", "CardContent", "CardHeader", "CardTitle"];
  if (v.CardDescription) parts.push("CardDescription");
  if (v.CardFooter) parts.push("CardFooter");
  parts.sort();
  const L = [`import { ${parts.join(", ")} } from "@/components/ui/card"`];
  if (v.CardFooter) L.push(`import { Button } from "@/components/ui/button"`);
  L.push(
    "",
    "export function CreateAccount() {",
    "  return (",
    '    <Card className="w-full max-w-sm">',
    "      <CardHeader>",
    `        <CardTitle>${v.CardTitle}</CardTitle>`,
  );
  if (v.CardDescription) L.push("        <CardDescription>Enter your details to create a new account.</CardDescription>");
  L.push(
    "      </CardHeader>",
    '      <CardContent className="space-y-4">',
    '        <div className="space-y-2">',
    '          <label htmlFor="name" className="text-sm font-medium">Name</label>',
    `          <input id="name" placeholder="John Doe" className="${field}" />`,
    "        </div>",
    '        <div className="space-y-2">',
    '          <label htmlFor="email" className="text-sm font-medium">Email</label>',
    `          <input id="email" type="email" placeholder="john@example.com" className="${field}" />`,
    "        </div>",
    "      </CardContent>",
  );
  if (v.CardFooter)
    L.push(
      '      <CardFooter className="flex justify-between">',
      '        <Button variant="outline">Cancel</Button>',
      "        <Button>Create</Button>",
      "      </CardFooter>",
    );
  L.push("    </Card>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "create-account.tsx",
  controls: [
    { name: "CardTitle", type: "text", default: "Create Account" },
    { name: "CardDescription", type: "boolean", default: true },
    { name: "CardFooter", type: "boolean", default: true },
  ],
  Demo,
  code,
});
