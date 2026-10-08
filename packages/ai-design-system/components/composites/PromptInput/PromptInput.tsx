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
  type AttachmentsContext,
  type AttachmentBadge,
  type AttachmentItemData,
  type PromptInputAttachmentFile,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/primitives/DropdownMenu";
import { cn } from "@/lib/utils";

export interface AttachmentActionItem {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  shortcut?: string;
  separator?: boolean;
  children?: AttachmentActionItem[];
  title?: string;
  description?: string;
  badge?: AttachmentBadge | string;
  thumbnailUrl?: string;
  onSelect?: (attachments: AttachmentsContext) => void;
}

export type { AttachmentBadge, AttachmentItemData, PromptInputAttachmentFile };

export interface AttachmentActionGroup {
  id?: string;
  label?: string;
  items: AttachmentActionItem[];
}

export type AttachmentAction = AttachmentActionItem | AttachmentActionGroup;

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
  helperText?: ReactNode;
  multiline?: boolean;
  onChange?: (value: string) => void;
  onSubmit?: (
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
  attachmentActions?: AttachmentAction[];
}

export const PromptInput = React.memo<PromptInputBlockProps>((props) => {
  const { dialog, value } = props;
  const existingController = useOptionalPromptInputController();

  if (dialog) {
    return <>{dialog}</>;
  }

  if (existingController) {
    return (
      <>
        <ExternalValueSync value={value} />
        <PromptInputInner {...props} />
      </>
    );
  }

  return (
    <PromptInputProvider initialInput={value ?? ""}>
      <ExternalValueSync value={value} />
      <PromptInputInner {...props} />
    </PromptInputProvider>
  );
});

