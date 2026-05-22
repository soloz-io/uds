"use client";

import * as React from "react";
import {
  Select as ShadcnSelect,
  SelectContent as ShadcnSelectContent,
  SelectGroup as ShadcnSelectGroup,
  SelectItem as ShadcnSelectItem,
  SelectLabel as ShadcnSelectLabel,
  SelectScrollDownButton as ShadcnSelectScrollDownButton,
  SelectScrollUpButton as ShadcnSelectScrollUpButton,
  SelectSeparator as ShadcnSelectSeparator,
  SelectTrigger as ShadcnSelectTrigger,
  SelectValue as ShadcnSelectValue,
} from "@/components/ui/select";

/**
 * Select Primitive
 *
 * A comprehensive select component built on Radix UI with shadcn/ui styling.
 * Provides a fully accessible dropdown select with keyboard navigation.
 *
 * Features:
 * - Keyboard navigation support
 * - Size variants (sm, default)
 * - Grouped options
 * - Scroll buttons for long lists
 * - Separator support
 * - Portal rendering
 * - WCAG 2.1 Level AA compliant
 */

export type SelectProps = React.ComponentProps<typeof ShadcnSelect>;
export type SelectTriggerProps = React.ComponentProps<typeof ShadcnSelectTrigger>;
export type SelectContentProps = React.ComponentProps<typeof ShadcnSelectContent>;
export type SelectItemProps = React.ComponentProps<typeof ShadcnSelectItem>;
export type SelectLabelProps = React.ComponentProps<typeof ShadcnSelectLabel>;
export type SelectGroupProps = React.ComponentProps<typeof ShadcnSelectGroup>;
export type SelectValueProps = React.ComponentProps<typeof ShadcnSelectValue>;
export type SelectSeparatorProps = React.ComponentProps<typeof ShadcnSelectSeparator>;
export type SelectScrollUpButtonProps = React.ComponentProps<typeof ShadcnSelectScrollUpButton>;
export type SelectScrollDownButtonProps = React.ComponentProps<typeof ShadcnSelectScrollDownButton>;

/**
 * Root Select component - controls the select state
 */
export const Select = React.memo<SelectProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnSelect>, SelectProps>(
    (props, ref) => {
      return <ShadcnSelect {...props} />;
    }
  )
);
Select.displayName = "Select";

/**
 * SelectTrigger - The button that opens the select dropdown
 */
export const SelectTrigger = React.memo<SelectTriggerProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnSelectTrigger>, SelectTriggerProps>(
    (props, ref) => {
      return <ShadcnSelectTrigger ref={ref} {...props} />;
    }
  )
);
SelectTrigger.displayName = "SelectTrigger";

/**
 * SelectContent - The dropdown content container
 */
export const SelectContent = React.memo<SelectContentProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnSelectContent>, SelectContentProps>(
    (props, ref) => {
      return <ShadcnSelectContent ref={ref} {...props} />;
    }
  )
);
SelectContent.displayName = "SelectContent";

/**
 * SelectItem - Individual selectable option
 */
export const SelectItem = React.memo<SelectItemProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnSelectItem>, SelectItemProps>(
    (props, ref) => {
      return <ShadcnSelectItem ref={ref} {...props} />;
    }
  )
);
SelectItem.displayName = "SelectItem";

/**
 * SelectLabel - Label for a group of items
 */
export const SelectLabel = React.memo<SelectLabelProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnSelectLabel>, SelectLabelProps>(
    (props, ref) => {
      return <ShadcnSelectLabel ref={ref} {...props} />;
    }
  )
);
SelectLabel.displayName = "SelectLabel";

/**
 * SelectGroup - Groups related select items
 */
export const SelectGroup = React.memo<SelectGroupProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnSelectGroup>, SelectGroupProps>(
    (props, ref) => {
      return <ShadcnSelectGroup {...props} />;
    }
  )
);
SelectGroup.displayName = "SelectGroup";

/**
 * SelectValue - Displays the selected value
 */
export const SelectValue = React.memo<SelectValueProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnSelectValue>, SelectValueProps>(
    (props, ref) => {
      return <ShadcnSelectValue {...props} />;
    }
  )
);
SelectValue.displayName = "SelectValue";

/**
 * SelectSeparator - Visual separator between items
 */
export const SelectSeparator = React.memo<SelectSeparatorProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnSelectSeparator>, SelectSeparatorProps>(
    (props, ref) => {
      return <ShadcnSelectSeparator ref={ref} {...props} />;
    }
  )
);
SelectSeparator.displayName = "SelectSeparator";

/**
 * SelectScrollUpButton - Button to scroll up in long lists
 */
export const SelectScrollUpButton = React.memo<SelectScrollUpButtonProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnSelectScrollUpButton>, SelectScrollUpButtonProps>(
    (props, ref) => {
      return <ShadcnSelectScrollUpButton ref={ref} {...props} />;
    }
  )
);
SelectScrollUpButton.displayName = "SelectScrollUpButton";

/**
 * SelectScrollDownButton - Button to scroll down in long lists
 */
export const SelectScrollDownButton = React.memo<SelectScrollDownButtonProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnSelectScrollDownButton>, SelectScrollDownButtonProps>(
    (props, ref) => {
      return <ShadcnSelectScrollDownButton ref={ref} {...props} />;
    }
  )
);
SelectScrollDownButton.displayName = "SelectScrollDownButton";
