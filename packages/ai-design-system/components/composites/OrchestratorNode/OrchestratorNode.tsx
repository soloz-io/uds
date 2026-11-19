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

const MAX_CAPABILITY_BADGES = 2;

function formatSkillName(skill: string): string {
  const trimmed = skill.replace(/\/+$/, "");
  const segments = trimmed.split("/").filter(Boolean);
  return segments[segments.length - 1] ?? skill;
}

export type OrchestratorFunctionToolBadge = {
  name: string;
  kind?: "cli" | "app-tool" | "mcp" | "designed";
  status?: "executable" | "designed";
  description?: string;
};

export type OrchestratorNodeData = {
  label: string;
  description?: string;
  type: "orchestrator";
  /** Explicit agent_type from definition.json (e.g. "router"). Never defaulted in UI. */
  agentType?: string;
  /** Optional presentation icon override from the DS icon registry (defaults to "brain") */
  icon?: string;
  /** Attached agent skills displayed verbatim from definition.json / inventory */
  skills?: string[];
  /**
   * Authoritative Function / MCP tools from PackInventory.
   * When present (even empty), the canvas card renders ONLY actual Function/MCP
   * tools with overflow badges instead of harness built-ins.
   */
  functionTools?: Array<OrchestratorFunctionToolBadge | string>;
  /** Legacy/fallback tool list when `functionTools` is not supplied */
  tools?: string[];
  /** Tools requiring HITL approval from definition.json */
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
  const agentType = data.agentType;
  const skills = data.skills ?? [];
  const displayTools: OrchestratorFunctionToolBadge[] =
    data.functionTools !== undefined
      ? data.functionTools.map((t) => (typeof t === "string" ? { name: t } : t))
      : (data.tools ?? []).map((name) => ({ name }));
  const hasCapabilities = skills.length > 0 || displayTools.length > 0;

  return (
    <Node
      className={cn(
        "relative flex flex-col items-stretch justify-center overflow-hidden bg-card border border-purple-300/80 dark:border-purple-700/80 shadow-none transition-all duration-150 ease-out",
        selected && "border-primary border-2"
      )}
      data-testid={`orchestrator-node-${id}`}
      data-agent-type={agentType}
      handles={{ target: true, source: true }}
      status={status}
    >
      <div className="flex items-center justify-between gap-2 border-b border-purple-200/70 bg-purple-500/10 px-3 py-2 dark:border-purple-800/70">
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <Icon
            name={iconName}
            size="xs"
            className={cn(
              "shrink-0",
              getHighlightIconColor(status, data.highlightStatus, "text-purple-600 dark:text-purple-400")
            )}
            strokeWidth={1.75}
          />
          <NodeTitle className="truncate text-left text-xs font-medium leading-tight" title={displayTitle}>
            {displayTitle}
          </NodeTitle>
        </div>
        {agentType && (
          <Badge
            variant="outline"
            className="shrink-0 border-purple-300/80 bg-background/80 px-1.5 py-0 font-mono text-[9px] font-medium text-purple-700 dark:border-purple-700 dark:text-purple-300"
          >
            {agentType}
          </Badge>
        )}
      </div>

      {displayDescription && (
        <div className="px-3 py-2">
          <NodeDescription className="line-clamp-2 text-left text-[10px] leading-snug" title={displayDescription}>
            {displayDescription}
          </NodeDescription>
        </div>
      )}

      {hasCapabilities && (
        <div className="flex flex-col gap-1.5 border-t border-border/60 px-3 py-2">
          {skills.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Icon name="book" size="xs" className="shrink-0 text-muted-foreground" strokeWidth={1.5} />
              <div className="flex min-w-0 flex-1 flex-wrap gap-1">
                {skills.slice(0, MAX_CAPABILITY_BADGES).map((skill) => (
                  <Badge key={skill} variant="secondary" title={skill} className="max-w-full truncate px-1.5 py-0 font-mono text-[10px]">
                    {formatSkillName(skill)}
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
          {displayTools.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Icon name="wrench" size="xs" className="shrink-0 text-muted-foreground" strokeWidth={1.5} />
              <div className="flex min-w-0 flex-1 flex-wrap gap-1">
                {displayTools.slice(0, MAX_CAPABILITY_BADGES).map((tool) => {
                  const requiresApproval = Boolean(data.interruptOn && tool.name in data.interruptOn);
                  const isDesigned = tool.status === "designed";
                  return (
                    <Badge
                      key={tool.name}
                      variant="outline"
                      title={tool.description || tool.name}
                      className={cn(
                        "max-w-full gap-1 truncate px-1.5 py-0 font-mono text-[10px]",
                        isDesigned && "border-dashed text-muted-foreground"
                      )}
                    >
                      <span className="truncate">{tool.name}</span>
                      {requiresApproval && (
                        <Icon name="shield-check" size="xs" className="shrink-0 text-amber-500" strokeWidth={1.5} />
                      )}
                    </Badge>
                  );
                })}
                {displayTools.length > MAX_CAPABILITY_BADGES && (
                  <Badge variant="outline" className="px-1.5 py-0 font-mono text-[10px]">
                    +{displayTools.length - MAX_CAPABILITY_BADGES}
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
