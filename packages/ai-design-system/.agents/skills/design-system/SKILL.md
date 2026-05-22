---
name: design-system
description: Comprehensive guide for working with the AI Design System. Use when building components, validating architecture, managing layers (primitives/ai-elements/composites/blocks/features), enforcing import rules, using design tokens, or ensuring accessibility compliance. Essential for maintaining design system governance and architectural integrity.
---

# AI Design System

A comprehensive skill for working with the AI Design System - a layered, validated, and governed component library built with React, Tailwind CSS, and Radix UI.

## When to Use This Skill

Use this skill when:
- Building new components in any layer (primitives, ai-elements, composites, blocks, features)
- Validating layer architecture and import rules
- Working with design tokens instead of hardcoded CSS values
- Ensuring accessibility compliance (WCAG 2.1 AA)
- Publishing components to npm
- Running validation scripts
- Understanding the strict layer hierarchy
- Fixing import violations or token violations
- Setting up git hooks for governance

> For Storybook story writing, see the **storybook-guidelines** skill.

## Core Principles

1. **Strict Layer Architecture** - Components must follow the defined hierarchy
2. **Progressive Disclosure** - Build from simple to complex
3. **Design Token First** - Never use hardcoded CSS values
4. **Storybook Coverage** - All primitives and blocks must have stories (see storybook-guidelines skill)
5. **Accessibility by Default** - WCAG 2.1 AA compliance required
6. **Import Alias Enforcement** - Always use `@/` imports, never relative paths
7. **Validation Before Commit** - All validations must pass

---

## CRITICAL Design Patterns (Read First)

These patterns apply to all components across all layers. Violating them causes cascading refactors.

### 1. Composites Are Dumb UI Shells

A composite must be a **pure presentation component**. It accepts data and callbacks as props and renders UI. It must never:
- Hardcode which UI elements appear based on feature-specific logic
- Contain business logic or state
- Know about the specific feature consuming it

When a composite has variable content (e.g. a toolbar with different buttons per feature), model that content as **generic data props** — not as specific named callbacks.

**✅ CORRECT — generic data-driven props:**
```tsx
export interface ToolbarAction {
  id: string
  icon: ReactNode
  title: string
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
}

export function ToolbarActions({ actionGroups }: { actionGroups: ToolbarAction[][] }) {
  return actionGroups.map(group => (
    <ButtonGroup>{group.map(action => <Button key={action.id} .../>)}</ButtonGroup>
  ))
}
```

**❌ WRONG — feature-specific named props:**
```tsx
export function ToolbarActions({ onSave, onCancel, onUndo, onRedo, isSaving }) {
  // Hardcoded to one feature's needs
}
```

The **feature** owns the button definitions and passes them as data:
```tsx
<ToolbarActions
  actionGroups={[
    [
      { id: "undo", icon: <Undo2 />, title: "Undo", onClick: onUndo, disabled: !canUndo },
      { id: "save", icon: <Save />, title: "Save", onClick: onSave, loading: isSaving },
    ],
  ]}
/>
```

### 2. Features Accept Individual Props, Never a Hook Object

Features accept **individual props** directly — the same as any other component. The consuming application wires up a hook and passes its values as individual props.

**✅ CORRECT — individual props:**
```tsx
export interface MyFeatureProps {
  title?: string
  items?: Item[]
  isLoading?: boolean
  onSave?: () => void
  onCancel?: () => void
}
```

**❌ WRONG — hook object prop:**
```tsx
export interface MyFeatureProps {
  hook: UseMyFeatureReturn  // Never do this
}
```

**Why?** Individual props allow:
- `args`-based Storybook stories without mock hooks
- `play` functions in behavior tests
- Storybook controls to work
- The component to be used without any specific hook implementation

The mock hook is only used in `WithStateManagement` stories:
```tsx
export const WithStateManagement: Story = {
  render: () => {
    const hook = useMyFeatureMock()
    return <MyFeature title={hook.title} items={hook.items} onSave={hook.onSave} />
  }
}
```

