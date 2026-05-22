# Best Practices

This document covers best practices for writing high-quality Storybook stories in the AI Design System.

## Core Principles

### 1. One Story Per Concept

Each story should demonstrate a single concept, variant, or state.

**❌ Bad - Multiple concepts in one story:**
```tsx
export const Everything: Story = {
  render: () => (
    <div>
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button size="sm">Small</Button>
      <Button size="lg">Large</Button>
      <Button disabled>Disabled</Button>
    </div>
  ),
}
```

**✅ Good - One concept per story:**
```tsx
export const Default: Story = {
  args: { children: 'Button', variant: 'default' },
}

export const Destructive: Story = {
  args: { children: 'Delete', variant: 'destructive' },
}

export const Small: Story = {
  args: { children: 'Small', size: 'sm' },
}

export const Disabled: Story = {
  args: { children: 'Disabled', disabled: true },
}
```

**Exception:** `AllVariants` showcase story is allowed to display multiple variants for comparison.

### 2. Descriptive Naming

Story names should clearly indicate what they demonstrate.

**❌ Bad - Vague names:**
```tsx
export const Story1: Story = { ... }
export const Story2: Story = { ... }
export const Test: Story = { ... }
export const Example: Story = { ... }
```

**✅ Good - Descriptive names:**
```tsx
export const Default: Story = { ... }
export const Destructive: Story = { ... }
export const WithLongText: Story = { ... }
export const DisabledState: Story = { ... }
export const LoadingWithSpinner: Story = { ... }
```

**Naming Conventions:**
- Use PascalCase for story names
- Start with the variant/state being demonstrated
- Be specific: `WithLongText` not `LongText`
- Include context: `DisabledDestructive` not just `Disabled2`

### 3. Comprehensive Documentation

Every story should have documentation at multiple levels.

**Component-Level Documentation:**
```tsx
/**
 * Button Primitive Stories
 *
 * The Button component is a foundational primitive for triggering actions.
 *
 * ## Features
 * - Multiple visual variants
 * - Flexible sizing options
 * - Full keyboard navigation
 * - ARIA attributes for screen readers
 *
 * ## Accessibility
 * - WCAG 2.1 Level AA compliance
 * - Keyboard navigation support
 * - Screen reader compatibility
 *
 * ## Usage Guidelines
 *
 * ### Do's
 * - Use descriptive button text
 * - Use default variant for primary actions
 *
 * ### Don'ts
 * - Don't use buttons for navigation
 * - Don't rely on color alone
 */
const meta = { ... }
```

**Story-Level Documentation:**
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

**Parameters Documentation:**
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
        story: 'Icon-only buttons require accessible labels via aria-label prop.',
      },
    },
  },
}
```

### 4. Accessibility First

Every story should demonstrate accessibility compliance.

**Required Accessibility Patterns:**

**1. Semantic HTML:**
```tsx
// ✅ Good - semantic button
export const Default: Story = {
  args: {
    children: 'Click me',
  },
}

// ❌ Bad - div with click handler (don't do this in components)
<div onClick={...}>Click me</div>
```

**2. ARIA Labels for Icon-Only:**
```tsx
export const IconButton: Story = {
  args: {
    children: '✓',
    size: 'icon',
    'aria-label': 'Confirm', // REQUIRED
  },
}
```

**3. Disabled State Explanation:**
```tsx
export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled buttons should include context via tooltip explaining why.',
      },
    },
  },
}
```

**4. Loading States:**
```tsx
export const Loading: Story = {
  args: {
    children: 'Loading...',
    disabled: true,
    'aria-busy': true, // Announces to screen readers
  },
}
```

**5. Keyboard Navigation:**
```tsx
/**
 * Keyboard navigation
 *
 * - Tab: Focus button
 * - Enter/Space: Activate button
 * - Escape: Cancel (if in dialog)
 */
