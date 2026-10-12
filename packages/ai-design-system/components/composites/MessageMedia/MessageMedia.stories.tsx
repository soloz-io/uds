import type { Meta, StoryObj } from '@storybook/react'
import { MessageMedia } from './MessageMedia'

const meta: Meta<typeof MessageMedia> = {
  title: 'Composites/MessageMedia',
  component: MessageMedia,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof MessageMedia>

export default meta
type Story = StoryObj<typeof meta>

export const Video: Story = {
  args: {
    media: [
      {
        url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        mediaType: 'video/mp4',
      },
    ],
  },
}

export const VideoAudioAndImage: Story = {
  args: {
    media: [
      {
        url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        mediaType: 'video/mp4',
      },
      {
        url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3',
        mediaType: 'audio/mpeg',
      },
      {
        url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=480&fit=crop',
        mediaType: 'image/jpeg',
      },
    ],
  },
}

export const Empty: Story = {
  args: {
    media: [],
  },
}
