import * as React from "react"
import {
  Drawer as ShadcnDrawer,
  DrawerPortal as ShadcnDrawerPortal,
  DrawerOverlay as ShadcnDrawerOverlay,
  DrawerTrigger as ShadcnDrawerTrigger,
  DrawerClose as ShadcnDrawerClose,
  DrawerContent as ShadcnDrawerContent,
  DrawerHeader as ShadcnDrawerHeader,
  DrawerFooter as ShadcnDrawerFooter,
  DrawerTitle as ShadcnDrawerTitle,
  DrawerDescription as ShadcnDrawerDescription,
} from "../../ui/drawer"

/**
 * Drawer Primitive
 *
 * A foundational drawer component that wraps shadcn/ui Drawer with design system
 * enhancements. This primitive serves as the single source of truth for all drawer
 * interactions across the application.
 *
 * @example
 * ```tsx
 * <Drawer>
 *   <DrawerTrigger>Open Drawer</DrawerTrigger>
 *   <DrawerContent>
 *     <DrawerHeader>
 *       <DrawerTitle>Drawer Title</DrawerTitle>
 *       <DrawerDescription>Drawer description</DrawerDescription>
 *     </DrawerHeader>
 *     <div>Drawer content</div>
 *     <DrawerFooter>
 *       <DrawerClose>Close</DrawerClose>
 *     </DrawerFooter>
 *   </DrawerContent>
 * </Drawer>
 * ```
 *
 * @see https://ui.shadcn.com/docs/components/drawer - shadcn/ui Drawer documentation
 */

/**
 * Drawer component props
 */
export type DrawerProps = React.ComponentProps<typeof ShadcnDrawer>

/**
 * Drawer component
 *
 * A drawer component for displaying content in a slide-out panel, built on shadcn/ui foundation.
 *
 * Features:
 * - Slide-out panel from bottom (mobile-first)
 * - Backdrop overlay
 * - Keyboard navigation support
 * - Focus management
 * - Dark mode support
 */
export const Drawer = ShadcnDrawer

Drawer.displayName = "Drawer"

/**
 * DrawerPortal component
 *
 * Portal component for rendering drawer content in a portal.
 */
export const DrawerPortal = ShadcnDrawerPortal

;(DrawerPortal as React.ComponentType & { displayName?: string }).displayName = "DrawerPortal"

/**
 * DrawerOverlay component props
 */
export type DrawerOverlayProps = React.ComponentPropsWithoutRef<typeof ShadcnDrawerOverlay>

/**
 * DrawerOverlay component
 *
 * Backdrop overlay for the drawer.
 */
export const DrawerOverlay = React.memo(
  React.forwardRef<
    React.ElementRef<typeof ShadcnDrawerOverlay>,
    DrawerOverlayProps
  >((props, ref) => {
    return <ShadcnDrawerOverlay ref={ref} {...props} />
  })
)

DrawerOverlay.displayName = "DrawerOverlay"

/**
 * DrawerTrigger component
 *
 * Button that triggers the drawer to open.
 */
export const DrawerTrigger = ShadcnDrawerTrigger

DrawerTrigger.displayName = "DrawerTrigger"

/**
 * DrawerClose component
 *
 * Button that closes the drawer.
 */
export const DrawerClose = ShadcnDrawerClose

DrawerClose.displayName = "DrawerClose"

/**
 * DrawerContent component props
 */
export type DrawerContentProps = React.ComponentPropsWithoutRef<typeof ShadcnDrawerContent>

/**
 * DrawerContent component
 *
 * Container for drawer content with proper styling and animations.
 */
export const DrawerContent = React.memo(
  React.forwardRef<
    React.ElementRef<typeof ShadcnDrawerContent>,
    DrawerContentProps
  >((props, ref) => {
    return <ShadcnDrawerContent ref={ref} {...props} />
  })
)

DrawerContent.displayName = "DrawerContent"

/**
 * DrawerHeader component props
 */
export type DrawerHeaderProps = React.HTMLAttributes<HTMLDivElement>

/**
 * DrawerHeader component
 *
 * Header section of the drawer for title and description.
 */
export const DrawerHeader = React.memo<DrawerHeaderProps>((props) => {
  return <ShadcnDrawerHeader {...props} />
})

DrawerHeader.displayName = "DrawerHeader"

/**
 * DrawerFooter component props
 */
export type DrawerFooterProps = React.HTMLAttributes<HTMLDivElement>

/**
 * DrawerFooter component
 *
 * Footer section of the drawer for actions.
 */
export const DrawerFooter = React.memo<DrawerFooterProps>((props) => {
  return <ShadcnDrawerFooter {...props} />
})

DrawerFooter.displayName = "DrawerFooter"

/**
 * DrawerTitle component props
 */
export type DrawerTitleProps = React.ComponentPropsWithoutRef<typeof ShadcnDrawerTitle>

/**
 * DrawerTitle component
 *
 * Title of the drawer for accessibility.
 */
export const DrawerTitle = React.memo(
  React.forwardRef<
    React.ElementRef<typeof ShadcnDrawerTitle>,
    DrawerTitleProps
  >((props, ref) => {
    return <ShadcnDrawerTitle ref={ref} {...props} />
  })
)

DrawerTitle.displayName = "DrawerTitle"

/**
 * DrawerDescription component props
 */
export type DrawerDescriptionProps = React.ComponentPropsWithoutRef<typeof ShadcnDrawerDescription>

/**
 * DrawerDescription component
 *
 * Description of the drawer for accessibility.
 */
export const DrawerDescription = React.memo(
  React.forwardRef<
    React.ElementRef<typeof ShadcnDrawerDescription>,
    DrawerDescriptionProps
  >((props, ref) => {
    return <ShadcnDrawerDescription ref={ref} {...props} />
  })
)

DrawerDescription.displayName = "DrawerDescription"
