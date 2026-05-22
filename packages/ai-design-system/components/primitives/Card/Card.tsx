import * as React from "react"
import {
  Card as ShadcnCard,
  cardVariants,
  CardHeader as ShadcnCardHeader,
  CardTitle as ShadcnCardTitle,
  CardDescription as ShadcnCardDescription,
  CardContent as ShadcnCardContent,
  CardFooter as ShadcnCardFooter,
  CardAction as ShadcnCardAction,
} from "../../ui/card"
import type { VariantProps } from "class-variance-authority"

/**
 * Card Primitive
 *
 * A foundational card component that wraps shadcn/ui Card with extensibility for
 * design system-specific enhancements. Cards are flexible containers for grouping
 * related content and actions, providing visual separation and hierarchy.
 *
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Card Title</CardTitle>
 *     <CardDescription>Card description goes here</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     <p>Card content goes here</p>
 *   </CardContent>
 *   <CardFooter>
 *     <Button>Action</Button>
 *   </CardFooter>
 * </Card>
 *
 * <Card elevation="elevated" padding="lg">
 *   <CardHeader>
 *     <CardTitle>Elevated Card</CardTitle>
 *   </CardHeader>
 *   <CardContent>
 *     <p>Card with elevated shadow and large padding</p>
 *   </CardContent>
 * </Card>
 *
 * <Card elevation="outlined" padding="sm">
 *   <CardHeader>
 *     <CardTitle>Outlined Card</CardTitle>
 *   </CardHeader>
 *   <CardContent>
 *     <p>Card with prominent border and compact padding</p>
 *   </CardContent>
 * </Card>
 * ```
 *
 * @see https://ui.shadcn.com/docs/components/card - shadcn/ui Card documentation
 */

/**
 * Card component props
 * Extends the native div element props with variant options
 */
export type CardProps = React.ComponentProps<"div"> &
  VariantProps<typeof cardVariants>

/**
 * CardHeader component props
 * Extends the native div element props
 */
export type CardHeaderProps = React.ComponentProps<"div">

/**
 * CardTitle component props
 * Extends the native div element props
 */
export type CardTitleProps = React.ComponentProps<"div">

/**
 * CardDescription component props
 * Extends the native div element props
 */
export type CardDescriptionProps = React.ComponentProps<"div">

/**
 * CardContent component props
 * Extends the native div element props
 */
export type CardContentProps = React.ComponentProps<"div">

/**
 * CardFooter component props
 * Extends the native div element props
 */
export type CardFooterProps = React.ComponentProps<"div">

/**
 * CardAction component props
 * Extends the native div element props
 */
export type CardActionProps = React.ComponentProps<"div">

/**
 * Card component
 *
 * A versatile card container component built on shadcn/ui foundation.
 * Provides visual separation and hierarchy for grouping related content and actions.
 * Optimized with React.memo for performance in high-frequency rendering scenarios.
 *
 * Features:
 * - Flexible composition with header, content, and footer sections
 * - Elevation variants (flat, elevated, outlined) for different visual treatments
 * - Padding variants (sm, default, lg) for different content densities
 * - Title and description components for consistent typography
 * - Action slot for card header controls
 * - Dark mode support
 * - Semantic HTML structure
 */
export const Card = React.memo(
  React.forwardRef<HTMLDivElement, CardProps>(
    (props, ref) => {
      return <ShadcnCard ref={ref} {...props} />
    }
  )
)

Card.displayName = "Card"

/**
 * Re-export cardVariants for consumers who need direct access to the variant generator.
 * This is useful for creating custom card-like components that need consistent styling.
 *
 * @example
 * ```tsx
 * import { cardVariants } from './Card'
 *
 * <div className={cardVariants({ elevation: "elevated", padding: "lg" })}>
 *   Custom card-like div
 * </div>
 * ```
 */
export { cardVariants }

/**
 * Re-export VariantProps for type inference in consuming components
 */
export type { VariantProps }

/**
 * CardHeader component
 *
 * Used to group the card's title, description, and optional actions.
 * Provides consistent spacing and layout for the card's header section.
 * Optimized with React.memo for performance in high-frequency rendering scenarios.
 */
export const CardHeader = React.memo(
  React.forwardRef<HTMLDivElement, CardHeaderProps>(
    (props, ref) => {
      return <ShadcnCardHeader ref={ref} {...props} />
    }
  )
)

CardHeader.displayName = "CardHeader"

/**
 * CardTitle component
 *
 * The main heading for the card. Uses semantic HTML and proper typography hierarchy.
 * Optimized with React.memo for performance in high-frequency rendering scenarios.
 */
export const CardTitle = React.memo(
  React.forwardRef<HTMLDivElement, CardTitleProps>(
    (props, ref) => {
      return <ShadcnCardTitle ref={ref} {...props} />
    }
  )
)

CardTitle.displayName = "CardTitle"

/**
 * CardDescription component
 *
 * Supporting text for the card title. Uses muted styling to establish visual hierarchy.
 * Optimized with React.memo for performance in high-frequency rendering scenarios.
 */
export const CardDescription = React.memo(
  React.forwardRef<HTMLDivElement, CardDescriptionProps>(
    (props, ref) => {
      return <ShadcnCardDescription ref={ref} {...props} />
    }
  )
)

CardDescription.displayName = "CardDescription"

/**
 * CardContent component
 *
 * Main container for card body content. Provides consistent padding and spacing.
 * Optimized with React.memo for performance in high-frequency rendering scenarios.
 */
export const CardContent = React.memo(
  React.forwardRef<HTMLDivElement, CardContentProps>(
    (props, ref) => {
      return <ShadcnCardContent ref={ref} {...props} />
    }
  )
)

CardContent.displayName = "CardContent"

/**
 * CardFooter component
 *
 * Used for actions and supplementary content. Typically contains buttons or links.
 * Optimized with React.memo for performance in high-frequency rendering scenarios.
 */
export const CardFooter = React.memo(
  React.forwardRef<HTMLDivElement, CardFooterProps>(
    (props, ref) => {
      return <ShadcnCardFooter ref={ref} {...props} />
    }
  )
)

CardFooter.displayName = "CardFooter"

/**
 * CardAction component
 *
 * Used for action buttons or icons in the card header. Provides consistent positioning.
 * Optimized with React.memo for performance in high-frequency rendering scenarios.
 */
export const CardAction = React.memo(
  React.forwardRef<HTMLDivElement, CardActionProps>(
    (props, ref) => {
      return <ShadcnCardAction ref={ref} {...props} />
    }
  )
)

CardAction.displayName = "CardAction"
