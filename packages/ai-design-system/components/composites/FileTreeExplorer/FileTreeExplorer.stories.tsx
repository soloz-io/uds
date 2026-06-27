import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { FileTreeExplorer } from './FileTreeExplorer'

const sampleTree = [
  {
    name: 'src',
    path: 'src',
    type: 'folder' as const,
    children: [
      {
        name: 'components',
        path: 'src/components',
        type: 'folder' as const,
        children: [
          { name: 'Button.tsx', path: 'src/components/Button.tsx', type: 'file' as const },
          { name: 'Input.tsx', path: 'src/components/Input.tsx', type: 'file' as const },
        ],
      },
      {
        name: 'hooks',
        path: 'src/hooks',
        type: 'folder' as const,
        children: [
          { name: 'use-toast.ts', path: 'src/hooks/use-toast.ts', type: 'file' as const },
        ],
      },
      { name: 'index.ts', path: 'src/index.ts', type: 'file' as const },
    ],
  },
  { name: 'package.json', path: 'package.json', type: 'file' as const },
]

const meta = {
  title: 'Composites/FileTreeExplorer',
  component: FileTreeExplorer,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof FileTreeExplorer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    tree: sampleTree,
    defaultExpanded: new Set(['src', 'src/components']),
    selectedPath: 'src/components/Button.tsx',
    onSelect: fn(),
    createButtonLabel: 'New File',
  },
}

export const Empty: Story = {
  args: {
    tree: [],
    createButtonLabel: 'New File',
  },
}

export const DarkMode: Story = {
  args: {
    tree: sampleTree,
    defaultExpanded: new Set(['src']),
    selectedPath: 'src/index.ts',
    onSelect: fn(),
  },
  parameters: {
    backgrounds: { disable: true },
  },
}
