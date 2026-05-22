# Story Types & Patterns

Complete guide to all story types and patterns used in the AI Design System.

## Overview

Stories serve different purposes: demonstrating variants, showing states, providing examples, and documenting edge cases. This guide covers all standard story patterns.

## Core Story Types

### 1. Default Story (REQUIRED)

**Purpose**: Show the component in its most basic, common usage

**Pattern**:
```tsx
export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'default',
    size: 'default',
  },
}
```

**Requirements**:
- Must be named `Default`
- Must use default prop values
- Should be the simplest possible usage
- First story users see

**Example - Button**:
```tsx
export const Default: Story = {
  args: {
    children: 'Button',
  },
}
```

**Example - DataTable**:
```tsx
export const Default: Story = {
  args: {
    data: mockData,
    columns: defaultColumns,
  },
}
```

---

### 2. Variant Stories (REQUIRED for components with variants)

**Purpose**: Demonstrate each visual variant separately

**Pattern**:
```tsx
export const VariantName: Story = {
  args: {
    variant: 'variantName',
    // other default props
  },
}
```

**Example - Button Variants**:
```tsx
/**
 * Default variant
 *
 * Used for primary actions that are most important on the current screen.
 */
export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'default',
  },
}

/**
 * Destructive variant
 *
 * Used for dangerous or irreversible actions like deletions.
 */
export const Destructive: Story = {
  args: {
    children: 'Delete',
    variant: 'destructive',
  },
}

/**
 * Outline variant
 *
 * Used for secondary actions with lighter visual weight.
 */
export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
}

/**
 * Secondary variant
 *
 * Used for alternative actions that complement the primary action.
 */
export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
}

/**
 * Ghost variant
 *
 * Used for tertiary actions with minimal visual weight.
 */
export const Ghost: Story = {
  args: {
    children: 'Ghost',
    variant: 'ghost',
  },
}

/**
 * Link variant
 *
 * Styled to look like a hyperlink while maintaining button semantics.
 */
export const Link: Story = {
  args: {
    children: 'Link',
    variant: 'link',
  },
}
```

**Best Practices**:
- One story per variant
- Descriptive JSDoc comment explaining when to use
- Consistent naming (variant name capitalized)
- Include usage context in description

---

### 3. Size Stories (REQUIRED for components with sizes)

**Purpose**: Demonstrate each size option

**Pattern**:
```tsx
export const SizeName: Story = {
  args: {
    size: 'sizeName',
    // other default props
  },
}
```

**Example - Button Sizes**:
```tsx
/**
 * Small size
 *
 * Compact button for tight spaces or less important actions.
 */
export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 'sm',
  },
}

/**
 * Default size
 *
 * Standard button size for most use cases.
 */
export const DefaultSize: Story = {
  args: {
    children: 'Default Button',
    size: 'default',
  },
}

/**
 * Large size
 *
 * Prominent button for important calls to action.
 */
export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'lg',
  },
}

/**
 * Icon size
 *
 * Square button sized for a single icon.
 */
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

---

### 4. State Stories (REQUIRED)

**Purpose**: Show component in different interaction states

**Common States**:
- Disabled
- Loading
- Error
- Success
- Hover (via pseudo-class)
- Focus (via pseudo-class)
- Active (via pseudo-class)

**Example - Disabled State**:
```tsx
/**
 * Disabled state
 *
 * Disabled buttons cannot be interacted with and are visually dimmed.
 * Consider providing context about why the button is disabled via tooltip.
 */
export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled buttons should include context about why they are disabled.',
      },
    },
  },
}
```

**Example - Loading State**:
```tsx
/**
 * Loading state
 *
 * Shows the button in a loading state with spinner and disabled interaction.
 */
export const Loading: Story = {
  args: {
    children: 'Loading...',
    disabled: true,
    'aria-busy': true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Loading states should include aria-busy for screen readers.',
      },
    },
  },
}
```

**Example - Error State**:
```tsx
/**
 * Error state
 *
 * Shows the input with an error message.
 */