const PromptInputInner = React.memo<PromptInputBlockProps>(
  ({
    disabled = false,
    placeholder,
    value,
    helperText,
    multiline = false,
    onChange,
    onSubmit,
    loading = false,
    onStop,
    context,
    tools,
    enableAttachments = true,
    enableSpeech = true,
    speechProps,
    attachIcon = "plus",
    attachmentActions,
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

    const attachments = usePromptInputAttachments();
    const hasAttachments = showAttachments && attachments.files.length > 0;
    const isMultiline = Boolean(multiline || helperText || hasAttachments);

    const handleSubmit = React.useCallback(
      (message: PromptInputMessage, event: FormEvent<HTMLFormElement>) => {
        if (disabled || (loading && onStop)) {
          event.preventDefault();
          if (loading && onStop) {
            onStop();
          }
          return;
        }
        onSubmit?.(message, event);
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

    const isStopping = loading && Boolean(onStop);

    // When multiline or attachments are present, replace any forced rounded-full with rounded-2xl
    let resolvedClassName = className;
    if (isMultiline && resolvedClassName) {
      resolvedClassName = resolvedClassName.replace(/\brounded-full\b/g, "rounded-2xl");
    }

    const formClassName = cn(
      isMultiline
        ? "min-h-[96px] rounded-2xl md:rounded-3xl [&>[data-slot=input-group]]:min-h-[96px] [&>[data-slot=input-group]]:rounded-2xl md:[&>[data-slot=input-group]]:rounded-3xl [&>[data-slot=input-group]]:flex-col [&>[data-slot=input-group]]:items-stretch border border-border/60 bg-card/60 shadow-xs"
        : "min-h-[52px] [&>[data-slot=input-group]]:min-h-[52px] [&>[data-slot=input-group]]:rounded-full",
      resolvedClassName?.includes("border") &&
        "[&>[data-slot=input-group]]:border-0 [&>[data-slot=input-group]]:bg-transparent [&>[data-slot=input-group]]:shadow-none",
      resolvedClassName
    );

    return (
      <AIPromptInput
        onSubmit={handleSubmit}
        accept={accept}
        multiple={multiple}
        maxFiles={maxFiles}
        maxFileSize={maxFileSize}
        onError={onError}
        className={formClassName}
        {...props}
      >
        {isMultiline ? (
          <>
            {hasAttachments && <AttachmentPreviews />}
            <PromptInputTextarea
              placeholder={placeholder}
              disabled={disabled}
              onChange={isControlled ? handleControlledChange : undefined}
              className="w-full px-4 pt-3.5 pb-2 text-sm md:text-base resize-none border-0 shadow-none focus-visible:ring-0 bg-transparent flex-1 field-sizing-content min-h-[52px] max-h-48"
            />
            <div
              data-align="block-end"
              className="w-full flex items-center justify-between px-3.5 pb-2.5 pt-1 border-0 bg-transparent"
            >
              <div className="flex items-center gap-2">
                {helperText ? (
                  <span className="text-xs text-muted-foreground font-normal">{helperText}</span>
                ) : showAttachments ? (
                  <AttachButton
                    disabled={disabled || loading}
                    icon={attachIcon}
                    actions={attachmentActions}
                  />
                ) : null}
                {tools}
                {context ? (
                  <PromptInputContextIndicator
                    context={context}
                    disabled={disabled || loading}
                  />
                ) : null}
              </div>
              <div className="flex items-center gap-1.5">
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
              </div>
            </div>
          </>
        ) : (
          <>
            {showAttachments && (
              <InputGroupAddon align="inline-start" className="self-center flex items-center shrink-0 !pl-2.5 !ml-0 pr-1.5 py-0">
                <AttachButton
                  disabled={disabled || loading}
                  icon={attachIcon}
                  actions={attachmentActions}
                />
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
          </>
        )}
      </AIPromptInput>
    );
  }
);

PromptInputInner.displayName = "PromptInputInner";

function isActionGroup(
  action: AttachmentAction
): action is AttachmentActionGroup {
  return "items" in action && Array.isArray((action as AttachmentActionGroup).items);
}

function renderActionItem(
  item: AttachmentActionItem,
  attachments: AttachmentsContext
) {
  const hasChildren = Boolean(item.children && item.children.length > 0);

  if (hasChildren) {
    return (
      <DropdownMenuSub key={item.id}>
        <DropdownMenuSubTrigger
          disabled={item.disabled}
          className="flex items-center gap-2 cursor-pointer"
        >
          {item.icon && <span className="shrink-0 flex items-center justify-center size-4">{item.icon}</span>}
          <span className="flex-1 truncate">{item.label}</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent className="min-w-[180px]">
          {item.children!.map((child) => renderActionItem(child, attachments))}
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    );
  }

  return (
    <React.Fragment key={item.id}>
      <DropdownMenuItem
        disabled={item.disabled}
        onSelect={() => {
          if (item.onSelect) {
            item.onSelect(attachments);
          } else if (item.title || item.description || item.badge || item.thumbnailUrl) {
            attachments.addAttachment?.({
              id: item.id,
              label: item.label,
              title: item.title,
              description: item.description,
              icon: item.icon,
              badge: item.badge,
              thumbnailUrl: item.thumbnailUrl,
              url: `item://${item.id}`,
            });
          } else {
            attachments.openFileDialog();
          }
        }}
        className="flex items-center gap-2 cursor-pointer"
      >
        {item.icon && <span className="shrink-0 flex items-center justify-center size-4">{item.icon}</span>}
        <span className="flex-1 truncate">{item.label}</span>
        {item.shortcut && (
          <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
        )}
      </DropdownMenuItem>
      {item.separator && <DropdownMenuSeparator />}
    </React.Fragment>
  );
}

/**
 * The attach toolbar button — opens the native file picker or a cascading
 * dropdown menu when `actions` are provided. Must render inside <AIPromptInput>
 * (or a PromptInputProvider), since usePromptInputAttachments() reads that context.
 */
function AttachButton({
  disabled,
  icon = "plus",
  actions,
}: {
  disabled?: boolean;
  icon?: "paperclip" | "plus";
  actions?: AttachmentAction[];
}) {
  const attachments = usePromptInputAttachments();

  const buttonTrigger = (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground transition-colors"
      type="button"
      disabled={disabled}
      onClick={!actions || actions.length === 0 ? () => attachments.openFileDialog() : undefined}
      aria-label="Attach files"
      title="Attach files"
    >
      <Icon name={icon} size="sm" />
    </Button>
  );

  if (!actions || actions.length === 0) {
    return buttonTrigger;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {buttonTrigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="min-w-[200px]">
        {actions.map((action, idx) => {
          if (isActionGroup(action)) {
            return (
              <React.Fragment key={action.id ?? action.label ?? `group-${idx}`}>
                {idx > 0 && <DropdownMenuSeparator />}
                <DropdownMenuGroup>
                  {action.label && (
                    <DropdownMenuLabel>{action.label}</DropdownMenuLabel>
                  )}
                  {action.items.map((item) =>
                    renderActionItem(item, attachments)
                  )}
                </DropdownMenuGroup>
              </React.Fragment>
            );
          }
          return renderActionItem(action, attachments);
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


/** Renders a preview chip (thumbnail + remove) per attached file. */
function AttachmentPreviews() {
  const attachments = usePromptInputAttachments();
  if (!attachments.files.length) return null;
  return (
    <InputGroupAddon align="block-start" className="w-full justify-start px-3.5 pt-3 pb-1 border-0 bg-transparent">
      <PromptInputAttachments className="w-full justify-start self-start px-0 pt-0 gap-2">
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
