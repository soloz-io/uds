# design-schema

The AI schema layer for `ai-design-system`. Provides everything a consumer app needs to let an AI model generate a UI — except the AI call itself.

```
ai-design-system        component implementations (React + Tailwind)
      ↑ peer dep
design-schema           schema definitions + React registries + prompt helpers   ← this package
      ↑ npm dep
waypoint-builder        (or any consumer app)
```

---

## What this package does

An AI model needs three things to generate a UI reliably:

1. **A system prompt** — describing exactly which components exist and what props they accept
2. **A rendered output** — a React registry that maps the AI's JSON output to real components
3. **A storage contract** — a TypeScript type for what gets persisted to the DB

`design-schema` provides all three. The AI call, state management, and persistence are owned entirely by the consumer.

---

## What this package does NOT do

- ❌ Make any AI / LLM calls
- ❌ Manage application state (no Jotai atoms, no Zustand)
- ❌ Write to any database
- ❌ Implement any business logic

---

## Peer Dependencies

```json
{
  "ai-design-system": "*",
  "@json-render/core": "*",
  "@json-render/react": "*",
  "@json-render/shadcn": "*",
  "zod": "^3",
  "react": "^18 || ^19"
}
```

`@json-render/shadcn` covers the 30 generic shadcn primitives (Button, Card, Input, Grid, etc.).  
`design-schema` extends it with `ai-design-system`-specific components (StatsCard, InteractiveChart, DataTable, WorkflowBuilder nodes, AI conversation elements).

---

## Package Structure

```
design-schema/
├── src/
│   ├── schemas/                   # Component definitions (Zod schemas + AI descriptions)
│   │   ├── core/                  # Re-exports @json-render/shadcn + layout overrides
│   │   ├── data/                  # StatsCard, InteractiveChart, DataTable
│   │   ├── workflow/              # StateNode, TransitionNode, WorkflowToolbar
│   │   └── ai/                    # PromptInput, Message, CodeBlock, ChainOfThought
│   │
│   ├── registries/
│   │   └── react/                 # Wires each schema domain to ai-design-system components
│   │       ├── core.tsx
│   │       ├── data.tsx
│   │       ├── workflow.tsx
│   │       └── ai.tsx
│   │
│   ├── presets/                   # Pre-assembled schema + registry bundles
│   │   ├── dashboard/             # core + data + feedback
│   │   ├── form/                  # core + forms + feedback
│   │   ├── workflow/              # core + workflow + ai
│   │   └── full/                  # Everything
│   │
│   ├── prompts/                   # System prompt builders
│   │   └── index.ts               # getSystemPrompt(), buildUserPrompt()
│   │
│   ├── store/                     # DB storage contract
│   │   └── types.ts               # SchemaRecord, SchemaStore interface
│   │
│   └── adapters/                  # Optional drop-in helpers
│       ├── jotai/                 # createSchemaAtoms(store) — Jotai atom factory
│       └── drizzle/               # schemaColumn() — Drizzle JSONB column type helper
│
├── package.json
├── vite.config.ts
└── README.md
```

---

## Exports

```
"."                              → full preset (dashboard) + store types
"./schemas/core"                 → layout primitives (backend-safe, no React)
"./schemas/data"                 → data display schemas
"./schemas/workflow"             → workflow component schemas
"./schemas/ai"                   → AI conversation schemas
"./registries/react/core"        → React registry for core
"./registries/react/data"        → React registry for data
"./registries/react/workflow"    → React registry for workflow
"./registries/react/ai"          → React registry for AI elements
"./presets/dashboard"            → dashboard catalog + registry + system prompt
"./presets/form"                 → form catalog + registry + system prompt
"./presets/workflow"             → workflow catalog + registry + system prompt
"./presets/full"                 → all domains bundled
"./prompts"                      → buildSystemPrompt(), buildUserPrompt()
"./store"                        → SchemaRecord type + SchemaStore interface
"./adapters/jotai"               → optional Jotai atom factories
"./adapters/drizzle"             → optional Drizzle column helper
```

Schemas (`./schemas/*`) are backend-safe — they import no React. Safe to use in a server-side route for building the LLM system prompt without pulling any component code into the backend bundle.

---

## Usage

### 1. Backend — build the LLM system prompt

```typescript
// waypoint-builder-backend/src/routes/generate-ui.ts
import { dashboardPreset, buildUserPrompt } from 'design-schema/presets/dashboard';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

app.post('/api/generate-ui', async (c) => {
  const { prompt, currentSpec } = await c.req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    system: dashboardPreset.getSystemPrompt(),        // design-schema builds this
    prompt: buildUserPrompt({ prompt, currentSpec }), // handles fresh vs. refinement
  });

  return result.toDataStreamResponse();
});
```

### 2. Frontend — render the AI-generated spec

```typescript
// waypoint-builder-frontend/src/components/AIUICanvas.tsx
import { dashboardPreset } from 'design-schema/presets/dashboard';
import { Renderer } from '@json-render/react';

export function AIUICanvas({ spec }) {
  return (
    <Renderer
      registry={dashboardPreset.registry}  // design-schema wires this
      spec={spec}                          // consumer manages this (Jotai atom, useState, etc.)
    />
  );
}
```

### 3. Persist the generated spec (optional interface)

