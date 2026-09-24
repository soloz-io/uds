import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
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
  args: {
    open: true,
    onOpenChange: fn(),
    title: 'Sprint checklist',
    description: 'specs/sprint-plan.md',
    content: [
      '## Tasks',
      '- [x] Draft API contract',
      '- [ ] Land UI stubs',
      '- [ ] Wire preview',
    ].join('\n'),
  },
}

export const Empty: Story = {
  args: {
    open: true,
    onOpenChange: fn(),
    title: 'Untitled spec',
    description: 'specs/untitled.md',
    content: undefined,
  },
}
