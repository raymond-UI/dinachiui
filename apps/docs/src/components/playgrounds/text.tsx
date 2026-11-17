"use client";

import { Text } from "@/components/ui/text";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

const VARIANTS = ["h1", "h2", "h3", "h4", "p", "large", "small", "lead", "muted", "blockquote", "code", "span"] as const;
type Variant = (typeof VARIANTS)[number];
type V = { variant: Variant; as: string; children: string };

const AS = ["default", "h2", "p", "span", "label"];

function Demo({ values: v }: DemoProps<V>) {
  return (
    <div className="max-w-full text-center">
      <Text variant={v.variant} as={v.as === "default" ? undefined : (v.as as "h2")}>
        {v.children}
      </Text>
    </div>
  );
}

function code(v: V): string {
  const props: string[] = [];
  if (v.variant !== "p") props.push(`variant="${v.variant}"`);
  if (v.as !== "default") props.push(`as="${v.as}"`);
  return [
    `import { Text } from "@/components/ui/text"`,
    "",
    "export function Headline() {",
    "  return (",
    `    <Text${props.length ? " " + props.join(" ") : ""}>${v.children}</Text>`,
    "  )",
    "}",
  ].join("\n");
}

export default playground<V>({
  file: "headline.tsx",
  controls: [
    { name: "variant", type: "select", options: VARIANTS, default: "h2" },
    { name: "as", type: "select", options: AS, default: "default" },
    { name: "children", type: "text", default: "The quick brown fox" },
  ],
  Demo,
  code,
});
