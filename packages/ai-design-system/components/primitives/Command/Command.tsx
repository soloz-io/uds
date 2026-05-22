"use client";

import * as React from "react";
import {
  Command as ShadcnCommand,
  CommandDialog as ShadcnCommandDialog,
  CommandEmpty as ShadcnCommandEmpty,
  CommandGroup as ShadcnCommandGroup,
  CommandInput as ShadcnCommandInput,
  CommandItem as ShadcnCommandItem,
  CommandList as ShadcnCommandList,
  CommandSeparator as ShadcnCommandSeparator,
  CommandShortcut as ShadcnCommandShortcut,
} from "@/components/ui/command";

/**
 * Command Primitive
 *
 * A command menu component for search and command palette functionality.
 * Built on cmdk (Command+K) library with full keyboard navigation.
 *
 * Features:
 * - Fast fuzzy search
 * - Keyboard navigation
 * - Command groups and shortcuts
 * - Dialog mode for command palette
 * - Empty state handling
 * - WCAG 2.1 Level AA compliant
 */

export type CommandProps = React.ComponentProps<typeof ShadcnCommand>;
export type CommandDialogProps = React.ComponentProps<typeof ShadcnCommandDialog>;
export type CommandInputProps = React.ComponentProps<typeof ShadcnCommandInput>;
export type CommandListProps = React.ComponentProps<typeof ShadcnCommandList>;
export type CommandEmptyProps = React.ComponentProps<typeof ShadcnCommandEmpty>;
export type CommandGroupProps = React.ComponentProps<typeof ShadcnCommandGroup>;
export type CommandItemProps = React.ComponentProps<typeof ShadcnCommandItem>;
export type CommandSeparatorProps = React.ComponentProps<typeof ShadcnCommandSeparator>;
export type CommandShortcutProps = React.ComponentProps<typeof ShadcnCommandShortcut>;

/**
 * Command - Root command menu component
 */
export const Command = React.memo<CommandProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnCommand>, CommandProps>(
    (props, ref) => {
      return <ShadcnCommand ref={ref} {...props} />;
    }
  )
);
Command.displayName = "Command";

/**
 * CommandDialog - Command menu in a dialog (Command+K style)
 */
export const CommandDialog = React.memo<CommandDialogProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnCommandDialog>, CommandDialogProps>(
    (props, ref) => {
      return <ShadcnCommandDialog {...props} />;
    }
  )
);
CommandDialog.displayName = "CommandDialog";

/**
 * CommandInput - Search input for filtering commands
 */
export const CommandInput = React.memo<CommandInputProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnCommandInput>, CommandInputProps>(
    (props, ref) => {
      return <ShadcnCommandInput ref={ref} {...props} />;
    }
  )
);
CommandInput.displayName = "CommandInput";

/**
 * CommandList - Scrollable list container for command items
 */
export const CommandList = React.memo<CommandListProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnCommandList>, CommandListProps>(
    (props, ref) => {
      return <ShadcnCommandList ref={ref} {...props} />;
    }
  )
);
CommandList.displayName = "CommandList";

/**
 * CommandEmpty - Displayed when no results found
 */
export const CommandEmpty = React.memo<CommandEmptyProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnCommandEmpty>, CommandEmptyProps>(
    (props, ref) => {
      return <ShadcnCommandEmpty ref={ref} {...props} />;
    }
  )
);
CommandEmpty.displayName = "CommandEmpty";

/**
 * CommandGroup - Groups related command items
 */
export const CommandGroup = React.memo<CommandGroupProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnCommandGroup>, CommandGroupProps>(
    (props, ref) => {
      return <ShadcnCommandGroup ref={ref} {...props} />;
    }
  )
);
CommandGroup.displayName = "CommandGroup";

/**
 * CommandItem - Individual command item
 */
export const CommandItem = React.memo<CommandItemProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnCommandItem>, CommandItemProps>(
    (props, ref) => {
      return <ShadcnCommandItem ref={ref} {...props} />;
    }
  )
);
CommandItem.displayName = "CommandItem";

/**
 * CommandSeparator - Visual separator between groups
 */
export const CommandSeparator = React.memo<CommandSeparatorProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnCommandSeparator>, CommandSeparatorProps>(
    (props, ref) => {
      return <ShadcnCommandSeparator ref={ref} {...props} />;
    }
  )
);
CommandSeparator.displayName = "CommandSeparator";

/**
 * CommandShortcut - Displays keyboard shortcut hint
 */
export const CommandShortcut = React.memo<CommandShortcutProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnCommandShortcut>, CommandShortcutProps>(
    (props, ref) => {
      return <ShadcnCommandShortcut ref={ref} {...props} />;
    }
  )
);
CommandShortcut.displayName = "CommandShortcut";
