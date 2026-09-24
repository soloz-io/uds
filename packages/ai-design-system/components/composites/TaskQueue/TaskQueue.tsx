"use client";

import * as React from "react";
import {
  Queue,
  QueueSection,
  QueueSectionTrigger,
  QueueSectionLabel,
  QueueSectionContent,
  QueueList,
  QueueItem,
  QueueItemContent,
  QueueItemActions,
  QueueItemAction,
} from "@/components/ai-elements/queue";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { cn } from "@/lib/utils";
import type { TaskQueueProps, TaskStatus } from "./interfaces";

/**
 * TaskQueue Composite
 *
 * Displays active and queued tasks/jobs with status indicators, command previews,
 * and stop/cancel controls. Uses Queue AI element for structure, following the
 * pattern established in FileQueue.
 *
 * Supports both standalone card mode and docked mode attaching directly above PromptInput.
 * Recreates Antigravity jobs/tasks UI (inspirations/antigravity/2.1-jobs.png).
 */

const getStatusIcon = (status: TaskStatus) => {
  switch (status) {
    case "running":
      return (
        <Icon
          name="loader-2"
          size="sm"
          className="animate-spin text-muted-foreground flex-shrink-0"
        />
      );
    case "queued":
    case "pending":
      return (
        <Icon
          name="clock"
          size="sm"
          className="text-muted-foreground/60 flex-shrink-0"
        />
      );
    case "completed":
      return (
        <Icon
          name="check"
          size="sm"
          className="text-emerald-500 flex-shrink-0"
        />
      );
    case "failed":
      return (
        <Icon
          name="x"
          size="sm"
          className="text-destructive flex-shrink-0"
        />
      );
    case "cancelled":
      return (
        <Icon
          name="minus"
          size="sm"
          className="text-muted-foreground/60 flex-shrink-0"
        />
      );
    default:
      return null;
  }
};

export const TaskQueue = React.memo<TaskQueueProps>(
  ({
    tasks,
    title,
    open,
    defaultOpen = true,
    onOpenChange,
    onStop,
    onCancel,
    onRetry,
    onStopAll,
    onTaskClick,
    variant = "standalone",
    className,
    showEmpty = false,
    emptyMessage = "No tasks in queue",
  }) => {
    const runningTasks = React.useMemo(
      () => tasks.filter((t) => t.status === "running"),
      [tasks]
    );

    const queuedTasks = React.useMemo(
      () => tasks.filter((t) => t.status === "queued" || t.status === "pending"),
      [tasks]
    );

    const displayTitle = React.useMemo(() => {
      if (title) return title;
      const parts: string[] = [];
      if (runningTasks.length > 0) {
        parts.push(
          `${runningTasks.length} task${runningTasks.length === 1 ? "" : "s"} running`
        );
      }
      if (queuedTasks.length > 0) {
        parts.push(`${queuedTasks.length} queued`);
      }
      if (parts.length > 0) {
        return parts.join(", ");
      }
      if (tasks.length > 0) {
        return `${tasks.length} task${tasks.length === 1 ? "" : "s"}`;
      }
      return emptyMessage;
    }, [title, runningTasks.length, queuedTasks.length, tasks.length, emptyMessage]);

    // Only display if at least 1 task exists or showEmpty is explicitly enabled
    if (tasks.length === 0 && !showEmpty) {
      return null;
    }

    const isDocked = variant === "docked";

    return (
      <Queue
        className={cn(
          "w-full transition-colors",
          isDocked
            ? "rounded-t-2xl rounded-b-none border-b-0 border-t border-x border-border/80 bg-card/95 backdrop-blur-md shadow-xs -mb-px p-1.5"
            : "rounded-2xl border border-border bg-card text-card-foreground shadow-sm p-1.5",
          className
        )}
      >
        <QueueSection
          defaultOpen={defaultOpen}
          open={open}
          onOpenChange={onOpenChange}
          className="w-full"
        >
          <div className="flex items-center justify-between w-full">
            <QueueSectionTrigger
              className={cn(
                "w-full px-3 py-2 bg-transparent hover:bg-muted/40 text-foreground transition-colors",
                isDocked ? "rounded-t-xl" : "rounded-lg"
              )}
            >
              <QueueSectionLabel
                label={displayTitle}
                className="w-full justify-between flex-row-reverse font-sans text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors"
              />
            </QueueSectionTrigger>

            {runningTasks.length > 1 && onStopAll && (
              <Button
                variant="ghost"
                size="sm"
                type="button"
                className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive flex-shrink-0 mr-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onStopAll();
                }}
              >
                Stop all
              </Button>
            )}
          </div>

          <QueueSectionContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden">
            <QueueList className="max-h-[260px] mt-1 -mb-0">
              {tasks.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground italic">
                  {emptyMessage}
                </div>
              ) : (
                tasks.map((task) => {
                  const isClickable = Boolean(onTaskClick);

                  return (
                    <QueueItem
                      key={task.id}
                      className={cn(
                        "flex flex-row items-center justify-between gap-3 px-3 py-1.5 rounded-lg text-sm transition-colors",
                        "hover:bg-muted/40 group/item",
                        isClickable && "cursor-pointer"
                      )}
                      onClick={isClickable ? () => onTaskClick?.(task) : undefined}
                      role={isClickable ? "button" : undefined}
                      tabIndex={isClickable ? 0 : undefined}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        {getStatusIcon(task.status)}

                        <QueueItemContent className="font-mono text-sm text-foreground select-all">
                          {task.command || task.title}
                        </QueueItemContent>

                        {task.duration && (
                          <span className="text-xs text-muted-foreground/60 font-sans ml-1 flex-shrink-0">
                            {task.duration}
                          </span>
                        )}
                      </div>

                      <QueueItemActions>
                        {task.status === "running" && onStop && (
                          <QueueItemAction
                            onClick={(e) => {
                              e.stopPropagation();
                              onStop(task.id);
                            }}
                            aria-label={`Stop ${task.command || task.title}`}
                            title="Stop task"
                            className="size-6 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 opacity-100 group-hover:opacity-100"
                          >
                            <Icon name="circle-stop" size="sm" />
                          </QueueItemAction>
                        )}

                        {(task.status === "queued" || task.status === "pending") && onCancel && (
                          <QueueItemAction
                            onClick={(e) => {
                              e.stopPropagation();
                              onCancel(task.id);
                            }}
                            aria-label={`Cancel ${task.command || task.title}`}
                            title="Cancel task"
                            className="size-6 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 opacity-100 group-hover:opacity-100"
                          >
                            <Icon name="x" size="sm" />
                          </QueueItemAction>
                        )}

                        {task.status === "failed" && onRetry && (
                          <QueueItemAction
                            onClick={(e) => {
                              e.stopPropagation();
                              onRetry(task.id);
                            }}
                            aria-label={`Retry ${task.command || task.title}`}
                            title="Retry task"
                            className="size-6 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 opacity-100 group-hover:opacity-100"
                          >
                            <Icon name="refresh-cw" size="sm" />
                          </QueueItemAction>
                        )}
                      </QueueItemActions>
                    </QueueItem>
                  );
                })
              )}
            </QueueList>
          </QueueSectionContent>
        </QueueSection>
      </Queue>
    );
  }
);

TaskQueue.displayName = "TaskQueue";
