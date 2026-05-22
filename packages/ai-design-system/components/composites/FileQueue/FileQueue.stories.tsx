import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { FileQueue, type FileGroup } from "./FileQueue";

const meta: Meta<typeof FileQueue> = {
  title: "Blocks/FileQueue",
  component: FileQueue,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    groups: {
      description: "Array of file groups to display with customizable titles, icons, and files",
    },
    selectedFileId: {
      description: "ID of currently selected file for visual highlighting",
    },
    onFileSelect: {
      description: "Callback function invoked when a file is selected",
    },
    className: {
      description: "Additional CSS classes for custom styling",
    },
  },
} satisfies Meta<typeof FileQueue>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample file groups for stories
const sampleGroups: FileGroup[] = [
  {
    id: "requirements",
    title: "Requirements",
    icon: "file-text",
    iconColor: "text-blue-600 dark:text-blue-500",
    files: [
      { id: "req1", name: "requirements.md", path: ".kiro/specs/feature/" },
      { id: "req2", name: "user-stories.md", path: ".kiro/specs/feature/" },
      { id: "req3", name: "acceptance-criteria.md", path: ".kiro/specs/feature/" },
    ],
    defaultOpen: true,
  },
  {
    id: "design",
    title: "Design",
    icon: "layout",
    iconColor: "text-purple-600 dark:text-purple-500",
    files: [
      { id: "design1", name: "design.md", path: ".kiro/specs/feature/" },
      { id: "design2", name: "architecture.md", path: ".kiro/specs/feature/" },
    ],
    defaultOpen: false,
  },
  {
    id: "tasks",
    title: "Tasks",
    icon: "check-square",
    iconColor: "text-green-600 dark:text-green-500",
    files: [
      { id: "task1", name: "tasks.md", path: ".kiro/specs/feature/" },
      { id: "task2", name: "implementation-plan.md", path: ".kiro/specs/feature/" },
    ],
    defaultOpen: false,
  },
];

/**
 * Default story demonstrating multiple file groups with different icons and colors.
 * Shows the generic grouping capability with customizable group properties.
 */
export const Default: Story = {
  args: {
    groups: sampleGroups,
  },
};

/**
 * Empty state with no file groups.
 * Demonstrates how the component handles an empty groups array.
 */
export const Empty: Story = {
  args: {
    groups: [],
  },
};

/**
 * Single group with multiple files.
 * Shows the component with only one file group, useful for focused displays.
 */
export const SingleGroup: Story = {
  args: {
    groups: [
      {
        id: "components",
        title: "Components",
        icon: "box",
        iconColor: "text-orange-600 dark:text-orange-500",
        files: [
          { id: "comp1", name: "Button.tsx", path: "src/components/primitives/" },
          { id: "comp2", name: "Input.tsx", path: "src/components/primitives/" },
          { id: "comp3", name: "Card.tsx", path: "src/components/primitives/" },
        ],
        defaultOpen: true,
      },
    ],
  },
};

/**
 * Multiple groups demonstrating various use cases.
 * Shows different group configurations including groups without icons.
 */
export const MultipleGroups: Story = {
  args: {
    groups: [
      {
        id: "modified",
        title: "Modified Files",
        icon: "file-text",
        iconColor: "text-blue-600 dark:text-blue-500",
        files: [
          { id: "mod1", name: "Button.tsx", path: "src/components/" },
          { id: "mod2", name: "Input.tsx", path: "src/components/" },
        ],
        defaultOpen: true,
      },
      {
        id: "created",
        title: "Created Files",
        icon: "plus",
        iconColor: "text-green-600 dark:text-green-500",
        files: [
          { id: "new1", name: "Icon.tsx", path: "src/components/" },
          { id: "new2", name: "Badge.tsx", path: "src/components/" },
        ],
        defaultOpen: false,
      },
      {
        id: "documentation",
        title: "Documentation",
        files: [
          { id: "doc1", name: "README.md" },
          { id: "doc2", name: "CONTRIBUTING.md" },
        ],
        defaultOpen: false,
      },
    ],
  },
};

/**
 * File selection with interactive state management.
 * Demonstrates the selection functionality with visual highlighting and click handling.
 * Uses React state to manage the selected file ID.
 */
export const WithSelection: Story = {
  render: () => {
    const [selectedFileId, setSelectedFileId] = useState<string>("req1");

    return (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Selected file: <span className="font-mono">{selectedFileId}</span>
        </div>
        <FileQueue
          groups={sampleGroups}
          selectedFileId={selectedFileId}
          onFileSelect={setSelectedFileId}
        />
      </div>
    );
  },
};
