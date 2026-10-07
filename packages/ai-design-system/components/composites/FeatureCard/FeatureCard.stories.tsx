import type { Meta, StoryObj } from "@storybook/react"
import { FeatureCard } from "./FeatureCard"

const meta: Meta<typeof FeatureCard> = {
  title: "Composites/FeatureCard",
  component: FeatureCard,
  tags: ["autodocs"],
  args: {
    category: "Social Media",
    headline: "Batch generate multi-format content",
    body: "Turn any source material such as blog posts, reports, or data into polished, platform-ready social graphics and carousels.",
    action: {
      label: "Watch demo",
      href: "#",
    },
    mediaPosition: "left",
  },
}

export default meta
type Story = StoryObj<typeof FeatureCard>

export const Default: Story = {}

export const MediaRight: Story = {
  args: {
    mediaPosition: "right",
  },
}
