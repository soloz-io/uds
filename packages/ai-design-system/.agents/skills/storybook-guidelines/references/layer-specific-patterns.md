# Layer-Specific Patterns

Story patterns and requirements specific to each layer in the AI Design System.

## Overview

Each layer has different story requirements based on its complexity and purpose:
- **Primitives**: Comprehensive variant coverage
- **AI Elements**: Specialized AI patterns
- **Composites**: Realistic data examples
- **Blocks**: Complex scenarios
- **Features**: State management integration

## Primitives Layer

### Required Stories

1. ✅ **Default** - Basic usage
2. ✅ **All Variants** - One story per variant
3. ✅ **All Sizes** - One story per size
4. ✅ **Disabled** - Disabled state
5. ✅ **AllVariants** - Showcase all options
6. ✅ **DarkMode** - Theme verification

### Optional but Recommended

- WithLongText
- WithShortText
- ResponsiveLayout
- FormActions
- ToolbarLayout
- Interactive

### Example: Button (Primitive)

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

/**
 * Button Primitive Stories
 *
 * Foundational button component with multiple variants and sizes.
 *
 * ## Features
 * - 6 visual variants
 * - 6 size options
 * - Full keyboard navigation
 * - ARIA support
 * - Dark mode compatible
 */
const meta = {
  title: 'Primitives/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon', 'icon-sm', 'icon-lg'],
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// 1. Default (REQUIRED)
export const Default: Story = {
  args: {
    children: 'Button',
  },
}

// 2. All Variants (REQUIRED)
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

// 3. All Sizes (REQUIRED)
export const Small: Story = {
  args: { children: 'Small', size: 'sm' },
}

export const Large: Story = {
  args: { children: 'Large', size: 'lg' },
}

export const IconSize: Story = {
  args: { children: '✓', size: 'icon', 'aria-label': 'Confirm' },
}

// 4. Disabled (REQUIRED)
export const Disabled: Story = {
  args: { children: 'Disabled', disabled: true },
}

// 5. AllVariants Showcase (REQUIRED)
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>Variants</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button variant="default">Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>
    </div>
  ),
}

// 6. DarkMode (REQUIRED)
export const DarkMode: Story = {
  render: () => (
    <div className="dark-neutral" style={{ padding: '24px', background: 'hsl(222.2 84% 4.9%)', borderRadius: '8px' }}>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Button>Default</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
    </div>
  ),
  parameters: {
    backgrounds: { disable: true },
  },
}
```

### Primitives Checklist

- [ ] Default story
- [ ] All variants (one story each)
- [ ] All sizes (one story each)
- [ ] Disabled state
- [ ] AllVariants showcase
- [ ] DarkMode story
- [ ] Comprehensive JSDoc
- [ ] ArgTypes configured
- [ ] Layout: 'centered'

---

## AI Elements Layer

### Required Stories

1. ✅ **Default** - Basic usage
2. ✅ **Key Variants** - Main variations
3. ✅ **States** - Loading, streaming, complete

### Optional but Recommended

- WithRealData
- Empty
- Error
- DarkMode

### Example: Message (AI Element)

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Message } from './message'

/**
 * Message AI Element Stories
 *
 * Displays AI and human messages in conversations.
 *
 * ## Features
 * - Human and AI message types
 * - Streaming support
 * - Markdown rendering
 * - Avatar display
 */
const meta = {
  title: 'AI Elements/Message',
  component: Message,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Message>

export default meta
type Story = StoryObj<typeof meta>

// 1. Default (REQUIRED)
export const Default: Story = {
  args: {
    type: 'ai',
    content: 'This is an AI message with some content.',
    avatarName: 'AI Assistant',
  },
}

// 2. Key Variants (REQUIRED)
export const HumanMessage: Story = {
  args: {
    type: 'human',
    content: 'This is a human message asking a question.',
    avatarName: 'User',
    avatarSrc: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop',
  },
}

export const AIMessage: Story = {
  args: {
    type: 'ai',
    content: 'This is an AI response with detailed information.',
    avatarName: 'AI Assistant',
  },
}

// 3. States (REQUIRED)
export const Streaming: Story = {
  args: {
    type: 'ai',
    content: 'This message is currently streaming...',
    isStreaming: true,
  },
}

export const WithMarkdown: Story = {
  args: {
    type: 'ai',
    content: '# Heading\n\nThis message contains **markdown** formatting with `code` and [links](https://example.com).',
  },
}

// Optional
export const Empty: Story = {
  args: {
    type: 'ai',
    content: '',
  },
}
```

