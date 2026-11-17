"use client";

import * as React from "react";
import { isAgentChange } from "@/components/ui/agent";
import {
  Combobox,
  ComboboxClear,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxInputGroup,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

const FRAMEWORKS = ["React", "Vue", "Angular", "Svelte", "Solid", "Next.js", "Nuxt", "Remix"];

type V = { placeholder: string; ComboboxClear: boolean; autoHighlight: boolean; disabled: boolean };

const GROUP =
  "flex w-[280px] max-w-full items-center gap-1 rounded-md border border-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2";

function Demo({ values: v, anatomy, refuse }: DemoProps<V>) {
  const id = React.useId();
  const [openState, setOpen] = React.useState(false);
  const refused = (details: unknown) => refuse && isAgentChange(details);
  return (
    <Combobox
      items={FRAMEWORKS}
      autoHighlight={v.autoHighlight}
      disabled={v.disabled}
      open={anatomy || openState}
      onOpenChange={(o) => !anatomy && setOpen(o)}
      onValueChange={(_, details) => {
        if (refused(details)) details.cancel();
      }}
      onInputValueChange={(_, details) => {
        if (refused(details)) details.cancel();
      }}
    >
      <div className="space-y-2">
        <label htmlFor={id} className="block text-sm font-medium leading-none">
          Framework
        </label>
        <ComboboxInputGroup className={GROUP}>
          <ComboboxInput id={id} placeholder={v.placeholder} />
          {v.ComboboxClear && <ComboboxClear />}
          <ComboboxTrigger />
        </ComboboxInputGroup>
      </div>
      <ComboboxContent>
        <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
        <ComboboxList>
          {(fw: string) => (
            <ComboboxItem key={fw} value={fw}>
              {fw}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const parts = ["Combobox", "ComboboxContent", "ComboboxEmpty", "ComboboxInput", "ComboboxInputGroup", "ComboboxItem", "ComboboxList", "ComboboxTrigger"];
  if (v.ComboboxClear) parts.push("ComboboxClear");
  parts.sort();
  const L: string[] = ["import {", ...parts.map((p) => `  ${p},`), `} from "@/components/ui/combobox"`];
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push("", `const frameworks = [${FRAMEWORKS.map((f) => `"${f}"`).join(", ")}]`, "", "export function FrameworkCombobox() {", "  return (");
  const rootProps = ["items={frameworks}"];
  if (v.autoHighlight) rootProps.push("autoHighlight");
  if (v.disabled) rootProps.push("disabled");
  if (refuse) {
    L.push("    <Combobox");
    rootProps.forEach((p) => L.push(`      ${p}`));
    L.push(
      "      onValueChange={(value, details) => {",
      "        if (isAgentChange(details)) details.cancel()",
      "      }}",
      "      onInputValueChange={(text, details) => {",
      "        if (isAgentChange(details)) details.cancel()",
      "      }}",
      "    >",
    );
  } else {
    L.push(`    <Combobox ${rootProps.join(" ")}>`);
  }
  L.push(
    `      <div className="space-y-2">`,
    `        <label htmlFor="framework" className="block text-sm font-medium leading-none">`,
    "          Framework",
    "        </label>",
    `        <ComboboxInputGroup className="${GROUP}">`,
    `          <ComboboxInput id="framework" placeholder=${JSON.stringify(v.placeholder)} />`,
  );
  if (v.ComboboxClear) L.push("          <ComboboxClear />");
  L.push(
    "          <ComboboxTrigger />",
    "        </ComboboxInputGroup>",
    "      </div>",
    "      <ComboboxContent>",
    "        <ComboboxEmpty>No frameworks found.</ComboboxEmpty>",
    "        <ComboboxList>",
    "          {(fw: string) => (",
    "            <ComboboxItem key={fw} value={fw}>",
    "              {fw}",
    "            </ComboboxItem>",
    "          )}",
    "        </ComboboxList>",
    "      </ComboboxContent>",
    "    </Combobox>",
    "  )",
    "}",
  );
  return L.join("\n");
}

export default playground<V>({
  file: "framework-combobox.tsx",
  tall: true,
  refusable: true,
  controls: [
    { name: "placeholder", type: "text", default: "Search frameworks..." },
    { name: "ComboboxClear", type: "boolean", default: false },
    { name: "autoHighlight", type: "boolean", default: false },
    { name: "disabled", type: "boolean", default: false },
  ],
  tries: [
    { label: "Pick Svelte", action: "select", args: ["Svelte"] },
    { label: "Search nu", action: "search", args: ["nu"] },
    { label: "Pick Ember", action: "select", args: ["Ember"] },
  ],
  Demo,
  code,
});
