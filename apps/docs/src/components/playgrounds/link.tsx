"use client";

import { Link } from "@/components/ui/link";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type Variant = "default" | "muted" | "plain" | "unstyled";
type V = { children: string; variant: string; external: boolean };

function Demo({ values: v }: DemoProps<V>) {
  return (
    <Link href="#" variant={v.variant as Variant} external={v.external} onClick={(e) => e.preventDefault()}>
      {v.children}
    </Link>
  );
}

function code(v: V): string {
  const props = ['href="#"'];
  if (v.variant !== "default") props.push(`variant="${v.variant}"`);
  if (v.external) props.push("external");
  return [
    `import { Link } from "@/components/ui/link"`,
    "",
    "export function DocsLink() {",
    `  return <Link ${props.join(" ")}>${v.children}</Link>`,
    "}",
  ].join("\n");
}

export default playground<V>({
  file: "docs-link.tsx",
  controls: [
    { name: "children", type: "text", default: "DinachiUI Documentation" },
    { name: "variant", type: "select", options: ["default", "muted", "plain", "unstyled"], default: "default" },
    { name: "external", type: "boolean", default: false },
  ],
  Demo,
  code,
});
