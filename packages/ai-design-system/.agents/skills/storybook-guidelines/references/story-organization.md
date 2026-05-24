# Story Organization

Complete guide to organizing stories in the AI Design System.

## File Structure

### Story File Location

Stories MUST be co-located with their components:

```
components/
├── primitives/
│   └── Button/
│       ├── Button.tsx
│       ├── Button.stories.tsx    ← Story file
│       └── index.ts
├── composites/
│   └── DataTable/
│       ├── DataTable.tsx
│       ├── DataTable.stories.tsx  ← Story file
│       └── index.ts
├── blocks/
│   └── AIConversation/
│       ├── AIConversation.tsx
│       ├── AIConversation.stories.tsx  ← Story file
│       └── index.ts
└── features/
    └── WorkflowCanvas/
        ├── WorkflowCanvas.tsx
        ├── WorkflowCanvas.stories.tsx  ← Story file
  ├── useWorkflowCanvas.d.ts
  ├── useWorkflowCanvas.mock.ts
        └── index.ts
```

### Naming Convention

**File naming**: `{ComponentName}.stories.tsx`

```
✅ Button.stories.tsx
✅ DataTable.stories.tsx
✅ AIConversation.stories.tsx

❌ button.stories.tsx        // Wrong case
❌ ButtonStories.tsx         // Wrong format
❌ Button.story.tsx          // Wrong extension
❌ stories/Button.tsx        // Wrong location
```

## Story Discovery

### Storybook Configuration

Stories are discovered from:

```tsx
// .storybook/main.ts
stories: [
  "../stories/**/*.mdx",
  "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  "../components/**/*.stories.@(js|jsx|mjs|ts|tsx)"  // Main discovery path
]
```

**Discovery rules**:
- Recursively scans `components/` directory
- Matches files ending in `.stories.tsx` or `.stories.ts`
- Ignores `node_modules/`
- Ignores `.next/` and `dist/`

## Title Hierarchy

### Layer-Based Organization

Stories are organized by layer in the Storybook sidebar:

```tsx
// Primitives
title: 'Primitives/Button'
title: 'Primitives/Input'
title: 'Primitives/Card'

// AI Elements
title: 'AI Elements/Message'
title: 'AI Elements/Artifact'

// Composites
title: 'Composites/DataTable'
title: 'Composites/PromptInput'

// Blocks
title: 'Blocks/AIConversation'
title: 'Blocks/AppSidebar'

// Features
title: 'Features/WorkflowCanvas'
title: 'Features/AIDocEditor'
```

### Story Sort Order

Configured in `.storybook/preview.ts`:

```tsx
options: {
  storySort: {
    order: [
      'Pages',        // 1. Full page examples
      'Features',     // 2. Complete features
      'Blocks',       // 3. Complex sections
      'Composites',   // 4. Composite components
      'Primitives',   // 5. Base components
      'AI Elements',  // 6. AI-specific elements
    ],
  },
}
```

**Sidebar appearance**:
```
📁 Pages
📁 Features
  └── 📄 WorkflowCanvas
  └── 📄 AIDocEditor
📁 Blocks
  └── 📄 AIConversation
  └── 📄 AppSidebar
📁 Composites
  └── 📄 DataTable
  └── 📄 PromptInput
📁 Primitives
  └── 📄 Button
  └── 📄 Input
📁 AI Elements
  └── 📄 Message
  └── 📄 Artifact
```

### Nested Categories

For components with many variants, use nested categories:

```tsx
// Group related primitives
title: 'Primitives/Forms/Input'
title: 'Primitives/Forms/Textarea'
title: 'Primitives/Forms/Select'

// Group by feature area
title: 'Features/Editor/AIDocEditor'
title: 'Features/Editor/RefinementPanel'
```

**Sidebar appearance**:
```
📁 Primitives
  └── 📁 Forms
      └── 📄 Input
      └── 📄 Textarea
      └── 📄 Select
```

## Story Order Within File

### Recommended Order

