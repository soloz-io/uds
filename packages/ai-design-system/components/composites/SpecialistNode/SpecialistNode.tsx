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

export type SpecialistAgentType = "router" | "agent" | "subagent" | "subgraph";

export type NodeFunctionToolBadge = {
  name: string;
  kind?: "cli" | "app-tool" | "mcp" | "designed";
  status?: "executable" | "designed";
  description?: string;
};

export type SpecialistNodeData = {
  label: string;
  description?: string;
  type: "specialist";
  /** Explicit agent_type from definition.json ("router" | "agent" | "subagent" | "subgraph"). Never defaulted in UI. */
  agentType?: SpecialistAgentType;
  /** Optional presentation icon override from the DS icon registry */
  icon?: string;
  /** Attached agent skills displayed verbatim from definition.json / inventory */
  skills?: string[];
  /**
   * Authoritative Function / MCP tools from PackInventory.
   * When present (even empty), the canvas card renders ONLY actual Function/MCP
   * tools with overflow badges instead of harness built-ins.
   */
  functionTools?: Array<NodeFunctionToolBadge | string>;
  /** Legacy/fallback tool list when `functionTools` is not supplied */
  tools?: string[];
  /** Tools requiring HITL approval from definition.json */
  interruptOn?: Record<string, unknown>;
  status?: "idle" | "running" | "success" | "error";
  highlightStatus?: "active" | "pending" | "done" | "error";
  enabled?: boolean;
};

type SpecialistNodeProps = NodeProps & {
  data?: SpecialistNodeData;
  id: string;
};

const AGENT_TYPE_VISUALS: Record<
  SpecialistAgentType,
  {
    defaultIcon: string;
    cardBorder: string;
    headerStrip: string;
    iconColor: string;
    chipClass: string;
  }
> = {
  router: {
    defaultIcon: "brain",
    cardBorder: "border-purple-300/80 dark:border-purple-700/80",
    headerStrip: "border-purple-200/70 bg-purple-500/10 dark:border-purple-800/70",
    iconColor: "text-purple-600 dark:text-purple-400",
    chipClass: "border-purple-300/80 bg-background/80 text-purple-700 dark:border-purple-700 dark:text-purple-300",
  },
  agent: {
    defaultIcon: "layers",
    cardBorder: "border-indigo-300/90 dark:border-indigo-700/80",
    headerStrip: "border-indigo-200/70 bg-indigo-500/10 dark:border-indigo-800/70",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    chipClass: "border-indigo-300/80 bg-background/80 text-indigo-700 dark:border-indigo-700 dark:text-indigo-300",
  },
  subagent: {
    defaultIcon: "git-branch",
    cardBorder: "border-dashed border-teal-400/80 dark:border-teal-600/80",
    headerStrip: "border-teal-200/70 bg-teal-500/10 dark:border-teal-800/70",
    iconColor: "text-teal-600 dark:text-teal-400",
    chipClass: "border-teal-300/80 bg-background/80 text-teal-700 dark:border-teal-700 dark:text-teal-300",
  },
  subgraph: {
    defaultIcon: "sparkles",
    cardBorder: "border-amber-300/90 dark:border-amber-700/80",
    headerStrip: "border-amber-200/70 bg-amber-500/10 dark:border-amber-800/70",
    iconColor: "text-amber-600 dark:text-amber-400",
    chipClass: "border-amber-300/80 bg-background/80 text-amber-700 dark:border-amber-700 dark:text-amber-300",
  },
};

export const SpecialistNode = memo(({ data, selected, id }: SpecialistNodeProps) => {
  if (!data) {
    return null;
  }

  const displayTitle = data.label || "Specialist";
  const displayDescription = data.description;
  const status = data.status;
  const isDisabled = data.enabled === false;
  const agentType = data.agentType;
  const visual = agentType ? AGENT_TYPE_VISUALS[agentType] : undefined;
  const iconName = data.icon ?? visual?.defaultIcon ?? "bot";
  const skills = data.skills ?? [];
  const displayTools: NodeFunctionToolBadge[] =
    data.functionTools !== undefined
      ? data.functionTools.map((t) => (typeof t === "string" ? { name: t } : t))
      : (data.tools ?? []).map((name) => ({ name }));
  const hasCapabilities = skills.length > 0 || displayTools.length > 0;

  return (
    <Node
      className={cn(
        "relative flex flex-col items-stretch justify-center overflow-hidden bg-card border shadow-none transition-all duration-150 ease-out",
        visual?.cardBorder ?? "border-border",
        selected && "border-primary border-2 border-solid",
        isDisabled && "opacity-50"
      )}
      data-testid={`specialist-node-${id}`}
      data-agent-type={agentType}
      handles={{ target: true, source: true }}
      status={status}
    >
      <div
        className={cn(
          "flex items-center justify-between gap-2 px-3 py-2",
          (displayDescription || hasCapabilities) && "border-b",
          visual?.headerStrip ?? "border-border/60"
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <Icon
            name={iconName}
            size="xs"
            className={cn(
              "shrink-0",
              getHighlightIconColor(status, data.highlightStatus, visual?.iconColor ?? "text-primary")
            )}
            strokeWidth={1.75}
          />
          <NodeTitle className="truncate text-left text-xs font-medium leading-tight" title={displayTitle}>
            {displayTitle}
          </NodeTitle>
        </div>
        {agentType && visual && (
          <Badge
            variant="outline"
            className={cn("shrink-0 px-1.5 py-0 font-mono text-[9px] font-medium", visual.chipClass)}
          >
            {agentType}
          </Badge>
        )}
      </div>

      {status && status !== "idle" && status !== "running" && (
        <div
          className={cn(
            "absolute top-9 right-2 rounded-full p-1",
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
      )}

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

SpecialistNode.displayName = "SpecialistNode";
