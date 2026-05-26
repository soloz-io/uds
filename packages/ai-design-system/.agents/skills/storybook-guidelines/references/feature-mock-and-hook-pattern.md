# Feature Mock and Hook Pattern

Every feature in the design system follows a strict three-file pattern for state management and testing. This pattern separates the hook contract, mock implementation, and static mock data into distinct files.

---

## Required Files Per Feature

```
components/features/MyFeature/
├── MyFeature.tsx                  # Feature component (individual props)
├── MyFeature.stories.tsx          # Storybook stories
├── MyFeature.behaviors.stories.tsx # Behavior tests
├── MyFeature.mocks.ts             # Static mock data (shared by stories + tests)
├── useMyFeature.d.ts              # Hook contract (interface + stub)
├── useMyFeature.mock.ts           # Mock hook implementation (for WithStateManagement)
└── index.ts
```

---

## 1. Hook Contract — `useMyFeature.d.ts`

Defines the interface that consuming applications must implement. Contains:
- The `UseMyFeatureReturn` interface with all state and handlers
- A stub function that throws (signals it must be implemented externally)
- JSDoc explaining what the real implementation should do

```ts
/**
 * Hook Contract for MyFeature
 *
 * Consuming applications implement this interface with real API calls.
 * The design system provides a mock (useMyFeature.mock.ts) for Storybook.
 */

import type { ItemType } from "./MyFeature";

export interface UseMyFeatureReturn {
  // State
  items: ItemType[];
  isLoading: boolean;
  hasUnsavedChanges: boolean;

  // Handlers
  onSave: () => Promise<void> | void;
  onCancel: () => void;
  onItemSelect: (id: string) => void;
}

/**
 * Hook for managing MyFeature state.
 * Must be implemented by the consuming application.
 *
 * @example
 * ```tsx
 * export function useMyFeature(): UseMyFeatureReturn {
 *   const [items, setItems] = useState<ItemType[]>([]);
 *   // ... real implementation with API calls
 *   return { items, isLoading, hasUnsavedChanges, onSave, onCancel, onItemSelect };
 * }
 * ```
 */
export function useMyFeature(): UseMyFeatureReturn;
```

**Rules:**
- File extension is `.d.ts` — it is a type declaration file, not an implementation
- The stub function body throws an error — it is never called directly
- All state and handlers the feature component needs must be listed here
- Group related fields with comments (State, Handlers, UI state, etc.)

---

## 2. Mock Hook — `useMyFeature.mock.ts`

A fully working React hook that simulates realistic behavior using `useState` and `useCallback`. Used only in `WithStateManagement` stories.

```ts
import { useState, useCallback } from "react";
import type { UseMyFeatureReturn } from "./useMyFeature";
import type { ItemType } from "./MyFeature";

const initialItems: ItemType[] = [
  { id: "1", label: "Item One", status: "active" },
  { id: "2", label: "Item Two", status: "idle" },
];

export function useMyFeatureMock(): UseMyFeatureReturn {
  const [items, setItems] = useState<ItemType[]>(initialItems);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const onSave = useCallback(async () => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800)); // simulate API delay
    setIsLoading(false);
    setHasUnsavedChanges(false);
  }, []);

  const onCancel = useCallback(() => {
    setItems(initialItems);
    setHasUnsavedChanges(false);
  }, []);

  const onItemSelect = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) => ({ ...item, status: item.id === id ? "active" : "idle" }))
    );
    setHasUnsavedChanges(true);
  }, []);

  return {
    items,
    isLoading,
    hasUnsavedChanges,
    onSave,
    onCancel,
    onItemSelect,
  };
}
```

**Rules:**
- Must return exactly the `UseMyFeatureReturn` interface — no extra fields
- Use `useCallback` for all handlers to prevent unnecessary re-renders
- Simulate async operations with `setTimeout` to reflect real loading states
- Reset to initial state on cancel
- Never import from `@storybook/*` — this is a pure React hook

---

## 3. Static Mock Data — `MyFeature.mocks.ts`

Static data constants shared between stories and behavior tests. No React hooks — just typed data.

```ts
/**
 * Mock data for MyFeature stories and tests
 *
 * Imported by:
 * - MyFeature.stories.tsx
 * - MyFeature.behaviors.stories.tsx
 */

import type { ItemType } from "./MyFeature";

export const mockItems: ItemType[] = [
  { id: "1", label: "Item One", status: "active" },
  { id: "2", label: "Item Two", status: "idle" },
  { id: "3", label: "Item Three", status: "idle" },
];

export const mockItemsEmpty: ItemType[] = [];

export const mockItemsLarge: ItemType[] = Array.from({ length: 20 }, (_, i) => ({
  id: `${i + 1}`,
  label: `Item ${i + 1}`,
  status: "idle" as const,
}));
```

**Rules:**
- Pure TypeScript — no React, no hooks, no JSX
- Export named constants, not default exports
- Cover the main scenarios: default, empty, edge cases (large lists, long text)
- Both stories files import from here — never duplicate data inline

---

## 4. How They Connect in Stories

### `WithStateManagement` — uses mock hook via `render`

```tsx
import { useMyFeatureMock } from "./useMyFeature.mock";

export const WithStateManagement: Story = {
  render: () => {
    const hook = useMyFeatureMock();
    return (
      <MyFeature
        items={hook.items}
        isLoading={hook.isLoading}
        hasUnsavedChanges={hook.hasUnsavedChanges}
        onSave={hook.onSave}
        onCancel={hook.onCancel}
        onItemSelect={hook.onItemSelect}
      />
    );
  },
};
```

Rules for `WithStateManagement`:
- Do not define local `handle*` functions inside the story.
- Do not pass inline callback props like `onSave={() => ...}` or `onTabChange={(value) => ...}`.
- If the story needs an action handler or loading transition, add it to the mock hook first.

### `Default` and other static stories — use `args` + mocks data

```tsx
import { mockItems } from "./MyFeature.mocks";

export const Default: Story = {
  args: {
    items: mockItems,
    isLoading: false,
    hasUnsavedChanges: false,
  },
};

export const Empty: Story = {
  args: {
    items: [],
    isLoading: false,
  },
};
```

### Behavior tests — use `args` + `fn()`, never mock hook

```tsx
import { mockItems } from "./MyFeature.mocks";
import { fn } from "@storybook/test";

export const SaveTriggersCallback: Story = {
  args: {
    items: mockItems,
    onSave: fn(),
    onCancel: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByTitle("Save"));
    await waitFor(() => expect(args.onSave).toHaveBeenCalled());
  },
};
```

---

## Summary Table

| File | Purpose | Uses React hooks | Used in |
|------|---------|-----------------|---------|
| `useMyFeature.d.ts` | Contract for consuming apps | No (stub only) | Consuming app |
| `useMyFeature.mock.ts` | Simulated state for Storybook | Yes | `WithStateManagement` story |
| `MyFeature.mocks.ts` | Static typed data | No | All stories + behavior tests |

---

## Checklist

- [ ] `useMyFeature.d.ts` — interface + stub, groups state/handlers with comments
- [ ] `useMyFeature.mock.ts` — returns exact `UseMyFeatureReturn`, uses `useCallback`, simulates async
- [ ] `MyFeature.mocks.ts` — named exports, covers default/empty/edge cases, no React
- [ ] `WithStateManagement` story uses `render` + mock hook
- [ ] `Default`/`Empty`/state stories use `args` + mocks data
- [ ] Behavior tests use `args` + `fn()` — no mock hook
- [ ] All three files are flat in the feature folder — no `hooks/` subfolder
