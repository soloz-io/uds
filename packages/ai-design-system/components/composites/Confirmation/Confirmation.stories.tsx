import type { Meta, StoryObj } from "@storybook/react";
import { Confirmation } from "./Confirmation";
import * as React from "react";

const meta: Meta<typeof Confirmation> = {
  title: "Blocks/Confirmation",
  component: Confirmation,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Confirmation>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Approval requested state with title and actions
 */
export const ApprovalRequested: Story = {
  args: {
    title: "Do you want to delete this file?",
    state: "approval-requested",
    approval: {},
    onApprove: () => console.log("Approved"),
    onReject: () => console.log("Rejected"),
    children: (
      <p className="text-sm">This action cannot be undone. The file will be permanently deleted.</p>
    ),
  },
};

/**
 * Approved state showing confirmed action
 */
export const Approved: Story = {
  args: {
    title: "File deletion confirmed",
    state: "approval-responded",
    approval: { approved: true },
    onApprove: () => console.log("Approved"),
    onReject: () => console.log("Rejected"),
    children: (
      <p className="text-sm">The file has been successfully deleted.</p>
    ),
  },
};

/**
 * Rejected state showing cancelled action
 */
export const Rejected: Story = {
  args: {
    title: "File deletion cancelled",
    state: "approval-responded",
    approval: { approved: false },
    onApprove: () => console.log("Approved"),
    onReject: () => console.log("Rejected"),
    children: (
      <p className="text-sm">The file has not been deleted.</p>
    ),
  },
};

/**
 * Interactive example with state management
 */
export const WithStateManagement: Story = {
  render: () => {
    const [state, setState] = React.useState<"approval-requested" | "approval-responded">("approval-requested");
    const [approval, setApproval] = React.useState<{ approved: boolean } | undefined>(undefined);

    const handleApprove = () => {
      setState("approval-responded");
      setApproval({ approved: true });
      console.log("Approved");
    };

    const handleReject = () => {
      setState("approval-responded");
      setApproval({ approved: false });
      console.log("Rejected");
    };

    const handleReset = () => {
      setState("approval-requested");
      setApproval(undefined);
    };

    return (
      <div className="space-y-4">
        {state === "approval-responded" && (
          <div className="rounded-md border border-border bg-muted p-4">
            <p className="text-sm">
              {approval?.approved && "✅ Action approved!"}
              {approval?.approved === false && "❌ Action rejected!"}
            </p>
            <button
              onClick={handleReset}
              className="mt-2 text-sm text-primary underline"
            >
              Reset to approval requested
            </button>
          </div>
        )}

        <Confirmation
          title="Review and confirm this action"
          state={state}
          approval={approval}
          onApprove={handleApprove}
          onReject={handleReject}
        >
          <p className="text-sm">This is the content that needs approval. Click the buttons below to approve or reject.</p>
        </Confirmation>
      </div>
    );
  },
};

/**
 * Without title - content only
 */
export const WithoutTitle: Story = {
  args: {
    state: "approval-requested",
    approval: {},
    onApprove: () => console.log("Approved"),
    onReject: () => console.log("Rejected"),
    children: (
      <>
        <p className="text-sm font-medium">Are you sure you want to proceed?</p>
        <p className="text-xs text-muted-foreground mt-1">This action cannot be undone.</p>
      </>
    ),
  },
};

/**
 * With only approve action
 */
export const OnlyApprove: Story = {
  args: {
    title: "Acknowledge this message",
    state: "approval-requested",
    approval: {},
    onApprove: () => console.log("Acknowledged"),
    children: (
      <p className="text-sm">Please review this information before continuing.</p>
    ),
  },
};
