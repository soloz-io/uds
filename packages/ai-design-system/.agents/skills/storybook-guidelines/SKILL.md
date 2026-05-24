---
name: storybook-guidelines
description: Complete guide for writing Storybook stories in the AI Design System. Use when creating stories, documenting components, setting up story variants, configuring accessibility testing, implementing dark mode stories, or ensuring Storybook coverage compliance. Essential for component documentation and visual testing.
---

# Storybook Guidelines

Comprehensive guide for writing Storybook stories that follow the AI Design System standards.

## References

Detailed documentation for specific topics:

- **[Delivery Process](./references/delivery-process.md)** - Component delivery workflow, Chrome MCP testing, and acceptance criteria
- **[Best Practices](./references/best-practices.md)** - Story writing best practices and common pitfalls
- **[Layer-Specific Patterns](./references/layer-specific-patterns.md)** - Story patterns for each layer (primitives, composites, blocks, features)
- **[Feature Mock and Hook Pattern](./references/feature-mock-and-hook-pattern.md)** - Hook contract, mock hook, and static mock data files for features
- **[Story Organization](./references/story-organization.md)** - File structure, naming conventions, and story ordering
- **[Story Types and Patterns](./references/story-types-and-patterns.md)** - Common story patterns with examples
- **[Theme Support](./references/theme-support.md)** - Dark mode, theme switching, and design token usage
- **[Validation Requirements](./references/validation-requirements.md)** - Coverage requirements and validation rules

---

## When to Use This Skill

Use this skill when:
- Creating new `.stories.tsx` files
- Documenting component variants and states
- Setting up accessibility testing
- Implementing dark mode stories

---

## CRITICAL RULES (Read First)

### 1. Story Type Imports Must Be Consistent

```tsx
import type { Meta, StoryObj } from '@storybook/react'      // ✅
import type { Meta, StoryObj } from '@storybook/nextjs-vite' // ✅ also used in existing features
```

Use one source consistently within a single file.

### 2. Always use `satisfies Meta<typeof Component>`

```tsx
// ✅ CORRECT
const meta = {
  title: 'Layer/Component',
  component: Component,
  tags: ['autodocs'],
} satisfies Meta<typeof Component>

export default meta
type Story = StoryObj<typeof meta>

// ❌ WRONG — causes different sidebar icon
const meta: Meta<typeof Component> = { ... }
type Story = StoryObj<typeof Component>
```

### 3. Features MUST accept individual props — never a `hook` object

```tsx
// ✅ CORRECT
export interface MyFeatureProps {
  workflowName?: string;
  nodes?: Node[];
  onSave?: () => void;
}

// ❌ WRONG
export interface MyFeatureProps {
  hook: UseMyFeatureReturn;
}
```

### 4. Features MUST have a `Behaviors` stories file

Every feature needs `FeatureName.behaviors.stories.tsx` with `title: 'Features/FeatureName/Behaviors'`.
Without it, Storybook shows a different sidebar icon for the feature.

### 5. Behaviors stories use `args` + `fn()` — not mock hooks

```tsx
// ✅ CORRECT — behaviors use args
export const SaveButton: Story = {
  args: { onSave: fn(), nodes: mockNodes },
  play: async ({ canvasElement, args }) => {
    await userEvent.click(canvas.getByTitle('Save'))
    await waitFor(() => expect(args.onSave).toHaveBeenCalled())
  },
}

// ❌ WRONG — behaviors should not use render with mock hooks
export const SaveButton: Story = {
  render: () => {
    const hook = useMock()
    return <Feature {...hook} />
  },
}
```

### 6. `WithStateManagement` uses `render` with mock hook

```tsx
export const WithStateManagement: Story = {
  render: () => {
    const hook = useMyFeatureMock()
    return <MyFeature prop1={hook.prop1} prop2={hook.prop2} onAction={hook.onAction} />
  },
}
```

- Writing component documentation
- Configuring story parameters
- Creating showcase stories
- Ensuring Storybook coverage compliance
- Fixing story composition violations

## Storybook Configuration

### Version & Framework
- **Storybook**: 10.x
- **Framework**: `@storybook/nextjs-vite`
- **Builder**: Vite

