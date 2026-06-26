export interface NavigationItem {
  title: string;
  url: string;
  icon?: string;
  isActive?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  items?: NavigationItem[];
}
