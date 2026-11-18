"use client";

import type { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { Badge } from "@/components/primitives/Badge";
import { Icon } from "@/components/primitives/Icon";
import {
  Node,
  NodeDescription,
  NodeTitle,
  getHighlightIconColor,
} from "@/components/ai-elements/node";
import { cn } from "@/lib/utils";

const MAX_CAPABILITY_BADGES = 3;

export type OrchestratorNodeData = {
  label: string;
  description?: string;
  type: "orchestrator";
  /** Optional presentation icon override from the DS icon registry (defaults to "brain") */
  icon?: string;
  /** Attached agent skills displayed as compact capability badges */
  skills?: string[];
  /** Attached agent tools displayed as compact capability badges */
  tools?: string[];
  /** Tools requiring HITL approval */
  interruptOn?: Record<string, unknown>;
  status?: "idle" | "running" | "success" | "error";
  highlightStatus?: "active" | "pending" | "done" | "error";
  enabled?: boolean;
};

type OrchestratorNodeProps = NodeProps & {
  data?: OrchestratorNodeData;
  id: string;
};

export const OrchestratorNode = memo(({ data, selected, id }: OrchestratorNodeProps) => {
  if (!data) {
    return null;
  }

  const displayTitle = data.label || "Orchestrator";
  const displayDescription = data.description;
  const status = data.status;
  const iconName = data.icon ?? "brain";
  const skills = data.skills ?? [];
  const tools = data.tools ?? [];
  const hasCapabilities = skills.length > 0 || tools.length > 0;

  return (
    <Node
      className={cn(
        "relative flex flex-col items-stretch justify-center bg-card border border-purple-200 dark:border-purple-800 shadow-none transition-all duration-150 ease-out",
        selected && "border-primary border-2"
      )}
      data-testid={`orchestrator-node-${id}`}
      handles={{ target: true, source: true }}
      status={status}
    >
      <div className="flex w-full items-center justify-center gap-2 px-4 py-3">
        <Icon
          name={iconName}
          size="xs"
          className={cn(
            "shrink-0",
            getHighlightIconColor(status, data.highlightStatus, "text-purple-600 dark:text-purple-400")
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

      {hasCapabilities && (
        <div className="flex flex-col gap-1.5 border-t border-border/60 px-3 py-2">
          {skills.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Icon name="book" size="xs" className="shrink-0 text-muted-foreground" strokeWidth={1.5} />
              <div className="flex min-w-0 flex-1 flex-wrap gap-1">
                {skills.slice(0, MAX_CAPABILITY_BADGES).map((skill) => (
                  <Badge key={skill} variant="secondary" className="max-w-full truncate px-1.5 py-0 font-mono text-[10px]">
                    {skill}
                  </Badge>
                ))}
                {skills.length > MAX_CAPABILITY_BADGES && (
                  <Badge variant="outline" className="px-1.5 py-0 font-mono text-[10px]">
                    +{skills.length - MAX_CAPABILITY_BADGES}
                  </Badge>
                )}
              </div>
            </div>
          )}
          {tools.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Icon name="wrench" size="xs" className="shrink-0 text-muted-foreground" strokeWidth={1.5} />
              <div className="flex min-w-0 flex-1 flex-wrap gap-1">
                {tools.slice(0, MAX_CAPABILITY_BADGES).map((tool) => {
                  const requiresApproval = Boolean(data.interruptOn && tool in data.interruptOn);
                  return (
                    <Badge key={tool} variant="outline" className="max-w-full gap-1 truncate px-1.5 py-0 font-mono text-[10px]">
                      <span className="truncate">{tool}</span>
                      {requiresApproval && (
                        <Icon name="shield-check" size="xs" className="shrink-0 text-amber-500" strokeWidth={1.5} />
                      )}
                    </Badge>
                  );
                })}
                {tools.length > MAX_CAPABILITY_BADGES && (
                  <Badge variant="outline" className="px-1.5 py-0 font-mono text-[10px]">
                    +{tools.length - MAX_CAPABILITY_BADGES}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Node>
  );
});

OrchestratorNode.displayName = "OrchestratorNode";