### Installed Addons
- `@storybook/addon-docs` - Auto-generated documentation
- `@storybook/addon-a11y` - Accessibility testing (test: 'todo' mode)
- `@storybook/addon-vitest` - Component testing integration
- `@chromatic-com/storybook` - Visual regression testing

### Story Locations
Stories are discovered from:
- `../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)`
- `../components/**/*.stories.@(js|jsx|mjs|ts|tsx)`

## Story File Structure

### Basic Template

```tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ComponentName } from './ComponentName'

/**
 * Component Description
 *
 * Comprehensive description of what the component does, its purpose,
 * and how it fits into the design system.
 *
 * ## Features
 * - Feature 1
 * - Feature 2
 * - Feature 3
 *
 * ## Accessibility
 * - WCAG 2.1 Level AA compliance
 * - Keyboard navigation support
 * - Screen reader compatibility
 * - Proper ARIA attributes
 *
 * ## Usage Guidelines
 *
 * ### Do's
 * - Do this
 * - Do that
 *
 * ### Don'ts
 * - Don't do this
 * - Don't do that
 */
const meta = {
  title: 'Layer/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
  argTypes: {
    // Prop configurations
  },
  parameters: {
    layout: 'centered', // or 'padded' or 'fullscreen'
    docs: {
      description: {
        component: 'Brief component description for docs.',
      },
    },
  },
} satisfies Meta<typeof ComponentName>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default story description
 */
export const Default: Story = {
  args: {
    // Default props
  },
}
```

## Title Naming Convention

Stories MUST follow the layer hierarchy:

```tsx
// Primitives
title: 'Primitives/Button'
title: 'Primitives/Input'
title: 'Primitives/Card'

// AI Elements
title: 'AI Elements/Message'
title: 'AI Elements/Artifact'
title: 'AI Elements/CodeBlock'

// Composites
title: 'Composites/DataTable'
title: 'Composites/PromptInput'
title: 'Composites/FileQueue'

// Blocks
title: 'Blocks/AIConversation'
title: 'Blocks/AppSidebar'
title: 'Blocks/FileChangeQueue'

// Features
title: 'Features/AIDocEditor'
title: 'Features/PageLayout'
title: 'Features/RefinementPanel'
```

**Story Sort Order** (configured in preview.ts):
1. Pages
2. Features
3. Blocks
4. Composites
5. Primitives

## Documentation Standards

### Component-Level Documentation

Add comprehensive JSDoc comment above `meta`:

