import type { Spec } from "@dinachi/json-render";

/**
 * Converts a json-render Spec into React/JSX source code
 * using DinachiUI component imports.
 */
export function specToCode(spec: Spec): string {
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
    usedComponents.add(type);

    const pad = "  ".repeat(indent);
    const props = el.props as Record<string, unknown>;
    const children = (el.children as string[] | undefined) ?? [];

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
  const componentImports = sortedComponents.join(", ");
  lines.push(`import { ${componentImports} } from "@/components/ui";\n`);

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
