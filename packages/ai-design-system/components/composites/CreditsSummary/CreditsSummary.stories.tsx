import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { CreditsSummary } from "./CreditsSummary";

/**
 * CreditsSummary Composite Stories
 *
 * Balance overview card showing included credits, expiration date, add-on credits,
 * frozen status badge, and upgrade/buy actions.
 *
 * ## Features
 * - Total balance presentation
 * - Included credits with expiry notice
 * - Add-on credits with frozen alert badge
 * - Upgrade and Buy credits button triggers
 */
const meta = {
  title: "Composites/CreditsSummary",
  component: CreditsSummary,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    onUpgrade: fn(),
    onBuyCredits: fn(),
  },
} satisfies Meta<typeof CreditsSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    planName: "Free",
    total: 631,
    included: {
      amount: 631,
      expiresAt: "Nov 8, 2026",
    },
  },
};

export const ActiveWithAddOn: Story = {
  args: {
    planName: "Pro plan",
    total: 3500,
    included: {
      amount: 1000,
      expiresAt: "Nov 28, 2026",
    },
    addOn: {
      amount: 2500,
      frozen: false,
    },
  },
};

export const FrozenAddOn: Story = {
  args: {
    planName: "Free",
    total: 50,
    included: {
      amount: 50,
      expiresAt: "Nov 1, 2026",
    },
    addOn: {
      amount: 1400,
      frozen: true,
    },
  },
};

export const ZeroBalance: Story = {
  args: {
    planName: "Free",
    total: 0,
    included: {
      amount: 0,
    },
  },
};
