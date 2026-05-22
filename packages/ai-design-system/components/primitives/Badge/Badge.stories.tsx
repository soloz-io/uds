import type { Meta, StoryObj } from "@storybook/react"
import { Badge } from "./Badge"

const meta = {
  title: "Primitives/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <Badge>Default</Badge>,
}

export const Secondary: Story = {
  render: () => <Badge variant="secondary">Secondary</Badge>,
}

export const Destructive: Story = {
  render: () => <Badge variant="destructive">Destructive</Badge>,
}

export const Outline: Story = {
  render: () => <Badge variant="outline">Outline</Badge>,
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Badge>
        <span className="size-2 rounded-full bg-green-500" />
        Active
      </Badge>
      <Badge variant="secondary">
        <span className="size-2 rounded-full bg-yellow-500" />
        Pending
      </Badge>
      <Badge variant="destructive">
        <span className="size-2 rounded-full bg-white" />
        Inactive
      </Badge>
    </div>
  ),
}

export const DarkMode: Story = {
  parameters: {
    backgrounds: { default: "dark" },
  },
  render: () => (
    <div className="dark flex gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
}
