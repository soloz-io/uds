import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

/**
 * Library entry points.
 * Each key becomes a file in dist/ (e.g. "schemas/core/index" → dist/schemas/core/index.js).
 * The exports map in package.json only needs a single "." entry pointing to dist/index —
 * consumers import sub-paths directly from the dist folder (e.g. dist/schemas/core/index.js).
 */
const entries: Record<string, string> = {
  // Root barrel
  index: resolve(__dirname, "src/index.ts"),

  // Schema domains (backend-safe, no React)
  "schemas/core": resolve(__dirname, "src/schemas/core/index.ts"),
  "schemas/data": resolve(__dirname, "src/schemas/data/index.ts"),
  "schemas/form": resolve(__dirname, "src/schemas/form/index.ts"),
  "schemas/workflow": resolve(__dirname, "src/schemas/workflow/index.ts"),
  "schemas/ai": resolve(__dirname, "src/schemas/ai/index.ts"),

  // React registries
  "registries/react/core": resolve(__dirname, "src/registries/react/core.tsx"),
  "registries/react/data": resolve(__dirname, "src/registries/react/data.tsx"),
  "registries/react/workflow": resolve(__dirname, "src/registries/react/workflow.tsx"),
  "registries/react/ai": resolve(__dirname, "src/registries/react/ai.tsx"),

  // Presets (catalog + registry + prompt bundled)
  "presets/dashboard": resolve(__dirname, "src/presets/dashboard/index.ts"),
  "presets/form": resolve(__dirname, "src/presets/form/index.ts"),
  "presets/workflow": resolve(__dirname, "src/presets/workflow/index.ts"),
  "presets/full": resolve(__dirname, "src/presets/full/index.ts"),

  // Renderer re-exports (consumers import Renderer without @json-render/react directly)
  "renderer": resolve(__dirname, "src/renderer/index.ts"),

  // Prompt helpers
  "prompts": resolve(__dirname, "src/prompts/index.ts"),

  // Store types
  "store": resolve(__dirname, "src/store/types.ts"),

  // Optional adapters
  "adapters/jotai": resolve(__dirname, "src/adapters/jotai/index.ts"),
  "adapters/drizzle": resolve(__dirname, "src/adapters/drizzle/index.ts"),
};

const externalDeps = [
  "react",
  "react-dom",
  "ai-design-system",
  "ui-schema-contracts",
  /^ui-schema-contracts\//,
  "recharts",
  "zod",
  "jotai",
  "drizzle-orm",
  /^drizzle-orm\//,
];

export default defineConfig({
  plugins: [
    react(),
    dts({
      // Generate .d.ts files next to each output file
      include: ["src"],
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: entries,
      formats: ["es", "cjs"],
      // Vite uses the entry key as the file name — no manual filename fn needed
      fileName: (format, entryName) =>
        `${entryName}.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      // Externalise everything that must be a peer dep — never bundled
      external: externalDeps,
    },
    // Vite 8+ uses Rolldown internally; keep externals in sync.
    rolldownOptions: {
      external: externalDeps,
    },
    // Keep individual chunks so tree-shaking works per entry
    sourcemap: true,
    emptyOutDir: true,
  },
});

