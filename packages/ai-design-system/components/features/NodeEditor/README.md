# WorkflowBuilder Feature

Visual workflow editor with a canvas, toolbar, version management, and undo/redo support. Composes WorkflowCanvas and WorkflowToolbar blocks.

## Architecture

- **Component Layer**: Pure UI component (`WorkflowBuilder.tsx`)
- **Hook Contract**: Interface definition (`useWorkflowBuilder.d.ts`)
- **Mock Implementation**: Storybook testing (`useWorkflowBuilder.mock.ts`)
- **Application Layer**: Real implementation (in your app)

## Usage

### In Your Application (implement hook with real API)

```tsx
// app/hooks/useWorkflowBuilder.ts
import type { UseWorkflowBuilderReturn } from 'ui-lib/components/features/WorkflowBuilder';

export function useWorkflowBuilder(workflowId?: string): UseWorkflowBuilderReturn {
  const [nodes, setNodes] = useState<WorkflowNode[]>([]);
  const [edges, setEdges] = useState<WorkflowEdge[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const onSave = async () => {
    setIsSaving(true);
    await api.saveWorkflow(workflowId, { nodes, edges });
    setIsSaving(false);
  };

  return {
    nodes, edges, workflowName, workflowVisibility,
    versions, currentVersionId, onVersionSelect,
    isSaving, hasUnsavedChanges, canUndo, canRedo,
    onNodesChange, onEdgesChange, onConnect,
    onSave, onCancel, onUndo, onRedo,
    workflows, currentWorkflowId,
    onWorkflowSelect,
  };
}
```

```tsx
// app/components/WorkflowBuilderContainer.tsx
import { WorkflowBuilder } from 'ui-lib/components/features/WorkflowBuilder';
import { useWorkflowBuilder } from '../hooks/useWorkflowBuilder';

export function WorkflowBuilderContainer({ workflowId }) {
  const state = useWorkflowBuilder(workflowId);

  return (
    <WorkflowBuilder
      nodes={state.nodes}
      edges={state.edges}
      workflowName={state.workflowName}
      versions={state.versions}
      currentVersionId={state.currentVersionId}
      isSaving={state.isSaving}
      hasUnsavedChanges={state.hasUnsavedChanges}
      canUndo={state.canUndo}
      canRedo={state.canRedo}
      onNodesChange={state.onNodesChange}
      onEdgesChange={state.onEdgesChange}
      onConnect={state.onConnect}
      onSave={state.onSave}
      onCancel={state.onCancel}
      onUndo={state.onUndo}
      onRedo={state.onRedo}
      onVersionSelect={state.onVersionSelect}
    />
  );
}
```

### In Storybook (use mock hook)

```tsx
import { WorkflowBuilder } from 'ui-lib/components/features/WorkflowBuilder';
import { useMockWorkflowBuilder } from 'ui-lib/components/features/WorkflowBuilder';

export const Default = () => {
  const state = useMockWorkflowBuilder();

  return <WorkflowBuilder {...state} />;
};
```

## Hook Contract

### `UseWorkflowBuilderReturn`

```typescript
interface UseWorkflowBuilderReturn {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  workflowName: string;
  workflowVisibility: 'public' | 'private';
  versions: WorkflowVersion[];
  currentVersionId: string;
  onVersionSelect: (versionId: string) => void;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  onSave: () => void;
  onCancel: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onWorkflowSelect: (workflowId: string) => void;
  workflows: Array<{ id: string; name: string }>;
  currentWorkflowId?: string;
}
```

## Component Props

### `WorkflowBuilderProps`

```typescript
interface WorkflowBuilderProps {
  workflowName?: string;
  versions?: WorkflowVersion[];
  currentVersionId?: string;
  onVersionSelect?: (versionId: string) => void;
  nodes?: WorkflowNode[];
  edges?: WorkflowEdge[];
  onNodesChange?: (changes: NodeChange[]) => void;
  onEdgesChange?: (changes: EdgeChange[]) => void;
  onConnect?: (connection: Connection) => void;
  isSaving?: boolean;
  hasUnsavedChanges?: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  showMinimap?: boolean;
  interactive?: boolean;
  className?: string;
}
```

## Files

- `WorkflowBuilder.tsx` - Main component implementation
- `WorkflowBuilder.stories.tsx` - Storybook stories and examples
- `WorkflowBuilder.behaviors.stories.tsx` - Behavior-driven stories
- `WorkflowBuilder.mocks.ts` - Shared mock data
- `useWorkflowBuilder.d.ts` - Hook contract definition
- `useWorkflowBuilder.mock.ts` - Mock implementation for testing
- `index.ts` - Public exports

## References

See `.kiro/skills/storybook-guidelines/references/feature-mock-and-hook-pattern.md`
