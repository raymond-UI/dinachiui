"use client";

import * as React from "react";
import { isAgentChange } from "@/components/ui/agent";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckboxGroup } from "@/components/ui/checkbox-group";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

const FRAMEWORKS = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
];
const ALL = FRAMEWORKS.map((f) => f.value);

type V = { parent: boolean; disabled: boolean };

function Demo({ values: v, refuse }: DemoProps<V>) {
  const id = React.useId();
  const [selected, setSelected] = React.useState<string[]>(["react"]);
  return (
    <div className="space-y-3">
      <div id={`${id}-label`} className="text-sm font-medium text-foreground">
        Select frameworks you know
      </div>
      <CheckboxGroup
        aria-labelledby={`${id}-label`}
        value={selected}
        onValueChange={(next, details) => {
          if (refuse && isAgentChange(details)) return details.cancel();
          setSelected(next);
        }}
        allValues={v.parent ? ALL : undefined}
        disabled={v.disabled}
      >
        {v.parent && (
          <div className="flex items-center space-x-2">
            <Checkbox id={`${id}-all`} parent />
            <label htmlFor={`${id}-all`} className="text-sm text-foreground">All frameworks</label>
          </div>
        )}
        {FRAMEWORKS.map((f) => (
          <div key={f.value} className={v.parent ? "flex items-center space-x-2 pl-6" : "flex items-center space-x-2"}>
            <Checkbox id={`${id}-${f.value}`} name="frameworks" value={f.value} />
            <label htmlFor={`${id}-${f.value}`} className="text-sm text-foreground">{f.label}</label>
          </div>
        ))}
      </CheckboxGroup>
      <p className="text-sm text-muted-foreground">
        Selected: {selected.length > 0 ? selected.join(", ") : "None"}
      </p>
    </div>
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const L: string[] = [];
  L.push(`import { useState } from "react"`);
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push(`import { Checkbox } from "@/components/ui/checkbox"`, `import { CheckboxGroup } from "@/components/ui/checkbox-group"`, "");
  L.push("const frameworks = [");
  for (const f of FRAMEWORKS) L.push(`  { value: "${f.value}", label: "${f.label}" },`);
  L.push("]", "");
  L.push("export function FrameworkPicker() {", `  const [selected, setSelected] = useState<string[]>(["react"])`, "", "  return (");
  L.push(`    <div className="space-y-3">`, `      <div id="frameworks-label" className="text-sm font-medium">`, "        Select frameworks you know", "      </div>");
  L.push("      <CheckboxGroup", `        aria-labelledby="frameworks-label"`, "        value={selected}");
  if (refuse) {
    L.push("        onValueChange={(value, details) => {", "          if (isAgentChange(details)) return details.cancel()", "          setSelected(value)", "        }}");
  } else {
    L.push("        onValueChange={setSelected}");
  }
  if (v.parent) L.push("        allValues={frameworks.map((f) => f.value)}");
  if (v.disabled) L.push("        disabled");
  L.push("      >");
  if (v.parent) {
    L.push(`        <div className="flex items-center space-x-2">`, `          <Checkbox id="all" parent />`, `          <label htmlFor="all" className="text-sm">All frameworks</label>`, "        </div>");
  }
  L.push("        {frameworks.map((f) => (");
  L.push(`          <div key={f.value} className="flex items-center space-x-2${v.parent ? " pl-6" : ""}">`);
  L.push(`            <Checkbox id={f.value} name="frameworks" value={f.value} />`);
  L.push(`            <label htmlFor={f.value} className="text-sm">{f.label}</label>`, "          </div>", "        ))}");
  L.push("      </CheckboxGroup>", `      <p className="text-sm text-muted-foreground">`, `        Selected: {selected.length > 0 ? selected.join(", ") : "None"}`, "      </p>", "    </div>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "framework-picker.tsx",
  refusable: true,
  controls: [
    { name: "parent", type: "boolean", default: false },
    { name: "disabled", type: "boolean", default: false },
  ],
  tries: [
    { label: "Tick React and Vue", action: "setValue", args: [["React", "Vue"]] },
    { label: "Tick Ember", action: "setValue", args: [["Ember"]] },
  ],
  Demo,
  code,
});
