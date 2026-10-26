import type { Meta, StoryObj } from "@storybook/react";
import { PromptTaskQueue } from "./PromptTaskQueue";
import type { TaskItem } from "@/components/composites/TaskQueue";
import { Button } from "@/components/primitives/Button";

const meta: Meta<typeof PromptTaskQueue> = {
  title: "Blocks/PromptTaskQueue",
  component: PromptTaskQueue,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof PromptTaskQueue>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleTasks: TaskItem[] = [
  {
    id: "task-1",
    command: "Scene 1",
    title: "Scene 1: Shorten intro hook duration",
    status: "running",
  },
  {
    id: "task-2",
    command: "Scene 2",
    title: "Scene 2: Add caption overlay",
    status: "queued",
  },
];

export const Default: Story = {
  args: {
    placeholder: "Ask a question or provide instructions...",
  },
};

export const WithTasks: Story = {
  args: {
    placeholder: "Ask a question or provide instructions...",
    tasks: sampleTasks,
    taskQueueTitle: "(2) pending changes",
  },
};

export const WithHeaderAction: Story = {
  args: {
    placeholder: "Ask a question or provide instructions...",
    tasks: sampleTasks,
    taskQueueTitle: "(2) pending changes",
    taskQueueAction: (
      <Button size="sm" className="h-6 px-2.5 text-xs font-semibold">
        Apply
      </Button>
    ),
  },
};
