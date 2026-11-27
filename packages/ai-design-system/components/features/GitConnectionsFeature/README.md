# GitConnectionsFeature

Mintlify-inspired GitHub App and Business Repository management feature for Waypoint.

## Architecture

- **UI Component**: `GitConnectionsFeature.tsx`
- **Hook Contract**: `useGitConnectionsFeature.d.ts`
- **Mock Hook**: `useGitConnectionsFeature.mock.ts`
- **Mock Data**: `GitConnectionsFeature.mocks.ts`

## Usage

```tsx
import { GitConnectionsFeature } from 'ai-design-system';
import { useConnections } from '@/hooks/useConnections';

export default function ConnectionsPage() {
  const { data, actions } = useConnections();
  return <GitConnectionsFeature data={data} actions={actions} />;
}
```
