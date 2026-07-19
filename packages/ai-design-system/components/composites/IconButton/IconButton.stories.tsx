import type { Meta, StoryObj } from '@storybook/react'
import { IconButton } from './IconButton'
import { fn } from '@storybook/test'

const meta = {
  title: 'Composites/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: "download",
    onClick: fn(),
    title: "Download",
  },
}

export const Outline: Story = {
  args: {
    icon: "play",
    variant: "outline",
    onClick: fn(),
    title: "Play",
  },
}
