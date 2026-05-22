# PageLayout Feature

Complete page layout with sidebar, header, and content area. Composes AppSidebar, AppHeader, and LayoutProvider into a self-contained layout shell.

## Architecture

- **Component Layer**: Pure UI component (`PageLayout.tsx`)
- **Hook Contract**: Interface definition (`usePageLayout.d.ts`)
- **Mock Implementation**: Storybook testing (`usePageLayout.mock.ts`)
- **Application Layer**: Real implementation (in your app)

## Usage

### In Your Application (implement hook with real API)

```tsx
// app/hooks/usePageLayout.ts
import type { UsePageLayoutReturn } from 'ui-lib/components/features/PageLayout';

export function usePageLayout(): UsePageLayoutReturn {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return {
    isSidebarOpen,
    toggleSidebar,
    setSidebarOpen,
    layoutConfig: {
      sidebarWidth: 'var(--spacing-sidebar-width)',
      headerHeight: 'var(--spacing-header-height)',
    },
  };
}
```

```tsx
// app/pages/MyPage.tsx
import { PageLayout } from 'ui-lib/components/features/PageLayout';
import { usePageLayout } from '../hooks/usePageLayout';

export function MyPage({ children }) {
  const { isSidebarOpen, toggleSidebar } = usePageLayout();

  return (
    <PageLayout
      sidebar={sidebarConfig}
      header={headerConfig}
      defaultSidebarOpen={isSidebarOpen}
    >
      {children}
    </PageLayout>
  );
}
```

### In Storybook (use mock hook)

```tsx
import { PageLayout } from 'ui-lib/components/features/PageLayout';
import { useMockPageLayout } from 'ui-lib/components/features/PageLayout';

export const Default = () => {
  const { isSidebarOpen } = useMockPageLayout();

  return (
    <PageLayout
      sidebar={mockSidebarConfig}
      header={mockHeaderConfig}
      defaultSidebarOpen={isSidebarOpen}
    >
      <div>Page content</div>
    </PageLayout>
  );
};
```

## Hook Contract

### `UsePageLayoutReturn`

```typescript
interface UsePageLayoutReturn {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  layoutConfig: {
    sidebarWidth: string;
    headerHeight: string;
  };
}
```

## Component Props

### `PageLayoutProps`

```typescript
interface PageLayoutProps {
  sidebar: AppSidebarProps;
  header: AppHeaderProps;
  children: React.ReactNode;
  className?: string;
  defaultSidebarOpen?: boolean;
  sidebarWidth?: string;
  sidebarWidthIcon?: string;
}
```

## Files

- `PageLayout.tsx` - Main component implementation
- `PageLayout.stories.tsx` - Storybook stories and examples
- `PageLayout.behaviors.stories.tsx` - Behavior-driven stories
- `PageLayout.mocks.ts` - Shared mock data
- `usePageLayout.d.ts` - Hook contract definition
- `usePageLayout.mock.ts` - Mock implementation for testing
- `index.ts` - Public exports

## References

See `.kiro/skills/storybook-guidelines/references/feature-mock-and-hook-pattern.md`