```tsx
/**
 * Button Primitive Stories
 *
 * The Button component is a foundational primitive for triggering actions and navigation.
 * It extends shadcn/ui's Button with design system-specific enhancements and maintains
 * full accessibility compliance (WCAG 2.1 Level AA).
 *
 * ## Features
 * - Multiple visual variants for different contexts
 * - Flexible sizing options including icon-only buttons
 * - Full keyboard navigation support
 * - ARIA attributes for screen readers
 * - Dark mode support
 * - Composition via asChild prop (Radix Slot)
 *
 * ## Accessibility
 * - Semantic `<button>` element by default
 * - Proper focus management with visible focus indicators
 * - Disabled state prevents interaction and is announced to screen readers
 * - Loading states should include aria-busy and descriptive text
 *
 * ## Usage Guidelines
 *
 * ### Do's
 * - Use descriptive button text that clearly indicates the action
 * - Use the `default` variant for primary actions
 * - Use `destructive` variant for irreversible or dangerous actions
 * - Use `outline` or `ghost` for secondary actions
 * - Provide adequate touch target size (minimum 44x44px)
 *
 * ### Don'ts
 * - Don't use buttons for navigation (use links with asChild instead)
 * - Don't rely on color alone to convey meaning
 * - Don't disable buttons without explanation (consider tooltip)
 * - Don't use icon-only buttons without accessible labels
 */
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

Add story-specific documentation via parameters:

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

## ArgTypes Configuration

Configure controls and documentation for props:

```tsx
argTypes: {
  variant: {
    control: 'select',
    options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    description: 'Visual style variant of the button',
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'default' },
    },
  },
  size: {
    control: 'select',
    options: ['default', 'sm', 'lg', 'icon'],
    description: 'Size variant of the button',
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'default' },
    },
  },
  disabled: {
    control: 'boolean',
    description: 'Disables the button and prevents interaction',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: 'false' },
    },
  },
  asChild: {
    control: 'boolean',
    description: 'Renders as a child element using Radix Slot',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: 'false' },
    },
  },
}
```

**Control Types:**
- `select` - Dropdown with options
- `boolean` - Toggle switch
- `text` - Text input
- `number` - Number input
- `color` - Color picker
- `date` - Date picker
- `object` - JSON editor
- `array` - Array editor

## Required Stories

### For Primitives

**REQUIRED stories:**
1. ✅ `Default` - Basic usage
2. ✅ All variants (one story per variant)
3. ✅ All sizes (one story per size)
4. ✅ `Disabled` - Disabled state
5. ✅ `AllVariants` - Showcase all variants
6. ✅ `DarkMode` - Dark mode verification

**OPTIONAL but recommended:**
- `WithLongText` - Long content handling
- `ResponsiveLayout` - Real-world layout
- Edge cases specific to component

### For Composites

**REQUIRED stories:**
1. ✅ `Default` - Basic usage with realistic data
2. ✅ Key variants or configurations

**OPTIONAL:**
- Empty states
- Loading states
- Error states
- Edge cases

### For Blocks

**REQUIRED stories:**
1. ✅ `Default` - Basic usage
2. ✅ Complex scenarios with multiple sub-components

**OPTIONAL:**
- Empty states
- Multiple variations
- Real-world data examples

### For Features

**REQUIRED stories:**
1. ✅ `Default` - Basic usage
2. ✅ `WithStateManagement` - Using mock hooks

**REQUIRED files:**
- `useFeatureName.d.ts` - Hook contract
- `useFeatureName.mock.ts` - Mock implementation

## Story Patterns

### Pattern 1: Default Story

```tsx
export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'default',
    size: 'default',
  },
}
```

### Pattern 2: Variant Stories

```tsx
export const Destructive: Story = {
  args: {
    children: 'Delete',
    variant: 'destructive',
  },
}

export const Outline: Story = {
  args: {
    children: 'Outline',
    variant: 'outline',
  },
}
```

### Pattern 3: Size Stories

```tsx
export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'lg',
  },
}
```

### Pattern 4: State Stories

```tsx
export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
}

export const Loading: Story = {
  args: {
    children: 'Loading...',
    disabled: true,
    'aria-busy': true,
  },
}
```

### Pattern 5: AllVariants Showcase

```tsx
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 600 }}>
          Variants
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Button variant="default">Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete showcase of all button variants available.',
      },
    },
  },
}
```

### Pattern 6: Dark Mode Story

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
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Button variant="default">Default</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
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

### Pattern 7: With Mock Data (Composites)

```tsx
type Person = { 
  id: number
  name: string
  email: string
  role: string 
}

const data: Person[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
]

const columnHelper = createColumnHelper<Person>()
const columns = [
  columnHelper.accessor('name', { header: 'Name' }),
  columnHelper.accessor('email', { header: 'Email' }),
  columnHelper.accessor('role', { header: 'Role' }),
]

