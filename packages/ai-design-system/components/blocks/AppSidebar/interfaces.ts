import type { NavigationItem } from "@/components/composites/NavigationList/interfaces";
import type { SidebarProps } from "@/components/primitives/Sidebar";

export interface NavigationGroup {
  label: string;
  items: NavigationItem[];
}

export interface AppSidebarProps {
  logo?: {
    icon: string;
    text: string;
    href: string;
  };
  mainNavigation?: NavigationItem[];
  navigationGroups?: NavigationGroup[];
  secondaryNavigation?: NavigationItem[];
  documents?: NavigationItem[];
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  variant?: SidebarProps["variant"];
  collapsible?: SidebarProps["collapsible"];
  userActions?: { label: string; onClick: () => void }[];
  className?: string;
}
