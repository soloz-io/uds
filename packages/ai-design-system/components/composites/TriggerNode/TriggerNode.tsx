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
        "relative flex flex-col items-center justify-center bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 shadow-none transition-all duration-150 ease-out",
        selected && "border-primary border-2"
      )}
      data-testid={`trigger-node-${id}`}
      handles={{ target: false, source: true }}
      status={status}
    >
      <div className="flex h-full w-full items-center justify-center gap-1.5 px-3 py-2">
        <Play className="size-3 shrink-0 text-purple-600 dark:text-purple-400" strokeWidth={1.5} />
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

TriggerNode.displayName = "TriggerNode";
