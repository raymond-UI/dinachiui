"use client";

import { isAgentChange } from "@/components/ui/agent";
import { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = { orientation: string; activateOnFocus: boolean; TabsIndicator: boolean; disabled: boolean };

const TABS = [
  { value: "account", label: "Account", text: "Manage your account settings and preferences." },
  { value: "password", label: "Password", text: "Change your password and security settings." },
  { value: "settings", label: "Settings", text: "Configure your application preferences." },
];

function Demo({ values: v, refuse }: DemoProps<V>) {
  return (
    <Tabs
      defaultValue="account"
      orientation={v.orientation as "horizontal" | "vertical"}
      onValueChange={(_, details) => {
        if (refuse && isAgentChange(details)) details.cancel();
      }}
      className="w-full max-w-md"
    >
      <TabsList activateOnFocus={v.activateOnFocus} className={v.TabsIndicator ? "relative" : undefined}>
        {TABS.map((t) => (
          <TabsTrigger key={t.value} value={t.value} disabled={v.disabled && t.value === "settings"}>
            {t.label}
          </TabsTrigger>
        ))}
        {v.TabsIndicator && <TabsIndicator />}
      </TabsList>
      {TABS.map((t) => (
        <TabsContent key={t.value} value={t.value} className="space-y-2 pt-4">
          <h3 className="text-sm font-medium">{t.label}</h3>
          <p className="text-sm text-muted-foreground">{t.text}</p>
        </TabsContent>
      ))}
    </Tabs>
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const parts = ["Tabs", "TabsContent", "TabsList", "TabsTrigger"];
  if (v.TabsIndicator) parts.push("TabsIndicator");
  parts.sort();

  const L: string[] = [];
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push(`import { ${parts.join(", ")} } from "@/components/ui/tabs"`);
  L.push("", "export function AccountTabs() {", "  return (");
  const root = ['defaultValue="account"'];
  if (v.orientation !== "horizontal") root.push(`orientation="${v.orientation}"`);
  root.push('className="w-full max-w-md"');
  if (refuse) {
    L.push("    <Tabs");
    root.forEach((p) => L.push(`      ${p}`));
    L.push("      onValueChange={(value, details) => {", "        if (isAgentChange(details)) details.cancel()", "      }}", "    >");
  } else {
    L.push(`    <Tabs ${root.join(" ")}>`);
  }
  const list: string[] = [];
  if (v.activateOnFocus) list.push("activateOnFocus");
  if (v.TabsIndicator) list.push('className="relative"');
  L.push(`      <TabsList${list.map((p) => " " + p).join("")}>`);
  for (const t of TABS) {
    const dis = v.disabled && t.value === "settings" ? " disabled" : "";
    L.push(`        <TabsTrigger value="${t.value}"${dis}>${t.label}</TabsTrigger>`);
  }
  if (v.TabsIndicator) L.push("        <TabsIndicator />");
  L.push("      </TabsList>");
  for (const t of TABS) {
    L.push(`      <TabsContent value="${t.value}" className="space-y-2 pt-4">`);
    L.push(`        <h3 className="text-sm font-medium">${t.label}</h3>`);
    L.push(`        <p className="text-sm text-muted-foreground">${t.text}</p>`);
    L.push("      </TabsContent>");
  }
  L.push("    </Tabs>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "account-tabs.tsx",
  refusable: true,
  controls: [
    { name: "orientation", type: "select", options: ["horizontal", "vertical"], default: "horizontal" },
    { name: "activateOnFocus", type: "boolean", default: false },
    { name: "TabsIndicator", type: "boolean", default: false },
    { name: "disabled", type: "boolean", default: false },
  ],
  tries: [
    { label: "Select Password", action: "select", args: ["Password"] },
    { label: "Select Billing", action: "select", args: ["Billing"] },
  ],
  Demo,
  code,
});
