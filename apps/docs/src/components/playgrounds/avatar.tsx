"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

type V = { size: "sm" | "md" | "lg"; AvatarImage: boolean; AvatarFallback: string };

const SRC = "/avatar.png";

function Demo({ values: v }: DemoProps<V>) {
  return (
    <Avatar size={v.size}>
      {v.AvatarImage && <AvatarImage src={SRC} alt="@raymond-ui" />}
      <AvatarFallback>{v.AvatarFallback}</AvatarFallback>
    </Avatar>
  );
}

function code(v: V): string {
  const parts = ["Avatar", "AvatarFallback", ...(v.AvatarImage ? ["AvatarImage"] : [])];
  return [
    `import { ${parts.join(", ")} } from "@/components/ui/avatar"`,
    "",
    "export function UserAvatar() {",
    "  return (",
    `    <Avatar${v.size === "md" ? "" : ` size="${v.size}"`}>`,
    ...(v.AvatarImage ? [`      <AvatarImage src="${SRC}" alt="@raymond-ui" />`] : []),
    `      <AvatarFallback>${v.AvatarFallback}</AvatarFallback>`,
    "    </Avatar>",
    "  )",
    "}",
  ].join("\n");
}

export default playground<V>({
  file: "user-avatar.tsx",
  controls: [
    { name: "size", type: "select", options: ["sm", "md", "lg"], default: "md" },
    { name: "AvatarImage", type: "boolean", default: true },
    { name: "AvatarFallback", type: "text", default: "RA" },
  ],
  Demo,
  code,
});
