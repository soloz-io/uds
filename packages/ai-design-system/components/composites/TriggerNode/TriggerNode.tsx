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

export type TriggerSubtype = "webhook" | "schedule" | "manual";

export type TriggerNodeData = {
  label: string;
  description?: string;
  type: "trigger";
  /** Semantic trigger subtype used to derive the default icon */
  triggerType?: TriggerSubtype;
  /** Optional presentation icon override from the DS icon registry */
  icon?: string;
  status?: "idle" | "running" | "success" | "error";
  highlightStatus?: "active" | "pending" | "done" | "error";
  enabled?: boolean;
};

type TriggerNodeProps = NodeProps & {
  data?: TriggerNodeData;
  id: string;
};

function resolveTriggerIcon(data: TriggerNodeData): string {
  if (data.icon) return data.icon;
  switch (data.triggerType) {
    case "webhook":
      return "globe";
    case "schedule":
      return "clock";
    case "manual":
      return "play";
    default:
      return "play";
  }
}

export const TriggerNode = memo(({ data, selected, id }: TriggerNodeProps) => {
  if (!data) {
    return null;
  }

  const displayTitle = data.label || "Trigger";
  const displayDescription = data.description;
  const status = data.status;
  const iconName = resolveTriggerIcon(data);

  return (
    <Node
      className={cn(
        "relative flex flex-col items-center justify-center bg-card border border-purple-200 dark:border-purple-800 shadow-none transition-all duration-150 ease-out",
        selected && "border-primary border-2"
      )}
      data-testid={`trigger-node-${id}`}
      handles={{ target: false, source: true }}
      status={status}
    >
      <div className="flex h-full w-full items-center justify-center gap-2 px-4 py-3">
        <Icon name={iconName} size="xs" className={cn("shrink-0", getHighlightIconColor(status, data.highlightStatus, "text-purple-600 dark:text-purple-400"))} strokeWidth={1.5} />
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

TriggerNode.displayName = "TriggerNode";
