import type { Meta, StoryObj } from "@storybook/react"
import { ShowcaseGallery } from "./ShowcaseGallery"

const meta = {
  title: "Composites/ShowcaseGallery",
  component: ShowcaseGallery,
  tags: ["autodocs"],
  args: {
    eyebrow: "MADE WITH Nutgraf",
    title: "One sentence. Any kind of video.",
    description:
      "Launch films, trailers, explainers, ads, music videos, and short films. Open one to see the prompt behind it, then make your own.",
    columns: 3,
    items: [
      {
        title: "Motion Design Showreel",
        prompt:
          "Make a dynamic 15-second motion graphics video that shows what an incredible motion designer you are.",
        engineBadge: "Made with Nutgraf 2.0 Max · Alchemy",
        videoSrc:
          "https://hel1.your-objectstorage.com/waypoint-s3-dev/test/video/test-batch-001/scene001/avatar.mp4",
        imageSrc:
          "https://hel1.your-objectstorage.com/waypoint-s3-dev/01M3CZS9NH6J4VV6JN67E3YH6J/01M3CZS9NH6J4VV6JN67E3YH6J/chat-attachments/4ce6a0f0-burgundy_4_3_avatar.jpeg",
      },
      {
        title: "Studio Executive",
        prompt:
          "A young professional wearing a burgundy crewneck sweater in a studio interview, warm lighting, shallow depth of field.",
        engineBadge: "Made with Nutgraf 2.0 · HeadShot",
        videoSrc:
          "https://hel1.your-objectstorage.com/waypoint-s3-dev/test/video/test-batch-001/scene001/avatar.mp4",
        imageSrc:
          "https://hel1.your-objectstorage.com/waypoint-s3-dev/01M3CZS9NH6J4VV6JN67E3YH6J/01M3CZS9NH6J4VV6JN67E3YH6J/chat-attachments/4ce6a0f0-burgundy_4_3_avatar.jpeg",
      },
      {
        title: "Podcast Host",
        prompt:
          "Broadcast studio host speaking into a dynamic microphone, acoustic wood slat wall, warm rim lighting.",
        engineBadge: "Made with Nutgraf 2.0 · HeadShot",
        videoSrc:
          "https://hel1.your-objectstorage.com/waypoint-s3-dev/test/video/test-batch-001/scene001/avatar.mp4",
      },
    ],
  },
} satisfies Meta<typeof ShowcaseGallery>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const TwoColumns: Story = {
  args: {
    columns: 2,
  },
}
