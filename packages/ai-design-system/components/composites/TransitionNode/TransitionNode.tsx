"use client";

import type { NodeProps } from "@xyflow/react";
import { Check, GitBranch, XCircle } from "lucide-react";
import { memo } from "react";
import {
  Node,
  NodeDescription,
  NodeTitle,
} from "@/components/ai-elements/node";
import { cn } from "@/lib/utils";

export type TransitionNodeConfig = {
  /** For conditional transitions: form field comparison e.g. "{{record.orderValue}} > {{record.acceptedRange}}" */
  condition?: string;
  /** For human transitions: roles allowed to approve */
  allowed_roles?: string[];
  /** For scheduled transitions: delay in seconds */
  delay_seconds?: number;
  /** For plugin transitions: plugin identifier */
  plugin_id?: string;
  /** For plugin transitions: plugin input values */
  plugin_inputs?: Record<string, unknown>;
};

export type TransitionNodeData = {
  label: string;
  description?: string;
  type: "transition";
  /** Transition execution type */
  transitionType?: "human" | "conditional" | "scheduled" | "plugin";
  /** Transition-type-specific configuration */
  config?: TransitionNodeConfig;
  status?: "idle" | "running" | "success" | "error";
  enabled?: boolean;
};

type TransitionNodeProps = NodeProps & {
  data?: TransitionNodeData;
  id: string;
};

export const TransitionNode = memo(
  ({ data, selected, id }: TransitionNodeProps) => {
    if (!data) {
      return null;
    }

    const displayTitle = data.label || "Transition";
    const displayDescription = data.description;
    const status = data.status;

    return (
      <Node
        className={cn(
          "flex h-auto w-auto min-w-[120px] max-w-[180px] flex-col items-center justify-center border border-border bg-muted/40 shadow-none transition-all duration-150 ease-out",
          selected && "border-primary border-2"
        )}
        data-testid={`transition-node-${id}`}
        handles={{ target: true, source: true }}
        status={status}
      >
        {/* Status indicator badge in top right */}
        {status && status !== "idle" && status !== "running" && (
          <div
            className={cn(
              "absolute top-1 right-1 rounded-full p-0.5",
              status === "success" && "bg-green-500/50",
              status === "error" && "bg-red-500/50"
            )}
          >
            {status === "success" && (
              <Check className="size-3 text-white" strokeWidth={2.5} />
            )}
            {status === "error" && (
              <XCircle className="size-3 text-white" strokeWidth={2.5} />
            )}
          </div>
        )}

        <div className="flex items-center gap-1.5 px-3 py-2">
          <GitBranch className="size-3 shrink-0 text-muted-foreground" strokeWidth={1.5} />
          <div className="flex flex-col">
            <NodeTitle className="text-xs font-medium leading-tight">{displayTitle}</NodeTitle>
            {displayDescription && (
              <NodeDescription className="text-[10px] leading-tight mt-0.5">
                {displayDescription}
              </NodeDescription>
            )}
          </div>
        </div>
      </Node>
    );
  }
);

TransitionNode.displayName = "TransitionNode";
