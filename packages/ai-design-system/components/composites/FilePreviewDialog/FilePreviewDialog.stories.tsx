import type { Meta, StoryObj } from '@storybook/react'
import { FilePreviewDialog } from './FilePreviewDialog'

const meta = {
  title: 'Composites/FilePreviewDialog',
  component: FilePreviewDialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof FilePreviewDialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {} as any,
}
