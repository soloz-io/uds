"use client";

import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { z } from "zod";

import { coreSchemas } from "../../schemas/core/index.js";
import { dataSchemas } from "../../schemas/data/index.js";
import { buildSystemPrompt, buildUserPrompt, type SystemPromptOptions } from "../../prompts/index.js";
import { coreRegistry } from "../../registries/react/core.js";
import { dataRegistry } from "../../registries/react/data.js";

export type { SystemPromptOptions };
// Re-export buildUserPrompt so backend routes can import everything from one path
export { buildUserPrompt };

const allSchemas = { ...coreSchemas, ...dataSchemas };

export const dashboardCatalog = defineCatalog(schema, {
  components: allSchemas as Parameters<typeof defineCatalog>[1]["components"],
  actions: {},
});

const dashboardRegistry = { ...coreRegistry, ...dataRegistry };

type ExtendOptions = {
  schemas: Record<string, { props: z.ZodTypeAny; description: string; example?: unknown; slots?: string[] }>;
  registry: Record<string, (ctx: { props: Record<string, unknown>; children?: unknown }) => unknown>;
};

export const dashboardPreset = {
  catalog: dashboardCatalog,

  /** React registry  pass directly to <Renderer registry={dashboardPreset.registry} spec={spec} /> */
  registry: dashboardRegistry,

  /** Returns a system prompt string. Pass to your LLM before generating a spec. */
  getSystemPrompt(options?: SystemPromptOptions): string {
    return buildSystemPrompt(allSchemas, options);
  },

  /**
   * Creates a new preset extended with custom component schemas and registry entries.
   *
   * @example
   * ```ts
   * const extended = dashboardPreset.extend({
   *   schemas: {
   *     MyWidget: {
   *       props: z.object({ title: z.string(), dataKey: z.string() }),
   *       description: "Custom widget for internal KPIs.",
   *       example: { title: "Pipeline Health", dataKey: "pipeline" },
   *     },
   *   },
   *   registry: {
   *     MyWidget: ({ props }) => <MyCustomWidget title={props.title as string} />,
   *   },
   * });
   * ```
   */
  extend(opts: ExtendOptions) {
    const extendedSchemas = { ...allSchemas, ...opts.schemas };
    const extendedCatalog = defineCatalog(schema, {
      components: extendedSchemas as Parameters<typeof defineCatalog>[1]["components"],
      actions: {},
    });
    return {
      catalog: extendedCatalog,
      registry: { ...dashboardRegistry, ...opts.registry },
      getSystemPrompt(options?: SystemPromptOptions): string {
        return buildSystemPrompt(extendedSchemas, options);
      },
    };
  },
};