### AI Elements Checklist

- [ ] Default story
- [ ] Human and AI variants
- [ ] Streaming state
- [ ] Markdown rendering
- [ ] Empty state
- [ ] Layout: 'padded'

---

## Composites Layer

### Required Stories

1. ✅ **Default** - With realistic mock data
2. ✅ **Key Scenarios** - Main use cases

### Optional but Recommended

- Empty
- Loading
- Error
- WithManyItems
- WithFewItems

### Example: DataTable (Composite)

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { DataTable } from './DataTable'
import { createColumnHelper } from '@tanstack/react-table'

/**
 * DataTable Composite Stories
 *
 * Displays tabular data with sorting, filtering, and pagination.
 *
 * ## Features
 * - Column sorting
 * - Search filtering
 * - Pagination
 * - Responsive design
 */
const meta = {
  title: 'Composites/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof DataTable>

export default meta
type Story = StoryObj<typeof meta>

// Mock data
type Person = {
  id: number
  name: string
  email: string
  role: string
}

const mockData: Person[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
  { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'Editor' },
  { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'User' },
]

const columnHelper = createColumnHelper<Person>()
const columns = [
  columnHelper.accessor('name', { header: 'Name' }),
  columnHelper.accessor('email', { header: 'Email' }),
  columnHelper.accessor('role', { header: 'Role' }),
]

// 1. Default (REQUIRED)
export const Default: Story = {
  args: {
    data: mockData,
    columns,
    searchColumn: 'name',
  },
}

// 2. Key Scenarios (REQUIRED)
export const WithSearch: Story = {
  args: {
    data: mockData,
    columns,
    searchColumn: 'name',
    searchPlaceholder: 'Search by name...',
  },
}

export const WithPagination: Story = {
  args: {
    data: Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `Person ${i + 1}`,
      email: `person${i + 1}@example.com`,
      role: i % 3 === 0 ? 'Admin' : 'User',
    })),
    columns,
    pageSize: 10,
  },
}

// Optional
export const Empty: Story = {
  args: {
    data: [],
    columns,
  },
}

export const Loading: Story = {
  args: {
    data: mockData,
    columns,
    isLoading: true,
  },
}
```

### Composites Checklist

- [ ] Default story with realistic data
- [ ] Mock data types defined
- [ ] Key scenarios covered
- [ ] Empty state
- [ ] Loading state (if applicable)
- [ ] Layout: 'padded'

---

## Blocks Layer

### Required Stories

1. ✅ **Default** - Complete block with data
2. ✅ **Complex Scenarios** - Multiple sub-components

### Optional but Recommended

- Empty
- MultipleItems
- WithInteraction
- DarkMode

### Example: AIConversation (Block)

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { AIConversation } from './AIConversation'

/**
 * AIConversation Block Stories
 *
 * Complete conversation interface with messages, tool calls, and sub-agents.
 *
 * ## Features
 * - Human and AI messages
 * - Tool call display
 * - Sub-agent tracking
 * - Streaming support
 */
const meta: Meta<typeof AIConversation> = {
  title: 'Blocks/AIConversation',
  component: AIConversation,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof AIConversation>

export default meta
type Story = StoryObj<typeof meta>

// 1. Default (REQUIRED)
export const Default: Story = {
  args: {
    messages: [
      {
        id: '1',
        type: 'human',
        role: 'user',
        content: 'Compare LeBron James and Michael Jordan',
        avatarSrc: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop',
        avatarName: 'User',
      },
      {
        id: '2',
        type: 'ai',
        role: 'orchestrator',
        content: 'I\'ll help you conduct a comprehensive comparison.',
        avatarSrc: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop',
        avatarName: 'Coordinator',
        toolCalls: [
          {
            id: 'tool_1',
            name: 'write_file',
            args: { filename: 'research_plan.md' },
            result: 'File created successfully',
            status: 'completed',
          },
        ],
        subAgents: [
          {
            id: 'agent_1',
            name: 'research-agent',
            subAgentName: 'research-agent',
            input: 'Research LeBron James career achievements...',
            output: null,
            status: 'active',
          },
        ],
      },
    ],
  },
}

// 2. Complex Scenarios (REQUIRED)
export const MultipleAgents: Story = {
  args: {
    messages: [
      {
        id: '1',
        type: 'human',
        role: 'user',
        content: 'Analyze web application performance',
        avatarSrc: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop',
        avatarName: 'User',
      },
      {
        id: '2',
        type: 'ai',
        role: 'orchestrator',
        content: 'I\'ll coordinate a comprehensive performance analysis.',
        avatarSrc: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop',
        avatarName: 'Coordinator',
        subAgents: [
          {
            id: 'agent_1',
            name: 'performance-analyzer',
            subAgentName: 'performance-agent',
            input: 'Analyze Core Web Vitals',
            output: 'LCP: 2.1s, FID: 45ms, CLS: 0.12',
            status: 'completed',
          },
          {
            id: 'agent_2',
            name: 'security-scanner',
            subAgentName: 'security-agent',
            input: 'Scan for vulnerabilities',
            output: null,
            status: 'active',
          },
          {
            id: 'agent_3',
            name: 'accessibility-checker',
            subAgentName: 'a11y-agent',
            input: 'Check WCAG compliance',
            output: null,
            status: 'pending',
          },
        ],
      },
    ],
  },
}

// Optional
export const Empty: Story = {
  args: {
    messages: [],
  },
}

export const UserOnly: Story = {
  args: {
    messages: [
      {
        id: '1',
        type: 'human',
        role: 'user',
        content: 'First user message',
        avatarSrc: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop',
        avatarName: 'User',
      },
      {
        id: '2',
        type: 'human',
        role: 'user',
        content: 'Second user message',
        avatarSrc: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop',
        avatarName: 'User',
      },
    ],
  },
}
```

