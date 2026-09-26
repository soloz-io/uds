export type TaskStatus =
  | "running"
  | "queued"
  | "pending"
  | "completed"
  | "failed"
  | "cancelled";

export interface TaskItem {
  /**
   * Unique identifier for the task
   */
  id: string;
  /**
   * Command to display in monospace (e.g. "npm install")
   */
  command: string;
  /**
   * Optional title or label for the task
   */
  title?: string;
  /**
   * Current status of the task
   */
  status: TaskStatus;
  /**
   * Optional description or secondary information
   */
  description?: string;
  /**
   * Optional duration string (e.g. "2.4s" or "35s")
   */
  duration?: string;
  /**
   * Optional error message if the task failed
   */
  error?: string;
  /**
   * Optional underlying run/job identifier (e.g. for tooltip/diagnostics)
   */
  runId?: string;
}

export interface TaskQueueProps {
  /**
   * List of tasks in the queue
   */
  tasks: TaskItem[];
  /**
   * Custom title or header text (e.g. "1 task running").
   * Defaults to auto-computed summary:
   * e.g. "1 task running", "2 tasks running", "1 task running, 2 queued"
   */
  title?: string;
  /**
   * Whether the queue is expanded/open (controlled)
   */
  open?: boolean;
  /**
   * Default open state (uncontrolled, defaults to true)
   */
  defaultOpen?: boolean;
  /**
   * Callback fired when open state changes
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Callback fired when stopping a running task
   */
  onStop?: (taskId: string) => void;
  /**
   * Callback fired when cancelling a queued task
   */
  onCancel?: (taskId: string) => void;
  /**
   * Callback fired when retrying a failed task
   */
  onRetry?: (taskId: string) => void;
  /**
   * Callback fired to stop all running tasks
   */
  onStopAll?: () => void;
  /**
   * Callback fired when a task item is clicked (e.g. to inspect terminal output or logs)
   */
  onTaskClick?: (task: TaskItem) => void;
  /**
   * Display mode:
   * - 'standalone': self-contained card with full rounded corners
   * - 'docked': attaches flush directly above PromptInput (matches 2.1-jobs.png)
   * @default 'standalone'
   */
  variant?: "standalone" | "docked";
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Whether to render an empty state when tasks is empty
   * @default false
   */
  showEmpty?: boolean;
  /**
   * Custom message when there are no tasks and showEmpty is true
   */
  emptyMessage?: string;
}