export const Error: Story = {
  args: {
    value: 'invalid@',
    error: true,
    helperText: 'Please enter a valid email address',
  },
}
```

---

### 5. AllVariants Showcase (REQUIRED for primitives)

**Purpose**: Display all variants side-by-side for quick comparison

**Pattern**:
```tsx
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Organized sections */}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete showcase of all variants and options.',
      },
    },
  },
}
```

**Example - Button AllVariants**:
```tsx
/**
 * All Variants Showcase
 *
 * Displays all button variants side by side for quick comparison.
 */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'flex-start' }}>
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

      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>Sizes</h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>States</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button>Normal</Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete showcase of all button variants, sizes, and states.',
      },
    },
  },
}
```

**Best Practices**:
- Organize by category (Variants, Sizes, States)
- Use semantic HTML headings
- Consistent spacing and layout
- Include all possible combinations
- Use inline styles for story-specific layout

---

### 6. Dark Mode Story (REQUIRED for primitives)

**Purpose**: Verify component works in dark mode

**Pattern**:
```tsx
export const DarkMode: Story = {
  render: () => (
    <div 
      className="dark" 
      style={{ 
        padding: '24px', 
        background: 'hsl(222.2 84% 4.9%)', 
        borderRadius: '8px' 
      }}
    >
      {/* Components */}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All variants automatically adapt to dark mode.',
      },
    },
    backgrounds: { disable: true },
  },
}
```

**Example - Button Dark Mode**:
```tsx
/**
 * Dark Mode Preview
 *
 * All variants in dark mode to verify theming compatibility.
 */
export const DarkMode: Story = {
  render: () => (
    <div className="dark" style={{ padding: '24px', background: 'hsl(222.2 84% 4.9%)', borderRadius: '8px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button variant="default">Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button variant="default" disabled>Disabled</Button>
          <Button variant="outline" disabled>Disabled</Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All button variants automatically adapt to dark mode with appropriate contrast.',
      },
    },
    backgrounds: { disable: true },
  },
}
```

**Requirements**:
- Wrap in `<div className="dark">`
- Use dark background color
- Disable Storybook backgrounds
- Show all variants
- Include disabled states

---

### 7. Edge Case Stories (RECOMMENDED)

**Purpose**: Demonstrate how component handles edge cases

**Common Edge Cases**:
- Empty data
- Very long text
- Very short text
- Missing optional props
- Extreme values
- Special characters

**Example - Empty State**:
```tsx
/**
 * Empty state
 *
 * Shows how the component handles empty data.
 */
export const Empty: Story = {
  args: {
    messages: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Component gracefully handles empty data with appropriate messaging.',
      },
    },
  },
}
```

**Example - Long Text**:
```tsx
/**
 * With Long Text
 *
 * Demonstrates how buttons handle longer text content.
 */
export const WithLongText: Story = {
  args: {
    children: 'Button with longer text content that might wrap to multiple lines',
  },
  parameters: {
    docs: {
      description: {
        story: 'Buttons automatically expand to fit content while maintaining padding.',
      },
    },
  },
}
```

**Example - Special Characters**:
```tsx
/**
 * With Special Characters
 *
 * Tests rendering of special characters and emojis.
 */
export const WithSpecialCharacters: Story = {
  args: {
    children: '✓ Save & Continue →',
  },
}
```

---

### 8. Responsive Layout Stories (RECOMMENDED)

**Purpose**: Show component in realistic layout contexts

**Pattern**:
```tsx
export const ResponsiveLayout: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      {/* Components in realistic layout */}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Common layout pattern for [use case].',
      },
    },
  },
}
```

**Example - Form Actions**:
```tsx
/**
 * Form Actions Layout
 *
 * Shows buttons in a typical form action layout.
 */
export const FormActions: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
      <Button variant="ghost">Cancel</Button>
      <Button variant="outline">Save Draft</Button>
      <Button variant="default">Submit</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Common pattern for form submission actions with proper hierarchy.',
      },
    },
  },
}
```

**Example - Toolbar Layout**:
```tsx
/**
 * Toolbar Layout
 *
 * Shows buttons in a toolbar configuration.
 */
export const ToolbarLayout: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '8px', background: 'var(--color-muted)', borderRadius: '8px' }}>
      <Button size="icon-sm" variant="ghost" aria-label="Bold">
        <strong>B</strong>
      </Button>
      <Button size="icon-sm" variant="ghost" aria-label="Italic">
        <em>I</em>
      </Button>
      <Button size="icon-sm" variant="ghost" aria-label="Underline">
        <u>U</u>
      </Button>
      <div style={{ width: '1px', height: '20px', background: 'var(--color-border)' }} />
      <Button size="icon-sm" variant="ghost" aria-label="Link">
        🔗
      </Button>
    </div>
  ),
}
```

---

### 9. Interactive Stories (OPTIONAL)

**Purpose**: Demonstrate interactive behavior with play functions

**Pattern**:
```tsx
import { userEvent, within } from '@storybook/test'

export const Interactive: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button')
    await userEvent.click(button)
  },
}
```

**Example - Click Interaction**:
```tsx
/**
 * Click Interaction
 *
 * Demonstrates button click behavior.
 */
