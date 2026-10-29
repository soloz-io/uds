import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { PlanPicker } from "./PlanPicker";

const samplePlans = [
  {
    code: "free",
    name: "Free",
    priceUsdCents: 0,
    interval: "month",
    credits: 50,
    features: ["Access to open weight models and Claude Sonnet 4.5", "Standard queue priority"],
    current: true,
  },
  {
    code: "pro",
    name: "Pro",
    badge: "FOR GROWING TEAMS",
    priceUsdCents: 2000,
    interval: "month",
    credits: 1000,
    features: [
      "Access to premium models",
      "Priority execution speed",
      "Unlimited file uploads",
    ],
    addOnPriceUsdCentsPerCredit: 4,
    current: false,
  },
  {
    code: "team",
    name: "Pro+",
    badge: "FOR TEAMS FROM 2 TO 500",
    priceUsdCents: 4000,
    interval: "month",
    credits: 2000,
    features: [
      "Access to premium models",
      "Dedicated workspace compute",
      "Team collaboration & shared credits",
      "Priority 24/7 support",
    ],
    addOnPriceUsdCentsPerCredit: 4,
    current: false,
  },
];

/**
 * PlanPicker Composite Stories
 *
 * Tiered subscription and credit package selector component.
 *
 * ## Features
 * - Monthly plans with pricing and credit allocations
 * - Current plan badge and disabled state
 * - Add-on credit rate disclosure
 * - Dark and light theme compatible
 */
const meta = {
  title: "Composites/PlanPicker",
  component: PlanPicker,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    plans: samplePlans,
    onChoose: fn(),
  },
} satisfies Meta<typeof PlanPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Upgrade your plan",
    description: "Choose the plan that fits your workflow. You can upgrade, downgrade, or cancel at any time.",
    plans: samplePlans,
  },
};

export const ProCurrent: Story = {
  args: {
    title: "Change your plan",
    plans: samplePlans.map((p) => ({
      ...p,
      current: p.code === "pro",
    })),
  },
};

export const WithAddOns: Story = {
  args: {
    plans: samplePlans,
  },
};

export const Empty: Story = {
  args: {
    plans: [],
  },
};
