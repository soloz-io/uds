import type React from "react";
import type { ButtonSwitcherProps } from "@/components/composites/ButtonSwitcher/ButtonSwitcher";
import type { ChatToggleButtonProps } from "@/components/composites/ChatToggleButton/ChatToggleButton";

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
  tabsPosition?: 'left' | 'center' | 'right';
  className?: string;
  showSidebarToggle?: boolean;
  showTitle?: boolean;
  buttonSwitcherProps?: ButtonSwitcherProps;
  chatToggleProps?: ChatToggleButtonProps;
}
