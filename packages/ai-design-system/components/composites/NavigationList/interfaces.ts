export interface NavigationItem {
  title: string;
  url: string;
  icon?: string;
  isActive?: boolean;
  items?: NavigationItem[];
}
