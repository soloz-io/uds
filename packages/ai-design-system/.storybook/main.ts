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
    config.build = config.build || {};
    
    // Support standard Rollup configuration
    config.build.rollupOptions = config.build.rollupOptions || {};
    config.build.rollupOptions.external = [
      ...(Array.isArray(config.build.rollupOptions.external)
        ? config.build.rollupOptions.external
        : config.build.rollupOptions.external
        ? [config.build.rollupOptions.external]
        : []),
      "web-worker",
    ];

    // Support Rolldown configuration specifically if active
    const buildConfig = config.build as Record<string, unknown> & {
      rolldownOptions?: {
        external?: string | string[];
      };
    };
    if (buildConfig) {
      buildConfig.rolldownOptions = buildConfig.rolldownOptions || {};
      buildConfig.rolldownOptions.external = [
        ...(Array.isArray(buildConfig.rolldownOptions.external)
          ? buildConfig.rolldownOptions.external
          : buildConfig.rolldownOptions.external
          ? [buildConfig.rolldownOptions.external]
          : []),
        "web-worker",
      ];
    }

    return config;
  }
};
export default config;