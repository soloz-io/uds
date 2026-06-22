import type { StorybookConfig } from "@storybook/nextjs-vite";

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
    "name": "@storybook/nextjs-vite",
    "options": {}
  },
  "staticDirs": [
    "../public"
  ],
  async viteFinal(config) {
    const build = (config.build || {}) as Record<string, unknown> & {
      rollupOptions?: {
        external?: string | string[];
      };
      rolldownOptions?: {
        external?: string | string[];
      };
    };
    
    if (build) {
      // Support standard Rollup configuration
      build.rollupOptions = build.rollupOptions || {};
      build.rollupOptions.external = [
        ...(Array.isArray(build.rollupOptions.external)
          ? build.rollupOptions.external
          : build.rollupOptions.external
          ? [build.rollupOptions.external]
          : []),
        "web-worker",
      ];

      // Support Rolldown configuration specifically if active
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