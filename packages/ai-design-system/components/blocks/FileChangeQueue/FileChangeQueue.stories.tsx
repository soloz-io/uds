import type { Meta, StoryObj } from "@storybook/react";
import { FileChangeQueue } from "./FileChangeQueue";
import type { FileChangeData } from "@/components/composites/FileQueue";

const meta: Meta<typeof FileChangeQueue> = {
  title: "Blocks/FileChangeQueue",
  component: FileChangeQueue,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof FileChangeQueue>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample file changes for stories
const mixedChanges: FileChangeData[] = [
  {
    id: "1",
    filename: "Button.tsx",
    status: "modified",
    path: "src/components/primitives/Button/Button.tsx",
  },
  {
    id: "2",
    filename: "Icon.tsx",
    status: "created",
    path: "src/components/primitives/Icon/Icon.tsx",
  },
  {
    id: "3",
    filename: "FileQueue.tsx",
    status: "created",
    path: "src/components/composites/FileQueue/FileQueue.tsx",
  },
  {
    id: "4",
    filename: "OldComponent.tsx",
    status: "deleted",
    path: "src/components/deprecated/OldComponent.tsx",
  },
  {
    id: "5",
    filename: "README.md",
    status: "modified",
    path: "docs/README.md",
  },
  {
    id: "6",
    filename: "package.json",
    status: "pending",
    path: "package.json",
  },
];

/**
 * Default state - approval requested with mixed file statuses
 */
export const ApprovalRequested: Story = {
  args: {
    changes: mixedChanges,
    title: "Review and approve these file changes",
    state: "approval-requested",
    approval: {},
    onApprove: () => console.log("Approved all changes"),
    onReject: () => console.log("Rejected all changes"),
  },
};

/**
 * Approved state - shows after approval
 */
export const Approved: Story = {
  args: {
    changes: mixedChanges,
    title: "Review and approve these file changes",
    state: "approval-responded",
    approval: { approved: true },
    onApprove: () => console.log("Approved all changes"),
    onReject: () => console.log("Rejected all changes"),
  },
};

/**
 * Rejected state - shows after rejection
 */
export const Rejected: Story = {
  args: {
    changes: mixedChanges,
    title: "Review and approve these file changes",
    state: "approval-responded",
    approval: { approved: false },
    onApprove: () => console.log("Approved all changes"),
    onReject: () => console.log("Rejected all changes"),
  },
};

/**
 * All modified files
 */
export const AllModified: Story = {
  args: {
    changes: [
      {
        id: "1",
        filename: "Button.tsx",
        status: "modified",
        path: "src/components/primitives/Button/Button.tsx",
      },
      {
        id: "2",
        filename: "Input.tsx",
        status: "modified",
        path: "src/components/primitives/Input/Input.tsx",
      },
      {
        id: "3",
        filename: "Card.tsx",
        status: "modified",
        path: "src/components/primitives/Card/Card.tsx",
      },
    ],
    title: "Review modified files",
    state: "approval-requested",
    approval: {},
    onApprove: () => console.log("Approved"),
    onReject: () => console.log("Rejected"),
  },
};

/**
 * Large change set
 */
export const LargeChangeSet: Story = {
  args: {
    changes: [
      ...Array.from({ length: 15 }, (_, i) => ({
        id: `modified-${i}`,
        filename: `Component${i + 1}.tsx`,
        status: "modified" as const,
        path: `src/components/composites/Component${i + 1}/Component${i + 1}.tsx`,
      })),
      ...Array.from({ length: 10 }, (_, i) => ({
        id: `created-${i}`,
        filename: `NewComponent${i + 1}.tsx`,
        status: "created" as const,
        path: `src/components/new/NewComponent${i + 1}/NewComponent${i + 1}.tsx`,
      })),
      ...Array.from({ length: 5 }, (_, i) => ({
        id: `deleted-${i}`,
        filename: `OldComponent${i + 1}.tsx`,
        status: "deleted" as const,
        path: `src/components/deprecated/OldComponent${i + 1}.tsx`,
      })),
    ],
    title: "Review 30 file changes",
    state: "approval-requested",
    approval: {},
    onApprove: () => console.log("Approved"),
    onReject: () => console.log("Rejected"),
  },
};

/**
 * Empty state (no changes) - should not render
 */
export const EmptyState: Story = {
  args: {
    changes: [],
    title: "No changes to review",
    state: "approval-requested",
  },
};

/**
 * Without title
 */
export const WithoutTitle: Story = {
  args: {
    changes: mixedChanges,
    state: "approval-requested",
    approval: {},
    onApprove: () => console.log("Approved"),
    onReject: () => console.log("Rejected"),
  },
};

/**
 * Single file change
 */
export const SingleFile: Story = {
  args: {
    changes: [
      {
        id: "1",
        filename: "Button.tsx",
        status: "modified",
        path: "src/components/primitives/Button/Button.tsx",
      },
    ],
    title: "Review single file change",
    state: "approval-requested",
    approval: {},
    onApprove: () => console.log("Approved"),
    onReject: () => console.log("Rejected"),
  },
};
