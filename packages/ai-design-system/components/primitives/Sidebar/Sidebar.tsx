import * as React from "react"
import {
  Sidebar as ShadcnSidebar,
  SidebarContent as ShadcnSidebarContent,
  SidebarFooter as ShadcnSidebarFooter,
  SidebarGroup as ShadcnSidebarGroup,
  SidebarGroupAction as ShadcnSidebarGroupAction,
  SidebarGroupContent as ShadcnSidebarGroupContent,
  SidebarGroupLabel as ShadcnSidebarGroupLabel,
  SidebarHeader as ShadcnSidebarHeader,
  SidebarInset as ShadcnSidebarInset,
  SidebarMenu as ShadcnSidebarMenu,
  SidebarMenuButton as ShadcnSidebarMenuButton,
  SidebarMenuItem as ShadcnSidebarMenuItem,
  SidebarProvider as ShadcnSidebarProvider,
  SidebarSeparator as ShadcnSidebarSeparator,
  SidebarTrigger as ShadcnSidebarTrigger,
  useSidebar,
} from "../../ui/sidebar"

/**
 * Sidebar Primitive
 *
 * A foundational sidebar component that wraps shadcn/ui Sidebar with design system
 * enhancements. This primitive serves as the single source of truth for all sidebar
 * navigation across the application.
 *
 * @example
 * ```tsx
 * <SidebarProvider>
 *   <Sidebar>
 *     <SidebarHeader>Header</SidebarHeader>
 *     <SidebarContent>
 *       <SidebarMenu>
 *         <SidebarMenuItem>
 *           <SidebarMenuButton>Item</SidebarMenuButton>
 *         </SidebarMenuItem>
 *       </SidebarMenu>
 *     </SidebarContent>
 *   </Sidebar>
 *   <SidebarInset>Main content</SidebarInset>
 * </SidebarProvider>
 * ```
 *
 * @see https://ui.shadcn.com/docs/components/sidebar - shadcn/ui Sidebar documentation
 */

/**
 * SidebarProvider component props
 */
export type SidebarProviderProps = React.ComponentProps<typeof ShadcnSidebarProvider>

/**
 * SidebarProvider component
 *
 * Context provider for sidebar state management.
 */
export const SidebarProvider = ShadcnSidebarProvider

SidebarProvider.displayName = "SidebarProvider"

/**
 * Sidebar component props
 */
export type SidebarProps = React.ComponentProps<typeof ShadcnSidebar>

/**
 * Sidebar component
 *
 * Main sidebar container with collapsible behavior.
 */
export const Sidebar = React.memo(
  React.forwardRef<HTMLDivElement, SidebarProps>((props, ref) => {
    return <ShadcnSidebar ref={ref} {...props} />
  })
)

Sidebar.displayName = "Sidebar"

/**
 * SidebarInset component props
 */
export type SidebarInsetProps = React.ComponentProps<typeof ShadcnSidebarInset>

/**
 * SidebarInset component
 *
 * Main content area that adjusts based on sidebar state.
 */
export const SidebarInset = React.memo(
  React.forwardRef<HTMLDivElement, SidebarInsetProps>((props, ref) => {
    return <ShadcnSidebarInset ref={ref} {...props} />
  })
)

SidebarInset.displayName = "SidebarInset"

/**
 * SidebarHeader component props
 */
export type SidebarHeaderProps = React.ComponentProps<typeof ShadcnSidebarHeader>

/**
 * SidebarHeader component
 *
 * Header section of the sidebar.
 */
export const SidebarHeader = React.memo(
  React.forwardRef<HTMLDivElement, SidebarHeaderProps>((props, ref) => {
    return <ShadcnSidebarHeader ref={ref} {...props} />
  })
)

SidebarHeader.displayName = "SidebarHeader"

/**
 * SidebarContent component props
 */
export type SidebarContentProps = React.ComponentProps<typeof ShadcnSidebarContent>

/**
 * SidebarContent component
 *
 * Scrollable content area of the sidebar.
 */
export const SidebarContent = React.memo(
  React.forwardRef<HTMLDivElement, SidebarContentProps>((props, ref) => {
    return <ShadcnSidebarContent ref={ref} {...props} />
  })
)

SidebarContent.displayName = "SidebarContent"

/**
 * SidebarFooter component props
 */
export type SidebarFooterProps = React.ComponentProps<typeof ShadcnSidebarFooter>

/**
 * SidebarFooter component
 *
 * Footer section of the sidebar.
 */
export const SidebarFooter = React.memo(
  React.forwardRef<HTMLDivElement, SidebarFooterProps>((props, ref) => {
    return <ShadcnSidebarFooter ref={ref} {...props} />
  })
)

SidebarFooter.displayName = "SidebarFooter"

/**
 * SidebarMenu component props
 */
