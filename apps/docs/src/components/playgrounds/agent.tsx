"use client";

import * as React from "react";
import { Select, SelectContent, SelectFieldLabel, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider, SliderControl, SliderLabel, SliderRange, SliderThumb, SliderTrack, SliderValue } from "@/components/ui/slider";
import { Switch, SwitchThumb } from "@/components/ui/switch";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

const REGIONS = { us: "United States", eu: "Europe", ap: "Asia Pacific" };

type V = {
  Switch: boolean;
  Select: boolean;
  Slider: boolean;
  "data-agent-hidden": boolean;
};

// The workbench wraps the stage in its own AgentProvider, so these register with it.
function Demo({ values: v }: DemoProps<V>) {
  const none = !v.Switch && !v.Select && !v.Slider;
  return (
    <form className="w-full max-w-[300px] space-y-5" onSubmit={(e) => e.preventDefault()}>
      {v.Switch && (
        <label className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium">Email alerts</span>
          <Switch>
            <SwitchThumb />
          </Switch>
        </label>
      )}
      {v.Select && (
        <Select items={REGIONS} defaultValue="us" modal={false}>
          <SelectFieldLabel className="mb-2">Region</SelectFieldLabel>
          <SelectTrigger className="bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(REGIONS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {v.Slider && (
        <div data-agent-hidden={v["data-agent-hidden"] ? "" : undefined}>
          <Slider defaultValue={40}>
            <div className="flex items-center justify-between">
              <SliderLabel>Volume</SliderLabel>
              <SliderValue className="text-sm text-muted-foreground" />
            </div>
            <SliderControl>
              <SliderTrack>
                <SliderRange />
                <SliderThumb />
              </SliderTrack>
            </SliderControl>
          </Slider>
        </div>
      )}
      {none && <p className="text-center text-sm text-muted-foreground">Nothing for the agent to read.</p>}
    </form>
  );
}

function code(v: V): string {
  const L: string[] = [`import { AgentProvider, useAgent } from "@/components/ui/agent"`];
  if (v.Select) L.push(`import { Select, SelectContent, SelectFieldLabel, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"`);
  if (v.Slider) L.push(`import { Slider, SliderControl, SliderLabel, SliderRange, SliderThumb, SliderTrack, SliderValue } from "@/components/ui/slider"`);
  if (v.Switch) L.push(`import { Switch, SwitchThumb } from "@/components/ui/switch"`);
  if (v.Select) L.push("", `const regions = { us: "United States", eu: "Europe", ap: "Asia Pacific" }`);
  L.push("", "export function Settings() {", "  const agent = useAgent()", "", "  return (", "    <AgentProvider agent={agent}>");

  if (!v.Switch && !v.Select && !v.Slider) {
    L.push("      <form />", "    </AgentProvider>", "  )", "}");
    return L.join("\n");
  }
  L.push("      <form>");
  if (v.Switch) {
    L.push("        <label>", "          Email alerts", "          <Switch>", "            <SwitchThumb />", "          </Switch>", "        </label>");
  }
  if (v.Select) {
    L.push('        <Select items={regions} defaultValue="us">', "          <SelectFieldLabel>Region</SelectFieldLabel>");
    L.push("          <SelectTrigger>", "            <SelectValue />", "          </SelectTrigger>", "          <SelectContent>");
    L.push("            {Object.entries(regions).map(([value, label]) => (", "              <SelectItem key={value} value={value}>");
    L.push("                {label}", "              </SelectItem>", "            ))}", "          </SelectContent>", "        </Select>");
  }
  if (v.Slider) {
    const pad = v["data-agent-hidden"] ? "  " : "";
    if (pad) L.push("        <div data-agent-hidden>");
    L.push(`${pad}        <Slider defaultValue={40}>`, `${pad}          <SliderLabel>Volume</SliderLabel>`, `${pad}          <SliderValue />`);
    L.push(`${pad}          <SliderControl>`, `${pad}            <SliderTrack>`, `${pad}              <SliderRange />`, `${pad}              <SliderThumb />`);
    L.push(`${pad}            </SliderTrack>`, `${pad}          </SliderControl>`, `${pad}        </Slider>`);
    if (pad) L.push("        </div>");
  }
  L.push("      </form>", "    </AgentProvider>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "settings.tsx",
  controls: [
    { name: "Switch", type: "boolean", default: true },
    { name: "Select", type: "boolean", default: true },
    { name: "Slider", type: "boolean", default: true },
    { name: "data-agent-hidden", type: "boolean", default: false },
  ],
  tries: [
    { label: "Turn on alerts", action: "setChecked", args: [true], target: "Email alerts" },
    { label: "Pick Europe", action: "select", args: ["Europe"], target: "Region" },
    { label: "Set Volume 80", action: "setValue", args: [80], target: "Volume" },
  ],
  Demo,
  code,
});
