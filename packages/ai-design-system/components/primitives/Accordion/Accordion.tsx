import * as React from "react"
import {
  Accordion as ShadcnAccordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion"

/**
 * Accordion Primitive
 *
 * A foundational accordion component for collapsible content sections.
 * Built on Radix UI Accordion primitive with WCAG 2.1 Level AA compliance.
 *
 * ## Accessibility Features
 * - Keyboard navigation (Tab, Space, Enter, Arrow keys)
 * - Proper ARIA attributes (aria-expanded, aria-controls)
 * - Focus management
 * - Screen reader support
 *
 * @example
 * ```tsx
 * <Accordion type="single" collapsible>
 *   <AccordionItem value="item-1">
 *     <AccordionTrigger>Section 1</AccordionTrigger>
 *     <AccordionContent>Content 1</AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 * ```
 *
 * @see https://ui.shadcn.com/docs/components/accordion
 * @see https://www.radix-ui.com/primitives/docs/components/accordion
 */

export type AccordionProps = React.ComponentProps<typeof ShadcnAccordion>
export type AccordionItemProps = React.ComponentProps<typeof AccordionItem>
export type AccordionTriggerProps = React.ComponentProps<typeof AccordionTrigger>
export type AccordionContentProps = React.ComponentProps<typeof AccordionContent>

/**
 * Accordion component
 *
 * A collapsible content container built on Radix UI Accordion primitive.
 * Supports both single and multiple item expansion.
 *
 * Features:
 * - Keyboard navigation (Tab, Space, Enter, Arrow keys)
 * - Proper ARIA attributes
 * - Focus management
 * - Screen reader support
 * - Smooth animations
 * - Dark mode support
 */
export const Accordion = React.forwardRef<
  React.ElementRef<typeof ShadcnAccordion>,
  AccordionProps
>((props, ref) => {
  return <ShadcnAccordion {...props} />
})

Accordion.displayName = "Accordion"

/**
 * Re-export Accordion sub-components for composition
 */
export { AccordionContent, AccordionItem, AccordionTrigger }
