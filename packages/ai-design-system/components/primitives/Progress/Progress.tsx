"use client";

import * as React from "react";
import { Progress as ShadcnProgress } from "@/components/ui/progress";

/**
 * Progress Primitive
 *
 * Displays an indicator showing the completion progress of a task.
 *
 * Features:
 * - Determinate progress (0-100%)
 * - Smooth transitions
 * - Customizable height and color
 * - Accessible with proper ARIA attributes
 * - WCAG 2.1 Level AA compliant
 */

export type ProgressProps = React.ComponentProps<typeof ShadcnProgress>;

/**
 * Progress - Displays task completion progress
 */
export const Progress = React.memo<ProgressProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnProgress>, ProgressProps>(
    (props, ref) => {
      return <ShadcnProgress ref={ref} {...props} />;
    }
  )
);
Progress.displayName = "Progress";
