"use client";

import * as React from "react";
import { isAgentChange } from "@/components/ui/agent";
import {
  Slider,
  SliderControl,
  SliderLabel,
  SliderRange,
  SliderThumb,
  SliderTrack,
  SliderValue,
} from "@/components/ui/slider";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = {
  defaultValue: string;
  step: number;
  SliderValue: boolean;
  disabled: boolean;
};

const RANGE = "[25, 75]";

function Demo({ values: v, refuse }: DemoProps<V>) {
  const range = v.defaultValue === RANGE;
  return (
    <div className="w-full max-w-sm">
      <Slider
        // defaultValue only applies on mount, and one thumb or two is a different slider.
        key={v.defaultValue}
        defaultValue={range ? [25, 75] : 50}
        step={v.step}
        disabled={v.disabled}
        onValueChange={(_, details) => {
          if (refuse && isAgentChange(details)) details.cancel();
        }}
      >
        <div className="flex items-center justify-between">
          <SliderLabel>{range ? "Price range" : "Volume"}</SliderLabel>
          {v.SliderValue && <SliderValue className="text-sm text-muted-foreground" />}
        </div>
        <SliderControl>
          <SliderTrack>
            <SliderRange />
            {range ? (
              <>
                <SliderThumb index={0} aria-label="Minimum price" />
                <SliderThumb index={1} aria-label="Maximum price" />
              </>
            ) : (
              <SliderThumb />
            )}
          </SliderTrack>
        </SliderControl>
      </Slider>
    </div>
  );
}

function code(v: V, { refuse }: { refuse: boolean }): string {
  const range = v.defaultValue === RANGE;
  const parts = ["Slider", "SliderControl", "SliderLabel", "SliderRange", "SliderThumb", "SliderTrack"];
  if (v.SliderValue) parts.push("SliderValue");

  const props = [`defaultValue={${range ? "[25, 75]" : 50}}`];
  if (v.step !== 1) props.push(`step={${v.step}}`);
  if (v.disabled) props.push("disabled");

  const L: string[] = [`import { ${parts.join(", ")} } from "@/components/ui/slider"`];
  if (refuse) L.push(`import { isAgentChange } from "@/components/ui/agent"`);
  L.push("", `export function ${range ? "PriceRange" : "VolumeSlider"}() {`, "  return (");
  if (refuse) {
    L.push("    <Slider");
    props.forEach((p) => L.push(`      ${p}`));
    L.push("      onValueChange={(value, details) => {", "        if (isAgentChange(details)) details.cancel()", "      }}", "    >");
  } else {
    L.push(`    <Slider ${props.join(" ")}>`);
  }
  const label = `<SliderLabel>${range ? "Price range" : "Volume"}</SliderLabel>`;
  if (v.SliderValue) {
    L.push('      <div className="flex justify-between">', `        ${label}`, "        <SliderValue />", "      </div>");
  } else {
    L.push(`      ${label}`);
  }
  L.push("      <SliderControl>", "        <SliderTrack>", "          <SliderRange />");
  if (range) {
    L.push('          <SliderThumb index={0} aria-label="Minimum price" />', '          <SliderThumb index={1} aria-label="Maximum price" />');
  } else {
    L.push("          <SliderThumb />");
  }
  L.push("        </SliderTrack>", "      </SliderControl>", "    </Slider>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "slider-field.tsx",
  refusable: true,
  controls: [
    { name: "defaultValue", type: "select", options: ["50", RANGE], default: "50" },
    { name: "step", type: "number", default: 1, min: 1, max: 50 },
    { name: "SliderValue", type: "boolean", default: true },
    { name: "disabled", type: "boolean", default: false },
  ],
  tries: [
    { label: "Set 60", action: "setValue", args: [60] },
    { label: "Set [20, 80]", action: "setValue", args: [[20, 80]] },
    { label: "Set 140", action: "setValue", args: [140] },
  ],
  Demo,
  code,
});
