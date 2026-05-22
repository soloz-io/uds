import type React from "react";

export interface WorkflowVersion {
  id: string;
  label: string;
}

export interface ToolbarAction {
  id: string;
  icon: string | React.ReactNode;
  title: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  indicator?: boolean;
}

export interface WorkflowToolbarActionsProps {
  actionGroups?: ToolbarAction[][];
  className?: string;
}

export interface WorkflowToolbarProps {
  workflowName?: string;
  versions?: WorkflowVersion[];
  currentVersionId?: string;
  onVersionSelect?: (versionId: string) => void;
  actionGroups?: ToolbarAction[][];
  className?: string;
}
