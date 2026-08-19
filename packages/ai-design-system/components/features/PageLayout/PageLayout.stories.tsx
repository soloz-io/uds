import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PageLayout } from './PageLayout'
import { usePageLayoutMock, usePageLayoutStoryActionsMock } from './usePageLayout.mock'
import {
  mockHeaderConfig,
  mockHeaderConfigWithTabs,
  mockPageLayoutFileChanges,
  mockPageLayoutRefinementMessages,
  mockSidebarConfig,
} from './PageLayout.mocks'
import { NodeEditor } from '@/components/features/NodeEditor'
import { ChatPanel } from '../ChatPanel/ChatPanel'
import { mockEdges, mockNodes, mockVersions } from '@/components/features/NodeEditor/NodeEditor.mocks'
import { DashboardFeature } from '../DashboardFeature/DashboardFeature'
import { useDashboardIntegrationMock } from './useDashboardIntegration.mock'

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
          <div className="h-full rounded-lg border bg-muted p-4">
            <h3 className="mb-2 font-medium">File Explorer</h3>
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
          <div className="h-full rounded-lg border bg-muted p-4">
            <h3 className="mb-2 font-medium">Editor</h3>
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
          <div className="h-full rounded-lg border bg-muted p-4">
            <h3 className="mb-2 font-medium">Properties</h3>
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

export const WithStateManagement: Story = {
  render: () => {
    const layoutState = usePageLayoutMock()
    const actions = usePageLayoutStoryActionsMock()
    const dashboardState = useDashboardIntegrationMock()

    const hasProjects = dashboardState.projects.length > 0
    const activeTab = hasProjects ? dashboardState.activeTab : null

    // Determine center tabs based on project existence
    const headerTabs = hasProjects ? [
      { value: 'dashboard', label: 'Dashboard' },
      { value: 'agent', label: 'Agent' },
      { value: 'editor', label: 'Editor' },
    ] : undefined

    return (
      <PageLayout
        sidebar={mockSidebarConfig}
        header={{ title: '' }} // Intercepted by projectSwitcherProps
        projectSwitcherProps={{
          projects: dashboardState.projects,
          selectedProjectId: dashboardState.selectedProjectId,
          onSelectProject: dashboardState.onSelectProject,
          onCreateProject: dashboardState.onCreateProjectClick
        }}
        chatToggleProps={{
          isOpen: actions.isChatOpen,
          onClick: actions.toggleChat
        }}
        isLoading={layoutState.isLoading}
        loadingMessage={layoutState.loadingMessage}
        defaultSidebarOpen={layoutState.isSidebarOpen}
        layoutSections={
          !hasProjects ? undefined : [
            ...(actions.isChatOpen ? [{
              id: 'refinement-panel',
              content: (
                <ChatPanel
                  messages={mockPageLayoutRefinementMessages}
                  fileChanges={mockPageLayoutFileChanges}
                  onSubmit={actions.onSubmit}
                  onApprove={actions.onApprove}
                  onReject={actions.onReject}
                  placeholder="Ask for workflow optimizations or describe changes..."
                />
              ),
              defaultSize: 30,
              minSize: 30,
              maxSize: 40,
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
            }] : []),
            {
              id: 'main-content',
              content: activeTab === 'dashboard' ? (
                <DashboardFeature {...dashboardState.dashboardProps} />
              ) : (
                <NodeEditor
                  workflowName="Order Processing Workflow"
                  currentVersionId="v4"
                  versions={mockVersions}
                  nodes={mockNodes}
                  edges={mockEdges}
                  onVersionSelect={actions.onVersionSelect}
                  onSave={actions.onSave}
                  onUndo={actions.onUndo}
                  onRedo={actions.onRedo}
                  hasUnsavedChanges={true}
                  canUndo={true}
                  canRedo={false}
                  showMinimap={true}
                  interactive={true}
                />
              ),
              defaultSize: actions.isChatOpen ? 70 : 100,
              minSize: 60,
              maxSize: 70,
              header: {
                // title is intercepted by chatToggleProps
                showTitle: true,
                showSidebarToggle: false,
                tabs: headerTabs,
                defaultTab: activeTab || undefined,
                onTabChange: dashboardState.onTabChange,
                tabsPosition: 'right',
                actions: mockHeaderConfigWithTabs.actions,
              }
            },
          ]}
        layoutStorageKey="page-layout-workflow-refinement"
      >
        {!hasProjects && (
          <DashboardFeature {...dashboardState.dashboardProps} />
        )}
      </PageLayout>
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

