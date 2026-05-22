import * as React from "react"
import {
  Tabs as ShadcnTabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../ui/tabs"

/**
 * Tabs Primitive
 *
 * A foundational tabs component for organizing content into switchable panels.
 * Built on Radix UI Tabs primitive with WCAG 2.1 Level AA compliance.
 *
 * ## Accessibility Features
 * - Arrow key navigation between tabs
 * - Home/End keys for first/last tab
 * - Automatic ARIA attributes (role="tablist", "tab", "tabpanel")
 * - Focus management and keyboard support
 * - Screen reader announcements
 *
 * @example
 * ```tsx
 * <Tabs defaultValue="tab1">
 *   <TabsList>
 *     <TabsTrigger value="tab1">Tab 1</TabsTrigger>
 *     <TabsTrigger value="tab2">Tab 2</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="tab1">Content 1</TabsContent>
 *   <TabsContent value="tab2">Content 2</TabsContent>
 * </Tabs>
 * ```
 *
 * @see https://ui.shadcn.com/docs/components/tabs
 * @see https://www.radix-ui.com/primitives/docs/components/tabs
 */

export type TabsProps = React.ComponentProps<typeof ShadcnTabs>
export type TabsListProps = React.ComponentProps<typeof TabsList>
export type TabsTriggerProps = React.ComponentProps<typeof TabsTrigger>
export type TabsContentProps = React.ComponentProps<typeof TabsContent>

/**
 * Tabs component
 *
 * A tabs component for organizing content into switchable panels.
 * Built on Radix UI Tabs primitive with full accessibility support.
 *
 * Features:
 * - Arrow key navigation between tabs
 * - Home/End keys for first/last tab
 * - Automatic ARIA attributes
 * - Focus management
 * - Screen reader support
 * - Horizontal and vertical orientation
 * - Dark mode support
 */
export const Tabs = React.forwardRef<
  React.ElementRef<typeof ShadcnTabs>,
  TabsProps
>((props, ref) => {
  return <ShadcnTabs {...props} />
})

Tabs.displayName = "Tabs"

/**
 * Re-export Tabs sub-components for composition
 */
export { TabsContent, TabsList, TabsTrigger }
