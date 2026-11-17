"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = { orientation: "vertical" | "horizontal" | "both"; tags: number };

const make = (n: number) => Array.from({ length: n }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`);
const NOTE = "Fixes focus rings and trims the bundle";

const box: Record<V["orientation"], string> = {
  vertical: "h-72 w-48 rounded-md border",
  horizontal: "w-72 rounded-md border whitespace-nowrap",
  both: "h-72 w-64 rounded-md border",
};

function Demo({ values: v }: DemoProps<V>) {
  const tags = make(Math.max(1, Math.min(100, v.tags)));
  return (
    <ScrollArea orientation={v.orientation} className={box[v.orientation]}>
      {v.orientation === "horizontal" ? (
        <div className="flex w-max gap-2 p-4">
          {tags.map((tag) => (
            <div key={tag} className="rounded-md border px-3 py-1.5 text-sm">{tag}</div>
          ))}
        </div>
      ) : (
        <div className="p-4">
          <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
          {tags.map((tag) => (
            <div key={tag}>
              <div className={v.orientation === "both" ? "whitespace-nowrap text-sm" : "text-sm"}>
                {tag}
                {v.orientation === "both" && <span className="ml-3 text-muted-foreground">{NOTE}</span>}
              </div>
              <Separator className="my-2" />
            </div>
          ))}
        </div>
      )}
    </ScrollArea>
  );
}

function code(v: V): string {
  const horizontal = v.orientation === "horizontal";
  const L = [`import { ScrollArea } from "@/components/ui/scroll-area"`];
  if (!horizontal) L.push(`import { Separator } from "@/components/ui/separator"`);
  L.push("", `const tags = Array.from({ length: ${v.tags} }).map(`, "  (_, i, a) => `v1.2.0-beta.${a.length - i}`", ")", "");
  L.push("export function ReleaseTags() {", "  return (");
  const orient = v.orientation === "vertical" ? "" : ` orientation="${v.orientation}"`;
  L.push(`    <ScrollArea${orient} className="${box[v.orientation]}">`);
  if (horizontal) {
    L.push(
      '      <div className="flex w-max gap-2 p-4">',
      "        {tags.map((tag) => (",
      '          <div key={tag} className="rounded-md border px-3 py-1.5 text-sm">{tag}</div>',
      "        ))}",
      "      </div>",
    );
  } else {
    L.push('      <div className="p-4">', '        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>', "        {tags.map((tag) => (", "          <div key={tag}>");
    if (v.orientation === "both")
      L.push(
        '            <div className="whitespace-nowrap text-sm">',
        "              {tag}",
        `              <span className="ml-3 text-muted-foreground">${NOTE}</span>`,
        "            </div>",
      );
    else L.push('            <div className="text-sm">{tag}</div>');
    L.push('            <Separator className="my-2" />', "          </div>", "        ))}", "      </div>");
  }
  L.push("    </ScrollArea>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "release-tags.tsx",
  controls: [
    { name: "orientation", type: "select", options: ["vertical", "horizontal", "both"], default: "vertical" },
    { name: "tags", type: "number", default: 50, min: 1, max: 100 },
  ],
  Demo,
  code,
});
