"use client";

import * as React from "react";
import { Marquee } from "@/components/ui/marquee";
import { playground } from "@/components/component-page/workbench";
import type { DemoProps } from "@/components/component-page/workbench-types";

const LOGOS = ["Vercel", "Linear", "Supabase", "Resend", "Clerk", "Neon", "Cal.com", "Raycast"];

type V = { duration: number; direction: string; pauseOnHover: boolean; fade: boolean };

function Demo({ values: v }: DemoProps<V>) {
  return (
    <div className="w-full max-w-xl">
      <Marquee
        duration={v.duration}
        direction={v.direction as "left" | "right"}
        pauseOnHover={v.pauseOnHover}
        fade={v.fade}
        className="py-2"
      >
        {LOGOS.map((name) => (
          <span key={name} className="whitespace-nowrap px-5 text-lg font-semibold text-muted-foreground">
            {name}
          </span>
        ))}
      </Marquee>
    </div>
  );
}

function code(v: V): string {
  const props = [
    v.duration !== 24 && `duration={${v.duration}}`,
    v.direction !== "left" && `direction="${v.direction}"`,
    !v.pauseOnHover && "pauseOnHover={false}",
    !v.fade && "fade={false}",
    'className="py-2"',
  ].filter(Boolean);
  const L: string[] = [];
  L.push(`import { Marquee } from "@/components/ui/marquee"`, "");
  L.push(`const logos = [${LOGOS.map((l) => `"${l}"`).join(", ")}]`, "");
  L.push("export function LogoStrip() {", "  return (", `    <Marquee ${props.join(" ")}>`);
  L.push("      {logos.map((name) => (", '        <span key={name} className="px-5 text-lg font-semibold text-muted-foreground">');
  L.push("          {name}", "        </span>", "      ))}", "    </Marquee>", "  )", "}");
  return L.join("\n");
}

export default playground<V>({
  file: "logo-strip.tsx",
  controls: [
    { name: "duration", type: "number", default: 24, min: 4, max: 60, step: 2 },
    { name: "direction", type: "select", options: ["left", "right"], default: "left" },
    { name: "pauseOnHover", type: "boolean", default: true },
    { name: "fade", type: "boolean", default: true },
  ],
  Demo,
  code,
});