export const Default: Story = {
  args: {
    data,
    columns,
    searchColumn: 'name',
  },
}
```

### Pattern 8: Complex Nested Data (Blocks)

```tsx
export const Default: Story = {
  args: {
    messages: [
      {
        id: '1',
        type: 'human',
        role: 'user',
        content: 'User message content',
        avatarSrc: 'https://example.com/avatar.jpg',
        avatarName: 'User',
      },
      {
        id: '2',
        type: 'ai',
        role: 'orchestrator',
        content: 'AI response content',
        toolCalls: [
          {
            id: 'tool_1',
            name: 'write_file',
            args: { filename: 'plan.md' },
            result: 'Success',
            status: 'completed',
          },
        ],
        subAgents: [
          {
            id: 'agent_1',
            name: 'research-agent',
            input: 'Research task',
            output: 'Research results',
            status: 'completed',
          },
        ],
      },
    ],
  },
}
```

## Layout Parameters

Configure story layout:

```tsx
parameters: {
  layout: 'centered', // Default - centers component
  // OR
  layout: 'padded',   // Adds padding around component
  // OR
  layout: 'fullscreen', // Full viewport (for blocks/features)
}
```

**When to use:**
- `centered` - Primitives, small composites
- `padded` - Composites, medium components
- `fullscreen` - Blocks, features, full-page layouts

## Theme Support

### Global Theme Switcher

The design system has a global theme toolbar with options:
- `light`
- `dark-neutral`
- `dark-green`
- `dark-violet`

Default: `dark-violet`

### Theme Decorator

Automatically applied to all stories via `preview.ts`:

```tsx
const withTheme = (Story: any, context: any) => {
  const { theme } = context.globals

  useEffect(() => {
    const htmlElement = document.documentElement
    htmlElement.classList.remove('light', 'dark-neutral', 'dark-green', 'dark-violet')
    htmlElement.classList.add(theme)
  }, [theme])

  return Story()
}
```

### Dark Mode Story Pattern

Create explicit dark mode story for documentation:

```tsx
export const DarkMode: Story = {
  render: () => (
    <div className="dark" style={{ 
      padding: '24px', 
      background: 'hsl(222.2 84% 4.9%)', 
      borderRadius: '8px' 
    }}>
      {/* Components */}
    </div>
  ),
  parameters: {
    backgrounds: { disable: true },
  },
}
```

## Accessibility Testing

### A11y Addon Configuration

Configured in `preview.ts`:

```tsx
a11y: {
  test: 'todo' // Shows violations in UI, doesn't fail CI
  // Options: 'todo' | 'error' | 'off'
}
```

### Accessibility Requirements

All stories MUST demonstrate:
- ✅ Semantic HTML elements
- ✅ Proper ARIA attributes
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ Screen reader compatibility
- ✅ Color contrast (4.5:1 for text)
- ✅ Touch target size (44x44px minimum)

### Accessibility Examples

```tsx
// Icon-only button with aria-label
export const IconButton: Story = {
  args: {
    children: '✓',
    size: 'icon',
    'aria-label': 'Confirm', // REQUIRED for icon-only
  },
}

// Disabled with explanation
export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled buttons should include context via tooltip.',
      },
    },
  },
}

// Loading state
export const Loading: Story = {
  args: {
    children: 'Loading...',
    disabled: true,
    'aria-busy': true, // Announces loading to screen readers
  },
}
```

## Validation Rules

### Story Composition Validation

**FORBIDDEN:**
```tsx
// ❌ Don't import other design system components in stories
import { Icon } from "@/components/primitives/Icon"
import { Badge } from "@/components/primitives/Badge"
```

**ALLOWED:**
```tsx
// ✅ Import only the component being documented
import { Button } from './Button'

