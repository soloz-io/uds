"use client";

import * as React from "react";
import type { ReactNode } from "react";
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
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";

export interface PromptInputBlockProps
  extends Omit<
    AIPromptInputProps,
    "accept" | "multiple" | "maxFiles" | "maxFileSize" | "globalDrop" | "syncHiddenInput" | "onSubmit" | "onChange"
  > {
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSubmit: (
    message: PromptInputMessage,
    event: FormEvent<HTMLFormElement>
  ) => void | Promise<void>;
  dialog?: ReactNode;
  loading?: boolean;
}

export const PromptInput = React.memo<PromptInputBlockProps>(
  ({
    disabled = false,
    placeholder,
    value,
    onChange,
    onSubmit,
    dialog,
    loading = false,
    ...props
  }) => {
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

    const isControlled = value !== undefined && onChange !== undefined;

    const handleControlledChange = React.useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (onChange) {
          onChange(e.target.value);
        }
      },
      [onChange]
    );

    if (dialog) {
      return <>{dialog}</>;
    }

    const promptInputContent = (
      <AIPromptInput onSubmit={handleSubmit} {...props}>
        <PromptInputBody>
          <PromptInputTextarea
            placeholder={placeholder}
            disabled={false}
            onChange={isControlled ? handleControlledChange : undefined}
          />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" type="button" disabled={disabled}>
              <Icon name="plus" size="sm" />
            </Button>
          </PromptInputTools>
          <PromptInputSubmit disabled={disabled} status={loading ? "submitted" : undefined} />
        </PromptInputFooter>
      </AIPromptInput>
    );

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
