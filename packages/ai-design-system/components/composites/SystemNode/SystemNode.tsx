"use client";

import type { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { Icon } from "@/components/primitives/Icon";
import {
  Node,
  NodeDescription,
  NodeTitle,
  getHighlightIconColor,
} from "@/components/ai-elements/node";
import { cn } from "@/lib/utils";

export type SystemNodeData = {
  label: string;
  description?: string;
  type: "system";
  /** Optional presentation icon override from the DS icon registry (defaults to "layers") */
  icon?: string;
  status?: "idle" | "running" | "success" | "error";
  highlightStatus?: "active" | "pending" | "done" | "error";
  enabled?: boolean;
};

type SystemNodeProps = NodeProps & {
  data?: SystemNodeData;
  id: string;
};

export const SystemNode = memo(({ data, selected, id }: SystemNodeProps) => {
  if (!data) {
    return null;
  }

  const displayTitle = data.label || "System";
  const displayDescription = data.description;
  const status = data.status;
  const iconName = data.icon ?? "layers";

  return (
    <Node
      className={cn(
        "relative flex flex-col items-center justify-center bg-card border border-blue-200 dark:border-blue-800 shadow-none transition-all duration-150 ease-out",
        selected && "border-primary border-2"
      )}
      data-testid={`system-node-${id}`}
      handles={{ target: true, source: true }}
      status={status}
    >
      <div className="flex h-full w-full items-center justify-center gap-2 px-4 py-3">
        <Icon
          name={iconName}
          size="xs"
          className={cn(
            "shrink-0",
            getHighlightIconColor(status, data.highlightStatus, "text-blue-600 dark:text-blue-400")
          )}
          strokeWidth={1.5}
        />
        <div className="min-w-0 flex-1 text-center">
          <NodeTitle className="line-clamp-2 text-center text-xs font-medium leading-tight" title={displayTitle}>
            {displayTitle}
          </NodeTitle>
          {displayDescription && (
            <NodeDescription className="mt-1 line-clamp-2 text-center text-[10px] leading-tight" title={displayDescription}>
              {displayDescription}
            </NodeDescription>
          )}
        </div>
      </div>
    </Node>
  );
});

SystemNode.displayName = "SystemNode";
