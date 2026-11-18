"use client";

import { NodeToolbar, Position, type NodeProps } from "@xyflow/react";
import { memo } from "react";
import { Icon } from "@/components/primitives/Icon";
import { ButtonGroup } from "@/components/primitives/ButtonGroup";
import { Button } from "@/components/primitives/Button";
import { DefaultSwitcher } from "@/components/composites/DefaultSwitcher";
import {
  Node,
  NodeDescription,
  NodeTitle,
  getHighlightIconColor,
} from "@/components/ai-elements/node";
import { cn } from "@/lib/utils";
import type { ToolbarAction } from "@/components/composites/WorkflowToolbar";

export type TransitionNodeConfig = {
  /** For conditional transitions: form field comparison e.g. "{{record.orderValue}} > {{record.acceptedRange}}" */
  condition?: string;
  /** For human transitions: roles allowed to approve */
  allowed_roles?: string[];
  /** For scheduled transitions: delay in seconds */
  delay_seconds?: number;
  /** For plugin transitions: plugin identifier */
  plugin_id?: string;
  /** For plugin transitions: plugin input values */
  plugin_inputs?: Record<string, unknown>;
};

export type TransitionActionStepMeta = {
  stepId?: string;
  actionType?: string;
  delegatesToPack?: string;
  config?: Record<string, unknown>;
};

export type TransitionActionPhases = {
  before?: TransitionActionStepMeta[];
  during?: TransitionActionStepMeta[];
  after?: TransitionActionStepMeta[];
};

export type TransitionNodeData = {
  label: string;
  description?: string;
  type: "transition";
  /** Transition execution type (canonical STS lifecycle types) */
  transitionType?: "human" | "conditional" | "scheduled" | "plugin" | "system";
  /** Optional presentation icon override from the DS icon registry */
  icon?: string;
  /** Existing transition action metadata (used to derive agent-execution icon) */
  action?: TransitionActionPhases;
  actions?: ToolbarAction[] | TransitionActionPhases;
  actionSteps?: TransitionActionStepMeta[];
  /** Transition-type-specific configuration */
  config?: TransitionNodeConfig;
  status?: "idle" | "running" | "success" | "error";
  highlightStatus?: "active" | "pending" | "done" | "error";
  enabled?: boolean;
};

type TransitionNodeProps = NodeProps & {
  data?: TransitionNodeData;
  id: string;
};

function collectActionSteps(data: TransitionNodeData): TransitionActionStepMeta[] {
  const steps: TransitionActionStepMeta[] = [];
  const phases =
    data.action ??
    (data.actions && !Array.isArray(data.actions) ? data.actions : undefined);

  if (phases) {
    if (Array.isArray(phases.before)) steps.push(...phases.before);
    if (Array.isArray(phases.during)) steps.push(...phases.during);
    if (Array.isArray(phases.after)) steps.push(...phases.after);
  }
  if (Array.isArray(data.actionSteps)) {
    steps.push(...data.actionSteps);
  }
  return steps;
}

export function isAgentExecutingTransition(data: TransitionNodeData): boolean {
  const steps = collectActionSteps(data);
  return steps.some((step) => {
    if (step.delegatesToPack) return true;
    const actionType = typeof step.actionType === "string" ? step.actionType : "";
    if (
      actionType.endsWith("/send-message") ||
      actionType.startsWith("agent/") ||
      actionType.startsWith("ai-gateway/")
    ) {
      return true;
    }
    return Boolean(step.config && "definitionRef" in step.config && step.config.definitionRef);
  });
}

export function resolveTransitionIcon(data: TransitionNodeData): string {
  if (data.icon) return data.icon;
  if (isAgentExecutingTransition(data)) return "brain";
  switch (data.transitionType) {
    case "human":
      return "user";
    case "conditional":
      return "git-branch";
    case "scheduled":
      return "clock";
    case "system":
      return "zap";
    default:
      return "git-branch";
  }
}

export const TransitionNode = memo(
  ({ data, selected, id }: TransitionNodeProps) => {
    if (!data) {
      return null;
    }

    const displayTitle = data.label || "Transition";
    const displayDescription = data.description;
    const status = data.status;
    const iconName = resolveTransitionIcon(data);
    const toolbarActions = Array.isArray(data.actions) ? data.actions : undefined;

    return (
      <Node
        className={cn(
          "flex flex-col items-center justify-center border border-border bg-secondary text-secondary-foreground shadow-none transition-all duration-150 ease-out",
          selected && "border-primary border-2"
        )}
        data-testid={`transition-node-${id}`}
        handles={{ target: true, source: true }}
        status={status}
      >
        {/* Status indicator badge in top right */}
        {status && status !== "idle" && status !== "running" && (
          <div
            className={cn(
              "absolute top-1 right-1 rounded-full p-0.5",
              status === "success" && "bg-green-500/50",
              status === "error" && "bg-red-500/50"
            )}
          >
            {status === "success" && (
              <Icon name="check" size="xs" className="text-white" strokeWidth={2.5} />
            )}
            {status === "error" && (
              <Icon name="circle-x" size="xs" className="text-white" strokeWidth={2.5} />
            )}
          </div>
        )}

        <div className="flex h-full w-full items-center justify-center gap-2 px-4 py-3">
          <Icon
            name={iconName}
            size="xs"
            className={cn(
              "shrink-0",
              getHighlightIconColor(
                status,
                data.highlightStatus,
                iconName === "brain" ? "text-purple-500 dark:text-purple-400" : "text-muted-foreground"
              )
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
        {toolbarActions && toolbarActions.length > 0 && (
          <NodeToolbar isVisible={true} position={Position.Right} offset={12}>
            {(() => {
              const switcherActions = toolbarActions.filter((a: ToolbarAction) => a.switcher);
              const buttonActions = toolbarActions.filter((a: ToolbarAction) => !a.switcher);
              return (
                <>
                  {buttonActions.length > 0 && (
                    <ButtonGroup orientation="horizontal" className="shadow-md bg-secondary/80 backdrop-blur border-border/50">
                      {buttonActions.map((action: ToolbarAction) => (
                        <Button
                          key={action.id}
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8 hover:bg-primary/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            action.onClick?.();
                          }}
                          title={action.title}
                        >
                          {action.icon ? (
                            <Icon name={action.icon as string} size="sm" className={action.icon === 'check' ? 'text-green-500' : action.icon === 'x' ? 'text-red-500' : 'text-primary'} />
                          ) : (
                            <Icon name="play" size="sm" className="text-primary" />
                          )}
                        </Button>
                      ))}
                    </ButtonGroup>
                  )}
                  {switcherActions.map((action: ToolbarAction) => (
                    <div key={action.id} className="shadow-md bg-secondary/80 backdrop-blur border-border/50 rounded-md">
                      <DefaultSwitcher
                        themes={action.switcher!.items}
                        value={action.switcher!.value}
                        onValueChange={action.switcher!.onValueChange}
                        placeholder={action.switcher!.placeholder}
                      />
                    </div>
                  ))}
                </>
              );
            })()}
          </NodeToolbar>
        )}
      </Node>
    );
  }
);

TransitionNode.displayName = "TransitionNode";
