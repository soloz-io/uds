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

export type StateNodeData = {
  label: string;
  description?: string;
  type: "state";
  /** True for terminal states — marks workflow completion, no outgoing transitions */
  isTerminal?: boolean;
  status?: "idle" | "running" | "success" | "error";
  enabled?: boolean;
};

type StateNodeProps = NodeProps & {
  data?: StateNodeData;
  id: string;
};

// Status badge component
const StatusBadge = ({
  status,
}: {
  status?: "idle" | "running" | "success" | "error";
}) => {
  // Don't show badge for idle or running (running has AnimatedBorder animation)
  if (!status || status === "idle" || status === "running") {
    return null;
  }

  return (
    <div
      className={cn(
        "absolute top-2 right-2 rounded-full p-1",
        status === "success" && "bg-green-500/50",
        status === "error" && "bg-red-500/50"
      )}
    >
      {status === "success" && (
        <Icon name="check" className="size-3.5 text-white" strokeWidth={2.5} />
      )}
      {status === "error" && (
        <Icon name="circle-x" className="size-3.5 text-white" strokeWidth={2.5} />
      )}
    </div>
  );
};

export const StateNode = memo(({ data, selected, id }: StateNodeProps) => {
  if (!data) {
    return null;
  }

  const displayTitle = data.label || "State";
  const displayDescription = data.description;
  const status = data.status;
  const isDisabled = data.enabled === false;
  const isTerminal = data.isTerminal === true;

  return (
      <Node
        className={cn(
          "relative flex flex-col items-center justify-center border border-border bg-card shadow-none transition-all duration-150 ease-out",
          selected ? "border-primary border-2" : "border border-border",
          isDisabled && "opacity-50"
        )}
      data-testid={`state-node-${id}`}
      handles={{ target: true, source: true }}
      status={status}
    >
      {/* Disabled badge in top left */}
      {isDisabled && (
        <div className="absolute top-1 left-1 rounded-full bg-gray-500/50 p-0.5">
          <Icon name="eye-off" size="xs" className="text-white" />
        </div>
      )}

      {/* Status indicator badge in top right */}
      <StatusBadge status={status} />

      <div className="flex h-full w-full items-center justify-center gap-1.5 px-3 py-2">
        <Icon name="zap" size="xs" className="shrink-0 text-primary" strokeWidth={1.5} />
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
});

StateNode.displayName = "StateNode";
