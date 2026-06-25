"use client";

import type { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { Icon } from "@/components/primitives/Icon";
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
          "flex flex-col items-center justify-center border border-border bg-secondary text-secondary-foreground shadow-none transition-all duration-150 ease-out",
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
              <Icon name="check" size="xs" className="text-white" strokeWidth={2.5} />
            )}
            {status === "error" && (
              <Icon name="circle-x" size="xs" className="text-white" strokeWidth={2.5} />
            )}
          </div>
        )}

        <div className="flex h-full w-full items-center justify-center gap-1.5 px-3 py-2">
          <Icon name="git-branch" size="xs" className="shrink-0 text-muted-foreground" strokeWidth={1.5} />
          <div className="min-w-0 flex-1 text-center">
            <NodeTitle className="line-clamp-2 text-center text-xs font-medium leading-tight" title={displayTitle}>
              {displayTitle}
            </NodeTitle>
            {displayDescription && (
              <NodeDescription className="mt-0.5 line-clamp-2 text-center text-[10px] leading-tight" title={displayDescription}>
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
