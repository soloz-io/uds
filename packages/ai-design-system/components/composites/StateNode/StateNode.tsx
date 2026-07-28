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

export type StateNodeData = {
  label: string;
  description?: string;
  type: "state";
  /** True for terminal states — marks workflow completion, no outgoing transitions */
  isTerminal?: boolean;
  status?: "idle" | "running" | "success" | "error";
  highlightStatus?: "active" | "pending" | "done" | "error";
  enabled?: boolean;
  actions?: ToolbarAction[];
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
        <Icon name="check" className="size-3.5 text-white" strokeWidth={2.5} />
      )}
      {status === "error" && (
        <Icon name="circle-x" className="size-3.5 text-white" strokeWidth={2.5} />
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

  return (
      <Node
        className={cn(
          "relative flex flex-col items-center justify-center border border-border bg-card shadow-none transition-all duration-150 ease-out",
          selected ? "border-primary border-2" : "border border-border",
          isDisabled && "opacity-50"
        )}
      data-testid={`state-node-${id}`}
      handles={{ target: true, source: true }}
      status={status}
    >
      {/* Disabled badge in top left */}
      {isDisabled && (
        <div className="absolute top-1 left-1 rounded-full bg-gray-500/50 p-0.5">
          <Icon name="eye-off" size="xs" className="text-white" />
        </div>
      )}

      {/* Status indicator badge in top right */}
      <StatusBadge status={status} />

      <div className="flex h-full w-full items-center justify-center gap-1.5 px-3 py-2">
        <Icon name="zap" size="xs" className={cn("shrink-0", getHighlightIconColor(status, data.highlightStatus, "text-primary"))} strokeWidth={1.5} />
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
      {data.actions && data.actions.length > 0 && (
        <NodeToolbar isVisible={true} position={Position.Right} offset={12}>
          {(() => {
            const switcherActions = data.actions.filter((a: ToolbarAction) => a.switcher);
            const buttonActions = data.actions.filter((a: ToolbarAction) => !a.switcher);
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
});

StateNode.displayName = "StateNode";
