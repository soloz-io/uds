"use client";

import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";

import { coreSchemas } from "../../schemas/core/index.js";
import { buildSystemPrompt, buildUserPrompt, type SystemPromptOptions } from "../../prompts/index.js";
import { coreRegistry } from "../../registries/react/core.js";

export type { SystemPromptOptions };
export { buildUserPrompt };

export const formCatalog = defineCatalog(schema, {
  components: coreSchemas as Parameters<typeof defineCatalog>[1]["components"],
  actions: {},
});

export const formPreset = {
  catalog: formCatalog,
  registry: coreRegistry,

  getSystemPrompt(options?: SystemPromptOptions): string {
    return buildSystemPrompt(coreSchemas, {
      ...options,
      extraInstructions: [
        options?.extraInstructions ?? "",
        "Focus on form layout: group related fields with Card, use Stack for field spacing.",
        "Always wrap inputs in a Form component so Enter-key submission works.",
      ]
        .filter(Boolean)
        .join("\n"),
    });
  },
};
