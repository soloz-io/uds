/**
 * Popover Stories
 * 
 * Demonstrates the Popover primitive component
 */

import type { Meta, StoryObj } from '@storybook/react'
import { Popover, PopoverTrigger, PopoverContent } from './Popover'
import { Button } from '@/components/primitives/Button'

const meta: Meta<typeof Popover> = {
  title: 'Primitives/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Popover>

/**
 * Default popover with button trigger
 */
export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2">
          <h4 className="font-medium">Popover Content</h4>
          <p className="text-sm text-muted-foreground">
            This is a popover with some content inside.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
}