export const KeyboardNavigation: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px' }}>
      <Button>First</Button>
      <Button>Second</Button>
      <Button>Third</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Use Tab to navigate between buttons, Enter or Space to activate.',
      },
    },
  },
}
```

### 5. Design Tokens Only

Never use hardcoded values. Always use design tokens.

**❌ Bad - Hardcoded values:**
```tsx
export const Custom: Story = {
  render: () => (
    <Button style={{ 
      backgroundColor: '#3b82f6',  // ❌ Hardcoded color
      padding: '12px 24px',        // ❌ Hardcoded spacing
      fontSize: '16px',            // ❌ Hardcoded size
      borderRadius: '8px',         // ❌ Hardcoded radius
    }}>
      Custom Button
    </Button>
  ),
}
```

**✅ Good - Design tokens:**
```tsx
export const Custom: Story = {
  render: () => (
    <Button className="bg-primary text-primary-foreground px-6 py-3 text-base rounded-lg">
      Custom Button
    </Button>
  ),
}
```

**Design Token Categories:**
- **Colors:** `bg-primary`, `text-foreground`, `border-input`
- **Spacing:** `p-4`, `m-2`, `gap-3`
- **Typography:** `text-sm`, `font-medium`, `leading-normal`
- **Borders:** `rounded-md`, `border-2`
- **Shadows:** `shadow-sm`, `shadow-lg`

### 6. No Composition in Stories

Stories should not import and render other design system components.

**❌ Bad - Manual composition:**
```tsx
import { Button } from './Button'
import { Icon } from '@/components/primitives/Icon'
import { Badge } from '@/components/primitives/Badge'

export const WithIconAndBadge: Story = {
  render: () => (
    <Button>
      <Icon name="check" />
      Click me
      <Badge>New</Badge>
    </Button>
  ),
}
```

**✅ Good - Props-based configuration:**
```tsx
import { Button } from './Button'

export const WithIcon: Story = {
  args: {
    children: 'Click me',
    icon: 'check', // Component handles icon internally
    badge: 'New',  // Component handles badge internally
  },
}
```

**Why?**
- Stories should demonstrate the component's API, not test composition
- Composition testing belongs in integration tests
- Internal composition changes shouldn't break stories
- Keeps stories focused and maintainable

### 7. Complete Coverage

Cover all variants, states, and edge cases.

**Required Stories for Primitives:**
```tsx
// ✅ Variants
export const Default: Story = { ... }
export const Destructive: Story = { ... }
export const Outline: Story = { ... }
export const Secondary: Story = { ... }
export const Ghost: Story = { ... }
export const Link: Story = { ... }

// ✅ Sizes
export const Small: Story = { ... }
export const Large: Story = { ... }
export const IconSize: Story = { ... }

// ✅ States
export const Disabled: Story = { ... }
export const Loading: Story = { ... }

// ✅ Edge Cases
export const WithLongText: Story = { ... }
export const Empty: Story = { ... }

// ✅ Showcase
export const AllVariants: Story = { ... }

// ✅ Theme
export const DarkMode: Story = { ... }
```

**Coverage Checklist:**
- [ ] All variants documented
- [ ] All sizes documented
- [ ] Disabled state shown
- [ ] Loading state shown (if applicable)
- [ ] Empty state shown (if applicable)
- [ ] Error state shown (if applicable)
- [ ] Long text handling shown
- [ ] Dark mode verified
- [ ] Keyboard navigation documented
- [ ] ARIA attributes demonstrated

### 8. Edge Cases

Always demonstrate how components handle edge cases.

**Common Edge Cases:**

**1. Empty State:**
```tsx
export const Empty: Story = {
  args: {
    items: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Component gracefully handles empty data with a helpful message.',
      },
    },
  },
}
```

**2. Long Text:**
```tsx
export const WithLongText: Story = {
  args: {
    children: 'This is a very long button text that might wrap to multiple lines',
  },
  parameters: {
    docs: {
      description: {
        story: 'Button automatically expands to fit content while maintaining padding.',
      },
    },
  },
}
```

**3. Loading State:**
```tsx
export const Loading: Story = {
  args: {
    isLoading: true,
    children: 'Loading...',
  },
}
```

**4. Error State:**
```tsx
export const Error: Story = {
  args: {
    error: 'Failed to load data',
    onRetry: () => {},
  },
}
```

**5. Maximum Data:**
```tsx
export const WithManyItems: Story = {
  args: {
    items: Array.from({ length: 100 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
    })),
  },
  parameters: {
    docs: {
      description: {
        story: 'Component handles large datasets with pagination and virtualization.',
      },
    },
  },
}
```

### 9. Dark Mode Testing

Always include a dark mode story to verify theming.

**Standard Dark Mode Story:**
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
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All variants automatically adapt to dark mode with appropriate contrast.',
      },
    },
    backgrounds: { disable: true },
  },
}
```