export type SidebarMenuProps = React.ComponentProps<typeof ShadcnSidebarMenu>

/**
 * SidebarMenu component
 *
 * Container for sidebar menu items.
 */
export const SidebarMenu = React.memo(
  React.forwardRef<HTMLUListElement, SidebarMenuProps>((props, ref) => {
    return <ShadcnSidebarMenu ref={ref} {...props} />
  })
)

SidebarMenu.displayName = "SidebarMenu"

/**
 * SidebarMenuItem component props
 */
export type SidebarMenuItemProps = React.ComponentProps<typeof ShadcnSidebarMenuItem>

/**
 * SidebarMenuItem component
 *
 * Individual menu item in the sidebar.
 */
export const SidebarMenuItem = React.memo(
  React.forwardRef<HTMLLIElement, SidebarMenuItemProps>((props, ref) => {
    return <ShadcnSidebarMenuItem ref={ref} {...props} />
  })
)

SidebarMenuItem.displayName = "SidebarMenuItem"

/**
 * SidebarMenuButton component props
 */
export type SidebarMenuButtonProps = React.ComponentProps<typeof ShadcnSidebarMenuButton>

/**
 * SidebarMenuButton component
 *
 * Button for sidebar menu items with tooltip support.
 */
export const SidebarMenuButton = React.memo(
  React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>((props, ref) => {
    return <ShadcnSidebarMenuButton ref={ref} {...props} />
  })
)

SidebarMenuButton.displayName = "SidebarMenuButton"

/**
 * SidebarTrigger component props
 */
export type SidebarTriggerProps = React.ComponentProps<typeof ShadcnSidebarTrigger>

/**
 * SidebarTrigger component
 *
 * Button to toggle sidebar open/closed.
 */
export const SidebarTrigger = React.memo(
  React.forwardRef<HTMLButtonElement, SidebarTriggerProps>((props, ref) => {
    return <ShadcnSidebarTrigger ref={ref} {...props} />
  })
)

SidebarTrigger.displayName = "SidebarTrigger"

/**
 * SidebarGroup component props
 */
export type SidebarGroupProps = React.ComponentProps<typeof ShadcnSidebarGroup>

/**
 * SidebarGroup component
 *
 * Groups related sidebar items together.
 */
export const SidebarGroup = React.memo(
  React.forwardRef<HTMLDivElement, SidebarGroupProps>((props, ref) => {
    return <ShadcnSidebarGroup ref={ref} {...props} />
  })
)

SidebarGroup.displayName = "SidebarGroup"

/**
 * SidebarGroupContent component props
 */
export type SidebarGroupContentProps = React.ComponentProps<typeof ShadcnSidebarGroupContent>

/**
 * SidebarGroupContent component
 *
 * Content area for sidebar groups.
 */
export const SidebarGroupContent = React.memo(
  React.forwardRef<HTMLDivElement, SidebarGroupContentProps>((props, ref) => {
    return <ShadcnSidebarGroupContent ref={ref} {...props} />
  })
)

SidebarGroupContent.displayName = "SidebarGroupContent"

/**
 * SidebarGroupLabel component props
 */
export type SidebarGroupLabelProps = React.ComponentProps<typeof ShadcnSidebarGroupLabel>

/**
 * SidebarGroupLabel component
 *
 * Label for sidebar groups.
 */
export const SidebarGroupLabel = React.memo(
  React.forwardRef<HTMLDivElement, SidebarGroupLabelProps>((props, ref) => {
    return <ShadcnSidebarGroupLabel ref={ref} {...props} />
  })
)

SidebarGroupLabel.displayName = "SidebarGroupLabel"

/**
 * SidebarGroupAction component props
 */
export type SidebarGroupActionProps = React.ComponentProps<typeof ShadcnSidebarGroupAction>

/**
 * SidebarGroupAction component
 *
 * Action button for sidebar groups.
 */
export const SidebarGroupAction = React.memo(
  React.forwardRef<HTMLButtonElement, SidebarGroupActionProps>((props, ref) => {
    return <ShadcnSidebarGroupAction ref={ref} {...props} />
  })
)

SidebarGroupAction.displayName = "SidebarGroupAction"

/**
 * SidebarSeparator component props
 */
export type SidebarSeparatorProps = React.ComponentProps<typeof ShadcnSidebarSeparator>

/**
 * SidebarSeparator component
 *
 * Visual separator for sidebar sections.
 */
export const SidebarSeparator = React.memo(
  React.forwardRef<HTMLHRElement, SidebarSeparatorProps>((props, ref) => {
    return <ShadcnSidebarSeparator ref={ref} {...props} />
  })
)

SidebarSeparator.displayName = "SidebarSeparator"

/**
 * Re-export useSidebar hook for accessing sidebar state
 */
export { useSidebar }
