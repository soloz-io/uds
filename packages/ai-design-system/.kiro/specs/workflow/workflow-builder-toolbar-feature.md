# Workflow Builder with Toolbar Feature

## Overview

This document specifies the **WorkflowBuilder Feature** - a complete workflow editing experience that combines the workflow canvas with a toolbar for workflow management actions.

## Feature Architecture

```
Feature (Layer 6): WorkflowBuilder
├── Composite: WorkflowToolbar (new)
├── Block: WorkflowCanvasBlock (existing)
└── State Management: Workflow state, undo/redo, save, execute
```

## Components Breakdown

### 1. WorkflowToolbar (Composite - Layer 4)

**Purpose**: Combination of primitives that renders toolbar UI with action buttons

**Location**: `components/composites/WorkflowToolbar/`

**Composition**:
- Uses existing primitives: Button, DropdownMenu, ButtonGroup
- No new composites required (all primitives exist)
- Similar to existing TableToolbar composite

**Props Interface**:
```typescript
interface WorkflowToolbarProps {
  // Workflow metadata
  workflowName: string;
  workflowVisibility: 'public' | 'private';
  isOwner: boolean;
  
  // State flags
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  isExecuting: boolean;
  isDownloading: boolean;
  canUndo: boolean;
  canRedo: boolean;
  hasNodes: boolean;
  
  // Action callbacks
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onDownload: () => void;
  onExecute: () => void;
  onAddStep: () => void;
  onToggleVisibility: (visibility: 'public' | 'private') => void;
  onWorkflowSelect: (workflowId: string) => void;
  
  // Optional
  workflows?: Array<{ id: string; name: string; }>;
  currentWorkflowId?: string;
}
```

**Toolbar Sections**:

1. **Workflow Menu** (Left)
   - Dropdown with workflow name
   - List of all workflows
   - "New Workflow" option

2. **Action Buttons** (Right)
   - Add Step button (Plus icon)
   - Undo/Redo buttons (with disabled states)
   - Save button (with unsaved indicator dot)
   - Download button
   - Visibility toggle (Globe/Lock icon)
   - Run button (Play icon)

3. **Responsive Layout**:
   - Desktop: Horizontal button groups
   - Mobile: Vertical button groups

**No New Composites Required** ✅

All UI elements use existing primitives:
- `Button` (from primitives)
- `ButtonGroup` (from primitives)
- `DropdownMenu` (from primitives)
- Icons from `lucide-react`

**Similar Pattern**: `TableToolbar` composite (existing)

### 2. WorkflowBuilder Feature (Layer 6)

**Purpose**: Combines WorkflowToolbar + WorkflowCanvasBlock with state management

**Location**: `components/features/WorkflowBuilder/`

**Responsibilities**:
- Manages workflow state (nodes, edges)
- Handles undo/redo history
- Manages save/load operations
- Handles workflow execution
- Provides state to toolbar composite and canvas block

**Hook Contract**: `hooks/useWorkflowBuilder.d.ts`

```typescript
export interface UseWorkflowBuilderReturn {
  // Workflow state
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  workflowName: string;
  workflowVisibility: 'public' | 'private';
  
  // UI state
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  isExecuting: boolean;
  isDownloading: boolean;
  canUndo: boolean;
  canRedo: boolean;
  
  // Canvas handlers
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  
  // Toolbar actions
  onSave: () => Promise<void>;
  onUndo: () => void;
  onRedo: () => void;
  onDownload: () => Promise<void>;
  onExecute: () => Promise<void>;
  onAddStep: () => void;
  onToggleVisibility: (visibility: 'public' | 'private') => Promise<void>;
}

export function useWorkflowBuilder(workflowId?: string): UseWorkflowBuilderReturn;
```

## Implementation Plan

### Phase 1: WorkflowToolbar (Composite)

**Tasks**:
1. Create `WorkflowToolbar.tsx` with props interface
2. Implement responsive layout (desktop horizontal, mobile vertical)
3. Create button groups for each section
4. Add loading states and disabled states
5. Create Storybook stories with all states
6. Validate layer imports (should only import primitives)

**Stories Required**:
- Default (all actions enabled)
- Saving state
- Executing state
- Downloading state
- Undo/Redo disabled
- No workflows
- Public vs Private visibility
- Read-only mode (non-owner)
- Mobile layout

