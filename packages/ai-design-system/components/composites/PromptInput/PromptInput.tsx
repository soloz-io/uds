"use client";

import * as React from "react";
import type { ReactNode } from "react";
import type { LanguageModelUsage } from "ai";
import {
  PromptInput as AIPromptInput,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  PromptInputProvider,
  type PromptInputMessage,
  type PromptInputProps as AIPromptInputProps,
  usePromptInputAttachments,
  usePromptInputController,
  useOptionalPromptInputController,
} from "@/components/ai-elements/prompt-input";
import {
  Context,
  ContextTrigger,
  ContextContent,
  ContextContentHeader,
  ContextContentBody,
  ContextContentFooter,
  ContextInputUsage,
  ContextOutputUsage,
  ContextReasoningUsage,
  ContextCacheUsage,
} from "@/components/ai-elements/context";
import { SpeechInput, type SpeechInputProps } from "@/components/ai-elements/speech-input";
import type { FormEvent } from "react";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { cn } from "@/lib/utils";

export interface PromptInputContextProps {
  usedTokens: number;
  maxTokens: number;
  usage?: LanguageModelUsage;
  modelId?: string;
}

export interface PromptInputBlockProps
  extends Omit<
    AIPromptInputProps,
    "globalDrop" | "syncHiddenInput" | "onSubmit" | "onChange"
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
  onStop?: () => void;
  context?: PromptInputContextProps | ReactNode;
  tools?: ReactNode;
  enableSpeech?: boolean;
  speechProps?: SpeechInputProps;
  attachIcon?: "paperclip" | "plus";
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
    onStop,
    context,
    tools,
    enableSpeech = true,
    speechProps,
    attachIcon = "paperclip",
    accept = "image/*,audio/*",
    multiple = true,
    maxFiles,
    maxFileSize,
    onError,
    ...props
  }) => {
    const existingController = useOptionalPromptInputController();

    const handleSubmit = React.useCallback(
      (message: PromptInputMessage, event: FormEvent<HTMLFormElement>) => {
        if (disabled || (loading && onStop)) {
          event.preventDefault();
          if (loading && onStop) {
            onStop();
          }
          return;
        }
        onSubmit(message, event);
      },
      [disabled, loading, onStop, onSubmit]
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

    const isStopping = loading && Boolean(onStop);

    const promptInputContent = (
      <AIPromptInput
        onSubmit={handleSubmit}
        accept={accept}
        multiple={multiple}
        maxFiles={maxFiles}
        maxFileSize={maxFileSize}
        onError={onError}
        {...props}
      >
        <PromptInputBody>
          <AttachmentPreviews />
          <PromptInputTextarea
            placeholder={placeholder}
            disabled={disabled}
            onChange={isControlled ? handleControlledChange : undefined}
          />
        </PromptInputBody>
        <PromptInputFooter>
          <PromptInputTools>
            <AttachButton disabled={disabled || loading} icon={attachIcon} />
            {enableSpeech && (
              <SpeechInput
                disabled={disabled || loading}
                {...speechProps}
              />
            )}
            {tools}
            {context ? (
              <PromptInputContextIndicator
                context={context}
                disabled={disabled || loading}
              />
            ) : null}
          </PromptInputTools>
          <PromptInputSubmit
            disabled={disabled || (loading && !onStop)}
            status={loading ? (onStop ? "streaming" : "submitted") : undefined}
            onClick={isStopping ? (e: React.MouseEvent) => { e.preventDefault(); onStop?.(); } : undefined}
            className={cn(
              "rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors",
              isStopping && "bg-transparent hover:bg-accent"
            )}
          >
            {loading ? undefined : <Icon name="corner-down-left" size="sm" />}
          </PromptInputSubmit>
        </PromptInputFooter>
      </AIPromptInput>
    );

    if (isControlled) {
      if (existingController) {
        return (
          <>
            <ExternalValueSync value={value} />
            {promptInputContent}
          </>
        );
      }
      return (
        <PromptInputProvider initialInput={value}>
          <ExternalValueSync value={value} />
          {promptInputContent}
        </PromptInputProvider>
      );
    }

    return promptInputContent;
  }
);

/**
 * The attach toolbar button — opens the native file picker via the attachments
 * context. Must render inside <AIPromptInput> (or a PromptInputProvider),
 * since usePromptInputAttachments() reads that context.
 */
function AttachButton({
  disabled,
  icon = "paperclip",
}: {
  disabled?: boolean;
  icon?: "paperclip" | "plus";
}) {
  const attachments = usePromptInputAttachments();
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground transition-colors"
      type="button"
      disabled={disabled}
      onClick={() => attachments.openFileDialog()}
      aria-label="Attach files"
      title="Attach files"
    >
      <Icon name={icon} size="sm" />
    </Button>
  );
}


/** Renders a preview chip (thumbnail + remove) per attached file. */
function AttachmentPreviews() {
  return (
    <PromptInputAttachments className="w-full justify-start self-start">
      {(attachment) => <PromptInputAttachment data={attachment} />}
    </PromptInputAttachments>
  );
}

/**
 * Syncs a controlled external value into the PromptInput controller state so
 * consumers (e.g. waypoint inserting a screenshot markdown image) can update
 * the draft prompt reactively, not just as an initial value.
 */
function ExternalValueSync({ value }: { value?: string }) {
  const controller = usePromptInputController();
  React.useEffect(() => {
    if (value !== undefined && controller.textInput.value !== value) {
      controller.textInput.setInput(value);
    }
  }, [value, controller]);
  return null;
}

/**
 * Renders the context window usage indicator.
 * Supports either a PromptInputContextProps object (auto-rendered using Context compound elements)
 * or a custom ReactNode.
 */
function PromptInputContextIndicator({
  context,
  disabled,
}: {
  context: PromptInputContextProps | ReactNode;
  disabled?: boolean;
}) {
  if (React.isValidElement(context)) {
    return context;
  }

  const ctx = context as PromptInputContextProps;
  if (!ctx || typeof ctx.usedTokens !== "number" || typeof ctx.maxTokens !== "number") {
    return null;
  }

  return (
    <Context
      usedTokens={ctx.usedTokens}
      maxTokens={ctx.maxTokens}
      usage={ctx.usage}
      modelId={ctx.modelId}
    >
      <ContextTrigger
        className="h-8 px-2 text-xs font-normal gap-1.5"
        disabled={disabled}
      />
      <ContextContent>
        <ContextContentHeader />
        <ContextContentBody className="space-y-1.5">
          <ContextInputUsage />
          <ContextOutputUsage />
          <ContextReasoningUsage />
          <ContextCacheUsage />
        </ContextContentBody>
        {ctx.modelId && <ContextContentFooter />}
      </ContextContent>
    </Context>
  );
}

PromptInput.displayName = "PromptInput";
