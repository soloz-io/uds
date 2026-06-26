import type { Meta, StoryObj } from '@storybook/react'
import { FormReports } from './FormReports'

const meta = {
  title: 'Composites/FormReports',
  component: FormReports,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof FormReports>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {} as any,
}
