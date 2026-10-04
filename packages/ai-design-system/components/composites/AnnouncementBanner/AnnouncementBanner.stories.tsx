import type { Meta, StoryObj } from "@storybook/react"
import { AnnouncementBanner } from "./AnnouncementBanner"

const meta: Meta<typeof AnnouncementBanner> = {
  title: "Composites/AnnouncementBanner",
  component: AnnouncementBanner,
  tags: ["autodocs"],
  args: {
    message: "Introducing Manus 2.0 →",
    href: "/solutions/collar",
  },
}

export default meta
type Story = StoryObj<typeof AnnouncementBanner>

export const Default: Story = {}
