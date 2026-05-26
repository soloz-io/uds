import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { InboxList } from "./InboxList"

const items = Array.from({ length: 18 }).map((_, index) => ({
  id: `item-${index + 1}`,
  title: `Run ${index + 1}`,
  subtitle: index % 2 === 0 ? "completed • 5s • retries 0" : "running • 23s • retries 1",
  preview: "This is an email-style preview row for validating list readability and vertical scrolling.",
  timestamp: `${index + 1}m ago`,
  badge: index % 2 === 0 ? "completed" : "running",
}))

const meta = {
  title: "Composites/InboxList",
  component: InboxList,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof InboxList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items,
    selectedItemId: "item-2",
  },
}

export const Empty: Story = {
  args: {
    items: [],
    emptyMessage: "No messages yet.",
  },
}

export const Loading: Story = {
  args: {
    items: [],
    isLoading: true,
  },
}
