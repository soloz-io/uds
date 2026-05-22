"use client";

import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";

import { coreSchemas } from "../../schemas/core/index.js";
import { dataSchemas } from "../../schemas/data/index.js";
import { workflowSchemas } from "../../schemas/workflow/index.js";
import { aiSchemas } from "../../schemas/ai/index.js";
import { buildSystemPrompt, buildUserPrompt, type SystemPromptOptions } from "../../prompts/index.js";
import { coreRegistry } from "../../registries/react/core.js";
import { dataRegistry } from "../../registries/react/data.js";
import { workflowRegistry } from "../../registries/react/workflow.js";
import { aiRegistry } from "../../registries/react/ai.js";

export type { SystemPromptOptions };
export { buildUserPrompt };

const allSchemas = { ...coreSchemas, ...dataSchemas, ...workflowSchemas, ...aiSchemas };

export const fullCatalog = defineCatalog(schema, {
  components: allSchemas as Parameters<typeof defineCatalog>[1]["components"],
  actions: {},
});

export const fullPreset = {
  catalog: fullCatalog,
  registry: { ...coreRegistry, ...dataRegistry, ...workflowRegistry, ...aiRegistry },

  getSystemPrompt(options?: SystemPromptOptions): string {
    return buildSystemPrompt(allSchemas, options);
  },
};
