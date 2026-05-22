import type { Meta, StoryObj } from '@storybook/react'
import { DocumentTabBar } from './DocumentTabBar'
import type { DocumentTabBarProps } from './DocumentTabBar'

/**
 * DocumentTabBar composite - VS Code-style document tabs
 * 
 * Displays open documents as closeable tabs with dirty indicators.
 * Used by multi-document editors to allow users to switch between
 * and manage open files.
 */
const meta = {
  title: 'Composites/DocumentTabBar',
  component: DocumentTabBar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DocumentTabBar>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default - Single tab
 */
export const Default: Story = {
  args: {
    tabs: [
      {
        id: 'doc-1',
        name: 'Untitled',
        isDirty: false,
        format: 'json',
        lastModified: Date.now(),
      },
    ],
    activeTabId: 'doc-1',
  },
}

/**
 * Multiple tabs - Mix of clean and dirty
 */
export const MultipleTabs: Story = {
  args: {
    tabs: [
      {
        id: 'doc-1',
        name: 'Introduction.md',
        isDirty: false,
        format: 'markdown',
        lastModified: Date.now() - 3600000,
      },
      {
        id: 'doc-2',
        name: 'Workflow.json',
        isDirty: true,
        format: 'json',
        lastModified: Date.now() - 1800000,
      },
      {
        id: 'doc-3',
        name: 'Configuration.md',
        isDirty: true,
        format: 'markdown',
        lastModified: Date.now(),
      },
    ],
    activeTabId: 'doc-2',
  },
}

/**
 * Many tabs - Demonstrates horizontal scrolling
 */
export const ManyTabs: Story = {
  args: {
    tabs: Array.from({ length: 10 }).map((_, i) => ({
      id: `doc-${i}`,
      name: `Document-${i + 1}.md`,
      isDirty: Math.random() > 0.6,
      format: 'markdown' as const,
      lastModified: Date.now() - i * 3600000,
    })),
    activeTabId: 'doc-5',
  },
}

/**
 * Long names - Tab text truncation
 */
export const LongTabNames: Story = {
  args: {
    tabs: [
      {
        id: 'doc-1',
        name: 'VeryLongDocumentNameThatShouldBeTruncated.md',
        isDirty: true,
        format: 'markdown',
        lastModified: Date.now(),
      },
      {
        id: 'doc-2',
        name: 'AnotherDocumentWithAnExtremelyLongNameForTesting.json',
        isDirty: false,
        format: 'json',
        lastModified: Date.now(),
      },
    ],
    activeTabId: 'doc-1',
  },
}

/**
 * Empty state - No tabs
 */
export const EmptyTabs: Story = {
  args: {
    tabs: [],
  },
}
