"use client";

import * as React from "react";
import { isAgentChange } from "@/components/ui/agent";
import { RatesAskBar, RatesStage } from "@/components/examples/ask-bar-examples";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = {
  label: string;
  suggest: string;
  confirm: boolean;
  disabled: boolean;
};

// The site's own search holds Cmd+K, so the stage takes no shortcut.
function Demo({ values: v, refuse }: DemoProps<V>) {
  const [ran, setRan] = React.useState<string>();
  return (
    <div className="flex w-full flex-col gap-3">
      <RatesStage>
        <RatesAskBar
          contained
          shortcut={false}
          label={v.label}
          suggest={v.suggest as "focus" | "typing"}
          confirm={v.confirm ? undefined : false}
          disabled={v.disabled}
          onRan={setRan}
          onValueChange={(_, details) => {
            if (refuse && isAgentChange(details)) details.cancel();
          }}
          onCommand={(item, _, details) => {
            if (refuse && isAgentChange(details)) return details.cancel();
            setRan(`Opened ${item.label}`);
          }}
        />
      </RatesStage>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {ran}
      </p>
    </div>
  );
}

const str = (s: string) => JSON.stringify(s);

function code(v: V, { refuse }: { refuse: boolean }): string {
  const L: string[] = [];
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push(`import { AskBar, AskBarContent, AskBarTrigger } from "@/components/ui/ask-bar"`);
  L.push(`import { commands, resolve, suggestions } from "./rates"`, "");
  L.push("export function RatesBar() {", "  return (", "    <AskBar");
  L.push("      resolve={resolve}", "      commands={commands}", "      suggestions={suggestions}");
  if (v.suggest !== "focus") L.push(`      suggest=${str(v.suggest)}`);
  if (v.label !== "Ask") L.push(`      label=${str(v.label)}`);
  if (!v.confirm) L.push("      confirm={false}");
  if (v.disabled) L.push("      disabled");
  if (refuse) {
    L.push("      onValueChange={(value, details) => {", "        if (isAgentChange(details)) details.cancel()", "      }}");
    L.push("      onCommand={(command, action, details) => {", "        if (isAgentChange(details)) return details.cancel()", "        // open it", "      }}");
  } else {
    L.push("      onCommand={(command) => {", "        // open it", "      }}");
  }
  L.push("    >", "      <AskBarTrigger />", "      <AskBarContent />", "    </AskBar>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "rates-bar.tsx",
  refusable: true,
  height: 520,
  controls: [
    { name: "label", type: "text", default: "Ask" },
    { name: "suggest", type: "select", options: ["focus", "typing"], default: "focus" },
    { name: "confirm", type: "boolean", default: true },
    { name: "disabled", type: "boolean", default: false },
  ],
  tries: [
    { label: "Ask to raise rates", action: "search", args: ["raise weekend rates 10% in December"] },
    { label: "Make it 12%", action: "setValue", args: ["12"], target: "Change %" },
    { label: "Run it", action: "press", target: "Raise 24 rates by 12%" },
    { label: "Undo", action: "press", target: "Undo" },
    { label: "Search rate history", action: "search", args: ["rate history"] },
    { label: "Open Rates", action: "select", args: ["Rates"] },
  ],
  Demo,
  code,
});
