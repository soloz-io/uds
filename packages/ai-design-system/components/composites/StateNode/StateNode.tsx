"use client";

import type { NodeProps } from "@xyflow/react";
import { Check, EyeOff, XCircle, Zap } from "lucide-react";
import { memo } from "react";
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
        <Check className="size-3.5 text-white" strokeWidth={2.5} />
      )}
      {status === "error" && (
        <XCircle className="size-3.5 text-white" strokeWidth={2.5} />
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
        "relative flex h-auto w-auto min-w-[120px] max-w-[180px] flex-col items-center justify-center border border-border bg-card shadow-none transition-all duration-150 ease-out",
        selected && "border-primary border-2",
        isTerminal && "border-2 border-primary",
        isDisabled && "opacity-50"
      )}
      data-testid={`state-node-${id}`}
      handles={{ target: true, source: true }}
      status={status}
    >
      {/* Disabled badge in top left */}
      {isDisabled && (
        <div className="absolute top-1 left-1 rounded-full bg-gray-500/50 p-0.5">
          <EyeOff className="size-3 text-white" />
        </div>
      )}

      {/* Status indicator badge in top right */}
      <StatusBadge status={status} />

      <div className="flex items-center gap-1.5 px-3 py-2">
        <Zap className="size-3 shrink-0 text-primary" strokeWidth={1.5} />        <div className="flex flex-col">
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
});

StateNode.displayName = "StateNode";
