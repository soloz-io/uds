import type { Meta, StoryObj } from "@storybook/react"
import { FeatureSection } from "./FeatureSection"

const meta: Meta<typeof FeatureSection> = {
  title: "Blocks/FeatureSection",
  component: FeatureSection,
  tags: ["autodocs"],
  args: {
    title: "Only Manus Can Do",
    subtitle: "Handle complex, multi-step marketing workflows from start to finish in a single prompt.",
  },
}

export default meta
type Story = StoryObj<typeof FeatureSection>

export const Default: Story = {}
