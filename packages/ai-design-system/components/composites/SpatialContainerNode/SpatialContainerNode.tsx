"use client";

import { NodeResizer, NodeToolbar, Position, type NodeProps } from "@xyflow/react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/primitives/Tooltip";
import { cn } from "@/lib/utils";
import type { ToolbarAction } from "@/components/composites/WorkflowToolbar";

export type SpatialContainerColorTheme =
  | "blue"
  | "emerald"
  | "amber"
  | "purple"
  | "rose"
  | "cyan"
  | "indigo"
  | "slate";

export type SpatialContainerVariant = "extruded3d" | "flat" | "glassmorphism";

export type SpatialContainerItem = {
  id: string;
  label: string;
  description?: string;
  status?: "idle" | "running" | "success" | "error";
  icon?: string;
};

export type SpatialContainerNodeData = {
  label: string;
  description?: string;
  type: "spatialContainer";
  category?: string;
  themeColor?: SpatialContainerColorTheme;
  variant?: SpatialContainerVariant;
  icon?: string;
  status?: "idle" | "running" | "success" | "error";
  highlightStatus?: "active" | "pending" | "done" | "error";
  enabled?: boolean;
  actions?: ToolbarAction[];
  /** Badge count or sub-item summary tag */
  badgeText?: string;
  /** Sub-items rendered as HTML card elements inside spatial container */
  items?: SpatialContainerItem[];
};

type SpatialContainerNodeProps = NodeProps & {
  data?: SpatialContainerNodeData;
  id: string;
};

const THEME_STYLES: Record<
  SpatialContainerColorTheme,
  {
    border: string;
    bg: string;
    headerBg: string;
    text: string;
    badgeBg: string;
    extrusionBottom: string;
    extrusionSide: string;
  }
> = {
  blue: {
    border: "border-blue-500/40 dark:border-blue-400/30",
    bg: "bg-blue-50/50 dark:bg-blue-950/20",
    headerBg: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
    text: "text-blue-600 dark:text-blue-400",
    badgeBg: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
    extrusionBottom: "bg-blue-600/30 dark:bg-blue-900/60",
    extrusionSide: "bg-blue-700/40 dark:bg-blue-950/80",
  },
  indigo: {
    border: "border-indigo-500/40 dark:border-indigo-400/30",
    bg: "bg-indigo-50/50 dark:bg-indigo-950/20",
    headerBg: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
    text: "text-indigo-600 dark:text-indigo-400",
    badgeBg: "bg-indigo-500/20 text-indigo-700 dark:text-indigo-300",
    extrusionBottom: "bg-indigo-600/30 dark:bg-indigo-900/60",
    extrusionSide: "bg-indigo-700/40 dark:bg-indigo-950/80",
  },
  emerald: {
    border: "border-emerald-500/40 dark:border-emerald-400/30",
    bg: "bg-emerald-50/50 dark:bg-emerald-950/20",
    headerBg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    text: "text-emerald-600 dark:text-emerald-400",
    badgeBg: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
    extrusionBottom: "bg-emerald-600/30 dark:bg-emerald-900/60",
    extrusionSide: "bg-emerald-700/40 dark:bg-emerald-950/80",
  },
  amber: {
    border: "border-amber-500/40 dark:border-amber-400/30",
    bg: "bg-amber-50/50 dark:bg-amber-950/20",
    headerBg: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    text: "text-amber-600 dark:text-amber-400",
    badgeBg: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
    extrusionBottom: "bg-amber-600/30 dark:bg-amber-900/60",
    extrusionSide: "bg-amber-700/40 dark:bg-amber-950/80",
  },
  purple: {
    border: "border-purple-500/40 dark:border-purple-400/30",
    bg: "bg-purple-50/50 dark:bg-purple-950/20",
    headerBg: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
    text: "text-purple-600 dark:text-purple-400",
    badgeBg: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
    extrusionBottom: "bg-purple-600/30 dark:bg-purple-900/60",
    extrusionSide: "bg-purple-700/40 dark:bg-purple-950/80",
  },
  rose: {
    border: "border-rose-500/40 dark:border-rose-400/30",
    bg: "bg-rose-50/50 dark:bg-rose-950/20",
    headerBg: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
    text: "text-rose-600 dark:text-rose-400",
    badgeBg: "bg-rose-500/20 text-rose-700 dark:text-rose-300",
    extrusionBottom: "bg-rose-600/30 dark:bg-rose-900/60",
    extrusionSide: "bg-rose-700/40 dark:bg-rose-950/80",
  },
  cyan: {
    border: "border-cyan-500/40 dark:border-cyan-400/30",
    bg: "bg-cyan-50/50 dark:bg-cyan-950/20",
    headerBg: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
    text: "text-cyan-600 dark:text-cyan-400",
    badgeBg: "bg-cyan-500/20 text-cyan-700 dark:text-cyan-300",
    extrusionBottom: "bg-cyan-600/30 dark:bg-cyan-900/60",
    extrusionSide: "bg-cyan-700/40 dark:bg-cyan-950/80",
  },
  slate: {
    border: "border-slate-400/40 dark:border-slate-600/40",
    bg: "bg-slate-50/50 dark:bg-slate-900/30",
    headerBg: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
    text: "text-slate-600 dark:text-slate-400",
    badgeBg: "bg-slate-500/20 text-slate-700 dark:text-slate-300",
    extrusionBottom: "bg-slate-500/30 dark:bg-slate-800/60",
    extrusionSide: "bg-slate-600/40 dark:bg-slate-900/80",
  },
};

