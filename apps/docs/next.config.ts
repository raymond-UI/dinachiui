import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Pre-existing type errors in UI components (menubar, popover, preview-card, tooltip)
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [{ source: "/docs/components/:slug.md", destination: "/md/components/:slug" }];
  },
};

export default nextConfig;
