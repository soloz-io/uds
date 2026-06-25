"use client";

import * as React from "react";
import { iconRegistry, type IconName } from "@/registry/icons";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

/**
 * Icon Primitive
 *
 * A reusable icon component that uses the centralized icon registry.
 * All icons MUST use this component or the iconRegistry directly.
 *
 * Features:
 * - Size variants (xs, sm, default, lg, xl)
 * - Accessibility support with aria-label
 * - Error handling for missing icons
 * - Color inherits from currentColor
 */

const iconVariants = cva("inline-block flex-shrink-0", {
  variants: {
    size: {
      xs: "h-3 w-3",
      sm: "h-4 w-4",
      default: "h-5 w-5",
      lg: "h-6 w-6",
      xl: "h-8 w-8",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface IconProps
  extends Omit<React.SVGProps<SVGSVGElement>, "viewBox" | "children">,
    VariantProps<typeof iconVariants> {
  /**
   * Name of the icon from the icon registry
   * Type-safe: only accepts valid icon names
   */
  name: IconName | string;
  /**
   * Optional aria-label for accessibility
   * If provided, aria-hidden will be false
   */
  "aria-label"?: string;
}

/**
 * Icon component - renders icons from the icon registry
 */
export const Icon = React.memo<IconProps>(
  ({ name, size, className, "aria-label": ariaLabel, ...props }) => {
    const icon = iconRegistry.get(name);

    if (!icon) {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `Icon "${name}" not found in registry. Available icons:`,
          iconRegistry.getNames().join(", ")
        );
      }
      return null;
    }

    return (
      <svg
        viewBox={icon.viewBox}
        className={cn(iconVariants({ size }), className)}
        aria-hidden={!ariaLabel}
        aria-label={ariaLabel}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        {icon.elements
          ? icon.elements.map((el, i) => {
              switch (el.type) {
                case "path":
                  return <path key={i} d={el.attrs.d} {...el.attrs} />;
                case "circle":
                  return (
                    <circle
                      key={i}
                      cx={el.attrs.cx}
                      cy={el.attrs.cy}
                      r={el.attrs.r}
                      {...el.attrs}
                    />
                  );
                case "line":
                  return (
                    <line
                      key={i}
                      x1={el.attrs.x1}
                      y1={el.attrs.y1}
                      x2={el.attrs.x2}
                      y2={el.attrs.y2}
                      {...el.attrs}
                    />
                  );
                case "rect":
                  return (
                    <rect
                      key={i}
                      x={el.attrs.x}
                      y={el.attrs.y}
                      width={el.attrs.width}
                      height={el.attrs.height}
                      rx={el.attrs.rx}
                      ry={el.attrs.ry}
                      {...el.attrs}
                    />
                  );
                case "polyline":
                  return <polyline key={i} points={el.attrs.points} {...el.attrs} />;
                case "polygon":
                  return <polygon key={i} points={el.attrs.points} {...el.attrs} />;
                default:
                  return null;
              }
            })
          : icon.path && <path d={icon.path} />}
      </svg>
    );
  }
);

Icon.displayName = "Icon";
