// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Additional ignores:
    "node_modules/**",
    "dist/**",
    "storybook-static/**",
    "**/storybook-static/**",
    ".husky/**",
    ".git/**",
    "pnpm-lock.yaml",
    "package-lock.json",
    "*.config.js",
    "*.config.mjs",
    "*.config.ts",
    // Skip Storybook files (they have different patterns)
    "**/*.stories.tsx",
    "**/*.stories.ts",
    // Skip mock files
    "**/*.mock.ts",
    "**/*.mock.tsx",
    "**/*.mocks.ts",
    // Skip validation scripts
    "scripts/**/*.js",
  ]),
]);

export default eslintConfig;