Stories within a file should follow this order:

```tsx
// 1. Default (ALWAYS FIRST)
export const Default: Story = {}

// 2. Variants
export const Destructive: Story = {}
export const Outline: Story = {}
export const Secondary: Story = {}

// 3. Sizes
export const Small: Story = {}
export const Large: Story = {}

// 4. States
export const Disabled: Story = {}
export const Loading: Story = {}
export const Error: Story = {}

// 5. Edge Cases
export const WithLongText: Story = {}
export const Empty: Story = {}

// 6. Layouts
export const FormActions: Story = {}
export const ToolbarLayout: Story = {}

// 7. Showcase
export const AllVariants: Story = {}

// 8. Theme
export const DarkMode: Story = {}

// 9. Interactive
export const WithInteraction: Story = {}
```

### Example: Button Stories

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta = {
  title: 'Primitives/Button',
  component: Button,
  tags: ['autodocs'],
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// 1. Default
export const Default: Story = {
  args: { children: 'Button' },
}

// 2. Variants
export const Destructive: Story = {
  args: { children: 'Delete', variant: 'destructive' },
}

export const Outline: Story = {
  args: { children: 'Outline', variant: 'outline' },
}

export const Secondary: Story = {
  args: { children: 'Secondary', variant: 'secondary' },
}

export const Ghost: Story = {
  args: { children: 'Ghost', variant: 'ghost' },
}

export const Link: Story = {
  args: { children: 'Link', variant: 'link' },
}

// 3. Sizes
export const Small: Story = {
  args: { children: 'Small', size: 'sm' },
}

export const Large: Story = {
  args: { children: 'Large', size: 'lg' },
}

export const IconSize: Story = {
  args: { children: '✓', size: 'icon', 'aria-label': 'Confirm' },
}

// 4. States
export const Disabled: Story = {
  args: { children: 'Disabled', disabled: true },
}

// 5. Edge Cases
export const WithLongText: Story = {
  args: { children: 'Button with longer text content' },
}

// 6. Layouts
export const FormActions: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px' }}>
      <Button variant="ghost">Cancel</Button>
      <Button>Submit</Button>
    </div>
  ),
}

// 7. Showcase
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
}

// 8. Theme
export const DarkMode: Story = {
  render: () => (
    <div className="dark-neutral" style={{ padding: '24px', background: 'hsl(222.2 84% 4.9%)', borderRadius: '8px' }}>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Button>Default</Button>
        <Button variant="outline">Outline</Button>
      </div>
    </div>
  ),
  parameters: {
    backgrounds: { disable: true },
  },
}
```

## Documentation Organization

### Component-Level Documentation

Place comprehensive documentation at the top of the file:

```tsx
/**
 * Button Primitive Stories
 *
 * [Component description]
 *
 * ## Features
 * - [Feature list]
 *
 * ## Accessibility
 * - [A11y requirements]
 *
 * ## Usage Guidelines
 * ### Do's
 * - [Best practices]
 * ### Don'ts
 * - [Anti-patterns]
 */
const meta = {
  // ...
}
```

### Story-Level Documentation

Add JSDoc comment above each story:

```tsx
/**
 * Destructive variant
 *
 * Used for dangerous or irreversible actions like deletions.
 * The red color signals caution to users before proceeding.
 */
export const Destructive: Story = {
  args: {
    children: 'Delete',
    variant: 'destructive',
  },
}
```

### Parameters Documentation

Use parameters for additional context:

```tsx
export const IconSize: Story = {
  args: {
    children: '✓',
    size: 'icon',
    'aria-label': 'Confirm',
  },
  parameters: {
    docs: {
      description: {
        story: 'Icon-only buttons require an accessible label via aria-label prop.',
      },
    },
  },
}
```

## Grouping Related Stories

### Using Sections

Group related stories with comments:

```tsx
// ============================================================================
// Variants
// ============================================================================

export const Default: Story = {}
export const Destructive: Story = {}
export const Outline: Story = {}

