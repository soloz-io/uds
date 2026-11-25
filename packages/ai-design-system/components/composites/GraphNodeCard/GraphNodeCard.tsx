"use client";

import type { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { Node, NodeDescription, NodeTitle } from "@/components/ai-elements/node";
import { Icon } from "@/components/primitives/Icon";
import { cn } from "@/lib/utils";

export type GraphNodeTone = "chart-1" | "chart-2" | "chart-3" | "chart-4" | "chart-5" | "primary" | "muted";

export type GraphNodeCardData = {
  label: string;
  /** Secondary line, e.g. the node's kind */
  caption?: string;
  /** Design-token hue of the node's group */
  tone?: GraphNodeTone;
  /** Marks a node that opens another view */
  openable?: boolean;
};

const TONE: Record<GraphNodeTone, string> = {
  "chart-1": "border-l-[color:var(--chart-1)]",
  "chart-2": "border-l-[color:var(--chart-2)]",
  "chart-3": "border-l-[color:var(--chart-3)]",
  "chart-4": "border-l-[color:var(--chart-4)]",
  "chart-5": "border-l-[color:var(--chart-5)]",
  primary: "border-l-primary",
  muted: "border-l-muted-foreground",
};

type GraphNodeCardProps = NodeProps & {
  data?: GraphNodeCardData;
  id: string;
};

/** A generic graph node: a title, an optional caption, and its group's hue. */
export const GraphNodeCard = memo(({ data, selected, id }: GraphNodeCardProps) => {
  if (!data) return null;
  return (
    <Node
      className={cn(
        "min-h-0 border-l-4 shadow-none",
        TONE[data.tone ?? "muted"],
        selected && "ring-2 ring-primary"
      )}
      data-testid={`graph-node-${id}`}
      handles={{ target: true, source: true }}
    >
      <div className="flex items-center gap-2 px-3 py-2">
        <div className="min-w-0 flex-1">
        <NodeTitle className="line-clamp-1 text-xs font-medium leading-tight" title={data.label}>
          {data.label}
        </NodeTitle>
        {data.caption && (
          <NodeDescription className="mt-0.5 line-clamp-1 text-[10px] leading-tight">{data.caption}</NodeDescription>
        )}
        </div>
        {data.openable && <Icon name="chevron-right" size="xs" className="shrink-0 text-muted-foreground" aria-label="Opens" />}
      </div>
    </Node>
  );
});

GraphNodeCard.displayName = "GraphNodeCard";
