"use client";

import * as React from "react";
import { isAgentChange } from "@/components/ui/agent";
import { Switch, SwitchThumb } from "@/components/ui/switch";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = {
  label: string;
  defaultChecked: boolean;
  disabled: boolean;
  readOnly: boolean;
};

function Demo({ values: v, refuse }: DemoProps<V>) {
  return (
    <label className="flex items-center gap-2">
      <Switch
        // defaultChecked only applies on mount.
        key={String(v.defaultChecked)}
        defaultChecked={v.defaultChecked}
        disabled={v.disabled}
        readOnly={v.readOnly}
        onCheckedChange={(_, details) => {
          if (refuse && isAgentChange(details)) details.cancel();
        }}
      >
        <SwitchThumb />
      </Switch>
      <span className="text-sm font-medium">{v.label}</span>
    </label>
  );
}

const esc = (s: string) => s.replace(/[{}<>]/g, (c) => `{"${c}"}`);

function code(v: V, { refuse }: { refuse: boolean }): string {
  const props: string[] = [];
  if (v.defaultChecked) props.push("defaultChecked");
  if (v.disabled) props.push("disabled");
  if (v.readOnly) props.push("readOnly");

  const L: string[] = [`import { Switch, SwitchThumb } from "@/components/ui/switch"`];
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push("", "export function SettingSwitch() {", "  return (", '    <label className="flex items-center gap-2">');
  if (refuse) {
    L.push("      <Switch");
    props.forEach((p) => L.push(`        ${p}`));
    L.push("        onCheckedChange={(checked, details) => {", "          if (isAgentChange(details)) details.cancel()", "        }}", "      >");
  } else {
    L.push(`      <Switch${props.map((p) => ` ${p}`).join("")}>`);
  }
  L.push("        <SwitchThumb />", "      </Switch>", `      ${esc(v.label)}`, "    </label>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "setting-switch.tsx",
  refusable: true,
  controls: [
    { name: "label", type: "text", default: "Airplane Mode" },
    { name: "defaultChecked", type: "boolean", default: false },
    { name: "disabled", type: "boolean", default: false },
    { name: "readOnly", type: "boolean", default: false },
  ],
  tries: [
    { label: "Turn on", action: "setChecked", args: [true] },
    { label: "Toggle", action: "toggle" },
  ],
  Demo,
  code,
});
