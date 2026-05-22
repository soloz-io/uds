import * as React from "react"
import {
  DropdownMenu as ShadcnDropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu"

/**
 * DropdownMenu Primitive
 *
 * Displays a menu with actions or options triggered by a button.
 * Built on Radix UI DropdownMenu primitive with WCAG 2.1 Level AA compliance.
 *
 * @see https://ui.shadcn.com/docs/components/dropdown-menu
 * @see https://www.radix-ui.com/primitives/docs/components/dropdown-menu
 */

export type DropdownMenuProps = React.ComponentProps<typeof ShadcnDropdownMenu>

/**
 * DropdownMenu component
 *
 * Displays a menu with actions or options triggered by a button.
 * Built on Radix UI DropdownMenu primitive with full accessibility support.
 *
 * Features:
 * - Keyboard navigation
 * - Checkbox and radio item support
 * - Submenu support
 * - Keyboard shortcuts display
 * - ARIA attributes
 * - Dark mode support
 */
export const DropdownMenu = React.forwardRef<
  React.ElementRef<typeof ShadcnDropdownMenu>,
  DropdownMenuProps
>((props, ref) => {
  return <ShadcnDropdownMenu {...props} />
})

DropdownMenu.displayName = "DropdownMenu"

/**
 * Re-export DropdownMenu sub-components for composition
 */
export {
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
}
