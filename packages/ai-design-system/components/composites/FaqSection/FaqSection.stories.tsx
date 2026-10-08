import type { Meta, StoryObj } from "@storybook/react"
import { FaqSection } from "./FaqSection"

const meta = {
  title: "Composites/FaqSection",
  component: FaqSection,
  tags: ["autodocs"],
  args: {
    title: "Frequently asked questions",
    subtitle: "Everything you need to know about Nutgraf HeadShot.",
    items: [
      {
        id: "faq-1",
        question: "Does Nutgraf invent synthetic faces?",
        answer: "Never. The Rule of Identity guarantees your face always comes directly from your uploaded photo. We preserve facial geometry, eyes, and skin characteristics while elevating styling, wardrobe, and studio lighting.",
      },
      {
        id: "faq-2",
        question: "What kind of photo should I provide?",
        answer: "A clear, well-lit photo of your face looking toward the camera works best. Avoid heavy sunglasses, extreme angles, or heavy filters.",
      },
      {
        id: "faq-3",
        question: "Can I customize the presenter's wardrobe and setting?",
        answer: "Yes. You have 22 precision controls covering clothing type, fabrics, lighting temperature, background blur, and camera angles.",
      },
    ],
  },
} satisfies Meta<typeof FaqSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
