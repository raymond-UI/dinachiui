import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@dinachi/core': resolve(fileURLToPath(new URL('.', import.meta.url)), './packages/core/src'),
      '@dinachi/components': resolve(fileURLToPath(new URL('.', import.meta.url)), './packages/components/src'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
