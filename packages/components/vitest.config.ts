/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    // This suite is the publish gate, and it runs on a shared runner where a frame can
    // span an entire animation. The defaults (5s a test, 1s a `waitFor`) fail correct
    // code when the machine is busy rather than when the code is wrong, so they are set
    // to what a slow runner needs. Timing that genuinely has to be exact is pinned by
    // `installMotionClock` instead of by a deadline.
    testTimeout: 20_000,
    hookTimeout: 20_000,
  },
})