**Dark Mode Checklist:**
- [ ] All variants shown in dark mode
- [ ] Contrast verified (4.5:1 for text)
- [ ] Focus indicators visible
- [ ] Hover states visible
- [ ] Disabled states distinguishable
- [ ] Background set to dark theme color
- [ ] Storybook backgrounds disabled

### 10. Real-World Examples

Show components in realistic usage contexts.

**❌ Bad - Isolated component:**
```tsx
export const Default: Story = {
  args: {
    children: 'Button',
  },
}
```

**✅ Good - Real-world context:**
```tsx
export const FormActions: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
      <Button variant="ghost">Cancel</Button>
      <Button variant="outline">Save Draft</Button>
      <Button variant="default">Publish</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Common pattern for form actions with primary, secondary, and tertiary buttons.',
      },
    },
  },
}

export const DialogActions: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between' }}>
      <Button variant="ghost">Learn More</Button>
      <div style={{ display: 'flex', gap: '12px' }}>
        <Button variant="outline">Cancel</Button>
        <Button variant="destructive">Delete</Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Dialog action pattern with destructive action and cancel option.',
      },
    },
  },
}
```

**Real-World Context Examples:**
- Form actions (save, cancel, reset)
- Dialog actions (confirm, cancel)
- Toolbar actions (edit, delete, share)
- Navigation actions (back, next, finish)
- Card actions (view, edit, delete)

## Layer-Specific Best Practices

### Primitives

**Focus:** Individual component variants and states

**Required Stories:**
- Default
- All variants (one per variant)
- All sizes (one per size)
- Disabled state
- AllVariants showcase
- DarkMode verification

**Example:**
```tsx
// Button.stories.tsx
export const Default: Story = { ... }
export const Destructive: Story = { ... }
export const Outline: Story = { ... }
export const Small: Story = { ... }
export const Large: Story = { ... }
export const Disabled: Story = { ... }
export const AllVariants: Story = { ... }
export const DarkMode: Story = { ... }
```

### Composites

**Focus:** Component with realistic data

**Required Stories:**
- Default with realistic data
- Key configurations

**Recommended Stories:**
- Empty state
- Loading state
- Error state
- Maximum data

**Example:**
```tsx
// DataTable.stories.tsx
export const Default: Story = {
  args: {
    data: mockUsers,
    columns: userColumns,
  },
}

export const Empty: Story = {
  args: {
    data: [],
    columns: userColumns,
  },
}

export const Loading: Story = {
  args: {
    data: [],
    columns: userColumns,
    isLoading: true,
  },
}
```

### Blocks

**Focus:** Complex scenarios with multiple sub-components

**Required Stories:**
- Default with complete data
- Complex scenarios

**Recommended Stories:**
- Empty state
- Multiple variations
- Real-world examples

**Example:**
```tsx
// AIConversation.stories.tsx
export const Default: Story = {
  args: {
    messages: mockConversation,
  },
}

export const WithToolCalls: Story = {
  args: {
    messages: mockConversationWithTools,
  },
}

export const WithSubAgents: Story = {
  args: {
    messages: mockConversationWithAgents,
  },
}
```

### Features

**Focus:** State management and behaviors

**Required Stories:**
- Default
- WithStateManagement (using mock hook)

**Required Files:**
- `FeatureName.stories.tsx`
- `FeatureName.behaviors.stories.tsx`
- `FeatureName.mocks.ts`
- `useFeatureName.d.ts`
- `useFeatureName.mock.ts`

**Example:**
```tsx
// AIDocEditor.stories.tsx
export const Default: Story = {
  args: {
    document: mockDocument,
  },
}

export const WithStateManagement: Story = {
  render: () => {
    const state = useAIDocEditor()
    return <AIDocEditor {...state} />
  },
}
```

## Mock Data Best Practices

### 1. Centralize Mock Data

Create a `.mocks.ts` file for each component:

```tsx
// DataTable.mocks.ts
export const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
]

export const mockEmptyUsers = []

export const mockManyUsers = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 3 === 0 ? 'Admin' : 'User',
}))
```

### 2. Realistic Data

