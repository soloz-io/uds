import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GitConnectionsFeature } from "./GitConnectionsFeature";
import {
  mockUninstalledData,
  mockReadyData,
  mockProvisionedData,
} from "./GitConnectionsFeature.mocks";
import { useGitConnectionsFeatureMock } from "./useGitConnectionsFeature.mock";

const meta: Meta<typeof GitConnectionsFeature> = {
  title: "Features/GitConnectionsFeature",
  component: GitConnectionsFeature,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof GitConnectionsFeature>;

const noopActions = {
  onInstallApp: () => console.log("onInstallApp"),
  onSelectOrg: (id: string) => console.log("onSelectOrg", id),
  onCreateRepository: async (id?: string) => console.log("onCreateRepository", id),
  onOpenRepository: () => console.log("onOpenRepository"),
  onDetectBoxes: async () => console.log("onDetectBoxes"),
  onConnectBox: (id: string) => console.log("onConnectBox", id),
};

export const InstallationNeeded: Story = {
  args: {
    data: mockUninstalledData,
    actions: noopActions,
  },
};

export const OrganizationConnected: Story = {
  args: {
    data: mockReadyData,
    actions: noopActions,
  },
};

export const RepositoryProvisioned: Story = {
  args: {
    data: mockProvisionedData,
    actions: noopActions,
  },
};

export const WithStateManagement: Story = {
  render: () => {
    const Component = () => {
      const { data, actions } = useGitConnectionsFeatureMock();
      return <GitConnectionsFeature data={data} actions={actions} />;
    };
    return <Component />;
  },
};
