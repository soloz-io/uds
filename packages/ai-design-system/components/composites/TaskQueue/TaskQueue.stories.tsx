import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TaskQueue } from "./TaskQueue";
import type { TaskItem } from "./interfaces";
import { Button } from "@/components/primitives/Button";

const meta: Meta<typeof TaskQueue> = {
  title: "Composites/TaskQueue",
  component: TaskQueue,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof TaskQueue>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample tasks based on 2.1-jobs.png inspiration
const singleRunningTask: TaskItem[] = [
  {
    id: "task-1",
    command: "npm install",
    status: "running",
  },
];

const multipleMixedTasks: TaskItem[] = [
  {
    id: "task-1",
    command: "npm install",
    status: "running",
  },
  {
    id: "task-2",
    command: "npm run build",
    status: "queued",
  },
  {
    id: "task-3",
    command: "git push origin main",
    status: "queued",
  },
];

const completedAndFailedTasks: TaskItem[] = [
  {
    id: "task-1",
    command: "pnpm install",
    status: "completed",
    duration: "4.2s",
  },
  {
    id: "task-2",
    command: "pnpm test",
    status: "failed",
    duration: "1.1s",
    error: "Test failed with exit code 1",
  },
  {
    id: "task-3",
    command: "pnpm build",
    status: "queued",
  },
];

/**
 * Single running task — Exact replica of 2.1-jobs.png inspiration.
 * Displays "1 task running", spinner, "npm install", and stop button.
 */
export const SingleTaskRunning: Story = {
  args: {
    tasks: singleRunningTask,
    variant: "standalone",
    onStop: (id) => console.log(`Stopped task ${id}`),
  },
};

/**
 * Multiple tasks — Running task + queued tasks waiting in the queue.
 */
export const MultipleTasks: Story = {
  args: {
    tasks: multipleMixedTasks,
    variant: "standalone",
    onStop: (id) => console.log(`Stopped task ${id}`),
    onCancel: (id) => console.log(`Cancelled task ${id}`),
    onStopAll: () => console.log("Stopped all tasks"),
  },
};


/**
 * Collapsed state — Collapsed header showing the summary count and chevron.
 */
export const Collapsed: Story = {
  args: {
    tasks: multipleMixedTasks,
    defaultOpen: false,
    variant: "standalone",
    onStop: (id) => console.log(`Stopped task ${id}`),
    onCancel: (id) => console.log(`Cancelled task ${id}`),
  },
};

/**
 * All queued tasks — When tasks are waiting to execute.
 */
export const AllQueued: Story = {
  args: {
    tasks: [
      { id: "1", command: "npm test", status: "queued" },
      { id: "2", command: "npm run lint", status: "queued" },
    ],
    variant: "standalone",
    onCancel: (id) => console.log(`Cancelled task ${id}`),
  },
};

/**
 * Completed and failed tasks with retry support.
 */
export const CompletedAndFailed: Story = {
  args: {
    tasks: completedAndFailedTasks,
    variant: "standalone",
    onRetry: (id) => console.log(`Retried task ${id}`),
    onCancel: (id) => console.log(`Cancelled task ${id}`),
  },
};

/**
 * Interactive story — Allows testing stopping and cancelling tasks with live state.
 */
export const Interactive: Story = {
  render: () => {
    const [tasks, setTasks] = React.useState<TaskItem[]>([
      { id: "t1", command: "npm install", status: "running" },
      { id: "t2", command: "npm run test", status: "queued" },
      { id: "t3", command: "git push origin feat/task-queue", status: "queued" },
    ]);

    const handleStop = (id: string) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: "cancelled" } : t))
      );
    };

    const handleCancel = (id: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    };

    const handleRetry = (id: string) => {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: "running" } : t))
      );
    };

    const handleStopAll = () => {
      setTasks((prev) =>
        prev.map((t) =>
          t.status === "running" ? { ...t, status: "cancelled" } : t
        )
      );
    };

    const handleReset = () => {
      setTasks([
        { id: "t1", command: "npm install", status: "running" },
        { id: "t2", command: "npm run test", status: "queued" },
        { id: "t3", command: "git push origin feat/task-queue", status: "queued" },
      ]);
    };

    return (
      <div className="max-w-xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            Try stopping or cancelling tasks:
          </span>
          <Button variant="outline" size="sm" onClick={handleReset}>
            Reset Tasks
          </Button>
        </div>
        <TaskQueue
          tasks={tasks}
          onStop={handleStop}
          onCancel={handleCancel}
          onRetry={handleRetry}
          onStopAll={handleStopAll}
        />
      </div>
    );
  },
};

/**
 * Empty state — Gracefully returns null when no tasks are present.
 */
export const EmptyState: Story = {
  args: {
    tasks: [],
    showEmpty: false,
  },
};
