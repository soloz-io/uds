import type { Meta, StoryObj } from "@storybook/react";
import { GitHubAppCard } from "./GitHubAppCard";

const meta: Meta<typeof GitHubAppCard> = {
  title: "Composites/GitHubAppCard",
  component: GitHubAppCard,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof GitHubAppCard>;

export const InstallationNeeded: Story = {
  args: {
    state: "installation_needed",
    onInstallApp: () => console.log("onInstallApp"),
  },
};

export const NotConfigured: Story = {
  args: {
    state: "not_configured",
    onInstallApp: () => console.log("onInstallApp"),
  },
};

export const Installed: Story = {
  args: {
    state: "ready",
    orgName: "acme-corp",
    orgAccountType: "Organization",
    onInstallApp: () => console.log("onInstallApp"),
  },
};
