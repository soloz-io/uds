# Validation Requirements

This document covers all validation rules enforced by the design system's validation scripts for Storybook stories.

## Overview

The design system enforces three critical validation rules for Storybook stories:

1. **Story Composition Validation** - Stories must not import other design system components
2. **Storybook Coverage Validation** - All primitives and blocks must have stories
3. **Feature Story Validation** - Features must have complete story infrastructure

These validations run automatically during the build process and will block builds if violations are found.

## 1. Story Composition Validation

**Script:** `scripts/validate-story-composition.js`

**Purpose:** Ensures stories only render the component they're documenting, not manually compose child components from other layers.

### Rules

**FORBIDDEN:**
```tsx
// ❌ Don't import other design system components in stories
import { Button } from '@/components/primitives/Button'
import { Icon } from '@/components/primitives/Icon'
import { Badge } from '@/components/primitives/Badge'
import { Card } from '@/components/primitives/Card'

export const Default: Story = {
  render: () => (
    <Card>
      <Button>
        <Icon name="check" />
        Click me
      </Button>
      <Badge>New</Badge>
    </Card>
  ),
}
```

**ALLOWED:**
```tsx
// ✅ Import only the component being documented
import { PageLayout } from './PageLayout'

// ✅ Import external libraries
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'

// ✅ Import mock data
import { mockSidebarConfig, mockHeaderConfig } from './PageLayout.mocks'

export const Default: Story = {
  args: {
    sidebar: mockSidebarConfig,
    header: mockHeaderConfig,
    children: <div>Page content</div>,
  },
}
```

### Why This Rule Exists

1. **Encapsulation:** Stories should reflect actual usage patterns, not internal implementation
2. **Maintainability:** If internal composition changes, stories shouldn't break
3. **Focus:** Stories should demonstrate the component's API, not test composition
4. **Separation of Concerns:** Composition testing belongs in integration tests, not stories

### Validation Scope

This validation applies to:
- **Blocks** (`components/blocks/`)
- **Features** (`components/features/`)

Primitives and composites are allowed to use other components in their stories for demonstration purposes.

### Detection Logic

The script checks for:
1. Imports from `@/components/(primitives|composites|blocks|features|ai-elements)/ComponentName`
2. JSX usage of imported components: `<ComponentName />`
3. Excludes imports of the component itself (same name as directory)

### Example Violations

**Violation 1: Manual Composition in Block Story**
```tsx
// components/blocks/AppSidebar/AppSidebar.stories.tsx
import { AppSidebar } from './AppSidebar'
import { NavUser } from '@/components/composites/NavUser' // ❌ Violation
import { NavigationList } from '@/components/composites/NavigationList' // ❌ Violation

export const Default: Story = {
  render: () => (
    <AppSidebar>
      <NavUser {...userProps} />
      <NavigationList {...navProps} />
    </AppSidebar>
  ),
}
```

**Fix:**
```tsx
// components/blocks/AppSidebar/AppSidebar.stories.tsx
import { AppSidebar } from './AppSidebar'
import { mockUserConfig, mockNavConfig } from './AppSidebar.mocks'

export const Default: Story = {
  args: {
    user: mockUserConfig,
    navigation: mockNavConfig,
  },
}
```

**Violation 2: Building Component from Parts**
```tsx
// components/features/PageLayout/PageLayout.stories.tsx
import { PageLayout } from './PageLayout'
import { AppHeader } from '@/components/composites/AppHeader' // ❌ Violation
import { AppSidebar } from '@/components/blocks/AppSidebar' // ❌ Violation

export const Default: Story = {
  render: () => (
    <PageLayout>
      <AppHeader {...headerProps} />
      <AppSidebar {...sidebarProps} />
      <main>Content</main>
    </PageLayout>
  ),
}
```

**Fix:**
```tsx
// components/features/PageLayout/PageLayout.stories.tsx
import { PageLayout } from './PageLayout'
import { mockLayoutConfig } from './PageLayout.mocks'

export const Default: Story = {
  args: {
    ...mockLayoutConfig,
    children: <main>Content</main>,
  },
}
```

### Running the Validation

```bash
# Run manually
node scripts/validate-story-composition.js

# Runs automatically during build
pnpm build
```

### Bypass (Emergency Only)

```bash
# Not available - this validation cannot be bypassed
# Fix the violations instead
```

## 2. Storybook Coverage Validation

**Script:** `scripts/validate-storybook-coverage.js`

