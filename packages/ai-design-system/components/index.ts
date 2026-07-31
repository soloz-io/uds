// Root public runtime API: feature-layer values only.
export * from './features';

// Root public type API: allow contracts from all layers.
export type * from './primitives';
export type { AppHeaderProps, TabItem } from './composites/AppHeader/interfaces';
export type * from './blocks';
export type * from './features';

// Composites (value exports not covered by export type *)
export { ModeSwitcher, ApprovalCard, ProjectSwitcher, FormReportsDrawerForm, ChatToggleButton, SessionHeader, AppBreadcrumb } from './composites';
export type { ApprovalCardProps, ActionRequest, ReviewConfig, ProjectSwitcherProps, Project, FormReportsDrawerFormProps, SessionHeaderProps, ChatSessionInfo, AppBreadcrumbProps, BreadcrumbItemData } from './composites';
export { getLayoutedElements, bmcToCanvas, SectionLayout } from './blocks';
export type { SectionLayoutSection } from './blocks';

// External library re-exports
export { ReactFlowProvider, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
export type { NodeChange, EdgeChange, Connection } from '@xyflow/react';

export { toast, Toaster } from 'sonner';
export type { ExternalToast, ToastT, ToasterProps } from 'sonner';

// Utilities
export { cn } from '@/lib/utils';
export { ButtonSwitcher } from './composites';
export type { ButtonSwitcherProps, ButtonSwitcherItem } from './composites';
