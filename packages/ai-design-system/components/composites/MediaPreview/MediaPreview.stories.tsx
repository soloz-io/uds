import type { Meta, StoryObj } from '@storybook/react'
import { MediaPreview } from './MediaPreview'

const meta = {
  title: 'Composites/MediaPreview',
  component: MediaPreview,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof MediaPreview>

export default meta
type Story = StoryObj<typeof meta>

export const Video: Story = {
  args: {
    file: {
      id: 'video-1',
      name: 'sample-video.mp4',
      format: 'mp4',
      mediaType: 'video/mp4',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    },
  },
}

export const Audio: Story = {
  args: {
    file: {
      id: 'audio-1',
      name: 'sample-audio.mp3',
      format: 'mp3',
      mediaType: 'audio/mp3',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    },
  },
}

export const Image: Story = {
  args: {
    file: {
      id: 'image-1',
      name: 'sample-image.png',
      format: 'png',
      mediaType: 'image/png',
      url: 'https://picsum.photos/800/600',
    },
  },
}

export const NoUrl: Story = {
  args: {
    file: {
      id: 'file-1',
      name: 'unknown-media.bin',
      format: 'bin',
    },
  },
}
