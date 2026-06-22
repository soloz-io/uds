import type { StorybookConfig } from "@storybook/react-vite";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  "stories": [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../components/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-onboarding",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest"
  ],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
  "staticDirs": [
    "../public"
  ],
  async viteFinal(config) {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "../"),
    };

    const build = (config.build || {}) as Record<string, unknown> & {
      rollupOptions?: {
        external?: string | string[];
      };
      rolldownOptions?: {
        external?: string | string[];
      };
    };

    if (build) {
      build.rollupOptions = build.rollupOptions || {};
      build.rollupOptions.external = [
        ...(Array.isArray(build.rollupOptions.external)
          ? build.rollupOptions.external
          : build.rollupOptions.external
          ? [build.rollupOptions.external]
          : []),
        "web-worker",
      ];

      build.rolldownOptions = build.rolldownOptions || {};
      build.rolldownOptions.external = [
        ...(Array.isArray(build.rolldownOptions.external)
          ? build.rolldownOptions.external
          : build.rolldownOptions.external
          ? [build.rolldownOptions.external]
          : []),
        "web-worker",
      ];
    }

    return config;
  }
};
export default config;
