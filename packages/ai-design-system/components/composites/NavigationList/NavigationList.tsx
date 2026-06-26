import * as React from "react"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/primitives/Sidebar"
import { Icon } from "@/components/primitives/Icon"

export interface NavigationItem {
  key?: string
  title: string
  url: string
  icon?: string
  isActive?: boolean
  onClick?: (e: React.MouseEvent) => void
}

export interface NavigationListProps {
  items: NavigationItem[]
  onItemClick?: (item: NavigationItem) => void
  className?: string
}

export const NavigationList = React.memo<NavigationListProps>(
  ({ items, onItemClick, className }) => {
    return (
      <SidebarMenu className={className}>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              tooltip={item.title}
              isActive={item.isActive}
              onClick={(e) => {
                if (item.onClick) {
                  e.preventDefault();
                  item.onClick(e);
                }
                onItemClick?.(item)
              }}
              asChild
            >
              <a href={item.url}>
                {item.icon && <Icon name={item.icon} />}
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    )
  }
)

NavigationList.displayName = "NavigationList"
