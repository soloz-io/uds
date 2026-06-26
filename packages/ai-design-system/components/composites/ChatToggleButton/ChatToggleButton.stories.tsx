import type { Meta, StoryObj } from '@storybook/react'
import { ChatToggleButton } from './ChatToggleButton'
import { fn } from '@storybook/test'

const meta = {
  title: 'Composites/ChatToggleButton',
  component: ChatToggleButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ChatToggleButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    isOpen: true,
    label: "Hide Chat",
    onClick: fn(),
  },
}

export const Closed: Story = {
  args: {
    isOpen: false,
    label: "Show Chat",
    onClick: fn(),
  },
}
