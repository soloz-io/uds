import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { AccountDialog } from "./AccountDialog";

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
  },
} satisfies Meta<typeof AccountDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    user: {
      name: "Rajalakshmi",
      email: "rajalakshmi2655@gmail.com",
      plan: "Google AI Pro",
      planDescription: "You can upgrade to a Google AI Ultra plan to receive higher rate limits.",
    },
  },
};

export const OpenModal: Story = {
  args: {
    open: true,
    user: {
      name: "Rajalakshmi",
      email: "rajalakshmi2655@gmail.com",
      plan: "Google AI Pro",
      planDescription: "You can upgrade to a Google AI Ultra plan to receive higher rate limits.",
    },
  },
};
