import type { Meta, StoryObj } from '@storybook/react'
import { AdjustableLayout, type AdjustableLayoutSection } from './AdjustableLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/primitives/Card'

const meta = {
  title: 'Composites/AdjustableLayout',
  component: AdjustableLayout,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AdjustableLayout>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default AdjustableLayout
 *
 * 4-section layout with equal default sizes.
 */
export const Default: Story = {
  render: () => {
    const sections: AdjustableLayoutSection[] = [
      {
        id: 'left',
        content: (
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-blue-600">Left Panel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Resizeable panel content</p>
            </CardContent>
          </Card>
        ),
        defaultSize: 25,
      },
      {
        id: 'center',
        content: (
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-green-600">Center Panel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Resizeable panel content</p>
            </CardContent>
          </Card>
        ),
        defaultSize: 25,
      },
      {
        id: 'right',
        content: (
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-purple-600">Right Panel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Resizeable panel content</p>
            </CardContent>
          </Card>
        ),
        defaultSize: 25,
      },
      {
        id: 'logs',
        content: (
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-orange-600">Logs Panel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Resizeable panel content</p>
            </CardContent>
          </Card>
        ),
        defaultSize: 25,
      },
    ]

    return (
      <div className="h-screen p-4">
        <AdjustableLayout
          sections={sections}
          storageKey="adjustable-layout-default"
        />
      </div>
    )
  },
}

/**
 * Two Panels
 *
 * Simple 2-panel layout with resizable divider.
 */
export const TwoPanels: Story = {
  render: () => {
    const sections: AdjustableLayoutSection[] = [
      {
        id: 'main',
        content: (
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-blue-600">Main Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Primary content area</p>
            </CardContent>
          </Card>
        ),
        defaultSize: 70,
      },
      {
        id: 'sidebar',
        content: (
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-gray-600">Sidebar</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Secondary content area</p>
            </CardContent>
          </Card>
        ),
        defaultSize: 30,
      },
    ]

    return (
      <div className="h-screen p-4">
        <AdjustableLayout
          sections={sections}
          storageKey="adjustable-layout-two-panels"
        />
      </div>
    )
  },
}

/**
 * Vertical Orientation
 *
 * Vertical layout with horizontal dividers.
 */
export const VerticalOrientation: Story = {
  render: () => {
    const sections: AdjustableLayoutSection[] = [
      {
        id: 'header',
        content: (
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-blue-600">Header Section</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Top content area</p>
            </CardContent>
          </Card>
        ),
        defaultSize: 20,
      },
      {
        id: 'main',
        content: (
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-green-600">Main Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Middle content area</p>
            </CardContent>
          </Card>
        ),
        defaultSize: 60,
      },
      {
        id: 'footer',
        content: (
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-gray-600">Footer Section</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Bottom content area</p>
            </CardContent>
          </Card>
        ),
        defaultSize: 20,
      },
    ]

    return (
      <div className="h-screen p-4">
        <AdjustableLayout
          sections={sections}
          orientation="vertical"
          storageKey="adjustable-layout-vertical"
        />
      </div>
    )
  },
}
