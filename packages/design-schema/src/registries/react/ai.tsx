"use client";

import React from "react";
import { defineRegistry } from "@json-render/react";
import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";

import {
  UserMessage,
  SpecialistMessage,
  OrchestratorMessage,
  AgentIndicator,
  PromptInput,
  ToolCallDisplay,
} from "ai-design-system";

import { aiSchemas } from "../../schemas/ai/index.js";

/**
 * AI registry — wires AI conversation and interaction components from ai-design-system.
 */
const aiCatalog = defineCatalog(schema, {
  components: aiSchemas as Parameters<typeof defineCatalog>[1]["components"],
  actions: {},
});

export const { registry: aiRegistry } = defineRegistry(aiCatalog, {
  components: {
    UserMessage: ({ props }) => (
      <UserMessage
        message={{
          content: props.content,
          timestamp: props.timestamp ?? undefined,
        }}
      />
    ),

    SpecialistMessage: ({ props }) => (
      <SpecialistMessage
        message={{
          content: props.content,
          agentName: props.agentName ?? undefined,
          timestamp: props.timestamp ?? undefined,
          status: (props.status as SpecialistMessage["props"]["message"]["status"]) ?? "complete",
        }}
      />
    ),

    OrchestratorMessage: ({ props }) => (
      <OrchestratorMessage
        message={{
          content: props.content,
          timestamp: props.timestamp ?? undefined,
          subAgents: props.subAgents ?? undefined,
        }}
      />
    ),

    AgentIndicator: ({ props }) => (
      <AgentIndicator
        agent={{
          name: props.agentName,
          status: props.status,
          avatar: props.avatar ?? undefined,
        }}
      />
    ),

    PromptInput: ({ props, emit }) => (
      <PromptInput
        placeholder={props.placeholder ?? "Describe the UI you want..."}
        disabled={props.disabled ?? false}
        onSubmit={() => emit("submit")}
      />
    ),

    ToolCallDisplay: ({ props }) => (
      <ToolCallDisplay
        toolCall={{
          name: props.toolName,
          args: props.args ?? {},
          result: props.result ?? undefined,
          status: props.status,
        }}
      />
    ),

    AiCodeBlock: ({ props }) => (
      <pre
        className={`relative rounded-lg bg-muted p-4 overflow-auto text-sm font-mono ${props.filename ? "pt-8" : ""}`}
      >
        {props.filename ? (
          <span className="absolute top-2 left-4 text-xs text-muted-foreground">
            {props.filename}
          </span>
        ) : null}
        {props.copyable ? (
          <button
            className="absolute top-2 right-2 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => navigator.clipboard?.writeText(props.code)}
          >
            Copy
          </button>
        ) : null}
        <code className={props.language ? `language-${props.language}` : ""}>{props.code}</code>
      </pre>
    ),
  },
});

export { aiCatalog };