export const ClickInteraction: Story = {
  args: {
    children: 'Click Me',
    onClick: () => alert('Button clicked!'),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: /click me/i })
    await userEvent.click(button)
  },
}
```

---

### 10. With Mock Data (Composites/Blocks)

**Purpose**: Show component with realistic data

**Pattern**:
```tsx
type DataType = {
  // Type definition
}

const mockData: DataType[] = [
  // Mock data
]

export const Default: Story = {
  args: {
    data: mockData,
  },
}
```

**Example - DataTable**:
```tsx
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
]

const columnHelper = createColumnHelper<Person>()
const columns = [
  columnHelper.accessor('name', { header: 'Name' }),
  columnHelper.accessor('email', { header: 'Email' }),
  columnHelper.accessor('role', { header: 'Role' }),
]

export const Default: Story = {
  args: {
    data: mockData,
    columns,
    searchColumn: 'name',
  },
}
```

**Example - AIConversation**:
```tsx
const mockMessages = [
  {
    id: '1',
    type: 'human' as const,
    role: 'user',
    content: 'Compare LeBron James and Michael Jordan',
    avatarSrc: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop',
    avatarName: 'User',
  },
  {
    id: '2',
    type: 'ai' as const,
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
        status: 'completed' as const,
      },
    ],
    subAgents: [
      {
        id: 'agent_1',
        name: 'research-agent',
        subAgentName: 'research-agent',
        input: 'Research LeBron James career achievements...',
        output: null,
        status: 'active' as const,
      },
    ],
  },
]

export const Default: Story = {
  args: {
    messages: mockMessages,
  },
}
```

---

## Story Naming Conventions

### Naming Rules

1. **PascalCase** - All story names use PascalCase
2. **Descriptive** - Name clearly indicates what's demonstrated
3. **Consistent** - Follow established patterns

### Good Names

```tsx
export const Default: Story = {}
export const Destructive: Story = {}
export const Small: Story = {}
export const Disabled: Story = {}
export const AllVariants: Story = {}
export const DarkMode: Story = {}
export const WithLongText: Story = {}
export const FormActions: Story = {}
export const Empty: Story = {}
export const Loading: Story = {}
```

### Bad Names

```tsx
export const Story1: Story = {}           // ❌ Not descriptive
export const test: Story = {}             // ❌ Not PascalCase
export const ButtonVariant: Story = {}    // ❌ Redundant (already in Button stories)
export const Example: Story = {}          // ❌ Too generic
```

---

## Story Organization Within File

### Recommended Order

1. **Default** - Always first
2. **Variants** - All variant stories
3. **Sizes** - All size stories
4. **States** - Disabled, loading, error, etc.
5. **Edge Cases** - Long text, empty, special characters
6. **Layouts** - Responsive, form actions, toolbar
7. **Showcase** - AllVariants
8. **Theme** - DarkMode
9. **Interactive** - Play function stories

### Example Organization

```tsx
// 1. Default
export const Default: Story = {}

// 2. Variants
export const Destructive: Story = {}
export const Outline: Story = {}
export const Secondary: Story = {}
export const Ghost: Story = {}
export const Link: Story = {}

// 3. Sizes
export const Small: Story = {}
export const Large: Story = {}
export const IconSize: Story = {}

// 4. States
export const Disabled: Story = {}
export const Loading: Story = {}

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
```

---

## Best Practices

1. **One concept per story** - Don't combine multiple variants
2. **Descriptive JSDoc** - Explain when and why to use
3. **Realistic examples** - Use real-world data and scenarios
4. **Accessibility first** - Include ARIA attributes and labels
5. **Design tokens only** - Never hardcode colors or spacing
6. **No composition** - Don't import other design system components
7. **Complete coverage** - Cover all variants, sizes, and states
8. **Edge cases matter** - Test empty, long text, special characters
9. **Dark mode always** - Include dark mode story for primitives
10. **Document parameters** - Use parameters.docs.description

---

## Quick Reference

### Minimal Story Set (Primitives)

```tsx
export const Default: Story = {}
export const [EachVariant]: Story = {}
export const [EachSize]: Story = {}
export const Disabled: Story = {}
export const AllVariants: Story = {}
export const DarkMode: Story = {}
```

### Minimal Story Set (Composites)

```tsx
export const Default: Story = {}
export const Empty: Story = {}
```

### Minimal Story Set (Blocks)

```tsx
export const Default: Story = {}
export const [KeyScenarios]: Story = {}
```

### Minimal Story Set (Features)

```tsx
export const Default: Story = {}
export const WithStateManagement: Story = {}
```
