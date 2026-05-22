/**
 * design-schema  AI schema layer for ai-design-system.
 *
 * Root barrel re-exports the most commonly used APIs.
 * For tree-shaking, import directly from sub-paths:
 *   import { dashboardPreset } from "design-schema/presets/dashboard"
 *   import { dataSchemas }      from "design-schema/schemas/data"
 *   import { buildSystemPrompt } from "design-schema/prompts"
 */

// Default preset  most common starting point
export { dashboardPreset, dashboardCatalog, buildUserPrompt } from "./presets/dashboard/index.js";

// All presets
export { formPreset, formCatalog } from "./presets/form/index.js";
export { workflowPreset, workflowCatalog } from "./presets/workflow/index.js";
export { fullPreset, fullCatalog } from "./presets/full/index.js";

// Schema domains (backend-safe)
export { coreSchemas } from "./schemas/core/index.js";
export { dataSchemas } from "./schemas/data/index.js";
export { workflowSchemas } from "./schemas/workflow/index.js";
export { aiSchemas } from "./schemas/ai/index.js";

// Prompt helpers
export { buildSystemPrompt } from "./prompts/index.js";
export type { SystemPromptOptions } from "./prompts/index.js";

// Store types
export type { SchemaRecord, SchemaStore } from "./store/types.js";

// Renderer (re-exports from @json-render/react for convenience)
export { Renderer, StateProvider, ActionProvider, createStateStore } from "./renderer/index.js";
export type { RendererProps, ComponentRegistry } from "./renderer/index.js";
