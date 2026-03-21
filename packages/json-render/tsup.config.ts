import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/catalog.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  external: [
    "react",
    "react-dom",
    "@json-render/core",
    "@json-render/react",
    "@dinachi/components",
    "@dinachi/core",
    "zod",
  ],
  sourcemap: true,
});