// ============================================================================
// Sizes
// ============================================================================

export const Small: Story = {}
export const Large: Story = {}

// ============================================================================
// States
// ============================================================================

export const Disabled: Story = {}
export const Loading: Story = {}
```

### Using Nested Titles

For complex components, use nested titles:

```tsx
// Main component
title: 'Primitives/Button'

// Subcomponents
title: 'Primitives/Button/ButtonGroup'
title: 'Primitives/Button/ButtonIcon'
```

## Multi-File Organization

### When to Split Stories

Split stories into multiple files when:
- Component has 20+ stories
- Component has distinct subcomponents
- Stories serve different purposes (examples vs. tests)

### Split Pattern

```
Button/
├── Button.tsx
├── Button.stories.tsx           // Main stories
├── Button.examples.stories.tsx  // Usage examples
├── Button.test.stories.tsx      // Test scenarios
└── index.ts
```

**Main stories**:
```tsx
// Button.stories.tsx
title: 'Primitives/Button'
// Default, variants, sizes, states
```

**Example stories**:
```tsx
// Button.examples.stories.tsx
title: 'Primitives/Button/Examples'
// Real-world usage patterns
```

**Test stories**:
```tsx
// Button.test.stories.tsx
title: 'Primitives/Button/Tests'
// Edge cases, error states, interactions
```

## Storybook Sidebar Organization

### Collapsed by Default

Configure which categories are collapsed:

```tsx
// .storybook/manager.js
import { addons } from '@storybook/manager-api'

addons.setConfig({
  sidebar: {
    collapsedRoots: ['Primitives', 'AI Elements'],
  },
})
```

### Custom Icons

Add custom icons to categories:

```tsx
// .storybook/manager.js
addons.setConfig({
  sidebar: {
    renderLabel: ({ name, type }) => {
      if (type === 'root') {
        const icons = {
          Primitives: '🧱',
          Composites: '🔧',
          Blocks: '📦',
          Features: '⚡',
        }
        return `${icons[name] || ''} ${name}`
      }
      return name
    },
  },
})
```

## Search and Navigation

### Story Names for Search

Use descriptive names that appear in search:

```tsx
// ✅ Good - Searchable
export const ButtonWithLongText: Story = {}
export const ButtonDisabled: Story = {}
export const ButtonFormActions: Story = {}

// ❌ Bad - Not searchable
export const Story1: Story = {}
export const Test: Story = {}
export const Example: Story = {}
```

### Tags for Filtering

Add tags to stories for filtering:

```tsx
const meta = {
  title: 'Primitives/Button',
  component: Button,
  tags: ['autodocs', 'stable', 'accessible'],
} satisfies Meta<typeof Button>

export const Experimental: Story = {
  tags: ['experimental'],
  args: {},
}
```

## Best Practices

1. **Co-locate stories** - Keep stories with components
2. **Follow naming convention** - `ComponentName.stories.tsx`
3. **Use layer hierarchy** - `Layer/ComponentName`
4. **Order stories logically** - Default first, theme last
5. **Group related stories** - Use comments or nested titles
6. **Document thoroughly** - JSDoc + parameters
7. **Make searchable** - Descriptive story names
8. **Split when needed** - 20+ stories = split file
9. **Use tags** - For filtering and organization
10. **Keep sidebar clean** - Collapse less-used categories

## Quick Reference

### File Structure Template

```
ComponentName/
├── ComponentName.tsx
├── ComponentName.stories.tsx
└── index.ts
```

### Story File Template

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ComponentName } from './ComponentName'

const meta = {
  title: 'Layer/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
} satisfies Meta<typeof ComponentName>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
// ... more stories
```

### Title Format

```
Layer/ComponentName
Layer/Category/ComponentName
Layer/ComponentName/Subcomponent
```

### Story Order

```
1. Default
2. Variants
3. Sizes
4. States
5. Edge Cases
6. Layouts
7. Showcase
8. Theme
9. Interactive
```
