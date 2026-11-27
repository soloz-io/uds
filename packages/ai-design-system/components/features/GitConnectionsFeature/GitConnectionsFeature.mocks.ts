import type { GitConnectionsFeatureData } from './useGitConnectionsFeature.d';

export const mockUninstalledData: GitConnectionsFeatureData = {
  state: 'installation_needed',
  organizations: [],
  suggestedRepoName: 'expense-re-v2-business',
  defaultBranch: 'main',
  repository: null,
  releases: [],
  boxes: [],
  busy: null,
};

export const mockReadyData: GitConnectionsFeatureData = {
  state: 'ready',
  organizations: [
    { installationId: '186430921', login: 'soloz-io', accountType: 'Organization' },
    { installationId: '106641966', login: 'bizmatters', accountType: 'Organization' },
  ],
  selectedOrgId: '186430921',
  suggestedRepoName: 'expense-re-v2-business',
  defaultBranch: 'main',
  repository: null,
  releases: [],
  boxes: [],
  busy: null,
};

export const mockProvisionedData: GitConnectionsFeatureData = {
  state: 'provisioned',
  organizations: [
    { installationId: '186430921', login: 'soloz-io', accountType: 'Organization' },
  ],
  selectedOrgId: '186430921',
  suggestedRepoName: 'expense-re-v2-business',
  defaultBranch: 'main',
  repository: {
    fullName: 'soloz-io/expense-re-v2-business',
    url: 'https://github.com/soloz-io/expense-re-v2-business',
    defaultBranch: 'main',
  },
  releases: [
    {
      version: '0.1.0',
      commit_sha: '7a2b9ef184d0b1',
      digest: 'sha256:4a3e21890cfb129038d818274a91cbf2109',
      image: 'ghcr.io/soloz-io/expense-re-v2-business',
    },
  ],
  boxes: [],
  busy: null,
};