**Purpose:** Enforces that all components in primitives and blocks have corresponding `.stories.tsx` files.

### Rules

**REQUIRED:**
- Every component in `components/primitives/` MUST have a `.stories.tsx` file
- Every component in `components/blocks/` MUST have a `.stories.tsx` file

**OPTIONAL:**
- Composites are recommended but not required
- Features are validated separately (see Feature Story Validation)

### Detection Logic

The script:
1. Scans `components/primitives/` and `components/blocks/` directories
2. For each subdirectory, checks if a `.tsx` file exists (not `.stories.tsx` or `.test.tsx`)
3. If component file exists, checks for corresponding `.stories.tsx` file
4. Reports missing stories

### Example Violations

**Violation: Missing Stories File**
```
components/primitives/Input/
├── Input.tsx          ✅ Component exists
└── (no stories file)  ❌ Missing Input.stories.tsx
```

**Fix:**
```
components/primitives/Input/
├── Input.tsx
└── Input.stories.tsx  ✅ Added
```

### Expected File Structure

```
components/primitives/Button/
├── Button.tsx           # Component implementation
├── Button.stories.tsx   # Storybook stories (REQUIRED)
└── Button.test.tsx      # Tests (optional)

components/blocks/AIConversation/
├── AIConversation.tsx           # Component implementation
├── AIConversation.stories.tsx   # Storybook stories (REQUIRED)
├── AIConversation.mocks.ts      # Mock data (recommended)
└── AIConversation.test.tsx      # Tests (optional)
```

### Running the Validation

```bash
# Run manually
node scripts/validate-storybook-coverage.js

# Runs automatically during build
pnpm build
```

### Bypass (Emergency Only)

```bash
# Skip validation (use only in emergencies)
SKIP_STORYBOOK_VALIDATION=1 pnpm build
```

**Warning:** This bypass should only be used in emergencies. Missing stories violate the design system's documentation-first principle.

## 3. Feature Story Validation

**Script:** `scripts/validate-feature-stories.js`

**Purpose:** Enforces that all feature components have complete story infrastructure including state management patterns.

### Rules

**REQUIRED for all features:**
1. ✅ Component file: `FeatureName.tsx`
2. ✅ Stories file: `FeatureName.stories.tsx` (with `WithStateManagement` story)
3. ✅ Behavior stories: `FeatureName.behaviors.stories.tsx`
4. ✅ Mock data: `FeatureName.mocks.ts`
5. ✅ Mock hook: `useFeatureName.mock.ts`
6. ✅ Hook contract: `useFeatureName.d.ts`

All files must be in the feature directory itself.

### File Structure

```
components/features/AIDocEditor/
├── AIDocEditor.tsx                      # Component implementation
├── AIDocEditor.stories.tsx              # Main stories (REQUIRED)
├── AIDocEditor.behaviors.stories.tsx    # Behavior stories (REQUIRED)
├── AIDocEditor.mocks.ts                 # Mock data (REQUIRED)
├── useAIDocEditor.d.ts                  # Hook contract (REQUIRED)
└── useAIDocEditor.mock.ts               # Mock hook (REQUIRED)
```

### 1. Main Stories File

**File:** `FeatureName.stories.tsx`

**Requirements:**
- Must export `WithStateManagement` story
- Must demonstrate feature with mock hook

**Example:**
```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { AIDocEditor } from './AIDocEditor'
import { useAIDocEditor } from './useAIDocEditor.mock'

const meta = {
  title: 'Features/AIDocEditor',
  component: AIDocEditor,
  tags: ['autodocs'],
} satisfies Meta<typeof AIDocEditor>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default story with static props
 */
export const Default: Story = {
  args: {
    document: mockDocument,
    onSave: () => {},
  },
}

/**
 * With state management using mock hook
 * 
 * REQUIRED: This story demonstrates the feature with full state management.
 */
export const WithStateManagement: Story = {
  render: () => {
    const editorState = useAIDocEditor()
    
    return (
      <AIDocEditor
        document={editorState.document}
        onSave={editorState.handleSave}
        onEdit={editorState.handleEdit}
        isLoading={editorState.isLoading}
      />
    )
  },
}
```

### 2. Behavior Stories File

**File:** `FeatureName.behaviors.stories.tsx`

**Purpose:** Demonstrates interactive behaviors and state transitions

