import type { NavigationItem } from "@/components/composites/NavigationList/interfaces";
import type { SidebarProps } from "@/components/primitives/Sidebar";

export interface AppSidebarProps {
  logo?: {
    icon: string;
    text: string;
    href: string;
  };
  mainNavigation: NavigationItem[];
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
