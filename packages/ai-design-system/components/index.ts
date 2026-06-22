// Root public runtime API: feature-layer values only.
export * from './features';

// Root public type API: allow contracts from all layers.
export type * from './primitives';
export type { AppHeaderProps, TabItem } from './composites/AppHeader/interfaces';
export type * from './blocks';
export type * from './features';

// Composites (value exports not covered by export type *)
export { ModeSwitcher } from './composites';
export { getLayoutedElements } from './blocks';

// External library re-exports
export { ReactFlowProvider, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
export type { NodeChange, EdgeChange, Connection } from '@xyflow/react';

// Utilities
export { cn } from '@/lib/utils';
