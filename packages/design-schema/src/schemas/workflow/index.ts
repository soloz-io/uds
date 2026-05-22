import { z } from "zod";

/**
 * Workflow builder component schemas.
 * Covers StateNode, TransitionNode, WorkflowToolbar from ai-design-system.
 *
 * Backend-safe: no React imports.
 */

export const workflowSchemas = {
  StateNode: {
    props: z.object({
      id: z.string().describe("Unique node identifier"),
      label: z.string().describe("Node display name"),
      type: z
        .enum(["start", "end", "action", "condition", "wait"])
        .nullable()
        .describe("Node type determines styling and behaviour"),
      description: z.string().nullable(),
      status: z
        .enum(["idle", "running", "success", "error", "skipped"])
        .nullable()
        .describe("Runtime execution status"),
      className: z.string().nullable(),
    }),
    description:
      "Workflow state/step node for React Flow canvas. Place at a position in the workflow. type='start' for entry points, 'end' for terminal nodes.",
    example: {
      id: "step-1",
      label: "Validate Input",
      type: "action",
      description: "Check required fields",
    },
  },

  TransitionNode: {
    props: z.object({
      id: z.string().describe("Unique edge/transition identifier"),
      label: z.string().nullable().describe("Condition or trigger label"),
      from: z.string().describe("Source StateNode id"),
      to: z.string().describe("Target StateNode id"),
      condition: z.string().nullable().describe("Boolean condition expression"),
    }),
    description:
      "Directed edge connecting two StateNodes. Represents a workflow transition.",
    example: { id: "t-1", from: "step-1", to: "step-2", label: "on success" },
  },

  WorkflowToolbar: {
    props: z.object({
      title: z.string().nullable().describe("Workflow name shown in toolbar"),
      saveAction: z.string().nullable(),
      runAction: z.string().nullable(),
      readonly: z.boolean().nullable(),
    }),
    description:
      "Top toolbar for the workflow builder canvas. Provides save, run, and undo/redo controls.",
    example: { title: "My Workflow", saveAction: "saveWorkflow", runAction: "runWorkflow" },
  },

  WorkflowStatusBadge: {
    props: z.object({
      status: z.enum(["idle", "running", "success", "error", "paused"]),
      label: z.string().nullable(),
    }),
    description: "Compact execution status badge for a workflow or step.",
    example: { status: "running", label: "Processing" },
  },

  WorkflowStepConfig: {
    props: z.object({
      nodeId: z.string().describe("ID of the StateNode being configured"),
      fields: z.array(
        z.object({
          key: z.string(),
          label: z.string(),
          type: z.enum(["text", "select", "number", "boolean"]),
          options: z
            .array(z.object({ value: z.string(), label: z.string() }))
            .nullable(),
          required: z.boolean().nullable(),
        })
      ),
    }),
    description:
      "Configuration panel for a workflow step. Renders form fields for the selected node's properties.",
    example: {
      nodeId: "step-1",
      fields: [
        { key: "timeout", label: "Timeout (s)", type: "number" },
        { key: "retries", label: "Retries", type: "number" },
      ],
    },
  },

  ExecutionLog: {
    props: z.object({
      entries: z
        .array(
          z.object({
            timestamp: z.string(),
            level: z.enum(["info", "warn", "error"]),
            message: z.string(),
            nodeId: z.string().nullable(),
          })
        )
        .describe("Use { $state: '/execution/log' } to bind to live log"),
      maxRows: z.number().nullable(),
    }),
    description:
      "Scrollable execution log panel. Bind entries to live execution state with $state.",
    example: {
      entries: { $state: "/execution/log" },
      maxRows: 50,
    },
  },
} as const;

export type WorkflowComponentName = keyof typeof workflowSchemas;
