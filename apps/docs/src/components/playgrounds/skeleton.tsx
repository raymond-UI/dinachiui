"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = { avatar: boolean; lines: number };

const WIDTHS = ["w-[250px]", "w-[200px]", "w-[225px]", "w-[175px]"];
const count = (n: number) => Math.max(1, Math.min(4, n));

function Demo({ values: v }: DemoProps<V>) {
  return (
    <div className="flex items-center space-x-4">
      {v.avatar && <Skeleton className="h-12 w-12 rounded-full" />}
      <div className="space-y-2">
        {WIDTHS.slice(0, count(v.lines)).map((w) => (
          <Skeleton key={w} className={`h-4 max-w-[60vw] ${w}`} />
        ))}
      </div>
    </div>
  );
}

function code(v: V): string {
  const L = [`import { Skeleton } from "@/components/ui/skeleton"`, "", "export function ProfileLoading() {", "  return (", '    <div className="flex items-center space-x-4">'];
  if (v.avatar) L.push('      <Skeleton className="h-12 w-12 rounded-full" />');
  L.push('      <div className="space-y-2">');
  for (const w of WIDTHS.slice(0, count(v.lines))) L.push(`        <Skeleton className="h-4 ${w}" />`);
  L.push("      </div>", "    </div>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "profile-loading.tsx",
  controls: [
    { name: "avatar", type: "boolean", default: true },
    { name: "lines", type: "number", default: 2, min: 1, max: 4 },
  ],
  Demo,
  code,
});
