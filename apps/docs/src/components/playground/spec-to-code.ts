import type { Spec } from "@json-render/core";

// Box prop → Tailwind class maps (mirrors components.tsx)
const gapMap: Record<string, string> = {
  none: "gap-0", xs: "gap-1", sm: "gap-2", md: "gap-4", lg: "gap-6", xl: "gap-8",
};
const paddingMap: Record<string, string> = {
  none: "p-0", xs: "p-1", sm: "p-2", md: "p-4", lg: "p-6", xl: "p-8",
};
const alignMap: Record<string, string> = {
  start: "items-start", center: "items-center", end: "items-end",
  stretch: "items-stretch", baseline: "items-baseline",
};
const justifyMap: Record<string, string> = {
  start: "justify-start", center: "justify-center", end: "justify-end",
  between: "justify-between", around: "justify-around", evenly: "justify-evenly",
};

function boxPropsToClassName(props: Record<string, unknown>): string {
  const classes = [
    "flex",
    props.direction === "row" ? "flex-row" : "flex-col",
    gapMap[props.gap as string] ?? "",
    alignMap[props.align as string] ?? "",
    justifyMap[props.justify as string] ?? "",
    props.wrap ? "flex-wrap" : "",
    paddingMap[props.padding as string] ?? "",
  ].filter(Boolean);
  return classes.join(" ");
}

/**
 * Converts a json-render Spec into React/JSX source code
 * using DinachiUI component imports.
 */
export function specToCode(spec: Spec): string {
  if (!spec.root || !spec.elements) return "";
  const usedComponents = new Set<string>();
  const hasState = spec.state && Object.keys(spec.state).length > 0;

  function resolveValue(val: unknown): string {
    if (val === null || val === undefined) return "undefined";
    if (typeof val === "string") return JSON.stringify(val);
    if (typeof val === "number" || typeof val === "boolean") return String(val);

    if (typeof val === "object" && !Array.isArray(val)) {
      const obj = val as Record<string, unknown>;

      // Dynamic $path → state reference
      if ("$path" in obj && typeof obj.$path === "string") {
        const path = obj.$path as string;
        if (path.startsWith("$item/")) {
          return `item.${path.slice("$item/".length)}`;
        }
        const segments = path.replace(/^\//, "").split("/");
        return `state.${segments.join(".")}`;
      }

      // Dynamic $cond → ternary
      if ("$cond" in obj && "$then" in obj && "$else" in obj) {
        return `/* conditional */ ${resolveValue(obj.$then)}`;
      }

      // Plain object — inline as JSON
      return JSON.stringify(val);
    }

    if (Array.isArray(val)) {
      return JSON.stringify(val);
    }

    return String(val);
  }

  function renderElement(key: string, indent: number): string {
    const el = spec.elements[key];
    if (!el) return "";

    const type = el.type as string;
    if (!type) return "";

    const pad = "  ".repeat(indent);
    const props = (el.props ?? {}) as Record<string, unknown>;
    const children = Array.isArray(el.children) ? (el.children as string[]) : [];

    // --- Box: expand to raw Tailwind div ---
    if (type === "Box") {
      const className = boxPropsToClassName(props);
      const childLines = children
        .map((childKey) => renderElement(childKey, indent + 1))
        .filter(Boolean)
        .join("\n");

      if (children.length === 0) {
        return `${pad}<div className="${className}" />`;
      }
      return `${pad}<div className="${className}">\n${childLines}\n${pad}</div>`;
    }

    // --- Text: content prop becomes children ---
    if (type === "Text") {
      usedComponents.add("Text");
      const variant = props.variant as string | undefined;
      const content = props.content as string | undefined;
      const variantProp = variant && variant !== "p" ? ` variant="${variant}"` : "";

      if (content) {
        return `${pad}<Text${variantProp}>${content}</Text>`;
      }
      return `${pad}<Text${variantProp} />`;
    }

    // --- All other components ---
    usedComponents.add(type);

    // Build prop strings
    const propParts: string[] = [];
    for (const [k, v] of Object.entries(props)) {
      if (v === undefined || v === null) continue;

      if (typeof v === "string") {
        propParts.push(`${k}=${JSON.stringify(v)}`);
      } else if (typeof v === "boolean") {
        propParts.push(v ? k : `${k}={false}`);
      } else if (typeof v === "number") {
        propParts.push(`${k}={${v}}`);
      } else if (typeof v === "object" && "$path" in (v as Record<string, unknown>)) {
        propParts.push(`${k}={${resolveValue(v)}}`);
      } else if (Array.isArray(v)) {
        // Arrays (options, items, tabs) — format inline
        propParts.push(`${k}={${JSON.stringify(v)}}`);
      } else {
        propParts.push(`${k}={${resolveValue(v)}}`);
      }
    }

    const propsStr = propParts.length > 0 ? " " + propParts.join(" ") : "";

    if (children.length === 0) {
      return `${pad}<${type}${propsStr} />`;
    }

    const childLines = children
      .map((childKey) => renderElement(childKey, indent + 1))
      .filter(Boolean)
      .join("\n");

    return `${pad}<${type}${propsStr}>\n${childLines}\n${pad}</${type}>`;
  }

  const jsx = renderElement(spec.root, 2);

  // Build imports
  const sortedComponents = Array.from(usedComponents).sort();

  const lines: string[] = [];
  lines.push(`"use client";\n`);

  if (hasState) {
    lines.push(`import { useState } from "react";`);
  }

  // Group imports by source
  if (sortedComponents.length > 0) {
    const componentImports = sortedComponents.join(", ");
    lines.push(`import { ${componentImports} } from "@/components/ui";\n`);
  }

  lines.push(`export default function Page() {`);

  if (hasState) {
    lines.push(`  const [state] = useState(${JSON.stringify(spec.state, null, 4).split("\n").map((l, i) => i === 0 ? l : "  " + l).join("\n")});\n`);
  }

  lines.push(`  return (`);
  lines.push(jsx);
  lines.push(`  );`);
  lines.push(`}`);
  lines.push(``);

  return lines.join("\n");
}
