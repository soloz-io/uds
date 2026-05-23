import type { Meta, StoryObj } from "@storybook/react";
import { SpecNavigator } from "./SpecNavigator";
import { useSpecNavigatorMock } from "./useSpecNavigator.mock";
import { sampleSpecGroups, emptySpecGroups } from "./SpecNavigator.mocks";

const meta: Meta<typeof SpecNavigator> = {
  title: "Features/SpecNavigator",
  component: SpecNavigator,
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    groups: {
      description: "Array of file groups representing specification categories",
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
} satisfies Meta<typeof SpecNavigator>;

export default meta;
type Story = StoryObj<typeof meta>;

function SpecNavigatorStateManagementStory() {
  const { groups, selectedFileId, loading, handleFileSelect } =
    useSpecNavigatorMock({
      initialGroups: sampleSpecGroups,
      initialSelectedId: "req1",
    });

  return (
    <div className="h-screen w-full p-4">
      <div className="mb-4 rounded-lg border border-border bg-muted/50 p-4">
        <h3 className="mb-2 font-semibold text-sm">State Management Demo</h3>
        <div className="space-y-1 text-muted-foreground text-xs">
          <p>
            <strong>Selected File:</strong> {selectedFileId || "None selected"}
          </p>
          <p>
            <strong>Loading:</strong> {loading ? "Yes" : "No"}
          </p>
          <p>
            <strong>Total Groups:</strong> {groups.length}
          </p>
          <p className="mt-2 text-foreground/70">
            Click any file to update selection state and open a dialog preview.
            The mock hook manages state transitions just like a real
            application hook would.
          </p>
        </div>
      </div>
      <SpecNavigator
        groups={groups}
        selectedFileId={selectedFileId}
        onFileSelect={handleFileSelect}
      />
    </div>
  );
}

/**
 * Default story demonstrating spec file navigation with multiple categories.
 * Shows Instructions, Agents, Toolbox, and Triggers groups with sample specification files.
 */
export const Default: Story = {
  args: {
    groups: sampleSpecGroups,
  },
};

/**
 * Empty state with groups but no files.
 * Demonstrates how the component handles groups with empty file arrays,
 * showing placeholder text for each group.
 */
export const Empty: Story = {
  args: {
    groups: emptySpecGroups,
  },
};

/**
 * File selection with controlled state.
 * Demonstrates the selection functionality with visual highlighting and click handling.
 * Shows how selectedFileId and onFileSelect props work together.
 */
export const WithSelection: Story = {
  args: {
    groups: sampleSpecGroups,
    selectedFileId: "req1",
    onFileSelect: (fileId: string) => {
      console.log("Selected file:", fileId);
    },
  },
};

/**
 * Interactive state management demonstration using mock hook.
 *
 * This story demonstrates realistic state management patterns using the
 * useMockSpecNavigator hook. It shows how file selection state transitions
 * work in practice, with visual feedback and interactive behavior.
 *
 * The mock hook simulates what a real application hook would do:
 * - Manage file selection state
 * - Handle file selection events
 * - Provide loading states (simulated as false in mock)
 * - Transform data into FileGroup format
 *
 * Use this as a reference implementation when building real application hooks
 * that integrate with APIs, routing, or other state management systems.
 *
 * Try clicking different files to see the selection state update in real-time.
 */
export const WithStateManagement: Story = {
  render: () => <SpecNavigatorStateManagementStory />,
};
