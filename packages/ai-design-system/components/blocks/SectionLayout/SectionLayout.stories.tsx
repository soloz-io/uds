import type { Meta, StoryObj } from '@storybook/react'
import { SectionLayout } from './SectionLayout'

/**
 * SectionLayout Block Stories
 *
 * A layout block that provides adjustable panels with headers.
 * Uses AdjustableLayout composite for panel management and AppHeader composite for headers.
 *
 * ## Features
 * - Adjustable panel sizing with drag handles
 * - Optional headers with tabs in each panel
 * - Horizontal and vertical orientation support
 * - Panel size persistence via localStorage
 *
 * ## Usage
 * Perfect for creating multi-panel layouts with independent headers,
 * such as code editors, chat interfaces, or dashboard layouts.
 */
const meta = {
  title: 'Blocks/SectionLayout',
  component: SectionLayout,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SectionLayout>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default SectionLayout
 *
 * 4-panel adjustable layout with headers using AppHeader composite.
 */
export const Default: Story = {
  render: () => {
    const sections = [
      {
        id: 'top-left',
        content: (
          <div className="h-full bg-muted rounded-lg border p-4">
            <h3 className="font-medium mb-2">Top Left Content</h3>
            <p className="text-sm text-muted-foreground">Content area with AppHeader composite</p>
          </div>
        ),
        defaultSize: 25,
        header: {
          tabs: [
            { value: 'view', label: 'View' },
            { value: 'edit', label: 'Edit' },
          ],
          defaultTab: 'view',
          showSidebarToggle: false,
          showTitle: false,
        },
      },
      {
        id: 'top-right',
        content: (
          <div className="h-full bg-muted rounded-lg border p-4">
            <h3 className="font-medium mb-2">Top Right Content</h3>
            <p className="text-sm text-muted-foreground">Content area with AppHeader composite</p>
          </div>
        ),
        defaultSize: 25,
        header: {
          tabs: [
            { value: 'tab1', label: 'Tab 1' },
            { value: 'tab2', label: 'Tab 2' },
            { value: 'tab3', label: 'Tab 3' },
          ],
          defaultTab: 'tab1',
          showSidebarToggle: false,
          showTitle: false,
        },
      },
      {
        id: 'bottom-left',
        content: (
          <div className="h-full bg-muted rounded-lg border p-4">
            <h3 className="font-medium mb-2">Bottom Left Content</h3>
            <p className="text-sm text-muted-foreground">Content area with minimal AppHeader</p>
          </div>
        ),
        defaultSize: 25,
        header: {
          showSidebarToggle: false,
          showTitle: false,
        },
      },
      {
        id: 'bottom-right',
        content: (
          <div className="h-full bg-muted rounded-lg border p-4">
            <h3 className="font-medium mb-2">Bottom Right Content</h3>
            <p className="text-sm text-muted-foreground">Content area with AppHeader composite</p>
          </div>
        ),
        defaultSize: 25,
        header: {
          tabs: [
            { value: 'log', label: 'Log' },
            { value: 'console', label: 'Console' },
          ],
          defaultTab: 'log',
          showSidebarToggle: false,
          showTitle: false,
        },
      },
    ]

    return (
      <div className="h-screen p-4">
        <SectionLayout
          sections={sections}
          storageKey="section-layout-default"
        />
      </div>
    )
  },
}

/**
 * Single Panel Layout
 *
 * Single panel with header using AppHeader composite.
 */
export const SinglePanel: Story = {
  render: () => {
    const sections = [
      {
        id: 'main-panel',
        content: (
          <div className="h-full bg-muted rounded-lg border p-4">
            <h3 className="font-medium mb-2">Single Panel Content</h3>
            <p className="text-sm text-muted-foreground">Single panel with AppHeader composite</p>
          </div>
        ),
        defaultSize: 100,
        header: {
          tabs: [
            { value: 'overview', label: 'Overview' },
            { value: 'details', label: 'Details' },
            { value: 'settings', label: 'Settings' },
          ],
          defaultTab: 'overview',
          showSidebarToggle: false,
          showTitle: false,
        },
      },
    ]

    return (
      <div className="h-screen p-4">
        <SectionLayout
          sections={sections}
          storageKey="section-layout-single"
        />
      </div>
    )
  },
}

/**
 * Primary Drag Handles
 *
 * Demonstrates primary colored drag handles.
 */
export const PrimaryDragHandles: Story = {
  render: () => {
    const sections = [
      {
        id: 'left',
        content: (
          <div className="h-full bg-muted rounded-lg border p-4">
            <h3 className="font-medium mb-2">Left Panel</h3>
            <p className="text-sm text-muted-foreground">Primary drag handles</p>
          </div>
        ),
        defaultSize: 50,
        header: {
          showSidebarToggle: false,
          showTitle: false,
        },
      },
      {
        id: 'right',
        content: (
          <div className="h-full bg-muted rounded-lg border p-4">
            <h3 className="font-medium mb-2">Right Panel</h3>
            <p className="text-sm text-muted-foreground">Primary drag handles</p>
          </div>
        ),
        defaultSize: 50,
        header: {
          showSidebarToggle: false,
          showTitle: false,
        },
      },
    ]

    return (
      <div className="h-screen p-4">
        <SectionLayout
          sections={sections}
          dragHandleColor="primary"
          storageKey="section-layout-primary"
        />
      </div>
    )
  },
}

/**
 * Accent Drag Handles
 *
 * Demonstrates accent colored drag handles.
 */
export const AccentDragHandles: Story = {
  render: () => {
    const sections = [
      {
        id: 'panel1',
        content: (
          <div className="h-full bg-muted rounded-lg border p-4">
            <h3 className="font-medium mb-2">Panel 1</h3>
            <p className="text-sm text-muted-foreground">Accent drag handles</p>
          </div>
        ),
        defaultSize: 33,
        header: {
          showSidebarToggle: false,
          showTitle: false,
        },
      },
      {
        id: 'panel2',
        content: (
          <div className="h-full bg-muted rounded-lg border p-4">
            <h3 className="font-medium mb-2">Panel 2</h3>
            <p className="text-sm text-muted-foreground">Accent drag handles</p>
          </div>
        ),
        defaultSize: 34,
        header: {
          showSidebarToggle: false,
          showTitle: false,
        },
      },
      {
        id: 'panel3',
        content: (
          <div className="h-full bg-muted rounded-lg border p-4">
            <h3 className="font-medium mb-2">Panel 3</h3>
            <p className="text-sm text-muted-foreground">Accent drag handles</p>
          </div>
        ),
        defaultSize: 33,
        header: {
          showSidebarToggle: false,
          showTitle: false,
        },
      },
    ]

    return (
      <div className="h-screen p-4">
        <SectionLayout
          sections={sections}
          dragHandleColor="accent"
          storageKey="section-layout-accent"
        />
      </div>
    )
  },
}
