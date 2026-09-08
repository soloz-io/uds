"use client";

import { Button } from "@/components/primitives/Button";
import { ButtonGroup } from "@/components/primitives/ButtonGroup";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/primitives/DropdownMenu";
import { Icon } from "@/components/primitives/Icon";
import { cn } from "@/lib/utils";
import type {
  ToolbarAction,
  WorkflowToolbarActionsProps,
  WorkflowToolbarProps,
} from "./interfaces";

// ---------------------------------------------------------------------------
// WorkflowToolbarActions — generic grouped icon buttons
// ---------------------------------------------------------------------------

/**
 * Generic toolbar actions component.
 *
 * Renders icon button groups from `actionGroups`. Each group is a `ButtonGroup`.
 * The composite handles layout only — the feature decides which buttons to include.
 */
export function WorkflowToolbarActions({
  actionGroups = [],
  className,
}: WorkflowToolbarActionsProps) {
  if (actionGroups.length === 0) return null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {actionGroups.map((group, groupIndex) => (
        <ButtonGroup key={groupIndex} orientation="horizontal">
          {group.map((action) => {
            const button = (
              <Button
                key={action.id}
                className="relative border hover:bg-black/5 dark:hover:bg-white/5 disabled:[&>svg]:text-muted-foreground"
                disabled={action.disabled || action.loading || action.switcher?.disabled}
                onClick={action.onClick}
                size="icon"
                title={action.title}
                variant="secondary"
              >
                {action.loading ? (
                  <Icon name="loader-2" size="sm" className="animate-spin" />
                ) : typeof action.icon === 'string' ? (
                  <Icon name={action.icon} size="sm" />
                ) : (
                  action.icon
                )}
                {action.indicator && !action.loading && (
                  <div className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary" />
                )}
              </Button>
            );

            if (action.switcher) {
              const { switcher } = action;
              return (
                <DropdownMenu key={action.id}>
                  <DropdownMenuTrigger asChild>
                    {button}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {switcher.items.length === 0 ? (
                      <div className="px-2 py-1.5 text-xs text-muted-foreground">
                        {switcher.placeholder ?? "No items"}
                      </div>
                    ) : (
                      switcher.items.map((item) => (
                        <DropdownMenuItem
                          key={item.value}
                          className="flex items-center justify-between gap-4 text-xs"
                          onClick={() => switcher.onValueChange(item.value)}
                        >
                          <span>{item.label}</span>
                          {item.value === switcher.value && (
                            <Icon name="check" size="sm" className="ml-2" />
                          )}
                        </DropdownMenuItem>
                      ))
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            return button;
          })}
        </ButtonGroup>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// WorkflowToolbar — full toolbar row
// ---------------------------------------------------------------------------

/**
 * WorkflowToolbar composite.
 *
 * Full toolbar row:
 * - **Left**: workflow name dropdown + optional version selector
 * - **Right**: `WorkflowToolbarActions` (icon button groups)
 *
 * The feature imports this directly and places it above `WorkflowCanvas`.
 *
 * @example
 * ```tsx
 * <div className="flex h-full flex-col">
 *   <WorkflowToolbar
 *     workflowName={hook.workflowName}
 *     versions={hook.versions}
 *     currentVersionId={hook.currentVersionId}
 *     onVersionSelect={hook.onVersionSelect}
 *     actionGroups={[
 *       [
 *         { id: "undo", icon: <Undo2 className="size-4" />, title: "Undo", onClick: hook.onUndo, disabled: !hook.canUndo },
 *         { id: "redo", icon: <Redo2 className="size-4" />, title: "Redo", onClick: hook.onRedo, disabled: !hook.canRedo },
 *       ],
 *       [
 *         { id: "save", icon: <Save className="size-4" />, title: "Save", onClick: hook.onSave, loading: hook.isSaving, indicator: hook.hasUnsavedChanges },
 *         { id: "cancel", icon: <X className="size-4" />, title: "Cancel", onClick: hook.onCancel },
 *       ],
 *     ]}
 *   />
 *   <WorkflowCanvas ... />
 * </div>
 * ```
 */
export function WorkflowToolbar({
  workflowName,
  hideWorkflowName,
  versions,
  currentVersionId,
  onVersionSelect,
  actionGroups,
  className,
}: WorkflowToolbarProps) {
  const currentVersion = versions?.find((v) => v.id === currentVersionId);

  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      {/* Left: workflow name text + version dropdown */}
      <div className="flex items-center gap-2">
        {/* Plain text title */}
        {!hideWorkflowName && workflowName && (
          <div className="flex h-9 items-center rounded-md border bg-secondary px-3 text-secondary-foreground">
            <span className="truncate font-medium text-sm">
              {workflowName}
            </span>
          </div>
        )}


        {/* Version selector — only shown when versions are provided */}
        {versions && versions.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="h-9 border hover:bg-black/5 dark:hover:bg-white/5"
                size="sm"
                title="Select version"
                variant="secondary"
              >
                {currentVersion?.label ?? "Version"}
                <Icon name="chevron-down" size="xs" className="ml-1 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {versions.map((v) => (
                <DropdownMenuItem
                  className="flex items-center justify-between"
                  key={v.id}
                  onClick={() => onVersionSelect?.(v.id)}
                >
                  {v.label}
                  {v.id === currentVersionId && <Icon name="check" size="sm" className="ml-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Right: action buttons */}
      <WorkflowToolbarActions actionGroups={actionGroups} />
    </div>
  );
}
