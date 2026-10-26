import type * as React from "react";
import type { PromptInputBlockProps } from "@/components/composites/PromptInput";
import type { TaskItem, TaskQueueProps } from "@/components/composites/TaskQueue";

/**
 * PromptTaskQueue Block Props
 *
 * Section-level block combining TaskQueue composite and PromptInput composite.
 * When background tasks or drafts are present, TaskQueue docks flush atop PromptInput.
 * When tasks complete, TaskQueue automatically hides, returning PromptInput to its default appearance.
 */
export interface PromptTaskQueueProps extends Omit<PromptInputBlockProps, "className"> {
  /**
   * Active or queued background tasks to display docked directly atop the input.
   */
  tasks?: TaskItem[];
  /**
   * Custom title or header text for the docked TaskQueue (defaults to e.g. "(n) pending changes" or task summary).
   */
  taskQueueTitle?: string;
  /**
   * Custom action slot rendered on the right side of the TaskQueue header (e.g. Apply button).
   */
  taskQueueAction?: React.ReactNode;
  /**
   * Callback fired when stopping a running task in the queue.
   */
  onTaskStop?: (taskId: string) => void;
  /**
   * Callback fired when cancelling a queued task.
   */
  onTaskCancel?: (taskId: string) => void;
  /**
   * Callback fired when retrying a failed task.
   */
  onTaskRetry?: (taskId: string) => void;
  /**
   * Callback fired to stop all running tasks.
   */
  onTaskStopAll?: () => void;
  /**
   * Callback fired when a task item in the queue is clicked.
   */
  onTaskClick?: (task: TaskItem) => void;
  /**
   * Additional props forwarded to the docked TaskQueue composite.
   */
  taskQueueProps?: Partial<TaskQueueProps>;
  /**
   * Outer container CSS classes.
   */
  className?: string;
  /**
   * Optional CSS classes forwarded directly to PromptInput.
   */
  inputClassName?: string;
}

export type PromptInputWithQueueProps = PromptTaskQueueProps;