### 3. Composites Own Their Internal Layout and Alignment

The composite is responsible for its own internal layout, spacing, and alignment. The feature must never add wrapper elements to fix a composite's alignment.

**✅ CORRECT — composite owns its layout:**
```tsx
export function MyComposite({ className }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* composite owns all internal alignment */}
    </div>
  )
}
```

**❌ WRONG — feature wrapping composite to fix alignment:**
```tsx
// In feature
<div className="flex items-end justify-end">  {/* ❌ feature fixing composite layout */}
  <MyComposite />
</div>
```

If a composite needs layout variants, expose a `className` prop or a layout variant prop.

### 4. Split Named Exports for Slot-Based Layouts

When a composite has logically separate sections that go into different layout slots (e.g. left/right, header/footer), export them as **separate named components** rather than a single monolithic component.

**✅ CORRECT — separate exports:**
```tsx
export function ToolbarTitle(props: ToolbarTitleProps) { ... }   // goes in left slot
export function ToolbarActions(props: ToolbarActionsProps) { ... } // goes in right slot
export function Toolbar(props: ToolbarProps) { ... }              // convenience wrapper for standalone use
```

**❌ WRONG — single component with internal slot logic:**
```tsx
export function Toolbar({ leftContent, rightContent }) { ... }  // forces feature to build its own layout
```

The feature then places each part independently:
```tsx
<Canvas
  topLeft={<ToolbarTitle ... />}
  topRight={<ToolbarActions ... />}
/>
```

### 5. Blocks Expose Generic Slots, Not Feature-Specific Props

A block that hosts other components (e.g. a canvas, a layout container) should expose **generic `ReactNode` slots** — not feature-specific props. The block does not know or care what goes in the slots.

**✅ CORRECT — generic slots:**
```tsx
export interface CanvasProps {
  topLeft?: ReactNode   // generic — accepts anything
  topRight?: ReactNode  // generic — accepts anything
  bottomLeft?: ReactNode
}
```

**❌ WRONG — feature-specific props on a block:**
```tsx
export interface CanvasProps {
  toolbar?: ReactNode        // too specific
  workflowName?: string      // belongs in feature, not block
  onSave?: () => void        // belongs in feature, not block
}
```

### 6. Floating UI Goes in Canvas Slots, Not Above the Canvas

When UI needs to overlay a canvas or full-screen area (toolbars, overlays, controls), it should be rendered **inside** the canvas via floating slots — not stacked above it in the DOM.

**✅ CORRECT — floating inside canvas:**
```tsx
<Canvas
  topLeft={<Toolbar ... />}   // floats over canvas
  topRight={<Actions ... />}  // floats over canvas
/>
// Canvas takes full height, toolbar floats on top
```

**❌ WRONG — stacked above canvas:**
```tsx
<div className="flex flex-col h-full">
  <Toolbar ... />   {/* takes space, reduces canvas height */}
  <Canvas ... />
</div>
```

### 7. Sub-Components Are Private Unless Explicitly Exported

Internal helper components within a composite or block are **private by default**. Only export what the consuming layer needs.

```tsx
// Private — not exported
function SaveButton({ isSaving, onSave }) { ... }
function VisibilityToggle({ visibility, onToggle }) { ... }

// Public — exported from index.ts
export function Toolbar(props) { ... }
export function ToolbarActions(props) { ... }
```

If a sub-component needs to be used independently by a feature, it becomes a **separate composite** with its own folder and exports.

### 8. Full-Screen Features Must Own Their Height — Never Fix Styling in Stories

Features that render full-screen content (canvas, editors, layouts) must set their own height. **Never add wrapper divs, decorators, or inline styles in stories to fix a component's layout.**

If a story canvas is blank or unsized, the fix belongs in the **component**, not the story.