**Example:**
```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { AIDocEditor } from './AIDocEditor'
import { useAIDocEditor } from './useAIDocEditor.mock'

const meta = {
  title: 'Features/AIDocEditor/Behaviors',
  component: AIDocEditor,
  tags: ['autodocs'],
} satisfies Meta<typeof AIDocEditor>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Editing behavior
 */
export const EditingDocument: Story = {
  render: () => {
    const state = useAIDocEditor()
    
    return (
      <AIDocEditor
        document={state.document}
        onEdit={state.handleEdit}
        isEditing={true}
      />
    )
  },
}

/**
 * Saving behavior
 */
export const SavingDocument: Story = {
  render: () => {
    const state = useAIDocEditor()
    
    return (
      <AIDocEditor
        document={state.document}
        onSave={state.handleSave}
        isLoading={true}
      />
    )
  },
}
```

### 3. Mock Data File

**File:** `FeatureName.mocks.ts`

**Purpose:** Centralized mock data for stories and tests

**Example:**
```tsx
export const mockDocument = {
  id: '1',
  title: 'Sample Document',
  content: 'Document content...',
  author: 'John Doe',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-15'),
}

export const mockEmptyDocument = {
  id: '2',
  title: '',
  content: '',
  author: '',
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const mockDocumentWithComments = {
  ...mockDocument,
  comments: [
    { id: '1', text: 'Great work!', author: 'Jane' },
    { id: '2', text: 'Needs revision', author: 'Bob' },
  ],
}
```

### 4. Hook Contract File

**File:** `useFeatureName.d.ts`

**Purpose:** TypeScript interface defining the hook's contract

**Example:**
```tsx
export interface UseAIDocEditorReturn {
  document: Document
  isLoading: boolean
  isEditing: boolean
  handleEdit: (content: string) => void
  handleSave: () => Promise<void>
  handleDelete: () => Promise<void>
}

export function useAIDocEditor(): UseAIDocEditorReturn
```

### 5. Mock Hook File

**File:** `useFeatureName.mock.ts`

**Purpose:** Mock implementation of the hook for Storybook

**Example:**
```tsx
import { useState } from 'react'
import type { UseAIDocEditorReturn } from './useAIDocEditor.d'
import { mockDocument } from './AIDocEditor.mocks'

export function useAIDocEditor(): UseAIDocEditorReturn {
  const [document, setDocument] = useState(mockDocument)
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const handleEdit = (content: string) => {
    setIsEditing(true)
    setDocument({ ...document, content })
  }

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    setIsEditing(false)
  }

  const handleDelete = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsLoading(false)
  }

  return {
    document,
    isLoading,
    isEditing,
    handleEdit,
    handleSave,
    handleDelete,
  }
}
```

### Detection Logic

The script checks for:
1. Component file exists (`.tsx`, not `.stories.tsx` or `.test.tsx`)
2. Main stories file exists (`FeatureName.stories.tsx`)
3. `WithStateManagement` story is exported in main stories file
4. Behavior stories file exists (`FeatureName.behaviors.stories.tsx`)
5. Mock data file exists (`FeatureName.mocks.ts`)
6. Mock hook file exists (`useFeatureName.mock.ts`)
7. Hook contract file exists (`useFeatureName.d.ts`)

### Example Violations

**Violation: Missing WithStateManagement Story**
```tsx
// AIDocEditor.stories.tsx
export const Default: Story = { ... }
export const Empty: Story = { ... }
// ❌ Missing: export const WithStateManagement: Story = { ... }
```

**Violation: Missing Hook Files**
```
components/features/AIDocEditor/
├── AIDocEditor.tsx
├── AIDocEditor.stories.tsx
├── AIDocEditor.mocks.ts
└── (missing hook files)  ❌ Missing useAIDocEditor.d.ts and useAIDocEditor.mock.ts
```

**Violation: Missing Behavior Stories**
```
components/features/AIDocEditor/
├── AIDocEditor.tsx
├── AIDocEditor.stories.tsx
├── useAIDocEditor.d.ts
├── useAIDocEditor.mock.ts
└── (missing behaviors)  ❌ Missing AIDocEditor.behaviors.stories.tsx
```

### Running the Validation

```bash
# Run manually
node scripts/validate-feature-stories.js

# Runs automatically during build
pnpm build
```

### Bypass

```bash
# Not available - this validation cannot be bypassed
# Create the required files instead
```

## Validation Workflow

### During Development

1. **Create component** → Validation fails (no stories)
2. **Create stories file** → Validation passes (for primitives/blocks)
3. **For features:** Create all 6 required files → Validation passes

