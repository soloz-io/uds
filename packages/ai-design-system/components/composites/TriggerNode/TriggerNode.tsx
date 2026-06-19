"use client";

import type { NodeProps } from "@xyflow/react";
import { Play } from "lucide-react";
import { memo } from "react";
import {
  Node,
  NodeDescription,
  NodeTitle,
} from "@/components/ai-elements/node";
import { cn } from "@/lib/utils";

export type TriggerNodeData = {
  label: string;
  description?: string;
  type: "trigger";
  status?: "idle" | "running" | "success" | "error";
  enabled?: boolean;
};

type TriggerNodeProps = NodeProps & {
  data?: TriggerNodeData;
  id: string;
};

export const TriggerNode = memo(({ data, selected, id }: TriggerNodeProps) => {
  if (!data) {
    return null;
  }

  const displayTitle = data.label || "Trigger";
  const displayDescription = data.description;
  const status = data.status;

  return (
    <Node
      className={cn(
        "relative flex h-auto w-auto min-w-[120px] max-w-[180px] flex-col items-center justify-center bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 shadow-none transition-all duration-150 ease-out",
        selected && "border-primary border-2"
      )}
      data-testid={`trigger-node-${id}`}
      handles={{ target: false, source: true }}
      status={status}
    >
      <div className="flex items-center gap-1.5 px-3 py-2">
        <Play className="size-3 shrink-0 text-purple-600 dark:text-purple-400" strokeWidth={1.5} />
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
});

TriggerNode.displayName = "TriggerNode";
