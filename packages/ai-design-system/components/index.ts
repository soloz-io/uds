// Root public runtime API: feature-layer values only.
export * from './features';

// Root public type API: allow contracts from all layers.
export type * from './primitives';
export type * from './composites';
export type * from './blocks';
export type * from './features';

// Composites (value exports not covered by export type *)
export { ModeSwitcher } from './composites';

// External library re-exports
export { ReactFlowProvider, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
export type { NodeChange, EdgeChange, Connection } from '@xyflow/react';

// Utilities
export { cn } from '@/lib/utils';
