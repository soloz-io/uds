# SpecNavigator Feature

Domain-specific navigation for browsing grouped specification files. Uses FileQueue composite for rendering categorized file lists.

## Architecture

- **Component Layer**: Pure UI component (`SpecNavigator.tsx`)
- **Hook Contract**: Interface definition (`useSpecNavigator.d.ts`)
- **Mock Implementation**: Storybook testing (`useSpecNavigator.mock.ts`)
- **Application Layer**: Real implementation (in your app)

## Usage

### In Your Application (implement hook with real API)

```tsx
// app/hooks/useSpecNavigator.ts
import type { UseSpecNavigatorReturn } from 'ui-lib/components/features/SpecNavigator';

export function useSpecNavigator(): UseSpecNavigatorReturn {
  const [groups, setGroups] = useState<SpecNavigatorGroup[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSpecifications()
      .then(data => setGroups(transformToFileGroups(data)))
      .finally(() => setLoading(false));
  }, []);

  const handleFileSelect = useCallback((fileId: string) => {
    setSelectedFileId(fileId);
    // The feature opens a preview dialog automatically when the selected file
    // includes preview content.
  }, []);

  return { groups, selectedFileId, loading, handleFileSelect };
}
```

```tsx
// app/components/SpecNavigatorContainer.tsx
import { SpecNavigator } from 'ui-lib/components/features/SpecNavigator';
import { useSpecNavigator } from '../hooks/useSpecNavigator';

export function SpecNavigatorContainer() {
  const { groups, selectedFileId, loading, handleFileSelect } = useSpecNavigator();

  if (loading) return <div>Loading specifications...</div>;

  return (
    <SpecNavigator
      groups={groups}
      selectedFileId={selectedFileId}
      onFileSelect={handleFileSelect}
    />
  );
}
```

### In Storybook (use mock hook)

```tsx
import { SpecNavigator } from 'ui-lib/components/features/SpecNavigator';
import { useMockSpecNavigator } from 'ui-lib/components/features/SpecNavigator';

export const Default = () => {
  const { groups, selectedFileId, handleFileSelect } = useMockSpecNavigator();

  return (
    <SpecNavigator
      groups={groups}
      selectedFileId={selectedFileId}
      onFileSelect={handleFileSelect}
    />
  );
};
```

## Hook Contract

### `UseSpecNavigatorReturn`

```typescript
interface UseSpecNavigatorReturn {
  groups: SpecNavigatorGroup[];
  selectedFileId?: string;
  loading: boolean;
  handleFileSelect: (fileId: string) => void;
}
```

## Component Props

### `SpecNavigatorProps`

```typescript
interface SpecNavigatorProps {
  groups: SpecNavigatorGroup[];
  selectedFileId?: string;
  onFileSelect?: (fileId: string) => void;
  className?: string;
}

interface SpecNavigatorFile {
  id: string;
  name: string;
  path?: string;
  previewContent?: string;
  previewTitle?: string;
  previewDescription?: string;
}

interface SpecNavigatorGroup {
  id: string;
  title: string;
  icon?: string;
  iconColor?: string;
  defaultOpen?: boolean;
  files: SpecNavigatorFile[];
}
```

## Files

- `SpecNavigator.tsx` - Main component implementation
- `SpecNavigator.stories.tsx` - Storybook stories and examples
- `SpecNavigator.behaviors.stories.tsx` - Behavior-driven stories
- `SpecNavigator.mocks.ts` - Shared mock data
- `useSpecNavigator.d.ts` - Hook contract definition
- `useSpecNavigator.mock.ts` - Mock implementation for testing
- `index.ts` - Public exports

## References

See `.kiro/skills/storybook-guidelines/references/feature-mock-and-hook-pattern.md`