```tsx
// ✅ CORRECT — feature owns its height
export function MyFeature({ className }: MyFeatureProps) {
  return (
    <div className={cn("relative h-screen w-full", className)}>
      {/* content */}
    </div>
  )
}
```

```tsx
// ❌ WRONG — relies on parent for height
export function MyFeature({ className }: MyFeatureProps) {
  return (
    <div className={cn("relative h-full w-full", className)}>
      {/* content */}
    </div>
  )
}
```

```tsx
// ❌ WRONG — fixing component layout in the story
export const Default: Story = {
  decorators: [(Story) => <div style={{ height: '100vh' }}><Story /></div>],
  render: () => <div style={{ width: '100vw', height: '100vh' }}><MyFeature /></div>,
}
```

This applies to all layout concerns — spacing, overflow, scroll, background. If it looks wrong in Storybook, fix the component.


Before building a new composite or feature, check `archived/` for reference implementations. References show the intended design — extract the UI pattern and strip the business logic.

Key things to extract from references:
- Responsive layout patterns (mobile vs desktop)
- Button grouping and visual hierarchy
- Loading/disabled/error state handling
- Icon and label conventions



## Layer Architecture

The design system enforces a **strict 6-layer hierarchy**:

```
┌─────────────────────────────────────────┐
│  6. features/                           │  ← Can import: blocks, composites
│     (AIDocEditor, PageLayout)           │
├─────────────────────────────────────────┤
│  5. blocks/                             │  ← Can import: composites, primitives
│     (AIConversation, AppSidebar)        │
├─────────────────────────────────────────┤
│  4. composites/                         │  ← Can import: primitives, ai-elements
│     (DataTable, PromptInput)            │
├─────────────────────────────────────────┤
│  3. ai-elements/                        │  ← Can import: ONLY ui/
│     (Message, Artifact, CodeBlock)      │
├─────────────────────────────────────────┤
│  2. primitives/                         │  ← Can import: ONLY ui/
│     (Button, Input, Card)               │
├─────────────────────────────────────────┤
│  1. ui/                                 │  ← shadcn/ui base (no project imports)
│     (Radix UI wrappers)                 │
└─────────────────────────────────────────┘
```

### Layer Rules (CRITICAL)

