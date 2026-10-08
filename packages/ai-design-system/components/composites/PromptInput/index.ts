export { PromptInput } from "./PromptInput";
export type {
  PromptInputBlockProps,
  PromptInputContextProps,
  AttachmentActionItem,
  AttachmentActionGroup,
  AttachmentAction,
  AttachmentBadge,
  AttachmentItemData,
  PromptInputAttachmentFile,
} from "./PromptInput";

export { SpeechInput } from "@/components/ai-elements/speech-input";
export type { SpeechInputProps } from "@/components/ai-elements/speech-input";

export {
  PromptInputProvider,
  usePromptInputController,
  usePromptInputAttachments,
  useOptionalPromptInputController,
} from "@/components/ai-elements/prompt-input";

export type {
  PromptInputControllerProps,
  AttachmentsContext,
  TextInputContext,
  PromptInputProviderProps,
} from "@/components/ai-elements/prompt-input";

export {
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

export type {
  ContextProps,
  ContextTriggerProps,
  ContextContentProps,
  ContextContentHeaderProps,
  ContextContentBodyProps,
  ContextContentFooterProps,
  ContextInputUsageProps,
  ContextOutputUsageProps,
  ContextReasoningUsageProps,
  ContextCacheUsageProps,
} from "@/components/ai-elements/context";

