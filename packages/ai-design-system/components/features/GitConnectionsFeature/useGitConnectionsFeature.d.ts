/**
 * GitConnectionsFeature Contract
 *
 * Defines the contract interface for git connections management,
 * following the Mintlify design pattern.
 */

export interface ConnectedOrganization {
  installationId: string;
  login: string;
  accountType: 'Organization' | 'User';
}

export interface BusinessRelease {
  version: string;
  commit_sha: string;
  digest: string;
  image: string;
  created_at?: string;
}

export interface BusinessRepository {
  fullName: string;
  url: string;
  defaultBranch?: string;
}

export interface BoxConnectionItem {
  id: string;
  boxId: string;
  repository: string;
  managementCluster: string;
  hubDomain: string;
  bundleVersion: string | null;
  mcpUrl: string;
  connection: 'connected' | 'expired' | 'none';
  problem?: string | null;
}

export type GitConnectionState =
  | 'not_configured'
  | 'installation_needed'
  | 'ready'
  | 'provisioning'
  | 'provisioned';

export interface GitConnectionsFeatureData {
  state: GitConnectionState;
  missingConfig?: string[];
  organizations: ConnectedOrganization[];
  selectedOrgId?: string;
  suggestedRepoName: string;
  defaultBranch: string;
  repository?: BusinessRepository | null;
  releases: BusinessRelease[];
  boxes: BoxConnectionItem[];
  busy?: string | null;
}

export interface GitConnectionsFeatureActionHandlers {
  onInstallApp: () => void;
  onSelectOrg: (installationId: string) => void;
  onCreateRepository: (installationId?: string) => Promise<void> | void;
  onOpenRepository?: () => void;
  onDetectBoxes?: () => Promise<void> | void;
  onConnectBox?: (boxId: string) => void;
}

export interface UseGitConnectionsFeatureReturn {
  data: GitConnectionsFeatureData;
  actions: GitConnectionsFeatureActionHandlers;
}

export function useGitConnectionsFeature(): UseGitConnectionsFeatureReturn;

