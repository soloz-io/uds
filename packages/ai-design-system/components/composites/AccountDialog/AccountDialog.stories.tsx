import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { AccountDialog } from "./AccountDialog";

/**
 * AccountDialog Composite Stories
 *
 * Account dialog modal with account switcher (Personal + Organisations), plan information,
 * credit balance row, and quick navigation.
 *
 * ## Features
 * - Multi-account switcher with personal and organisation accounts
 * - Plan status with upgrade action ("No plan" with Upgrade when the account has none)
 * - Credits row displaying balance and navigation to usage history
 * - Keyboard navigation and ARIA dialog semantics
 * - Supports dark and light themes
 */
const meta = {
  title: "Composites/AccountDialog",
  component: AccountDialog,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    onUpgrade: fn(),
    onSignOut: fn(),
    onSelectAccount: fn(),
    onCreateOrganisation: fn(),
    onOpenCredits: fn(),
    onOpenSettings: fn(),
  },
} satisfies Meta<typeof AccountDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    user: {
      name: "Rajalakshmi",
      email: "rajalakshmi2655@gmail.com",
      plan: "Pro plan",
      planDescription: "You have access to all premium models and tools.",
    },
  },
};

export const OpenModal: Story = {
  args: {
    open: true,
    user: {
      name: "Rajalakshmi",
      email: "rajalakshmi2655@gmail.com",
      plan: "Pro plan",
      planDescription: "You have access to all premium models and tools.",
    },
  },
};

export const WithAccounts: Story = {
  args: {
    open: true,
    selectedAccountId: "acc-1",
    accounts: [
      {
        id: "acc-1",
        name: "arun4ai",
        kind: "personal",
        plan: { code: "free", name: "Free" },
      },
      {
        id: "acc-2",
        name: "Acme Corp",
        kind: "organisation",
        role: "owner",
        plan: { code: "pro", name: "Pro Team" },
      },
      {
        id: "acc-3",
        name: "Soloz Labs",
        kind: "organisation",
        role: "admin",
        plan: { code: "team", name: "Team" },
      },
    ],
    creditsBalance: 931,
  },
};

export const WithoutPlan: Story = {
  args: {
    open: true,
    user: {
      name: "Alex River",
      email: "alex@example.com",
    },
    creditsBalance: 50,
  },
};

export const OrganisationSelected: Story = {
  args: {
    open: true,
    selectedAccountId: "acc-2",
    accounts: [
      {
        id: "acc-1",
        name: "arun4ai",
        kind: "personal",
        plan: { code: "free", name: "Free" },
      },
      {
        id: "acc-2",
        name: "Acme Corp",
        kind: "organisation",
        role: "owner",
        plan: { code: "pro", name: "Pro Team" },
      },
    ],
    creditsBalance: 4500,
  },
};
