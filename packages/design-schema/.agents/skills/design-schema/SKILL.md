---
name: design-schema
description: 'Guide for working with the design-schema npm package — the AI schema layer for ai-design-system. Use when building WithStateDesignSchema stories, creating JSON-UI specs, using Renderer, working with presets (dashboard/form/workflow/full), writing AI system prompts, managing schema state with Jotai/Drizzle adapters, or publishing a new version to npm. Essential for understanding how AI-generated schemas translate to rendered UI components.'
---

# design-schema

The `design-schema` package is the AI schema layer sitting between AI models and the `ai-design-system` component library. It provides:

- **Presets** — pre-built `ComponentRegistry` bundles (dashboard, form, workflow, full)
- **Schemas** — Zod schemas for validating AI-generated UI specs
- **Prompts** — helpers for generating LLM system/user prompts
- **Renderer** — re-exports `Renderer` from `@json-render/react` so consumers need only `design-schema` as a dependency
- **Adapters** — optional Jotai and Drizzle adapters for state persistence

## Package Structure

```
design-schema/
├── src/
│   ├── index.ts                   ← root barrel (most common exports)
│   ├── presets/
│   │   ├── dashboard/             ← dashboardPreset, dashboardCatalog, buildUserPrompt
│   │   ├── form/                  ← formPreset, formCatalog
│   │   ├── workflow/              ← workflowPreset, workflowCatalog
│   │   └── full/                  ← fullPreset, fullCatalog (all components)
│   ├── schemas/
│   │   ├── core/                  ← base element/spec Zod schemas
│   │   ├── data/                  ← table, stats, chart schemas
│   │   ├── workflow/              ← node, edge, graph schemas
│   │   └── ai/                    ← AI response envelope schemas
│   ├── registries/react/
│   │   ├── core.tsx               ← Button, Card, Badge, Text, Input mappings
│   │   ├── data.tsx               ← DataTable, StatsCard, Chart mappings
│   │   ├── workflow.tsx           ← WorkflowNode, WorkflowEdge mappings
│   │   └── ai.tsx                 ← Message, Artifact, CodeBlock mappings
│   ├── renderer/
│   │   └── index.ts               ← re-exports Renderer, StateProvider, ActionProvider
│   ├── prompts/
│   │   └── index.ts               ← buildSystemPrompt, SystemPromptOptions
│   ├── adapters/
│   │   ├── jotai/                 ← useSchemaStore, SchemaAtom helpers
│   │   └── drizzle/               ← SchemaRepository, migrate helpers
│   └── store/
│       └── types.ts               ← SchemaRecord, SchemaStore interfaces
```

## Key Import Paths

```ts
// Root barrel — most common APIs
import { dashboardPreset, Renderer, buildSystemPrompt } from "design-schema"

// Sub-path imports (tree-shakeable, preferred in production)
import { dashboardPreset }   from "design-schema/presets/dashboard"
import { dataSchemas }       from "design-schema/schemas/data"
import { buildSystemPrompt } from "design-schema/prompts"
import { Renderer }          from "design-schema/renderer"

// Optional adapters
import { useSchemaStore }    from "design-schema/adapters/jotai"
import { SchemaRepository }  from "design-schema/adapters/drizzle"
```

> ⚠️ Sub-path imports require `"moduleResolution": "bundler"` or `"node16"` in `tsconfig.json`.
> If using `"moduleResolution": "node"`, import from the root barrel: `import { ... } from "design-schema"`.

## Renderer — Rendering a Spec as UI

The core rendering pattern:

```tsx
import { Renderer, dashboardPreset } from "design-schema"

const spec = {
  root: "container",
  elements: {
    container: { type: "Card", props: { className: "p-4" }, children: ["title"] },
    title:     { type: "Text", props: { content: "Hello" } }
  }
}

export function MyUI() {
  return <Renderer spec={spec} registry={dashboardPreset.registry} />
}
```

### Spec Format (flat tree)

```ts
type UISpec = {
  root: string                        // key of the root element
  elements: Record<string, UIElement>
}

type UIElement = {
  type: string                        // component name in the registry
  props?: Record<string, unknown>
  children?: string[]                 // keys of child elements
}
```

## WithStateDesignSchema Stories Pattern

Each feature with a `WithStateManagement` story should also have a `WithStateDesignSchema` story that renders equivalent UI via the Renderer. See the [story pattern reference](./references/story-pattern.md).

## Available Presets

| Preset | Import | Components Included |
|--------|--------|-------------------|
| `dashboardPreset` | `design-schema/presets/dashboard` | Stats, DataTable, Card, Button, Badge, Text |
| `formPreset` | `design-schema/presets/form` | Input, Select, Checkbox, Form, Button |
| `workflowPreset` | `design-schema/presets/workflow` | WorkflowNode, Edge, Canvas |
| `fullPreset` | `design-schema/presets/full` | All of the above |

Each preset exposes:
- `.registry` — `ComponentRegistry` for `<Renderer registry={...} />`
- `.catalog` — array of `ComponentDefinition` for AI prompt generation
- `.buildUserPrompt(instructions)` — generates an AI user prompt with the catalog

## System Prompt Generation

```ts
import { buildSystemPrompt, dashboardPreset } from "design-schema"

const systemPrompt = buildSystemPrompt({
  preset: "dashboard",
  catalog: dashboardPreset.catalog,
  extraInstructions: "Always include a StatsCard at the top."
})
// Pass systemPrompt to your LLM call
```

## State Adapters

### Jotai (optional)
```ts
import { useSchemaStore } from "design-schema/adapters/jotai"

const { schema, saveSchema, loadSchema } = useSchemaStore("my-feature")
```

### Drizzle (optional)
```ts
import { SchemaRepository } from "design-schema/adapters/drizzle"

const repo = new SchemaRepository(db)
await repo.save({ id: "my-feature", spec: mySpec })
const record = await repo.load("my-feature")
```

## Build & Deployment

See [build-and-deployment.md](./references/build-and-deployment.md) for the full CI/CD workflow, version bumping, and npm publish process.

## Adding a New Registry Component

1. Add the component to the appropriate registry file in `src/registries/react/`
2. Add its `ComponentDefinition` to the relevant preset in `src/presets/`
3. Add a Zod schema in `src/schemas/` if the component has structured props
4. Run `npm run build` to verify no type errors
5. Bump the version (see [build-and-deployment.md](./references/build-and-deployment.md))
