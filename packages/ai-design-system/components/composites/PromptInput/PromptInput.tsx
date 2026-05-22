"use client";

import * as React from "react";
import {
  PromptInput as AIPromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  PromptInputProvider,
  type PromptInputMessage,
  type PromptInputProps as AIPromptInputProps,
} from "@/components/ai-elements/prompt-input";
import type { FormEvent } from "react";

/**
 * PromptInput Block
 *
 * A thin wrapper around the PromptInput AI element that hides attachment functionality.
 * This block provides a simplified prompt input interface focused on text-only input.
 *
 * Features:
 * - Controlled and uncontrolled state support
 * - Disabled state (blocks submission, keeps textarea editable)
 * - Custom placeholder text
 * - No attachment UI (compositional hiding)
 */

export interface PromptInputBlockProps
  extends Omit<
    AIPromptInputProps,
    "accept" | "multiple" | "maxFiles" | "maxFileSize" | "globalDrop" | "syncHiddenInput" | "onSubmit" | "onChange"
  > {
  /**
   * Blocks form submission when true. Textarea remains editable for drafts.
   */
  disabled?: boolean;
  /**
   * Placeholder text for the textarea input
   */
  placeholder?: string;
  /**
   * Controlled state value (when provided with onChange)
   */
  value?: string;
  /**
   * Controlled state change handler (when provided with value)
   */
  onChange?: (value: string) => void;
  /**
   * Submit handler called when form is submitted
   */
  onSubmit: (
    message: PromptInputMessage,
    event: FormEvent<HTMLFormElement>
  ) => void | Promise<void>;
}

/**
 * PromptInput component - text-only prompt input without attachments
 */
export const PromptInput = React.memo<PromptInputBlockProps>(
  ({
    disabled = false,
    placeholder,
    value,
    onChange,
    onSubmit,
    ...props
  }) => {
    // Handle form submission with disabled state
    const handleSubmit = React.useCallback(
      (message: PromptInputMessage, event: FormEvent<HTMLFormElement>) => {
        if (disabled) {
          event.preventDefault();
          return;
        }
        onSubmit(message, event);
      },
      [disabled, onSubmit]
    );

    // Controlled mode: wrap in PromptInputProvider
    const isControlled = value !== undefined && onChange !== undefined;

    // Handle controlled state change
    const handleControlledChange = React.useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (onChange) {
          onChange(e.target.value);
        }
      },
      [onChange]
    );

    // Render the prompt input composition
    const promptInputContent = (
      <AIPromptInput onSubmit={handleSubmit} {...props}>
        <PromptInputBody>
          <PromptInputTextarea
            placeholder={placeholder}
            disabled={false} // Keep editable even when form is disabled
            onChange={isControlled ? handleControlledChange : undefined}
          />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools>
            {/* No attachment menu - compositionally hidden */}
          </PromptInputTools>
          <PromptInputSubmit disabled={disabled} />
        </PromptInputFooter>
      </AIPromptInput>
    );

    // Wrap in provider for controlled mode
    if (isControlled) {
      return (
        <PromptInputProvider initialInput={value}>
          {promptInputContent}
        </PromptInputProvider>
      );
    }

    return promptInputContent;
  }
);

PromptInput.displayName = "PromptInput";