**primitives/**
- ✅ CAN import from: `components/ui/`
- ❌ CANNOT import from: ai-elements, composites, blocks, features
- Purpose: Base reusable components

**ai-elements/**
- ✅ CAN import from: `components/ui/`
- ❌ CANNOT import from: primitives, composites, blocks, features
- Purpose: Specialized AI-specific components

**composites/**
- ✅ CAN import from: `components/primitives/`, `components/ai-elements/`
- ❌ CANNOT import from: `components/ui/`, blocks, features
- Purpose: **Combinations of primitives and ai-elements** (reusable units)
- Examples: TableToolbar, PromptInput, WorkflowToolbar, StatsCard

**blocks/**
- ✅ CAN import from: `components/composites/`, `components/primitives/`
- ❌ CANNOT import from: `components/ui/`, ai-elements, features
- Purpose: **Complete UI sections** (self-contained page sections)
- Examples: AIConversation, AppSidebar, WorkflowCanvasBlock

**features/**
- ✅ CAN import from: `components/blocks/`, `components/composites/`
- ❌ CANNOT import from: `components/ui/`, ai-elements, primitives
- Purpose: Complete feature implementations

## Validation Scripts

The design system has **7 automated validation scripts** that enforce governance:

### 1. Layer Import Validation
**Script**: `scripts/validate-layer-imports.js`
**Enforces**: Strict layer hierarchy rules
**Checks**: 
- No upward imports (lower layers importing higher layers)
- No forbidden cross-layer imports
- Proper import paths

**Run**: `node scripts/validate-layer-imports.js`

### 2. Storybook Coverage Validation
**Script**: `scripts/validate-storybook-coverage.js`
**Enforces**: All primitives and blocks have `.stories.tsx` files
**Checks**:
- Story file exists for each component
- Proper naming conventions
- Required story exports

**Run**: `node scripts/validate-storybook-coverage.js`

### 3. Design Token Validation
**Script**: `scripts/validate-design-tokens.js`
**Enforces**: No hardcoded CSS values
**Forbidden**:
- Direct colors: `#hex`, `rgb()`, `rgba()`, `hsl()`
- Direct spacing: `'16px'`, `'1rem'`, `'2em'`

**Required**:
- CSS variables: `var(--token-color-primary)`
- Tailwind classes: `bg-primary`, `p-4`

**Run**: `node scripts/validate-design-tokens.js`

### 4. Story Composition Validation
**Script**: `scripts/validate-story-composition.js`
**Enforces**: Stories only render their own component
**Checks**: No nested component imports in stories

**Run**: `node scripts/validate-story-composition.js`

### 5. Feature Story Validation
**Script**: `scripts/validate-feature-stories.js`
**Enforces**: Features have proper state management stories
**Checks**:
- `WithStateManagement` story export exists
- Mock hook file (`.mock.ts`) exists
- Hook contract (`hooks/useFeatureName.d.ts`) exists

**Run**: `node scripts/validate-feature-stories.js`

### 6. Behavior Stories Validation
**Script**: `scripts/validate-behavior-stories.js`
**Enforces**: Features have behavior testing stories
**Checks**: Behavior test coverage for features

**Run**: `node scripts/validate-behavior-stories.js`

### 7. Import Alias Validation
**Script**: `scripts/validate-import-aliases.js`
**Enforces**: All imports use `@/` alias
**Forbidden**: `../../components/`, `../components/`
**Required**: `@/components/`, `@/lib/`, `@/types/`
**Allowed**: `./Component` (same directory), `./subdir/Component` (subdirectory)

**Run**: `node scripts/validate-import-aliases.js`

### Run All Validations
```bash
# Master validation script
node scripts/run-all-validations.js

# Or via npm
pnpm run prebuild
```

## Creating New Components

### Step 1: Choose the Correct Layer

Use this decision tree:

#### Primitives (Layer 2)
**When**: Single-purpose, reusable UI element wrapping shadcn/ui
**Examples**: Button, Input, Card, Badge, Avatar
**Test**: Can it be used alone without other components?
**Imports**: Only `@/components/ui/`

#### AI-Elements (Layer 3)
**When**: AI-specific, single-purpose component
**Examples**: Message, Artifact, CodeBlock, ChainOfThought
**Test**: Is it specific to AI/LLM interactions?
**Imports**: Only `@/components/ui/`

#### Composites (Layer 4)
**When**: Combines 2+ primitives/ai-elements into a reusable unit
**Examples**: 
- `TableToolbar` (combines Button + Input + DropdownMenu)
- `PromptInput` (combines Input + Button)
- `WorkflowToolbar` (combines Button + ButtonGroup + DropdownMenu)
- `StatsCard` (combines Card + primitives)
**Test**: Does it combine multiple primitives but isn't a complete section?
**Key Distinction**: Composites are **reusable combinations**, not complete sections
**Imports**: `@/components/primitives/`, `@/components/ai-elements/`

#### Blocks (Layer 5)
**When**: Complete, self-contained UI section (not just a combination)
**Examples**:
- `AIConversation` (entire chat interface)
- `AppSidebar` (complete sidebar with navigation)
- `WorkflowCanvasBlock` (complete canvas with ReactFlow)
- `DocumentEditorWithComments` (complete editor section)
**Test**: Is it a complete UI section that could stand alone on a page?
**Key Distinction**: Blocks are **complete sections**, not just combinations
**Imports**: `@/components/composites/`, `@/components/primitives/`

#### Features (Layer 6)
**When**: Complete feature with state management and business logic
**Examples**: AIDocEditor, PageLayout, WorkflowBuilder
**Test**: Does it manage state, handle API calls, or contain business logic?
**Imports**: `@/components/blocks/`, `@/components/composites/`

#### Quick Decision Guide

```
Is it a single UI element? → Primitive or AI-Element
Is it combining 2+ primitives? → Composite
Is it a complete UI section? → Block
Does it have state/business logic? → Feature
```

#### Common Confusion: Composite vs Block

**Composite** = Toolbar, Input Group, Card with Actions
- Combines primitives
- Reusable across contexts
- No complete section on its own
- Example: `TableToolbar`, `WorkflowToolbar`

**Block** = Sidebar, Conversation, Canvas, Editor
- Complete UI section
- Could be a page section
- Self-contained functionality
- Example: `AppSidebar`, `AIConversation`

### Step 2: Create Component Structure

```
components/{layer}/{ComponentName}/
├── {ComponentName}.tsx          # Main component
├── {ComponentName}.stories.tsx  # Storybook stories (REQUIRED for primitives/blocks)
├── index.ts                     # Exports
└── hooks/                       # Feature hooks (features only)
    ├── useFeatureName.d.ts      # Hook contract
    └── useFeatureName.mock.ts   # Mock implementation
```

> For story writing patterns, see the **storybook-guidelines** skill.

### Step 3: Component Template

```tsx
// components/{layer}/{ComponentName}/{ComponentName}.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const componentVariants = cva(
  "base-classes-using-tokens",
  {
    variants: {
      variant: {
        default: "variant-classes",
        secondary: "variant-classes",
      },
      size: {
        default: "size-classes",
        sm: "size-classes",
        lg: "size-classes",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ComponentNameProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {
  // Additional props
}

export function ComponentName({
  className,
  variant,
  size,
  ...props
}: ComponentNameProps) {
  return (
    <div
      className={cn(componentVariants({ variant, size, className }))}
      {...props}
    />
  );
}
```

### Step 4: Create Index File

```tsx
// components/{layer}/{ComponentName}/index.ts
export { ComponentName } from "./ComponentName";
export type { ComponentNameProps } from "./ComponentName";
```

### Step 5: Create Storybook Story (REQUIRED)

> See **storybook-guidelines** skill for full story writing patterns and requirements.

```tsx
// components/{layer}/{ComponentName}/{ComponentName}.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { ComponentName } from "./ComponentName";

const meta = {
  title: "{Layer}/ComponentName",
  component: ComponentName,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Component content" },
};
```

### Step 6: Validate

```bash
# Run all validations
node scripts/run-all-validations.js

# Or run specific validation
node scripts/validate-layer-imports.js
node scripts/validate-storybook-coverage.js
node scripts/validate-design-tokens.js
node scripts/validate-import-aliases.js
```

## Import Rules

### ✅ CORRECT Imports

```tsx
// Use @/ alias for all project imports
import { Button } from "@/components/primitives/Button";
import { DataTable } from "@/components/composites/DataTable";
import { cn } from "@/lib/utils";
import { useFeature } from "@/hooks/useFeature";

// Same directory imports are allowed
import { ComponentHelper } from "./ComponentHelper";
import { types } from "./types";
```

### ❌ INCORRECT Imports

```tsx
// Never use relative paths for project imports
import { Button } from "../../primitives/Button";  // ❌
import { DataTable } from "../composites/DataTable";  // ❌

// Never import from higher layers
// In primitives/
import { DataTable } from "@/components/composites/DataTable";  // ❌

// Never import from ui/ in composites or higher
// In composites/
import { Button as UIButton } from "@/components/ui/button";  // ❌
```

## Design Tokens

### ✅ CORRECT Token Usage

```tsx
// Use Tailwind classes
<div className="bg-primary text-primary-foreground p-4 rounded-lg" />

// Use CSS variables
<div style={{ color: "var(--color-primary)" }} />

// Use CVA with token-based classes
const variants = cva("base-class", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
    },
  },
});
```

### ❌ INCORRECT Hardcoded Values

```tsx
// Never use hardcoded colors
<div style={{ color: "#3b82f6" }} />  // ❌
<div style={{ backgroundColor: "rgb(59, 130, 246)" }} />  // ❌

// Never use hardcoded spacing
<div style={{ padding: "16px" }} />  // ❌
<div style={{ margin: "1rem" }} />  // ❌

// Never use hardcoded values in className
<div className="text-[#3b82f6]" />  // ❌
```

## Common Workflows

### Workflow 1: Adding a New Primitive

1. Create component in `components/primitives/NewComponent/`
2. Use ONLY imports from `@/components/ui/`
3. Use design tokens (Tailwind classes or CSS variables)
4. Create `.stories.tsx` file — see **storybook-guidelines** skill
5. Export from `index.ts`
6. Run validations: `node scripts/run-all-validations.js`
7. Commit (pre-commit hook will validate)

### Workflow 2: Adding a New Composite

1. Create component in `components/composites/NewComposite/`
2. Import from `@/components/primitives/` or `@/components/ai-elements/`
3. Never import from `@/components/ui/` directly
4. Combine 2+ primitives into a reusable unit
5. Use design tokens
6. Create `.stories.tsx` file — see **storybook-guidelines** skill
7. Run validations
8. Commit

**Example**: Creating a SearchToolbar composite
- Combines: Input + Button + DropdownMenu (all primitives)
- Reusable across different contexts
- No business logic, just UI combination

### Workflow 2b: Adding a New Block

1. Create component in `components/blocks/NewBlock/`
2. Import from `@/components/composites/` or `@/components/primitives/`
3. Never import from `@/components/ui/` or `@/components/ai-elements/`
4. Build a complete, self-contained UI section
5. Use design tokens
6. Create `.stories.tsx` file (REQUIRED) — see **storybook-guidelines** skill
7. Run validations
8. Commit

### Workflow 3: Adding a New Feature

1. Create component in `components/features/NewFeature/`
2. Import from `@/components/blocks/` or `@/components/composites/`
3. **Accept individual props** — never a `hook` object (see CRITICAL Design Patterns)
4. Create hook contract: `hooks/useNewFeature.ts` with `UseNewFeatureReturn` interface
5. Create mock hook: `hooks/useNewFeature.mock.ts`
6. Create `.stories.tsx` with `Default` (args) + `WithStateManagement` (render + mock hook)
7. Create `.behaviors.stories.tsx` with `play` functions using `args` + `fn()`
8. Run validations
9. Commit

### Workflow 4: Fixing Layer Import Violations

1. Run `node scripts/validate-layer-imports.js`
2. Identify the violation (file, line, import)
3. Check the layer rules for your component's layer
4. Replace forbidden import with allowed layer import
5. Re-run validation
6. Commit

### Workflow 5: Fixing Token Violations

1. Run `node scripts/validate-design-tokens.js`
2. Identify hardcoded values (colors, spacing)
3. Replace with Tailwind classes or CSS variables
4. Re-run validation
5. Commit

## Git Hooks

### Setup Hooks

```bash
bash scripts/setup-hooks.sh
```

This installs a pre-commit hook that runs all validations automatically.

### Pre-Commit Hook

Located at: `scripts/hooks/pre-commit`

Runs:
- Layer import validation
- Storybook coverage validation
- Design token validation
- Story composition validation
- Feature story validation
- Behavior stories validation
- Import alias validation

### Bypass Hook (NOT RECOMMENDED)

```bash
git commit --no-verify
```

Only use in emergencies. Fix violations immediately after.

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Component Variants**: Class Variance Authority (CVA)
- **Base Components**: Radix UI
- **Documentation**: Storybook 10
- **Type Safety**: TypeScript 5 (strict mode)
- **Icons**: Lucide React
- **Animation**: Motion (Framer Motion)
- **Design Tokens**: Style Dictionary

## Package Scripts

```bash
pnpm dev                  # Start dev server (builds tokens first)
pnpm build                # Production build (validates first)
pnpm build:lib            # Build for npm publishing
pnpm prebuild             # Run all validations
pnpm tokens:build         # Build design tokens
pnpm tokens:watch         # Watch design tokens
pnpm storybook            # Start Storybook
pnpm build-storybook      # Build Storybook
```

## Accessibility Requirements

All components MUST meet **WCAG 2.1 Level AA**:

- ✅ Keyboard navigation support
- ✅ Screen reader compatibility
- ✅ Proper ARIA attributes
- ✅ Focus management
- ✅ Color contrast requirements (4.5:1 for text)
- ✅ Touch target size (44x44px minimum)

## References

For detailed information on specific topics, see:

- [Layer Architecture](./references/layer-architecture.md) - Detailed layer rules and examples
- [Validation Scripts](./references/validation-scripts.md) - Complete validation guide
- [Component Patterns](./references/component-patterns.md) - Common component patterns
- [Design Tokens](./references/design-tokens.md) - Token system and usage
- [Accessibility](./references/accessibility.md) - WCAG compliance guide
- [Import Rules](./references/import-rules.md) - Import alias and path rules

> For Storybook story writing, see the **storybook-guidelines** skill and its references.

## Quick Reference

### Layer Import Matrix

| Layer | Can Import From |
|-------|----------------|
| ui/ | External libraries only |
| primitives/ | ui/ |
| ai-elements/ | ui/ |
| composites/ | primitives/, ai-elements/ |
| blocks/ | composites/, primitives/ |
| features/ | blocks/, composites/ |

### Validation Commands

```bash
# All validations
node scripts/run-all-validations.js

# Individual validations
node scripts/validate-layer-imports.js
node scripts/validate-storybook-coverage.js
node scripts/validate-design-tokens.js
node scripts/validate-story-composition.js
node scripts/validate-feature-stories.js
node scripts/validate-behavior-stories.js
node scripts/validate-import-aliases.js
```

### Common Fixes

**Layer violation**: Change import to allowed layer
**Token violation**: Replace hardcoded value with Tailwind class or CSS variable
**Story missing**: Create `.stories.tsx` file — see **storybook-guidelines** skill
**Import alias violation**: Replace `../../` with `@/`
**Feature story violation**: Add `WithStateManagement` story and mock hook — see **storybook-guidelines** skill

## Troubleshooting

### "Layer import violation"
- Check which layer your component is in
- Review allowed imports for that layer
- Use `@/` imports, not relative paths
- Never import from higher layers

### "Design token violation"
- Replace `#hex` colors with Tailwind classes
- Replace `16px` spacing with Tailwind spacing classes
- Use `var(--token-name)` for custom values

### "Storybook coverage violation"
- See **storybook-guidelines** skill for story requirements

### "Import alias violation"
- Replace `../../components/` with `@/components/`
- Replace `../lib/` with `@/lib/`
- Keep `./` imports for same-directory files

## Best Practices

1. **Always validate before committing** - Run `node scripts/run-all-validations.js`
2. **Use the correct layer** - Don't put composites in primitives, or blocks in composites
3. **Composite vs Block**: If it combines primitives → Composite. If it's a complete section → Block
4. **Design tokens only** - Never hardcode colors or spacing
5. **Import aliases always** - Use `@/` for all project imports
6. **Stories are required** - All primitives and blocks need stories (see **storybook-guidelines** skill)
7. **Accessibility first** - Test with keyboard and screen reader
8. **Type everything** - Use TypeScript strict mode
9. **Document variants** - Use CVA for variant management

## Publishing

### Build for npm

```bash
pnpm build:lib
```

This:
1. Builds design tokens
2. Runs all validations
3. Compiles TypeScript
4. Generates type definitions
5. Creates dist/ bundle

### Publish to npm

```bash
pnpm publish
```

The `prepublishOnly` script ensures validations pass before publishing.

---

**Remember**: The validation scripts are your friends. They enforce consistency and prevent architectural drift. Always run them before committing!
