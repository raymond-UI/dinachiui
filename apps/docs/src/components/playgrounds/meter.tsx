"use client";

import { Meter, MeterIndicator, MeterLabel, MeterTrack, MeterValue } from "@/components/ui/meter";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = { value: number; max: number; MeterLabel: string; MeterValue: boolean };

function Demo({ values: v }: DemoProps<V>) {
  return (
    <Meter value={v.value} max={v.max} className="w-full max-w-sm">
      <div className="flex items-center justify-between">
        <MeterLabel>{v.MeterLabel}</MeterLabel>
        {v.MeterValue && <MeterValue />}
      </div>
      <MeterTrack>
        <MeterIndicator />
      </MeterTrack>
    </Meter>
  );
}

function code(v: V): string {
  const parts = ["Meter", "MeterIndicator", "MeterLabel", "MeterTrack", ...(v.MeterValue ? ["MeterValue"] : [])];
  return [
    `import { ${parts.join(", ")} } from "@/components/ui/meter"`,
    "",
    "export function StorageMeter() {",
    "  return (",
    `    <Meter value={${v.value}}${v.max !== 100 ? ` max={${v.max}}` : ""} className="w-full max-w-sm">`,
    '      <div className="flex items-center justify-between">',
    `        <MeterLabel>${v.MeterLabel}</MeterLabel>`,
    ...(v.MeterValue ? ["        <MeterValue />"] : []),
    "      </div>",
    "      <MeterTrack>",
    "        <MeterIndicator />",
    "      </MeterTrack>",
    "    </Meter>",
    "  )",
    "}",
  ].join("\n");
}

export default playground<V>({
  file: "storage-meter.tsx",
  controls: [
    { name: "value", type: "number", default: 72, min: 0, max: 1000, step: 5 },
    { name: "max", type: "number", default: 100, min: 1, max: 1000, step: 10 },
    { name: "MeterLabel", type: "text", default: "Storage Used" },
    { name: "MeterValue", type: "boolean", default: true },
  ],
  Demo,
  code,
});
