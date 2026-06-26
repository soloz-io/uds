import type { Meta, StoryObj } from '@storybook/react'
import { WorkflowRunObservabilityPanel } from './WorkflowRunObservabilityPanel'

const meta = {
  title: 'Composites/WorkflowRunObservabilityPanel',
  component: WorkflowRunObservabilityPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof WorkflowRunObservabilityPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {} as any,
}