### During Build

```bash
pnpm build
```

Runs all three validations:
1. Story composition validation
2. Storybook coverage validation
3. Feature story validation

If any validation fails, the build is blocked.

### CI/CD Integration

All validations run automatically in CI/CD pipelines:

```yaml
# .github/workflows/ci.yml
- name: Build
  run: pnpm build
  # Includes all validations
```

## Common Validation Errors

### Error 1: "Missing Storybook coverage"

**Cause:** Component exists but no `.stories.tsx` file

**Fix:**
```bash
# Create stories file
touch components/primitives/ComponentName/ComponentName.stories.tsx
```

### Error 2: "Story composition validation failed"

**Cause:** Story imports other design system components

**Fix:**
```tsx
// Before (❌)
import { Button } from '@/components/primitives/Button'

// After (✅)
// Remove the import, pass data via props instead
```

### Error 3: "Missing WithStateManagement story"

**Cause:** Feature stories file doesn't export `WithStateManagement`

**Fix:**
```tsx
// Add to FeatureName.stories.tsx
export const WithStateManagement: Story = {
  render: () => {
    const state = useFeatureName()
    return <FeatureName {...state} />
  },
}
```

### Error 4: "Missing hook contract"

**Cause:** Feature doesn't have `useFeatureName.d.ts`

**Fix:**
```bash
# Create hook contract
touch components/features/FeatureName/useFeatureName.d.ts
```

### Error 5: "Missing mock hook"

**Cause:** Feature doesn't have `useFeatureName.mock.ts`

**Fix:**
```bash
# Create mock hook
touch components/features/FeatureName/useFeatureName.mock.ts
```

## Best Practices

### 1. Create Stories First

Follow TDD principles:
1. Create component file
2. Create stories file immediately
3. Implement component to match stories

### 2. Use Mock Data Files

Centralize mock data:
```tsx
// ComponentName.mocks.ts
export const mockData = { ... }
export const mockEmptyData = { ... }
export const mockErrorData = { ... }
```

### 3. Document Validation Rules

Add comments explaining why rules exist:
```tsx
/**
 * This story demonstrates the component with state management.
 * REQUIRED by validate-feature-stories.js
 */
export const WithStateManagement: Story = { ... }
```

### 4. Test Validations Locally

Before committing:
```bash
# Run all validations
node scripts/validate-storybook-coverage.js
node scripts/validate-story-composition.js
node scripts/validate-feature-stories.js

# Or run build (includes all validations)
pnpm build
```

### 5. Keep Hook Contracts Simple

Hook contracts should be minimal:
```tsx
// ✅ Good - focused interface
export interface UseFeatureReturn {
  data: Data
  isLoading: boolean
  handleAction: () => void
}

// ❌ Bad - too many responsibilities
export interface UseFeatureReturn {
  data: Data
  isLoading: boolean
  error: Error
  handleAction: () => void
  handleOtherAction: () => void
  handleYetAnotherAction: () => void
  // ... 20 more methods
}
```

## Troubleshooting

### Validation passes locally but fails in CI

**Cause:** File system case sensitivity differences

**Fix:** Ensure exact file name matches:
- `ComponentName.stories.tsx` (not `componentName.stories.tsx`)
- `useFeatureName.mock.ts` (not `useFeaturename.mock.ts`)

### Validation fails but file exists

**Cause:** File might be in wrong location

**Fix:** Ensure file is in component directory:
```
components/features/FeatureName/
└── useFeatureName.mock.ts  ✅ Correct location

hooks/
└── useFeatureName.mock.ts  ❌ Wrong location
```

### WithStateManagement story not detected

**Cause:** Export name doesn't match exactly

**Fix:**
```tsx
// ❌ Wrong
export const WithState: Story = { ... }
export const StateManagement: Story = { ... }

// ✅ Correct
export const WithStateManagement: Story = { ... }
```

## Summary

The design system enforces three critical validations:

1. **Story Composition** - Stories must not import other design system components
2. **Storybook Coverage** - All primitives and blocks must have stories
3. **Feature Stories** - Features must have complete story infrastructure

These validations ensure:
- ✅ Components are properly documented
- ✅ Stories reflect actual usage patterns
- ✅ Features demonstrate state management
- ✅ Design system maintains consistency
- ✅ New components follow established patterns

**Remember:** Validations are not obstacles—they're guardrails that keep the design system healthy and maintainable!
