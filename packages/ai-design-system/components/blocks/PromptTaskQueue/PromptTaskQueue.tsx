"use client";

import * as React from "react";
import { PromptInput } from "@/components/composites/PromptInput";
import { TaskQueue } from "@/components/composites/TaskQueue";
import { cn } from "@/lib/utils";
import type { PromptTaskQueueProps, PromptInputWithQueueProps } from "./interfaces";

export type { PromptTaskQueueProps, PromptInputWithQueueProps };

export const PromptTaskQueue = React.memo<PromptTaskQueueProps>(
  ({
    tasks,
    taskQueueTitle,
    taskQueueAction,
    onTaskStop,
    onTaskCancel,
    onTaskRetry,
    onTaskStopAll,
    onTaskClick,
    taskQueueProps,
    className,
    inputClassName,
    dialog,
    ...promptInputProps
  }) => {
    if (dialog) {
      return <>{dialog}</>;
    }

    const hasTasks = Boolean(tasks && tasks.length > 0);

    return (
      <div className={cn("flex flex-col w-full", className)}>
        {hasTasks && (
          <TaskQueue
            tasks={tasks!}
            title={taskQueueTitle}
            action={taskQueueAction}
            onStop={onTaskStop}
            onCancel={onTaskCancel}
            onRetry={onTaskRetry}
            onStopAll={onTaskStopAll}
            onTaskClick={onTaskClick}
            variant="docked"
            {...taskQueueProps}
          />
        )}
        <PromptInput
          {...promptInputProps}
          className={cn(hasTasks && "rounded-t-none border-t-0", inputClassName)}
        />
      </div>
    );
  }
);

PromptTaskQueue.displayName = "PromptTaskQueue";

// Convenience alias
export const PromptInputWithQueue = PromptTaskQueue;
