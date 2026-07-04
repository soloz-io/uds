import * as React from "react";
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbPage, 
  BreadcrumbSeparator,
  BreadcrumbEllipsis
} from "@/components/primitives/Breadcrumb";

export interface BreadcrumbItemData {
  label: React.ReactNode;
  href?: string;
  isCurrentPage?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export interface AppBreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItemData[];
  showEllipsis?: boolean;
  ellipsisIndex?: number;
}

/**
 * AppBreadcrumb Composite
 *
 * A composite wrapper around the Breadcrumb primitive that accepts a data array
 * and handles the complex rendering of links, separators, and ellipses.
 */
export const AppBreadcrumb = React.forwardRef<HTMLElement, AppBreadcrumbProps>(
  ({ items, showEllipsis = false, ellipsisIndex = 1, className, ...props }, ref) => {
    if (!items || items.length === 0) return null;

    return (
      <Breadcrumb ref={ref} className={className} {...props}>
        <BreadcrumbList>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isEllipsis = showEllipsis && index === ellipsisIndex && items.length > 3;

            if (isEllipsis) {
              return (
                <React.Fragment key={`ellipsis-${index}`}>
                  <BreadcrumbItem>
                    <BreadcrumbEllipsis />
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </React.Fragment>
              );
            }

            return (
              <React.Fragment key={`item-${index}`}>
                <BreadcrumbItem>
                  {item.isCurrentPage || isLast ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink 
                      href={item.href || "#"} 
                      onClick={item.onClick}
                    >
                      {item.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }
);

AppBreadcrumb.displayName = "AppBreadcrumb";
