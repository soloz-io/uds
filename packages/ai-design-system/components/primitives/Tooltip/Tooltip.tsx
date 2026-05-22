"use client";

import * as React from "react";
import {
  Tooltip as ShadcnTooltip,
  TooltipContent as ShadcnTooltipContent,
  TooltipTrigger as ShadcnTooltipTrigger,
  TooltipProvider as ShadcnTooltipProvider,
} from "@/components/ui/tooltip";

/**
 * Tooltip Primitive
 *
 * A popup that displays information related to an element when the element
 * receives keyboard focus or the mouse hovers over it.
 *
 * Features:
 * - Keyboard focus support
 * - Customizable delay duration
 * - Arrow indicator
 * - Side positioning (top, right, bottom, left)
 * - Portal rendering for proper z-index
 * - WCAG 2.1 Level AA compliant
 */

export type TooltipProps = React.ComponentProps<typeof ShadcnTooltip>;
export type TooltipTriggerProps = React.ComponentProps<typeof ShadcnTooltipTrigger>;
export type TooltipContentProps = React.ComponentProps<typeof ShadcnTooltipContent>;
export type TooltipProviderProps = React.ComponentProps<typeof ShadcnTooltipProvider>;

/**
 * TooltipProvider - Wraps your app to provide tooltip context
 * Usually placed at the root of your app
 */
export const TooltipProvider = React.memo<TooltipProviderProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnTooltipProvider>, TooltipProviderProps>(
    (props, ref) => {
      return <ShadcnTooltipProvider {...props} />;
    }
  )
);
TooltipProvider.displayName = "TooltipProvider";

/**
 * Tooltip - Root component that manages tooltip state
 */
export const Tooltip = React.memo<TooltipProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnTooltip>, TooltipProps>(
    (props, ref) => {
      return <ShadcnTooltip {...props} />;
    }
  )
);
Tooltip.displayName = "Tooltip";

/**
 * TooltipTrigger - The element that triggers the tooltip
 */
export const TooltipTrigger = React.memo<TooltipTriggerProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnTooltipTrigger>, TooltipTriggerProps>(
    (props, ref) => {
      return <ShadcnTooltipTrigger ref={ref} {...props} />;
    }
  )
);
TooltipTrigger.displayName = "TooltipTrigger";

/**
 * TooltipContent - The popup content that appears
 */
export const TooltipContent = React.memo<TooltipContentProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnTooltipContent>, TooltipContentProps>(
    (props, ref) => {
      return <ShadcnTooltipContent ref={ref} {...props} />;
    }
  )
);
TooltipContent.displayName = "TooltipContent";
