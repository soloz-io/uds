import type { Meta, StoryObj } from '@storybook/react'
import { ThemeSelector } from './ThemeSelector'
import { useState } from 'react'

const meta = {
  title: 'Composites/ThemeSelector',
  component: ThemeSelector,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ThemeSelector>

export default meta
type Story = StoryObj<typeof meta>

const themes = [
  { label: 'Default', value: 'default' },
  { label: 'Ocean', value: 'ocean' },
  { label: 'Forest', value: 'forest' },
  { label: 'Sunset', value: 'sunset' },
]

export const Default: Story = {
  args: {
    themes,
    placeholder: 'Select theme',
  },
}

export const WithValue: Story = {
  args: {
    themes,
    value: 'ocean',
  },
}

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState('default')
    return (
      <div style={{ minWidth: '200px' }}>
        <ThemeSelector themes={themes} value={value} onValueChange={setValue} />
        <p style={{ marginTop: '16px', fontSize: '14px' }}>Selected: {value}</p>
      </div>
    )
  },
}
