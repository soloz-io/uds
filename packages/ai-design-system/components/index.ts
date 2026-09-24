// Root public runtime API: feature-layer values only.
export * from './features';

// Root public type API: allow contracts from all layers.
export type * from './primitives';
export type { AppHeaderProps, TabItem } from './composites/AppHeader/interfaces';
export type * from './blocks';
export type * from './features';

// Composites (value exports not covered by export type *)
export {
  ModeSwitcher,
  ApprovalCard,
  ProjectSwitcher,
  FormReportsDrawerForm,
  ChatToggleButton,
  SessionHeader,
  AppBreadcrumb,
  PromptInput,
  PromptInputProvider,
  usePromptInputController,
  usePromptInputAttachments,
  useOptionalPromptInputController,
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
  TaskQueue,
} from './composites';
export type {
  ApprovalCardProps,
  ActionRequest,
  ReviewConfig,
  ProjectSwitcherProps,
  Project,
  FormReportsDrawerFormProps,
  SessionHeaderProps,
  ChatSessionInfo,
  AppBreadcrumbProps,
  BreadcrumbItemData,
  PromptInputBlockProps,
  PromptInputContextProps,
  PromptInputControllerProps,
  AttachmentsContext,
  TextInputContext,
  PromptInputProviderProps,
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
  TaskQueueProps,
  TaskItem,
  TaskStatus,
} from './composites';
export { WorkflowCanvas, getLayoutedElements, bmcToCanvas, SectionLayout, ExpoAppPreview } from './blocks';
export type { SectionLayoutSection, ExpoAppPreviewProps } from './blocks';

// External library re-exports
export { ReactFlowProvider, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
export type { Node, NodeChange, EdgeChange, Connection, OnConnectStartParams } from '@xyflow/react';

export { toast, Toaster } from 'sonner';
export type { ExternalToast, ToastT, ToasterProps } from 'sonner';

// Utilities
export { cn } from '@/lib/utils';
export { ButtonSwitcher } from './composites';
export type { ButtonSwitcherProps, ButtonSwitcherItem } from './composites';

// Canvas agent-presence pin (registered as the `agentAnnotation` node type)
export { AgentAnnotation } from './composites';
export type { AgentAnnotationNodeData, AgentAnnotationStatus } from './composites';

// Device preview composites (canvas + toolbar)
export { DevicePreviewNode, DEVICE_PRESETS, DEFAULT_PRESET_ID, getPreset, DevicePreviewToolbar } from './composites';
export type {
  DevicePreset,
  DevicePreviewNodeData,
  DevicePreviewNodeType,
  DeviceScreenshotRequest,
  DevicePreviewToolbarProps,
  DevicePreviewRoute,
} from './composites';
