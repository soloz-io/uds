import type { Meta, StoryObj } from "@storybook/react";
import { GitRepositoryCard } from "./GitRepositoryCard";

const meta: Meta<typeof GitRepositoryCard> = {
  title: "Composites/GitRepositoryCard",
  component: GitRepositoryCard,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof GitRepositoryCard>;

const mockOrgs = [
  { installationId: "inst_1", login: "acme-corp" },
  { installationId: "inst_2", login: "personal-user" },
];

export const ReadyToCreate: Story = {
  args: {
    state: "ready",
    organizations: mockOrgs,
    selectedOrgId: "inst_1",
    suggestedRepoName: "acme-business",
    defaultBranch: "main",
    onSelectOrg: (id) => console.log("selectOrg", id),
    onCreateRepository: (id) => console.log("createRepo", id),
  },
};

export const Provisioned: Story = {
  args: {
    state: "provisioned",
    organizations: mockOrgs,
    selectedOrgId: "inst_1",
    suggestedRepoName: "acme-business",
    defaultBranch: "main",
    repository: {
      fullName: "acme-corp/acme-business",
      url: "https://github.com/acme-corp/acme-business",
    },
    releases: [
      {
        version: "0.1.0",
        commit_sha: "abcd1234ef56",
        digest: "sha256:1234567890abcdef1234567890abcdef",
        image: "ghcr.io/acme-corp/acme-business",
      },
    ],
    onOpenRepository: () => console.log("openRepo"),
  },
};
