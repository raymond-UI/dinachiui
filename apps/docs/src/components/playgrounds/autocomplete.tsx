"use client";

import * as React from "react";
import { isAgentChange } from "@/components/ui/agent";
import {
  Autocomplete,
  AutocompleteClear,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteInputGroup,
  AutocompleteItem,
  AutocompleteList,
  AutocompleteTrigger,
} from "@/components/ui/autocomplete";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

const CITIES = ["New York", "San Francisco", "London", "Tokyo", "Toronto", "Paris", "Berlin", "Sydney"];
const MODES = ["list", "both", "inline", "none"] as const;

type V = { placeholder: string; mode: (typeof MODES)[number]; AutocompleteClear: boolean; disabled: boolean };

const GROUP =
  "flex w-[280px] max-w-full items-center gap-1 rounded-md border border-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2";

function Demo({ values: v, anatomy, refuse }: DemoProps<V>) {
  const [openState, setOpen] = React.useState(false);
  return (
    <Autocomplete
      items={CITIES}
      mode={v.mode}
      openOnInputClick
      disabled={v.disabled}
      open={anatomy || openState}
      onOpenChange={(o, details) => {
        if (refuse && isAgentChange(details)) return details.cancel();
        if (!anatomy) setOpen(o);
      }}
      onValueChange={(_, details) => {
        if (refuse && isAgentChange(details)) details.cancel();
      }}
    >
      <AutocompleteInputGroup className={GROUP}>
        <AutocompleteInput aria-label="Search cities" placeholder={v.placeholder} />
        {v.AutocompleteClear && <AutocompleteClear />}
        <AutocompleteTrigger />
      </AutocompleteInputGroup>
      <AutocompleteContent>
        <AutocompleteEmpty>No cities found.</AutocompleteEmpty>
        <AutocompleteList>
          {(city: string) => (
            <AutocompleteItem key={city} value={city}>
              {city}
            </AutocompleteItem>
          )}
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const parts = [
    "Autocomplete",
    "AutocompleteContent",
    "AutocompleteEmpty",
    "AutocompleteInput",
    "AutocompleteInputGroup",
    "AutocompleteItem",
    "AutocompleteList",
    "AutocompleteTrigger",
  ];
  if (v.AutocompleteClear) parts.push("AutocompleteClear");
  parts.sort();
  const L: string[] = ["import {", ...parts.map((p) => `  ${p},`), `} from "@/components/ui/autocomplete"`];
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push("", `const cities = [${CITIES.map((c) => `"${c}"`).join(", ")}]`, "", "export function CitySearch() {", "  return (");
  const rootProps = ["items={cities}"];
  if (v.mode !== "list") rootProps.push(`mode="${v.mode}"`);
  rootProps.push("openOnInputClick");
  if (v.disabled) rootProps.push("disabled");
  if (refuse) {
    L.push("    <Autocomplete");
    rootProps.forEach((p) => L.push(`      ${p}`));
    L.push(
      "      onOpenChange={(open, details) => {",
      "        if (isAgentChange(details)) details.cancel()",
      "      }}",
      "      onValueChange={(text, details) => {",
      "        if (isAgentChange(details)) details.cancel()",
      "      }}",
      "    >",
    );
  } else {
    L.push(`    <Autocomplete ${rootProps.join(" ")}>`);
  }
  L.push(
    `      <AutocompleteInputGroup className="${GROUP}">`,
    `        <AutocompleteInput aria-label="Search cities" placeholder=${JSON.stringify(v.placeholder)} />`,
  );
  if (v.AutocompleteClear) L.push("        <AutocompleteClear />");
  L.push(
    "        <AutocompleteTrigger />",
    "      </AutocompleteInputGroup>",
    "      <AutocompleteContent>",
    "        <AutocompleteEmpty>No cities found.</AutocompleteEmpty>",
    "        <AutocompleteList>",
    "          {(city: string) => (",
    "            <AutocompleteItem key={city} value={city}>",
    "              {city}",
    "            </AutocompleteItem>",
    "          )}",
    "        </AutocompleteList>",
    "      </AutocompleteContent>",
    "    </Autocomplete>",
    "  )",
    "}",
  );
  return L.join("\n");
}

export default playground<V>({
  file: "city-search.tsx",
  tall: true,
  refusable: true,
  controls: [
    { name: "placeholder", type: "text", default: "Search cities..." },
    { name: "mode", type: "select", options: MODES, default: "list" },
    { name: "AutocompleteClear", type: "boolean", default: false },
    { name: "disabled", type: "boolean", default: false },
  ],
  tries: [
    { label: "Search to", action: "search", args: ["to"] },
    { label: "Set Lisbon", action: "setValue", args: ["Lisbon"] },
  ],
  Demo,
  code,
});
