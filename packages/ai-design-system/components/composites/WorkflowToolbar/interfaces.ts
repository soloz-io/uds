import type React from "react";

export interface WorkflowVersion {
  id: string;
  label: string;
}

export interface ToolbarActionSwitcherItem {
  label: string;
  value: string;
}

export interface ToolbarActionSwitcher {
  items: ToolbarActionSwitcherItem[];
  /** The highlighted row — what picking does, not what is true. */
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /**
   * The item that is currently TRUE, if any — as opposed to the one highlighted.
   *
   * Supplying it moves the check mark off the selected row and onto this one,
   * so a tick states a fact about the item rather than about the cursor.
   *
   * Three-valued on purpose. `undefined` = this caller does not use the
   * feature, so the tick follows the selection as it always did. `null` = the
   * caller uses it and none of the items is current, so NOTHING is marked —
   * the answer the selection-driven check could never give, and the one the
   * snapshot picker needs while there is unsaved work.
   */
  currentValue?: string | null;
}

export interface ToolbarAction {
  id: string;
  icon: string | React.ReactNode;
  title: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  indicator?: boolean;
  switcher?: ToolbarActionSwitcher;
}

export interface WorkflowToolbarActionsProps {
  actionGroups?: ToolbarAction[][];
  className?: string;
}

export interface WorkflowToolbarProps {
  workflowName?: string;
  hideWorkflowName?: boolean;
  versions?: WorkflowVersion[];
  currentVersionId?: string;
  onVersionSelect?: (versionId: string) => void;
  actionGroups?: ToolbarAction[][];
  className?: string;
}
