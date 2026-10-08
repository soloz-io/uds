import type { Meta, StoryObj } from "@storybook/react"
import { ProcessSteps } from "./ProcessSteps"

const meta = {
  title: "Composites/ProcessSteps",
  component: ProcessSteps,
  tags: ["autodocs"],
  args: {
    title: "From a single selfie to your on-screen presenter",
    subtitle: "Turn raw photos into production-ready video presenters in three steps.",
    steps: [
      {
        step: "01",
        title: "Drop Your Photo",
        description: "Upload a clear headshot or selfie. Nutgraf extracts your unique facial features, complexion, and identity landmarks.",
      },
      {
        step: "02",
        title: "Shape Your Look",
        description: "Pick a studio aesthetic or customize 22 precision segments across wardrobe, lighting, bokeh, and camera framing.",
      },
      {
        step: "03",
        title: "Animate in Every Video",
        description: "Your consistent avatar speaks narration with photorealistic lip-sync across all channel scenes.",
      },
    ],
  },
} satisfies Meta<typeof ProcessSteps>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
