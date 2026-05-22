"use client";

import React from "react";
import { defineRegistry } from "@json-render/react";
import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";

import {
  StateNode,
  TransitionNode,
  WorkflowToolbar,
} from "ai-design-system";

import { workflowSchemas } from "../../schemas/workflow/index.js";

/**
 * Workflow registry — wires StateNode, TransitionNode, WorkflowToolbar
 * and supporting components from ai-design-system.
 */
const workflowCatalog = defineCatalog(schema, {
  components: workflowSchemas as Parameters<typeof defineCatalog>[1]["components"],
  actions: {},
});

export const { registry: workflowRegistry } = defineRegistry(workflowCatalog, {
  components: {
    StateNode: ({ props }) => (
      <StateNode
        id={props.id}
        data={{
          label: props.label,
          type: (props.type as StateNode["props"]["data"]["type"]) ?? "action",
          description: props.description ?? undefined,
          status: (props.status as StateNode["props"]["data"]["status"]) ?? "idle",
        }}
        type="stateNode"
        selected={false}
        zIndex={0}
        isConnectable={true}
        dragging={false}
        positionAbsoluteX={0}
        positionAbsoluteY={0}
      />
    ),

    TransitionNode: ({ props }) => (
      <TransitionNode
        id={props.id}
        data={{
          label: props.label ?? "",
          condition: props.condition ?? undefined,
          from: props.from,
          to: props.to,
        }}
        type="transitionNode"
        selected={false}
        zIndex={0}
        isConnectable={true}
        dragging={false}
        positionAbsoluteX={0}
        positionAbsoluteY={0}
      />
    ),

    WorkflowToolbar: ({ props, emit }) => (
      <WorkflowToolbar
        title={props.title ?? undefined}
        onSave={props.saveAction ? () => emit("save") : undefined}
        onRun={props.runAction ? () => emit("run") : undefined}
        readonly={props.readonly ?? false}
      />
    ),

    WorkflowStatusBadge: ({ props }) => {
      return (
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border`}>
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              props.status === "running" ? "bg-green-500 animate-pulse" :
              props.status === "error" ? "bg-red-500" :
              props.status === "success" ? "bg-green-500" :
              "bg-muted-foreground"
            }`}
          />
          {props.label ?? props.status}
        </span>
      );
    },

    WorkflowStepConfig: ({ props }) => (
      <div className="flex flex-col gap-3 p-4 border rounded-lg">
        <span className="text-sm font-medium text-muted-foreground">Node: {props.nodeId}</span>
        {props.fields.map((field) => (
          <div key={field.key} className="flex flex-col gap-1">
            <label className="text-xs font-medium">{field.label}</label>
            <input
              type={field.type === "number" ? "number" : "text"}
              className="border rounded px-2 py-1 text-sm bg-background"
              placeholder={field.label}
            />
          </div>
        ))}
      </div>
    ),

    ExecutionLog: ({ props }) => {
      const entries = Array.isArray(props.entries) ? props.entries : [];
      return (
        <div className="flex flex-col gap-1 font-mono text-xs p-3 bg-muted rounded-lg overflow-auto max-h-64">
          {entries.slice(-(props.maxRows ?? 50)).map((entry, i) => (
            <div key={i} className={`flex gap-2 ${entry.level === "error" ? "text-red-500" : entry.level === "warn" ? "text-yellow-600" : "text-foreground"}`}>
              <span className="text-muted-foreground shrink-0">{entry.timestamp}</span>
              {entry.nodeId ? <span className="text-blue-500 shrink-0">[{entry.nodeId}]</span> : null}
              <span>{entry.message}</span>
            </div>
          ))}
        </div>
      );
    },
  },
});

export { workflowCatalog };
