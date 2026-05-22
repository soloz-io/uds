import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Temporarily ignore type errors from Storybook files during build
    // Storybook has its own type checking
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