### Blocks Checklist

- [ ] Default story with complete data
- [ ] Complex scenario with multiple sub-components
- [ ] Empty state
- [ ] Realistic mock data
- [ ] Layout: 'fullscreen' or 'padded'

---

## Features Layer

### Required Stories

1. ✅ **Default** - Basic feature usage with static `args`
2. ✅ **WithStateManagement** - Using mock hook via `render`
3. ✅ **Behaviors file** - `FeatureName.behaviors.stories.tsx` with `play` functions

### Required Files

- `useFeatureName.d.ts` - Hook contract (`UseFeatureNameReturn` interface + stub)
- `useFeatureName.mock.ts` - Mock implementation
- `FeatureName.behaviors.stories.tsx` - Behavior tests with `play` functions

### CRITICAL: Feature Component Props Pattern

**Features MUST accept individual props directly — NOT a `hook` object.**

This is the same pattern as `RefinementPanel`, `PageLayout`, `AIDocEditor`.

**✅ CORRECT — individual props:**
```tsx
export interface WorkflowBuilderProps {
  workflowName?: string;
  nodes?: WorkflowNode[];
  edges?: WorkflowEdge[];
  isSaving?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
  // ...
}

export function WorkflowBuilder({ workflowName, nodes = [], onSave, ... }: WorkflowBuilderProps) {
  // ...
}
```

**❌ WRONG — hook object prop:**
```tsx
export interface WorkflowBuilderProps {
  hook: UseWorkflowBuilderReturn; // ❌ Never do this
}
```

**Why?** Individual props allow:
- `args`-based stories (no `render` needed for most stories)
- `play` functions in behaviors stories without mock hooks
- Storybook controls to work properly
- Consistent sidebar icon in Storybook

### CRITICAL: Meta Syntax

**Always use `satisfies Meta<typeof Component>` — NOT `Meta<typeof Component>` as type annotation.**

**✅ CORRECT:**
```tsx
const meta = {
  title: 'Features/MyFeature',
  component: MyFeature,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof MyFeature>

export default meta
type Story = StoryObj<typeof meta>
```

**❌ WRONG:**
```tsx
const meta: Meta<typeof MyFeature> = { ... } // ❌ Causes different sidebar icon
```

**Why?** Using `satisfies` with `StoryObj<typeof meta>` gives full type inference and consistent Storybook sidebar rendering.

### CRITICAL: Keep Storybook Type Imports Consistent

**Use one source for `Meta` and `StoryObj` per file. Existing features in this repository use both sources.**

```tsx
import type { Meta, StoryObj } from '@storybook/react'      // ✅
import type { Meta, StoryObj } from '@storybook/nextjs-vite' // ✅
```

