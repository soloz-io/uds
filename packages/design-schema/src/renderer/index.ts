"use client";

/**
 * design-schema/renderer
 *
 * Re-exports the core rendering primitives from @json-render/react so that
 * consumers only need to declare `design-schema` as a dependency — no direct
 * @json-render/* entries required.
 *
 * @example
 * ```tsx
 * import { Renderer, StateProvider, ActionProvider } from "design-schema/renderer"
 * import { dashboardPreset } from "design-schema/presets/dashboard"
 *
 * <StateProvider initialState={{}}>
 *   <ActionProvider actions={{}}>
 *     <Renderer spec={spec} registry={dashboardPreset.registry} />
 *   </ActionProvider>
 * </StateProvider>
 * ```
 */

export {
  Renderer,
  StateProvider,
  ActionProvider,
  JSONUIProvider,
  createRenderer,
  defineRegistry,
  createStateStore,
} from "@json-render/react";

export type {
  RendererProps,
  StateProviderProps,
  ActionProviderProps,
  ComponentRegistry,
} from "@json-render/react";
