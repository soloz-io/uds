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
  SpeechInput,
  StoriesBar,
  StoryPlayer,
  ScenePlayer,
  AccountDialog,
  AccountButton,
  SiteHeader,
  AnnouncementBanner,
  SolutionsLayout,
  FeatureCard,
  SideSheet,
  SideSheetRoot,
  SideSheetTrigger,
  SideSheetClose,
  SideSheetContent,
  SideSheetHeader,
  SideSheetFooter,
  SideSheetTitle,
  SideSheetDescription,
  SceneReviewSheet,
  ShareDialog,
} from './composites';
export type {
  ShareDialogProps,
  ShareItem,
  ExpiryDuration,
  SideSheetProps,
  SceneReviewSheetProps,
  SceneReviewComment,
  SceneCommentStatus,
  SceneCommentHistoryStep,
  AccountDialogProps,
  AccountButtonProps,
  AccountUser,
  StoriesBarProps,
  StoryItem,
  StoryPlayerProps,
  StorySegment,
  ScenePlayerProps,
  SceneItem,
  SpeechInputProps,
  ApprovalCardProps,
  ActionRequest,
  ReviewConfig,
  ProjectSwitcherProps,
  ProjectSwitcherItem,
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
export type {
  SiteHeaderProps,
  NavItem,
  NavDropdownItem,
  AnnouncementBannerProps,
  SolutionsLayoutProps,
  SolutionTab,
  FeatureCardProps,
  FeatureCardAction,
} from './composites';

export {
  WorkflowCanvas,
  getLayoutedElements,
  bmcToCanvas,
  SectionLayout,
  ExpoAppPreview,
  HeroSection,
  FeatureSection,
} from './blocks';
export type {
  SectionLayoutSection,
  ExpoAppPreviewProps,
  HeroSectionProps,
  FeatureSectionProps,
} from './blocks';

// NavigationMenu and Primitives
export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from './primitives/NavigationMenu';
export type {
  NavigationMenuProps,
  NavigationMenuListProps,
  NavigationMenuItemProps,
  NavigationMenuContentProps,
  NavigationMenuTriggerProps,
  NavigationMenuLinkProps,
  NavigationMenuIndicatorProps,
  NavigationMenuViewportProps,
} from './primitives/NavigationMenu';

// External library re-exports
export { ReactFlowProvider, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
export type { Node, NodeChange, EdgeChange, Connection, OnConnectStartParams } from '@xyflow/react';

export { toast, Toaster } from 'sonner';
export type { ExternalToast, ToastT, ToasterProps } from 'sonner';

// Utilities
export { cn } from '@/lib/utils';
// Calendar days in the reader's time zone
export { formatDayLabel, dayKey, isSameDay, userTimeZone } from '@/lib/date';
export type { DayOptions } from '@/lib/date';
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
