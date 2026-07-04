import * as React from "react"
import { 
  Breadcrumb as ShadcnBreadcrumb,
  BreadcrumbList as ShadcnBreadcrumbList,
  BreadcrumbItem as ShadcnBreadcrumbItem,
  BreadcrumbLink as ShadcnBreadcrumbLink,
  BreadcrumbPage as ShadcnBreadcrumbPage,
  BreadcrumbSeparator as ShadcnBreadcrumbSeparator,
  BreadcrumbEllipsis as ShadcnBreadcrumbEllipsis
} from "../../ui/breadcrumb"

/**
 * Breadcrumb Primitive
 *
 * Displays the path to the current resource using a hierarchy of links.
 * Re-exports the shadcn/ui components.
 *
 * @see https://ui.shadcn.com/docs/components/breadcrumb
 */

export const Breadcrumb = React.memo(
  React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<typeof ShadcnBreadcrumb>>(
    (props, ref) => <ShadcnBreadcrumb ref={ref} {...props} />
  )
)
Breadcrumb.displayName = "Breadcrumb"

export const BreadcrumbList = React.memo(
  React.forwardRef<HTMLOListElement, React.ComponentPropsWithoutRef<typeof ShadcnBreadcrumbList>>(
    (props, ref) => <ShadcnBreadcrumbList ref={ref} {...props} />
  )
)
BreadcrumbList.displayName = "BreadcrumbList"

export const BreadcrumbItem = React.memo(
  React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<typeof ShadcnBreadcrumbItem>>(
    (props, ref) => <ShadcnBreadcrumbItem ref={ref} {...props} />
  )
)
BreadcrumbItem.displayName = "BreadcrumbItem"

export const BreadcrumbLink = React.memo(
  React.forwardRef<HTMLAnchorElement, React.ComponentPropsWithoutRef<typeof ShadcnBreadcrumbLink>>(
    (props, ref) => <ShadcnBreadcrumbLink ref={ref} {...props} />
  )
)
BreadcrumbLink.displayName = "BreadcrumbLink"

export const BreadcrumbPage = React.memo(
  React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<typeof ShadcnBreadcrumbPage>>(
    (props, ref) => <ShadcnBreadcrumbPage ref={ref} {...props} />
  )
)
BreadcrumbPage.displayName = "BreadcrumbPage"

export const BreadcrumbSeparator = React.memo(
  React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<typeof ShadcnBreadcrumbSeparator>>(
    (props, ref) => <ShadcnBreadcrumbSeparator ref={ref} {...props} />
  )
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

export const BreadcrumbEllipsis = React.memo(
  React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<typeof ShadcnBreadcrumbEllipsis>>(
    (props, ref) => <ShadcnBreadcrumbEllipsis ref={ref} {...props} />
  )
)
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis"
