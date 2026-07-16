import * as React from "react"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/primitives/Sidebar"
import { Icon } from "@/components/primitives/Icon"
import { NavigationList } from "@/components/composites/NavigationList"
import { NavUser } from "@/components/composites/NavUser"
import type { AppSidebarProps } from "./interfaces"

export const AppSidebar = React.memo<AppSidebarProps>(
  ({
    logo,
    mainNavigation,
    navigationGroups,
    secondaryNavigation,
    documents,
    user,
    userActions,
    variant = "inset",
    collapsible = "offcanvas",
    ...props
  }) => {
    return (
      <Sidebar {...props} variant={variant} collapsible={collapsible}>
        <SidebarHeader>
          {logo && (
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
                  <a href={logo.href}>
                    <Icon name={logo.icon} className="!size-5" />
                    <span className="text-base font-semibold">{logo.text}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          )}
        </SidebarHeader>

        <SidebarContent>
          {mainNavigation && mainNavigation.length > 0 && (
            <SidebarGroup>
              <SidebarGroupContent>
                <NavigationList items={mainNavigation} />
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {navigationGroups?.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <NavigationList items={group.items} />
              </SidebarGroupContent>
            </SidebarGroup>
          ))}

          {documents && documents.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel>Documents</SidebarGroupLabel>
              <SidebarGroupContent>
                <NavigationList items={documents} />
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {secondaryNavigation && secondaryNavigation.length > 0 && (
            <SidebarGroup>
              <SidebarGroupContent className="mt-auto">
                <NavigationList items={secondaryNavigation} />
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>

        <SidebarFooter>
          <NavUser user={user} actions={userActions} />
        </SidebarFooter>
      </Sidebar>
    )
  }
)

AppSidebar.displayName = "AppSidebar"
