import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { InboxPanel } from "./InboxPanel"

const items = Array.from({ length: 30 }).map((_, index) => ({
  id: `item-${index + 1}`,
  title: `Item ${index + 1}`,
  subtitle: "completed • 12s • retries 0",
  preview: "Inbox-style preview text for validating panel-level vertical scrolling behavior.",
  timestamp: `${index + 1}m ago`,
  badge: index % 3 === 0 ? "running" : "completed",
}))

const meta = {
  title: "Blocks/InboxPanel",
  component: InboxPanel,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof InboxPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items,
    selectedItemId: "item-2",
  },
  render: (args) => (
    <div className="h-[720px]">
      <InboxPanel {...args} />
    </div>
  ),
}

export const Empty: Story = {
  args: {
    items: [],
    emptyMessage: "No matching items.",
  },
  render: (args) => (
    <div className="h-[720px]">
      <InboxPanel {...args} />
    </div>
  ),
}
