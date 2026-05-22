import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { PageLayout } from './PageLayout'
import { usePageLayoutMock } from './usePageLayout.mock'
import { mockSidebarConfig, mockHeaderConfig, mockHeaderConfigWithTabs } from './PageLayout.mocks'
import { WorkflowBuilder } from '@/components/features/WorkflowBuilder'
import { RefinementPanel } from '@/components/features/RefinementPanel'
import { mockVersions, mockNodes, mockEdges } from '@/components/features/WorkflowBuilder/WorkflowBuilder.mocks'

const meta = {
  title: 'Features/PageLayout',
  component: PageLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof PageLayout>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default PageLayout
 *
 * Complete page layout with sidebar, header, and three-panel SectionLayout.
 */
export const Default: Story = {
  args: {
    sidebar: mockSidebarConfig,
    header: mockHeaderConfigWithTabs,
    defaultSidebarOpen: true,
    layoutSections: [
      {
        id: 'file-explorer',
        content: (
          <div className="h-full bg-muted rounded-lg border p-4">
            <h3 className="font-medium mb-2">File Explorer</h3>
            <p className="text-sm text-muted-foreground">Project files and folders</p>
          </div>
        ),
        defaultSize: 25,
        header: {
          showSidebarToggle: false,
          showTitle: false,
        },
      },
      {
        id: 'editor',
        content: (
          <div className="h-full bg-muted rounded-lg border p-4">
            <h3 className="font-medium mb-2">Editor</h3>
            <p className="text-sm text-muted-foreground">Main editing area</p>
          </div>
        ),
        defaultSize: 50,
        header: {
          tabs: [
            { value: 'editor', label: 'Editor' },
            { value: 'split', label: 'Split' },
          ],
          defaultTab: 'editor',
          showSidebarToggle: false,
          showTitle: false,
        },
      },
      {
        id: 'properties',
        content: (
          <div className="h-full bg-muted rounded-lg border p-4">
            <h3 className="font-medium mb-2">Properties</h3>
            <p className="text-sm text-muted-foreground">File and project properties</p>
          </div>
        ),
        defaultSize: 25,
        header: {
          showSidebarToggle: false,
          showTitle: false,
        },
      },
    ],
    layoutStorageKey: 'page-layout-three-panels',
    dragHandleColor: 'accent',
  },
}

/**
 * With State Management
 *
 * PageLayout with two-panel layout: WorkflowBuilder and RefinementPanel features.
 */
export const WithStateManagement: Story = {
  render: () => {
    const layoutState = usePageLayoutMock()
    
    // Mock data for RefinementPanel
    const mockMessages = [
      {
        id: '1',
        type: 'human' as const,
        role: 'user' as const,
        content: 'Please optimize this workflow for better performance',
      },
      {
        id: '2',
        type: 'ai' as const,
        role: 'orchestrator' as const,
        content: 'I\'ll analyze the workflow and suggest optimizations for better performance.',
      },
    ]
    
    const mockFileChanges = [
      {
        id: '1',
        filename: 'workflow.json',
        status: 'modified' as const,
        path: 'workflow.json',
        changes: '+ Added parallel processing\n+ Optimized node connections',
      },
    ]
    
    return (
      <PageLayout
        sidebar={mockSidebarConfig}
        header={{
          ...mockHeaderConfigWithTabs,
          onTabChange: layoutState.onTabChange,
        }}
        defaultSidebarOpen={layoutState.isSidebarOpen}
        layoutSections={[
          {
            id: 'workflow-builder',
            content: (
              <WorkflowBuilder
                workflowName="Order Processing Workflow"
                currentVersionId="v4"
                versions={mockVersions}
                nodes={mockNodes}
                edges={mockEdges}
                onVersionSelect={(id) => console.log('Selected version:', id)}
                onSave={() => console.log('Workflow saved')}
                onCancel={() => console.log('Cancelled')}
                onUndo={() => console.log('Undo')}
                onRedo={() => console.log('Redo')}
                hasUnsavedChanges={true}
                canUndo={true}
                canRedo={false}
                showMinimap={true}
                interactive={true}
              />
            ),
            defaultSize: 60,
          },
          {
            id: 'refinement-panel',
            content: (
              <RefinementPanel
                messages={mockMessages}
                fileChanges={mockFileChanges}
                onSubmit={(message, event) => {
                  console.log('Refinement request:', message)
                }}
                onApprove={() => console.log('Changes approved')}
                onReject={() => console.log('Changes rejected')}
                placeholder="Ask for workflow optimizations or describe changes..."
              />
            ),
            defaultSize: 40,
            header: {
              tabs: [
                { value: 'chat', label: 'Chat' },
                { value: 'changes', label: 'Changes' },
                { value: 'history', label: 'History' },
              ],
              defaultTab: 'chat',
              showSidebarToggle: false,
              showTitle: false,
            },
          },
        ]}
        layoutStorageKey="page-layout-workflow-refinement"
        dragHandleColor="primary"
      />
    )
  },
}

/**
 * Collapsed Sidebar
 *
 * PageLayout with sidebar collapsed by default.
 */
export const CollapsedSidebar: Story = {
  args: {
    sidebar: mockSidebarConfig,
    header: mockHeaderConfig,
    defaultSidebarOpen: false,
    children: (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <h2 className="text-2xl font-bold">Collapsed Sidebar</h2>
          <p className="text-muted-foreground">
            The sidebar starts collapsed. Click the trigger button to expand it.
          </p>
        </div>
      </div>
    ),
  },
}

/**
 * With Multiple Sections
 *
 * PageLayout with sidebar containing multiple navigation sections.
 */
export const WithMultipleSections: Story = {
  args: {
    sidebar: {
      ...mockSidebarConfig,
      secondaryNavigation: [
        { title: 'Settings', url: '#', icon: 'settings' },
        { title: 'Help', url: '#', icon: 'help-circle' },
      ],
      documents: [
        { title: 'Project A', url: '#', icon: 'file' },
        { title: 'Project B', url: '#', icon: 'file' },
        { title: 'Project C', url: '#', icon: 'file' },
      ],
    },
    header: mockHeaderConfig,
    defaultSidebarOpen: true,
    children: (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <h2 className="text-2xl font-bold">Multiple Sections</h2>
          <p className="text-muted-foreground">
            The sidebar contains main navigation, documents, and secondary navigation sections.
          </p>
        </div>
      </div>
    ),
  },
}

