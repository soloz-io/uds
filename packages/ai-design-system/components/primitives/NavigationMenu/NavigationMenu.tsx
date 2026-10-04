import * as React from "react"
import {
  NavigationMenu as ShadcnNavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "../../ui/navigation-menu"

/**
 * NavigationMenu Primitive
 *
 * A collection of links and dropdown panels for navigating websites and applications.
 * Built on Radix UI NavigationMenu primitive with full accessibility support.
 *
 * @see https://ui.shadcn.com/docs/components/navigation-menu
 */

export type NavigationMenuProps = React.ComponentProps<typeof ShadcnNavigationMenu>
export type NavigationMenuListProps = React.ComponentProps<typeof NavigationMenuList>
export type NavigationMenuItemProps = React.ComponentProps<typeof NavigationMenuItem>
export type NavigationMenuContentProps = React.ComponentProps<typeof NavigationMenuContent>
export type NavigationMenuTriggerProps = React.ComponentProps<typeof NavigationMenuTrigger>
export type NavigationMenuLinkProps = React.ComponentProps<typeof NavigationMenuLink>
export type NavigationMenuIndicatorProps = React.ComponentProps<typeof NavigationMenuIndicator>
export type NavigationMenuViewportProps = React.ComponentProps<typeof NavigationMenuViewport>

export const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof ShadcnNavigationMenu>,
  NavigationMenuProps
>((props, ref) => {
  return <ShadcnNavigationMenu ref={ref} {...props} />
})

NavigationMenu.displayName = "NavigationMenu"

export {
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
}
