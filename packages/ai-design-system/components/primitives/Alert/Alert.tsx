"use client";

import * as React from "react";
import {
  Alert as ShadcnAlert,
  AlertTitle as ShadcnAlertTitle,
  AlertDescription as ShadcnAlertDescription,
} from "@/components/ui/alert";

/**
 * Alert Primitive
 *
 * Displays a callout for user attention with variants for different message types.
 *
 * Features:
 * - Variant support (default, destructive)
 * - Icon support
 * - Title and description components
 * - Semantic role="alert" for accessibility
 * - WCAG 2.1 Level AA compliant
 */

export type AlertProps = React.ComponentProps<typeof ShadcnAlert>;
export type AlertTitleProps = React.ComponentProps<typeof ShadcnAlertTitle>;
export type AlertDescriptionProps = React.ComponentProps<typeof ShadcnAlertDescription>;

/**
 * Alert - Root container with role="alert"
 */
export const Alert = React.memo<AlertProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnAlert>, AlertProps>(
    (props, ref) => {
      return <ShadcnAlert ref={ref} {...props} />;
    }
  )
);
Alert.displayName = "Alert";

/**
 * AlertTitle - Title/heading for the alert
 */
export const AlertTitle = React.memo<AlertTitleProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnAlertTitle>, AlertTitleProps>(
    (props, ref) => {
      return <ShadcnAlertTitle ref={ref} {...props} />;
    }
  )
);
AlertTitle.displayName = "AlertTitle";

/**
 * AlertDescription - Description content for the alert
 */
export const AlertDescription = React.memo<AlertDescriptionProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnAlertDescription>, AlertDescriptionProps>(
    (props, ref) => {
      return <ShadcnAlertDescription ref={ref} {...props} />;
    }
  )
);
AlertDescription.displayName = "AlertDescription";
