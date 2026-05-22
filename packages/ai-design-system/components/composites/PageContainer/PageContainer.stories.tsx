import type { Meta, StoryObj } from '@storybook/react'
import { PageContainer } from './PageContainer'

const meta = {
  title: 'Composites/PageContainer',
  component: PageContainer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof PageContainer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Page Content</h1>
        <p className="mt-4 text-muted-foreground">
          This is the main page content wrapped in PageContainer.
        </p>
      </div>
    ),
  },
}

export const WithCustomClass: Story = {
  args: {
    children: (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Custom Styled Container</h1>
        <p className="mt-4 text-muted-foreground">
          PageContainer with custom className applied.
        </p>
      </div>
    ),
    className: 'bg-muted',
  },
}