// ✅ Import external libraries
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
```

**Why?** Stories should focus on demonstrating the component, not testing composition. Composition is tested in integration tests.

### No Logic in Stories

**Stories must NOT contain:**
- Business logic or data transformation
- Event handlers with real implementation (use `fn()` from `@storybook/test` or `console.log` only)
- API calls or async operations
- State management logic (use mock hooks from `.mock.ts` files)
- Computed values or derived data

**Stories MUST only:**
- Import the component being documented
- Pass static data via `args`
- Use mock hooks from `.mock.ts` for `WithStateManagement` stories
- Use `fn()` from `@storybook/test` for callback props

**❌ FORBIDDEN - Logic in story:**
```tsx
export const WithStateManagement: Story = {
  render: () => {
    const [items, setItems] = useState([])
    const handleAdd = (item) => {
      // ❌ Real logic in story
      const processed = item.name.trim().toLowerCase()
      setItems(prev => [...prev, { ...item, name: processed }])
    }
    return <Component items={items} onAdd={handleAdd} />
  }
}
```

**✅ CORRECT - Mock hook, no logic:**
```tsx
// useComponent.mock.ts handles all logic
export const WithStateManagement: Story = {
  render: () => {
    const { items, onAdd } = useComponentMock()
    return <Component items={items} onAdd={onAdd} />
  }
}
```

**✅ CORRECT - Static args, no logic:**
```tsx
export const Default: Story = {
  args: {
    items: mockItems,
    onAdd: fn(),
    onRemove: fn(),
  }
}
```

### Storybook Coverage Validation

**REQUIRED:**
- All primitives MUST have `.stories.tsx`
- All blocks MUST have `.stories.tsx`
- Features MUST have `WithStateManagement` story

**Validation:**
```bash
node scripts/validations/validate-storybook-coverage.js
```

## Common Patterns

### Pattern: Icon Button

```tsx
export const IconButton: Story = {
  args: {
    children: '✓',
    size: 'icon',
    'aria-label': 'Confirm',
  },
  parameters: {
    docs: {
      description: {
        story: 'Icon-only buttons require accessible labels.',
      },
    },
  },
}
```

### Pattern: Long Text

```tsx
export const WithLongText: Story = {
  args: {
    children: 'Button with longer text content that wraps',
  },
  parameters: {
    docs: {
      description: {
        story: 'Buttons automatically expand to fit content.',
      },
    },
  },
}
```

### Pattern: Responsive Layout

```tsx
export const ResponsiveLayout: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Button variant="default">Save</Button>
      <Button variant="outline">Cancel</Button>
      <Button variant="ghost">Reset</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Common layout pattern for form actions.',
      },
    },
  },
}
```

### Pattern: Empty State

```tsx
export const Empty: Story = {
  args: {
    messages: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Component handles empty data gracefully.',
      },
    },
  },
}
```

## Best Practices

1. **One story per variant** - Don't combine multiple variants in one story
2. **Descriptive names** - Story names should clearly indicate what they demonstrate
3. **Comprehensive documentation** - Include JSDoc comments and parameters
4. **Accessibility annotations** - Document ARIA requirements and keyboard support
5. **Dark mode testing** - Include dark mode story for visual verification
6. **Edge cases** - Cover empty states, long text, disabled states
7. **Real-world examples** - Show practical usage patterns
8. **Design tokens only** - Never use hardcoded colors or spacing
9. **No composition** - Don't import other design system components
10. **Mock data** - Use realistic mock data for composites and blocks

## Troubleshooting

### "Story not appearing in Storybook"
- Check file is named `*.stories.tsx`
- Verify file is in `components/` directory
- Check `title` follows layer convention
- Restart Storybook dev server

### "Autodocs not generating"
- Ensure `tags: ['autodocs']` in meta
- Check JSDoc comments are present
- Verify argTypes are configured
- Check component has proper TypeScript types

### "Theme not switching"
- Verify global theme decorator is in preview.ts
- Check component uses design tokens (not hardcoded values)
- Ensure CSS variables are loaded

### "A11y violations showing"
- Review accessibility requirements
- Add missing ARIA attributes
- Fix color contrast issues
- Ensure keyboard navigation works

## Quick Reference

### Minimal Story File

```tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { Component } from './Component'

const meta = {
  title: 'Layer/Component',
  component: Component,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Component>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
```

### Story Checklist

- [ ] File named `ComponentName.stories.tsx`
- [ ] Title follows layer convention
- [ ] `tags: ['autodocs']` included
- [ ] JSDoc comment above meta
- [ ] `Default` story exists
- [ ] All variants have stories
- [ ] Accessibility documented
- [ ] Dark mode story included
- [ ] No design system imports
- [ ] Design tokens used (no hardcoded values)

## References

For detailed information, see:

- **[Delivery Process](./references/delivery-process.md)** - Chrome MCP testing, visual comparison, and acceptance criteria
- **[Best Practices](./references/best-practices.md)** - Story writing best practices and common pitfalls
- **[Layer-Specific Patterns](./references/layer-specific-patterns.md)** - Story patterns for each layer
- **[Story Organization](./references/story-organization.md)** - File structure, naming conventions, and story ordering
- **[Story Types and Patterns](./references/story-types-and-patterns.md)** - Common story patterns with examples
- **[Theme Support](./references/theme-support.md)** - Dark mode, theme switching, and design token usage
- **[Validation Requirements](./references/validation-requirements.md)** - Coverage requirements and validation rules

---

**Remember**: Stories are documentation, not tests. Import the component, pass data, use mock hooks. No logic in stories.