### Phase 2: WorkflowBuilder Feature

**Tasks**:
1. Create `WorkflowBuilder.tsx` feature component
2. Create `useWorkflowBuilder.d.ts` hook contract
3. Create `useWorkflowBuilder.mock.ts` mock implementation
4. Combine WorkflowToolbar + WorkflowCanvasBlock
5. Implement state management logic
6. Create Storybook stories with state management
7. Validate layer imports (can import blocks and composites)

**Stories Required**:
- WithStateManagement (using mock hook)
- Empty workflow
- Workflow with nodes
- Saving workflow
- Executing workflow
- Undo/Redo operations

## Design System Compliance

### Layer Import Rules

**WorkflowToolbar (Composite)**:
- ✅ Can import: `@/components/primitives/Button`
- ✅ Can import: `@/components/primitives/ButtonGroup`
- ✅ Can import: `@/components/primitives/DropdownMenu`
- ✅ Can import: `@/components/ai-elements/*` (if needed)
- ❌ Cannot import: `@/components/ui/*` (must use primitives)
- ❌ Cannot import: `@/components/blocks/*`

**WorkflowBuilder (Feature)**:
- ✅ Can import: `@/components/blocks/WorkflowCanvasBlock`
- ✅ Can import: `@/components/composites/WorkflowToolbar`
- ✅ Can import: `@/components/composites/*` (if needed)
- ❌ Cannot import: `@/components/primitives/*` (use composites/blocks)
- ❌ Cannot import: `@/components/ui/*`

### Design Tokens

All styling must use design tokens:
- Colors: `bg-primary`, `text-primary-foreground`, `border`
- Spacing: `p-4`, `gap-2`, `m-2`
- Sizing: `size-4`, `h-9`, `w-64`
- No hardcoded values allowed

### Accessibility

- All buttons must have `title` attribute for tooltips
- Keyboard navigation support
- Focus management
- Disabled states clearly indicated
- ARIA labels where needed

## Reference Implementation

Source: `archived/workflows/workflow-builder-template/components/workflow/workflow-toolbar.tsx`

**Key Features to Preserve**:
1. Responsive layout (desktop horizontal, mobile vertical)
2. Button grouping with ButtonGroup component
3. Loading states with Loader2 spinner
4. Unsaved changes indicator (red dot on save button)
5. Disabled states for all actions
6. Dropdown menu for workflow selection
7. Visibility toggle with Globe/Lock icons

## Validation Requirements

Before completion, all validations must pass:

```bash
node scripts/run-all-validations.js
```

Specific checks:
- ✅ Layer import validation
- ✅ Storybook coverage validation
- ✅ Design token validation
- ✅ Story composition validation
- ✅ Feature story validation (WithStateManagement)
- ✅ Import alias validation

## Success Criteria

1. **WorkflowToolbar (Composite)**:
   - Pure presentation component (no business logic)
   - Combines primitives (Button, ButtonGroup, DropdownMenu)
   - All props clearly defined
   - Responsive layout works on mobile and desktop
   - All button states (loading, disabled) work correctly
   - Storybook stories cover all variants
   - Layer import validation passes
   - Similar pattern to existing TableToolbar

2. **WorkflowBuilder Feature**:
   - Combines toolbar composite + canvas block seamlessly
   - State management works (undo/redo, save, execute)
   - Hook contract clearly defined
   - Mock implementation for Storybook
   - WithStateManagement story demonstrates full functionality
   - Layer import validation passes

3. **Design System Compliance**:
   - No hardcoded colors or spacing
   - Uses only design tokens
   - Follows layer import rules
   - All validations pass
   - Accessibility requirements met

## Notes

- **No new composites required** - toolbar IS the composite
- Toolbar is a **Composite** (combination of primitives), not a Block
- Similar to existing **TableToolbar** composite pattern
- Block = Complex UI section (like AIConversation, AppSidebar)
- Composite = Combination of primitives (like TableToolbar, PromptInput)
- Feature combines composites/blocks and adds state management
- Reference implementation has complex business logic that should be in the Feature layer, not the Composite
- Keep Composite component pure and testable in Storybook
