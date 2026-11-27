import * as React from 'react';
import type { UseGitConnectionsFeatureReturn, GitConnectionsFeatureData } from './useGitConnectionsFeature.d';
import { mockReadyData } from './GitConnectionsFeature.mocks';

export function useGitConnectionsFeatureMock(
  initialData: GitConnectionsFeatureData = mockReadyData
): UseGitConnectionsFeatureReturn {
  const [data, setData] = React.useState<GitConnectionsFeatureData>(initialData);

  const actions = React.useMemo(
    () => ({
      onInstallApp: () => {
        window.alert('Redirecting to GitHub App installation…');
      },
      onSelectOrg: (installationId: string) => {
        setData((prev) => ({ ...prev, selectedOrgId: installationId }));
      },
      onCreateRepository: async (installationId?: string) => {
        setData((prev) => ({ ...prev, busy: 'business-repo' }));
        setTimeout(() => {
          setData((prev) => ({
            ...prev,
            busy: null,
            state: 'provisioned',
            repository: {
              fullName: `${prev.organizations.find((o) => o.installationId === (installationId || prev.selectedOrgId))?.login || 'org'}/${prev.suggestedRepoName}`,
              url: 'https://github.com',
              defaultBranch: 'main',
            },
          }));
        }, 1000);
      },
      onOpenRepository: () => {
        if (data.repository?.url) {
          window.open(data.repository.url, '_blank', 'noopener,noreferrer');
        }
      },
      onDetectBoxes: async () => {
        setData((prev) => ({ ...prev, busy: 'detect' }));
        setTimeout(() => {
          setData((prev) => ({ ...prev, busy: null }));
        }, 800);
      },
      onConnectBox: (boxId: string) => {
        window.alert(`Connect box: ${boxId}`);
      },
    }),
    [data.repository?.url]
  );

  return { data, actions };
}
