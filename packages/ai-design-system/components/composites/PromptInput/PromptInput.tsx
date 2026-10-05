"use client";

import * as React from "react";
import type { ReactNode } from "react";
import type { LanguageModelUsage } from "ai";
import {
  PromptInput as AIPromptInput,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputSubmit,
  PromptInputTextarea,
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
import { InputGroupAddon } from "@/components/primitives/InputGroup";
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
  enableAttachments?: boolean;
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
    enableAttachments = true,
    enableSpeech = true,
    speechProps,
    attachIcon = "plus",
    accept = "image/*,audio/*",
    multiple = true,
    maxFiles,
    maxFileSize,
    onError,
    className,
    ...props
  }) => {
    const showAttachments = enableAttachments;
    const showSpeech = enableSpeech;

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
        className={cn(
          "min-h-[52px] [&>[data-slot=input-group]]:min-h-[52px] [&>[data-slot=input-group]]:rounded-full [&>[data-slot=input-group]:has([data-align=block-start])]:rounded-2xl",
          className?.includes("border") &&
          "[&>[data-slot=input-group]]:border-0 [&>[data-slot=input-group]]:bg-transparent [&>[data-slot=input-group]]:shadow-none",
          className
        )}
        {...props}
      >
        {showAttachments && <AttachmentPreviews />}
        {showAttachments && (
          <InputGroupAddon align="inline-start" className="self-center flex items-center shrink-0 !pl-2.5 !ml-0 pr-1.5 py-0">
            <AttachButton disabled={disabled || loading} icon={attachIcon} />
          </InputGroupAddon>
        )}
        <PromptInputTextarea
          placeholder={placeholder}
          disabled={disabled}
          onChange={isControlled ? handleControlledChange : undefined}
          className={cn(
            "min-h-[36px] py-2 text-sm resize-none border-0 shadow-none focus-visible:ring-0 bg-transparent flex-1 field-sizing-content self-center",
            showAttachments ? "pl-1.5 pr-2" : "pl-6 pr-2"
          )}
        />
        <InputGroupAddon align="inline-end" className="self-center flex items-center gap-1.5 shrink-0 !pr-2.5 !mr-0 py-0">
          {tools}
          {context ? (
            <PromptInputContextIndicator
              context={context}
              disabled={disabled || loading}
            />
          ) : null}
          {showSpeech && (
            <SpeechInput
              disabled={disabled || loading}
              {...speechProps}
            />
          )}
          <PromptInputSubmit
            disabled={disabled || (loading && !onStop)}
            status={loading ? (onStop ? "streaming" : "submitted") : undefined}
            onClick={isStopping ? (e: React.MouseEvent) => { e.preventDefault(); onStop?.(); } : undefined}
            className={cn(
              "h-8 w-8 rounded-full text-white transition-colors shrink-0 p-0 flex items-center justify-center",
              isStopping && "bg-transparent hover:bg-accent"
            )}
          >
            {loading ? undefined : <Icon name="arrow-up" size="sm" />}
          </PromptInputSubmit>
        </InputGroupAddon>
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
  icon = "plus",
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
  const attachments = usePromptInputAttachments();
  if (!attachments.files.length) return null;
  return (
    <InputGroupAddon align="block-start" className="w-full justify-start px-4 pt-3 pb-0 border-0 bg-transparent">
      <PromptInputAttachments className="w-full justify-start self-start px-0 pt-0">
        {(attachment) => <PromptInputAttachment data={attachment} />}
      </PromptInputAttachments>
    </InputGroupAddon>
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
