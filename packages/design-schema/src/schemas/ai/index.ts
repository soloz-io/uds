import { z } from "zod";

/**
 * AI conversation component schemas.
 * Covers message threads, prompt input, code blocks, and tool calls from ai-design-system.
 *
 * Backend-safe: no React imports.
 */

export const aiSchemas = {
  UserMessage: {
    props: z.object({
      content: z.string().describe("Message text content"),
      timestamp: z.string().nullable().describe("ISO-8601 datetime string"),
      avatarFallback: z.string().nullable(),
    }),
    description: "Chat bubble for a user message in an AI conversation thread.",
    example: { content: "Generate a dashboard for sales data", timestamp: "2024-01-01T10:00:00Z" },
  },

  SpecialistMessage: {
    props: z.object({
      content: z.string(),
      agentName: z.string().nullable().describe("Specialist agent display name"),
      timestamp: z.string().nullable(),
      status: z.enum(["streaming", "complete", "error"]).nullable(),
    }),
    description: "Chat bubble for a specialist AI agent response.",
    example: { content: "Here is your dashboard spec...", agentName: "Dashboard Agent", status: "complete" },
  },

  OrchestratorMessage: {
    props: z.object({
      content: z.string(),
      timestamp: z.string().nullable(),
      subAgents: z
        .array(z.object({ name: z.string(), status: z.enum(["running", "done", "error"]) }))
        .nullable(),
    }),
    description: "Message from the orchestrator AI showing sub-agent delegation.",
    example: { content: "Routing to specialist...", subAgents: [{ name: "DataAgent", status: "running" }] },
  },

  AgentIndicator: {
    props: z.object({
      agentName: z.string(),
      status: z.enum(["idle", "thinking", "responding", "done"]),
      avatar: z.string().nullable(),
    }),
    description: "Compact agent status indicator shown while AI is processing.",
    example: { agentName: "Analyst", status: "thinking" },
  },

  PromptInput: {
    props: z.object({
      placeholder: z.string().nullable(),
      submitAction: z.string().describe("Action name triggered on submit"),
      disabled: z.boolean().nullable(),
      value: z
        .string()
        .nullable()
        .describe("Use { $bindState: '/prompt/text' } for two-way binding"),
    }),
    description:
      "Multi-line prompt input with send button. Use submitAction to trigger an AI call action.",
    example: {
      placeholder: "Describe the UI you want...",
      submitAction: "generateSpec",
      value: { $bindState: "/prompt/text" },
    },
  },

  ToolCallDisplay: {
    props: z.object({
      toolName: z.string().describe("Name of the tool being called"),
      args: z.record(z.string(), z.unknown()).nullable(),
      result: z.unknown().nullable(),
      status: z.enum(["pending", "running", "success", "error"]),
    }),
    description:
      "Displays an AI tool call with its arguments and result. Used in reasoning/chain-of-thought views.",
    example: { toolName: "searchDatabase", args: { query: "recent orders" }, status: "success" },
  },

  AiCodeBlock: {
    props: z.object({
      code: z.string(),
      language: z.string().nullable().describe("Syntax highlight language, e.g. 'typescript'"),
      filename: z.string().nullable(),
      copyable: z.boolean().nullable(),
    }),
    description: "Syntax-highlighted code block with optional copy button.",
    example: { code: "const x = 1;", language: "typescript", copyable: true },
  },
} as const;

export type AiComponentName = keyof typeof aiSchemas;
