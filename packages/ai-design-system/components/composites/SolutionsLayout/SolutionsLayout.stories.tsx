import type { Meta, StoryObj } from "@storybook/react"
import { SolutionsLayout } from "./SolutionsLayout"

const meta: Meta<typeof SolutionsLayout> = {
  title: "Composites/SolutionsLayout",
  component: SolutionsLayout,
  tags: ["autodocs"],
  args: {
    title: "Manus for Product Management",
    subtitle: "Where product ideas become shaped features.",
    tabs: [
      {
        id: "competitive-intel",
        label: "Competitive Intelligence",
        category: "Product Management",
        headline: "Turn Every Meeting Into Shipping Momentum",
        body: "Transform raw customer feedback, sales calls, and market reports into clear, structured product requirements in seconds.",
      },
      {
        id: "feature-spec",
        label: "Feature Specifications",
        category: "Specification",
        headline: "Draft Complete PRDs with Confidence",
        body: "Generate user stories, acceptance criteria, and edge cases with one click.",
      },
    ],
  },
}

export default meta
type Story = StoryObj<typeof SolutionsLayout>

export const Default: Story = {}