Use realistic data that represents actual usage:

**❌ Bad - Unrealistic data:**
```tsx
const mockUser = {
  name: 'Test User',
  email: 'test@test.com',
  bio: 'Lorem ipsum dolor sit amet',
}
```

**✅ Good - Realistic data:**
```tsx
const mockUser = {
  name: 'Sarah Chen',
  email: 'sarah.chen@acme.com',
  bio: 'Senior Product Designer with 8 years of experience in B2B SaaS. Passionate about accessibility and inclusive design.',
}
```

### 3. Multiple Scenarios

Provide mock data for different scenarios:

```tsx
// User.mocks.ts
export const mockActiveUser = {
  id: '1',
  name: 'Sarah Chen',
  status: 'active',
  lastSeen: new Date(),
}

export const mockInactiveUser = {
  id: '2',
  name: 'John Doe',
  status: 'inactive',
  lastSeen: new Date('2024-01-01'),
}

export const mockNewUser = {
  id: '3',
  name: 'Jane Smith',
  status: 'pending',
  lastSeen: null,
}
```

### 4. Type-Safe Mocks

Use TypeScript for type-safe mock data:

```tsx
import type { User } from './types'

export const mockUser: User = {
  id: '1',
  name: 'Sarah Chen',
  email: 'sarah@example.com',
  role: 'admin',
  createdAt: new Date('2024-01-01'),
}
```

## ArgTypes Best Practices

### 1. Complete Configuration

Configure all props with controls and documentation:

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
}
```

### 2. Appropriate Controls

Choose the right control type for each prop:

```tsx
argTypes: {
  // Select for enums
  variant: {
    control: 'select',
    options: ['default', 'destructive', 'outline'],
  },
  
  // Boolean for flags
  disabled: {
    control: 'boolean',
  },
  
  // Text for strings
  label: {
    control: 'text',
  },
  
  // Number for numeric values
  maxLength: {
    control: 'number',
  },
  
  // Color for color values
  accentColor: {
    control: 'color',
  },
  
  // Object for complex data
  config: {
    control: 'object',
  },
}
```

### 3. Hide Internal Props

Hide props that shouldn't be controlled in Storybook:

```tsx
argTypes: {
  // Hide internal props
  ref: {
    table: { disable: true },
  },
  key: {
    table: { disable: true },
  },
  
  // Hide complex props that need custom stories
  children: {
    control: false,
  },
}
```

## Documentation Best Practices

### 1. Component Description

Provide comprehensive component description:

```tsx
/**
 * Button Primitive Stories
 *
 * [Brief description of what the component does]
 *
 * ## Features
 * - [Feature 1]
 * - [Feature 2]
 *
 * ## Accessibility
 * - [Accessibility feature 1]
 * - [Accessibility feature 2]
 *
 * ## Usage Guidelines
 *
 * ### Do's
 * - [Do this]
 *
 * ### Don'ts
 * - [Don't do this]
 */
```

### 2. Story Descriptions

Add descriptions to each story:

```tsx
/**
 * [Story name]
 *
 * [What this story demonstrates]
 * [When to use this variant/state]
 * [Any important notes]
 */
export const StoryName: Story = { ... }
```

### 3. Parameter Documentation

Use parameters for additional context:

```tsx
export const Story: Story = {
  args: { ... },
  parameters: {
    docs: {
      description: {
        story: 'Additional context about this story that appears in the docs.',
      },
    },
  },
}
```

## Performance Best Practices

### 1. Avoid Heavy Computations

Don't perform heavy computations in render functions:

**❌ Bad:**
```tsx
export const WithData: Story = {
  render: () => {
    // Heavy computation on every render
    const data = Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      value: Math.random() * 1000,
    }))
    
    return <Component data={data} />
  },
}
```

**✅ Good:**
```tsx
// Compute once, reuse
const mockLargeDataset = Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  value: Math.random() * 1000,
}))

export const WithData: Story = {
  args: {
    data: mockLargeDataset,
  },
}
```

### 2. Use Memoization for Complex Data

Memoize complex mock data:

```tsx
import { useMemo } from 'react'

export const WithComplexData: Story = {
  render: () => {
    const data = useMemo(() => generateComplexData(), [])
    return <Component data={data} />
  },
}
```

### 3. Lazy Load Heavy Components

For heavy components, consider lazy loading:

```tsx
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./HeavyComponent'))

