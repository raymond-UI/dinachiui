import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"

// Live runs against the model. Kept out of the test suite: they cost money, need a key,
// and their outcome depends on the model as much as on the code.
export default defineConfig({
  plugins: [react()],
  test: {
    root: __dirname,
    include: ["*.eval.tsx"],
    environment: "jsdom",
    setupFiles: ["../src/test/setup.ts"],
    globals: true,
    testTimeout: 180_000,
    // One case at a time, so the token counts compare run to run.
    fileParallelism: false,
  },
})
