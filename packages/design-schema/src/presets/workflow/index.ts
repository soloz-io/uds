"use client";

import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";

import { coreSchemas } from "../../schemas/core/index.js";
import { workflowSchemas } from "../../schemas/workflow/index.js";
import { aiSchemas } from "../../schemas/ai/index.js";
import { buildSystemPrompt, buildUserPrompt, type SystemPromptOptions } from "../../prompts/index.js";
import { coreRegistry } from "../../registries/react/core.js";
import { workflowRegistry } from "../../registries/react/workflow.js";
import { aiRegistry } from "../../registries/react/ai.js";

export type { SystemPromptOptions };
export { buildUserPrompt };

const allSchemas = { ...coreSchemas, ...workflowSchemas, ...aiSchemas };

export const workflowCatalog = defineCatalog(schema, {
  components: allSchemas as Parameters<typeof defineCatalog>[1]["components"],
  actions: {},
});

export const workflowPreset = {
  catalog: workflowCatalog,
  registry: { ...coreRegistry, ...workflowRegistry, ...aiRegistry },

  getSystemPrompt(options?: SystemPromptOptions): string {
    return buildSystemPrompt(allSchemas, {
      ...options,
      extraInstructions: [
        options?.extraInstructions ?? "",
        "Use StateNode for workflow steps, TransitionNode for directed edges between steps.",
        "WorkflowToolbar should appear at the top of the workflow canvas.",
        "Use ExecutionLog to display runtime output at the bottom of the screen.",
      ]
        .filter(Boolean)
        .join("\n"),
    });
  },
};