export const Default: Story = {
  render: () => (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  ),
}
```

## Common Mistakes to Avoid

### 1. ❌ Hardcoded Values

```tsx
// ❌ Don't use hardcoded colors
<Button style={{ backgroundColor: '#3b82f6' }}>Click</Button>

// ✅ Use design tokens
<Button className="bg-primary">Click</Button>
```

### 2. ❌ Missing Accessibility

```tsx
// ❌ Icon button without label
<Button size="icon">✓</Button>

// ✅ Icon button with aria-label
<Button size="icon" aria-label="Confirm">✓</Button>
```

### 3. ❌ Importing Other Components

```tsx
// ❌ Don't import other design system components
import { Icon } from '@/components/primitives/Icon'

// ✅ Pass data via props
args: { icon: 'check' }
```

### 4. ❌ Vague Story Names

```tsx
// ❌ Vague names
export const Test: Story = { ... }
export const Example: Story = { ... }

// ✅ Descriptive names
export const WithLongText: Story = { ... }
export const DisabledState: Story = { ... }
```

### 5. ❌ Missing Documentation

```tsx
// ❌ No documentation
export const Destructive: Story = {
  args: { variant: 'destructive' },
}

// ✅ With documentation
/**
 * Destructive variant
 *
 * Used for dangerous actions like deletions.
 */
export const Destructive: Story = {
  args: { variant: 'destructive' },
}
```

### 6. ❌ No Dark Mode Testing

```tsx
// ❌ Missing dark mode story
export const Default: Story = { ... }
export const Destructive: Story = { ... }

// ✅ Include dark mode story
export const Default: Story = { ... }
export const Destructive: Story = { ... }
export const DarkMode: Story = { ... }
```

### 7. ❌ Unrealistic Mock Data

```tsx
// ❌ Unrealistic data
const mockUser = {
  name: 'Test',
  email: 'test@test.com',
}

// ✅ Realistic data
const mockUser = {
  name: 'Sarah Chen',
  email: 'sarah.chen@acme.com',
}
```

## Quick Reference Checklist

Use this checklist when creating stories:

**File Structure:**
- [ ] File named `ComponentName.stories.tsx`
- [ ] Located in component directory
- [ ] Mock data in `ComponentName.mocks.ts` (if needed)

**Meta Configuration:**
- [ ] Title follows layer convention (`Layer/ComponentName`)
- [ ] Component imported and assigned
- [ ] `tags: ['autodocs']` included
- [ ] ArgTypes configured
- [ ] Layout parameter set
- [ ] Component-level JSDoc added

**Stories:**
- [ ] `Default` story exists
- [ ] All variants have stories
- [ ] All sizes have stories
- [ ] Disabled state shown
- [ ] `AllVariants` showcase included
- [ ] `DarkMode` story included
- [ ] Edge cases covered
- [ ] Story-level JSDoc added

**Documentation:**
- [ ] Component description comprehensive
- [ ] Features listed
- [ ] Accessibility documented
- [ ] Usage guidelines included
- [ ] Story descriptions added
- [ ] Parameters documentation added

**Accessibility:**
- [ ] Semantic HTML used
- [ ] ARIA labels for icon-only buttons
- [ ] Keyboard navigation documented
- [ ] Focus management demonstrated
- [ ] Color contrast verified

**Best Practices:**
- [ ] Design tokens used (no hardcoded values)
- [ ] No other design system components imported
- [ ] Realistic mock data
- [ ] One concept per story
- [ ] Descriptive story names
- [ ] Real-world examples included

## Summary

Follow these best practices to create high-quality Storybook stories:

1. **One story per concept** - Keep stories focused
2. **Descriptive naming** - Make intent clear
3. **Comprehensive documentation** - Document everything
4. **Accessibility first** - Demonstrate compliance
5. **Design tokens only** - No hardcoded values
6. **No composition** - Don't import other components
7. **Complete coverage** - Cover all variants and states
8. **Edge cases** - Show how components handle extremes
9. **Dark mode testing** - Verify theming
10. **Real-world examples** - Show practical usage

**Remember:** Stories are documentation, not tests. Focus on demonstrating the component clearly and comprehensively!