```typescript
// waypoint-builder-frontend/src/lib/schema-store.ts
import type { SchemaStore, SchemaRecord } from 'design-schema/store';
import { api } from './api-client';

export class WaypointSchemaStore implements SchemaStore {
  async save(record: SchemaRecord)        { return api.schemas.create(record); }
  async load(id: string)                  { return api.schemas.get(id); }
  async list()                            { return api.schemas.list(); }
  async delete(id: string)               { return api.schemas.delete(id); }
}
```

### 4. Optional — Jotai adapter (for waypoint-style apps)

```typescript
// waypoint-builder-frontend/src/lib/schema-atoms.ts
import { createSchemaAtoms } from 'design-schema/adapters/jotai';
import { WaypointSchemaStore } from './schema-store';

// Provides: specAtom, loadSpecAtom, saveSpecAtom, hasUnsavedChangesAtom
// with built-in 1s debounce autosave — same pattern as the archived workflow-builder-template
export const schemaAtoms = createSchemaAtoms(new WaypointSchemaStore());
```

### 5. Use individual schemas on the backend (tree-shaking)

```typescript
// Only import the data schemas — no layout or workflow code in the bundle
import { dataSchemas } from 'design-schema/schemas/data';
import { buildSystemPrompt } from 'design-schema/prompts';

const systemPrompt = buildSystemPrompt(dataSchemas, {
  theme: 'dark',
  designRules: ['always include sample data in state', 'use StatsCard for numeric KPIs'],
});
```

---

## Preset Reference

| Preset | Domains included | Typical use case |
|---|---|---|
| `dashboard` | core + data + feedback + actions | Analytics pages, KPI dashboards |
| `form` | core + forms + feedback + actions | Data entry, settings pages |
| `workflow` | core + workflow + ai + actions | Workflow builders, process editors |
| `full` | All domains | General-purpose, unknown UI type |

---

## Schema Domains

### `core`
Re-exports `@json-render/shadcn`'s layout components: `Container`, `Stack`, `Grid`, `Card`, `Separator`, `Tabs`, `Accordion`, `Dialog`, `Drawer`.

### `data`
`ai-design-system`-specific data display:
- **`StatsCard`** — KPI card with label, value, trend indicator (up/down/neutral), description
- **`InteractiveChart`** — Recharts chart (area / bar / line), bound to state via `statePath`
- **`DataTable`** — TanStack table, accepts column definitions + `statePath` for row data

### `workflow`
- **`StateNode`** — Workflow state node with status badges
- **`TransitionNode`** — Workflow transition/edge node
- **`WorkflowToolbar`** — Save / undo / redo / execute toolbar

### `ai`
- **`Message`** — AI conversation message bubble (user / assistant)
- **`PromptInput`** — Chat input with submit
- **`CodeBlock`** — Syntax-highlighted code
- **`ChainOfThought`** — Collapsible reasoning display
- **`Artifact`** — Rendered output artifact frame

---

## `SchemaRecord` Type

What gets stored in the DB:

```typescript
interface SchemaRecord {
  id: string;
  name: string;
  description?: string;
  spec: Spec;                    // the json-render Spec object
  catalogPreset: string;         // e.g. "dashboard" — needed to pick the right registry on load
  version: string;               // design-schema package version at time of generation
  createdAt: string;             // ISO timestamp
  updatedAt: string;
}
```

`version` is stored alongside the spec so consumers can detect when a saved spec was generated against an older catalog and handle migration or re-generation.

---

## Versioning

| Bump | Reason | Impact |
|---|---|---|
| **Major** | Component name or prop shape renamed/removed | Saved specs may no longer render; system prompts are stale |
| **Minor** | New schema domain or new component added | Backward-compatible; old specs still render |
| **Patch** | AI description text improved, Zod refinements | May improve generation quality; no structural change |

**Recommendation for consumers:** pin the minor version in production (`"design-schema": "~1.2.0"`). Description text changes in patches can drift AI output even without schema changes.

---

## Extending with custom components

Consumers can add their own components to any preset without forking the package:

```typescript
import { dashboardPreset } from 'design-schema/presets/dashboard';
import { z } from 'zod';
import { MyCustomWidget } from '@my-org/components';

const extendedPreset = dashboardPreset.extend({
  schemas: {
    MyWidget: {
      props: z.object({ title: z.string(), dataKey: z.string() }),
      description: 'Custom widget for internal KPIs.',
      example: { title: 'Pipeline Health', dataKey: 'pipeline' },
    },
  },
  registry: {
    MyWidget: ({ props }) => <MyCustomWidget {...props} />,
  },
});
```

---

## Full lifecycle (waypoint example)

```
User types prompt in RefinementPanel
            ↓
    useAIUIBuilder hook (consumer code)
            ↓
    POST /api/generate-ui  { prompt, currentSpec? }
            ↓
    waypoint-builder-backend
      dashboardPreset.getSystemPrompt()    ← design-schema
      buildUserPrompt({ prompt })          ← design-schema
      streamText(model, system, prompt)    ← consumer's AI SDK call
      → stream SpecStream back to frontend
            ↓
    Frontend patches spec into Jotai atom  ← consumer's state logic
            ↓
    schemaAtoms.saveSpecAtom (debounced)   ← design-schema/adapters/jotai (optional)
      → api.schemas.save(SchemaRecord)     ← consumer's API + DB
            ↓
    <Renderer
      registry={dashboardPreset.registry}  ← design-schema
      spec={spec}                          ← consumer's Jotai atom
    />
```
