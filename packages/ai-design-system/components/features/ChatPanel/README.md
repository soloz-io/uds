# RefinementPanel Feature

A comprehensive UI component for managing AI-powered refinement workflows with multi-agent conversations, file changes, and approval processes.

## Architecture

This feature follows the **extensible component pattern** with clear separation between:
- **Component Layer**: Pure UI component (`RefinementPanel.tsx`)
- **Hook Contract**: Interface definition (`useRefinementPanel.d.ts`)
- **Mock Implementation**: Storybook testing (`useRefinementPanel.mock.ts`)
- **Application Layer**: Real implementation (in your app)

## Usage

### In Your Application

Implement the hook contract with real API calls:

```tsx
// app/hooks/useRefinementPanel.ts
import { useState } from 'react';
import type { UseRefinementPanelReturn } from 'ui-lib/components/features/RefinementPanel';

export function useRefinementPanel(): UseRefinementPanelReturn {
  const [messages, setMessages] = useState([]);
  const [fileChanges, setFileChanges] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/refinement/submit', {
        method: 'POST',
        body: JSON.stringify({ messages }),
      });
      const data = await response.json();
      setMessages(data.messages);
      setFileChanges(data.fileChanges);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      await fetch('/api/refinement/approve', {
        method: 'POST',
        body: JSON.stringify({ fileChanges }),
      });
      setFileChanges([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      await fetch('/api/refinement/reject', {
        method: 'POST',
      });
      setFileChanges([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    fileChanges,
    loading,
    handleSubmit,
    handleApprove,
    handleReject,
  };
}
```

Then use it with the component:

```tsx
// app/components/RefinementContainer.tsx
import { RefinementPanel } from 'ui-lib/components/features/RefinementPanel';
import { useRefinementPanel } from '../hooks/useRefinementPanel';

export function RefinementContainer() {
  const { messages, fileChanges, loading, handleSubmit, handleApprove, handleReject } =
    useRefinementPanel();

  return (
    <RefinementPanel
      messages={messages}
      fileChanges={fileChanges}
      loading={loading}
      onSubmit={handleSubmit}
      onApprove={handleApprove}
      onReject={handleReject}
      placeholder="Ask a question or describe a task..."
    />
  );
}
```

### In Storybook

Use the mock hook for visual testing:

```tsx
import { RefinementPanel, useMockRefinementPanel } from 'ui-lib/components/features/RefinementPanel';

export const Interactive = () => {
  const { messages, fileChanges, handleSubmit, handleApprove, handleReject } =
    useMockRefinementPanel({
      initialMessages: [...],
      reviewMessages: [...],
      reviewFileChanges: [...],
      apiDelay: 800,
    });

  return (
    <RefinementPanel
      messages={messages}
      fileChanges={fileChanges}
      onSubmit={handleSubmit}
      onApprove={handleApprove}
      onReject={handleReject}
    />
  );
};
```

## Hook Contract

### `UseRefinementPanelReturn`

```typescript
interface UseRefinementPanelReturn {
  messages: RefinementMessage[];
  fileChanges: FileChangeData[];
  loading: boolean;
  handleSubmit: () => Promise<void> | void;
  handleApprove: () => Promise<void> | void;
  handleReject: () => Promise<void> | void;
}
```

## Component Props

### `RefinementPanelProps`

```typescript
interface RefinementPanelProps {
  messages?: RefinementMessage[];
  fileChanges?: FileChangeData[];
  loading?: boolean;
  placeholder?: string;
  onSubmit?: (message: PromptInputMessage) => void;
  onApprove?: () => void;
  onReject?: () => void;
}
```

## States

The component supports multiple workflow states:

1. **Input State**: Clean interface for submitting refinement requests
2. **Review State**: Multi-agent processing with file changes and approval workflow
3. **Loading State**: Visual feedback during async operations

## Design Principles

- **Declarative**: Component describes what happens visually, not how logic works
- **Extensible**: Event props allow integration with any backend
- **Stateless**: Business logic lives outside the component
- **Testable**: Mock hook enables isolated visual testing

## Files

- `RefinementPanel.tsx` - Main component implementation
- `RefinementPanel.stories.tsx` - Storybook stories and examples
- `useRefinementPanel.d.ts` - Hook contract definition
- `useRefinementPanel.mock.ts` - Mock implementation for testing
- `index.ts` - Public exports

## References

See `.claude/skills/design-system/references/extendable-with-state-stories.md` for the complete pattern documentation.
