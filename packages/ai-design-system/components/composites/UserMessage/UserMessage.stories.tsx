import type { Meta, StoryObj } from '@storybook/react'
import { UserMessage } from './UserMessage'

const meta: Meta<typeof UserMessage> = {
  title: 'Composites/UserMessage',
  component: UserMessage,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof UserMessage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    message: {
      id: '1',
      content: 'Hello, I need help with something',
      avatarSrc: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
      avatarName: 'User',
    },
    showAvatar: true,
  },
}

export const WithoutAvatar: Story = {
  args: {
    message: {
      id: '2',
      content: 'This is a user message without an avatar',
    },
    showAvatar: false,
  },
}

export const LongMessage: Story = {
  args: {
    message: {
      id: '3',
      content: 'This is a much longer user message that contains multiple sentences. It demonstrates how the component handles longer text content and how it wraps appropriately within the message bubble. The text should remain readable and properly formatted even when it spans multiple lines.',
      avatarSrc: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
      avatarName: 'User',
    },
    showAvatar: true,
  },
}

export const ShortQuestion: Story = {
  args: {
    message: {
      id: '4',
      content: 'Why?',
      avatarSrc: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
      avatarName: 'User',
    },
    showAvatar: true,
  },
}
