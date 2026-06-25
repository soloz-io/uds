import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "@storybook/test"

import { EmptyState } from "./EmptyState"

const meta = {
  title: "Composites/EmptyState",
  component: EmptyState,
  parameters: {
    layout: "centered",
  },
  args: {
    onAction: fn(),
  },
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: "Distribute Track",
    description: "Upload your first master to start reaching listeners on Spotify, Apple Music, and more.",
    actionLabel: "Create Release",
  },
}