export const SpatialContainerNode = memo(
  ({ data, selected, id, width = 320, height = 240 }: SpatialContainerNodeProps) => {
    if (!data) return null;

    const displayTitle = data.label || "Spatial Container";
    const displayDescription = data.description;
    const themeKey = data.themeColor || "indigo";
    const theme = THEME_STYLES[themeKey];
    const variant = data.variant || "extruded3d";
    const iconName = data.icon || "layout-grid";
    const status = data.status;
    const isDisabled = data.enabled === false;

    return (
      <div className="relative group" style={{ width, height }}>
        {/* Node Resizer — disabled for clean spatial sections */}
        <NodeResizer minWidth={180} minHeight={140} isVisible={false} />

        {/* 2.5D Extrusion Side & Bottom Panels for extruded3d visual mode */}
        {variant === "extruded3d" && (
          <>
            {/* Bottom Extrusion Shadow Face */}
            <div
              className={cn(
                "absolute -bottom-3.5 left-3.5 right-0 h-3.5 rounded-b-md transition-all duration-200 border-b border-r border-black/30 dark:border-black/60 shadow-md",
                theme.extrusionBottom
              )}
            />
            {/* Right Side Extrusion Face */}
            <div
              className={cn(
                "absolute -right-3.5 top-3.5 bottom-0 w-3.5 rounded-r-md transition-all duration-200 border-t border-r border-black/30 dark:border-black/60 shadow-md",
                theme.extrusionSide
              )}
            />
          </>
        )}

        <Node
          className={cn(
            "relative h-full w-full flex flex-col border transition-all duration-200 ease-out overflow-hidden rounded-lg shadow-sm",
            theme.border,
            theme.bg,
            variant === "glassmorphism" && "backdrop-blur-md bg-opacity-70 dark:bg-opacity-40",
            variant === "extruded3d" && "shadow-xl border-t border-l border-white/20 dark:border-white/10",
            isDisabled && "opacity-50"
          )}
          data-testid={`spatial-container-node-${id}`}
          handles={{ target: true, source: true }}
          status={status}
        >
          {/* Top 3D Highlight Line */}
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none z-10" />

          {/* Header Panel */}
          <div
            className={cn(
              "flex items-center justify-between px-3 py-2 border-b border-border/40 select-none",
              theme.headerBg
            )}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Icon
                name={iconName}
                size="xs"
                className={cn(
                  "shrink-0",
                  getHighlightIconColor(status, data.highlightStatus, theme.text)
                )}
                strokeWidth={2}
              />
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <NodeTitle
                  className="truncate text-xs font-bold tracking-wider uppercase"
                  title={displayTitle}
                >
                  {displayTitle}
                </NodeTitle>
                {displayDescription && (
                  <TooltipProvider>
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger asChild>
                        <span className="cursor-help text-muted-foreground/60 hover:text-foreground shrink-0 transition-colors">
                          <Icon name="info" size="xs" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        align="start"
                        className="max-w-xs p-3 text-xs bg-popover text-popover-foreground border border-border shadow-lg space-y-2"
                      >
                        {displayDescription.split('\n\n').map((paragraph, idx) => (
                          <p
                            key={idx}
                            className={cn(
                              idx === 0 && "font-medium text-foreground",
                              idx === 1 && "italic text-primary/90 font-medium",
                              idx === 2 && "text-muted-foreground text-[11px]"
                            )}
                          >
                            {paragraph}
                          </p>
                        ))}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>

            {/* Optional Badge Text */}
            {data.badgeText && (
              <span
                className={cn(
                  "ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium leading-none shrink-0",
                  theme.badgeBg
                )}
              >
                {data.badgeText}
              </span>
            )}
          </div>

          {/* Body Container Region for Child HTML Card Items */}
          <div className="relative flex-1 p-2.5 overflow-y-auto nowheel nodrag nopan custom-scrollbar pointer-events-auto flex flex-col gap-2">
            {data.items && data.items.length > 0 ? (
              data.items.map((item) => (
                <div
                  key={item.id}
                  className="group relative flex items-center gap-2 rounded-md border border-border/70 bg-card/95 px-3 py-2 text-xs shadow-2xs transition-all hover:border-primary/50 hover:bg-accent/30"
                >
                  <Icon
                    name={item.icon || "zap"}
                    size="xs"
                    className="shrink-0 text-primary"
                    strokeWidth={1.5}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-foreground truncate" title={item.label}>
                      {item.label}
                    </div>
                    {item.description && (
                      <div className="text-[10px] text-muted-foreground truncate" title={item.description}>
                        {item.description}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none -z-10" />
            )}
          </div>

          {/* Node Toolbar Actions */}
          {data.actions && data.actions.length > 0 && (
            <NodeToolbar isVisible={true} position={Position.Right} offset={12}>
              {(() => {
                const switcherActions = data.actions.filter(
                  (a: ToolbarAction) => a.switcher
                );
                const buttonActions = data.actions.filter(
                  (a: ToolbarAction) => !a.switcher
                );
                return (
                  <>
                    {buttonActions.length > 0 && (
                      <ButtonGroup
                        orientation="horizontal"
                        className="shadow-md bg-secondary/80 backdrop-blur border-border/50"
                      >
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
                              <Icon
                                name={action.icon as string}
                                size="sm"
                                className={
                                  action.icon === "check"
                                    ? "text-green-500"
                                    : action.icon === "x"
                                    ? "text-red-500"
                                    : "text-primary"
                                }
                              />
                            ) : (
                              <Icon name="play" size="sm" className="text-primary" />
                            )}
                          </Button>
                        ))}
                      </ButtonGroup>
                    )}
                    {switcherActions.map((action: ToolbarAction) => (
                      <div
                        key={action.id}
                        className="shadow-md bg-secondary/80 backdrop-blur border-border/50 rounded-md"
                      >
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
      </div>
    );
  }
);

SpatialContainerNode.displayName = "SpatialContainerNode";
