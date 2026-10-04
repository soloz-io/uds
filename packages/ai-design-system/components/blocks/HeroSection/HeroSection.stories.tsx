import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react"
import { HeroSection } from "./HeroSection"

const meta: Meta<typeof HeroSection> = {
  title: "Blocks/HeroSection",
  component: HeroSection,
  tags: ["autodocs"],
  args: {
    headline: "What can I do for you?",
    videoNode: (
      <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
        Video Player
      </div>
    ),
    promptPlaceholder: "Describe what you want to create",
  },
}

export default meta
type Story = StoryObj<typeof HeroSection>

export const Default: Story = {}
