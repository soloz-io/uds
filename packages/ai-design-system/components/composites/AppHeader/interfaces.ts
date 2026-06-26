import type React from "react";

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
}
