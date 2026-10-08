import type { Meta, StoryObj } from "@storybook/react"
import { CtaBanner } from "./CtaBanner"

const meta = {
  title: "Composites/CtaBanner",
  component: CtaBanner,
  tags: ["autodocs"],
  args: {
    badge: "Get Started",
    title: "Ready to create your presenter?",
    description: "Bring your face to your channel in minutes with photorealistic AI production.",
    primaryAction: {
      label: "Create your HeadShot",
      href: "#",
    },
    secondaryAction: {
      label: "Book a demo",
      href: "#",
    },
  },
} satisfies Meta<typeof CtaBanner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