### CRITICAL: Behaviors File Required

Every feature MUST have a `FeatureName.behaviors.stories.tsx` file. Without it, Storybook renders the feature with a different sidebar icon (component icon instead of folder icon).

**Behaviors file structure:**
```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, waitFor, within } from '@storybook/test'
import { MyFeature } from './MyFeature'

const meta = {
  title: 'Features/MyFeature/Behaviors',
  component: MyFeature,
  tags: ['test'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof MyFeature>

export default meta
type Story = StoryObj<typeof meta>

export const SomeBehavior: Story = {
  args: {
    // static args — no mock hooks needed
    onSave: fn(),
    nodes: mockNodes,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByTitle('Save')
    await userEvent.click(button)
    await waitFor(() => expect(args.onSave).toHaveBeenCalled())
  },
}
```

### WithStateManagement Pattern

Use `render` with mock hook only for `WithStateManagement` and stories that need live state:

```tsx
export const WithStateManagement: Story = {
  render: () => {
    const hook = useMyFeatureMock()
    return (
      <MyFeature
        workflowName={hook.workflowName}
        nodes={hook.nodes}
        onSave={hook.onSave}
        // ... spread all individual props from hook
      />
    )
  },
}
```

### Example: WorkflowBuilder (Feature)

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { WorkflowBuilder } from './WorkflowBuilder'
import { useWorkflowBuilderMock } from './useWorkflowBuilder.mock'

const meta = {
  title: 'Features/WorkflowBuilder',
  component: WorkflowBuilder,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof WorkflowBuilder>

export default meta
type Story = StoryObj<typeof meta>

// 1. Default — static args (REQUIRED)
export const Default: Story = {
  args: {
    workflowName: 'Order Processing',
    versions: [{ id: 'v1', label: 'v1' }, { id: 'v2', label: 'v2' }],
    currentVersionId: 'v2',
    nodes: mockNodes,
    edges: mockEdges,
  },
}

// 2. WithStateManagement — render with mock hook (REQUIRED)
export const WithStateManagement: Story = {
  render: () => {
    const hook = useWorkflowBuilderMock('wf-1')
    return (
      <div style={{ width: '100vw', height: '100vh' }}>
        <WorkflowBuilder
          workflowName={hook.workflowName}
          versions={hook.versions}
          currentVersionId={hook.currentVersionId}
          nodes={hook.nodes}
          edges={hook.edges}
          isSaving={hook.isSaving}
          onSave={hook.onSave}
          onCancel={hook.onCancel}
          interactive={true}
        />
      </div>
    )
  },
}

// 3. Edge cases — static args
export const Empty: Story = {
  args: { nodes: [], edges: [] },
}
```

### Features Checklist

- [ ] Component accepts **individual props** (not a `hook` object)
- [ ] All props have sensible defaults (especially arrays: `nodes = []`)
- [ ] `Default` story uses `args` (not `render`)
- [ ] `WithStateManagement` story uses `render` with mock hook
- [ ] `FeatureName.behaviors.stories.tsx` exists with `play` functions
- [ ] Behaviors stories use `args` + `fn()` (not mock hooks)
- [ ] Meta uses `satisfies Meta<typeof Component>` syntax
- [ ] Story type imports are consistent in each story file
- [ ] Hook contract file exists (`useFeatureName.d.ts`)
- [ ] Mock hook file exists (`useFeatureName.mock.ts`)
- [ ] Layout: `'fullscreen'`

---

## Quick Reference

### Story Requirements by Layer

| Layer | Default | Variants | Sizes | States | Showcase | DarkMode | StateManagement |
|-------|---------|----------|-------|--------|----------|----------|-----------------|
| Primitives | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| AI Elements | ✅ | ✅ | ❌ | ✅ | ❌ | Optional | ❌ |
| Composites | ✅ | Optional | ❌ | Optional | ❌ | Optional | ❌ |
| Blocks | ✅ | Optional | ❌ | Optional | ❌ | Optional | ❌ |
| Features | ✅ | Optional | ❌ | Optional | ❌ | Optional | ✅ |

### Layout by Layer

- **Primitives**: `centered`
- **AI Elements**: `padded`
- **Composites**: `padded`
- **Blocks**: `fullscreen` or `padded`
- **Features**: `fullscreen`
