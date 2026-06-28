import type React from "react";
import type { WorkflowSwitcherProps } from "../WorkflowSwitcher/WorkflowSwitcher";
import type { ChatToggleButtonProps } from "../ChatToggleButton/ChatToggleButton";

export interface TabItem {
  value: string;
  label: string;
}

export interface AppHeaderProps {
  title?: React.ReactNode;
  actions?: React.ReactNode;
  tabs?: TabItem[];
  defaultTab?: string;
  onTabChange?: (value: string) => void;
  tabsPosition?: 'center' | 'right';
  className?: string;
  showSidebarToggle?: boolean;
  showTitle?: boolean;
  workflowSwitcherProps?: WorkflowSwitcherProps;
  chatToggleProps?: ChatToggleButtonProps;
}
