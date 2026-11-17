"use client";

import { Progress, ProgressIndicator, ProgressLabel, ProgressTrack, ProgressValue } from "@/components/ui/progress";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = { value: number; max: number; ProgressLabel: string; ProgressValue: boolean };

function Demo({ values: v }: DemoProps<V>) {
  return (
    <Progress value={v.value} max={v.max} className="w-full max-w-sm">
      <div className="flex items-center justify-between">
        <ProgressLabel>{v.ProgressLabel}</ProgressLabel>
        {v.ProgressValue && <ProgressValue />}
      </div>
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </Progress>
  );
}

function code(v: V): string {
  const parts = ["Progress", "ProgressIndicator", "ProgressLabel", "ProgressTrack", ...(v.ProgressValue ? ["ProgressValue"] : [])];
  return [
    `import { ${parts.join(", ")} } from "@/components/ui/progress"`,
    "",
    "export function UploadProgress() {",
    "  return (",
    `    <Progress value={${v.value}}${v.max !== 100 ? ` max={${v.max}}` : ""} className="w-full max-w-sm">`,
    '      <div className="flex items-center justify-between">',
    `        <ProgressLabel>${v.ProgressLabel}</ProgressLabel>`,
    ...(v.ProgressValue ? ["        <ProgressValue />"] : []),
    "      </div>",
    "      <ProgressTrack>",
    "        <ProgressIndicator />",
    "      </ProgressTrack>",
    "    </Progress>",
    "  )",
    "}",
  ].join("\n");
}

export default playground<V>({
  file: "upload-progress.tsx",
  controls: [
    { name: "value", type: "number", default: 75, min: 0, max: 1000, step: 5 },
    { name: "max", type: "number", default: 100, min: 1, max: 1000, step: 10 },
    { name: "ProgressLabel", type: "text", default: "Uploading..." },
    { name: "ProgressValue", type: "boolean", default: true },
  ],
  Demo,
  code,
});
