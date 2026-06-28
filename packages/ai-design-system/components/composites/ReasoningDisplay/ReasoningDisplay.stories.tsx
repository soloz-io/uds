import type { Meta, StoryObj } from '@storybook/react'
import { ReasoningDisplay } from './ReasoningDisplay'

const meta: Meta<typeof ReasoningDisplay> = {
  title: 'Composites/ReasoningDisplay',
  component: ReasoningDisplay,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof ReasoningDisplay>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    content: "Let me evaluate the user's request and read the necessary files to propose a solution.",
    isStreaming: false,
    items: [
      {
        id: 'tool_1',
        name: 'read_file',
        args: { file_path: '/workspace/src/main.tsx' },
        result: 'import { App } from "./App"; ...',
        status: 'completed',
        visibility: 'reasoning',
        uiVariant: 'link',
        linkText: 'src/main.tsx',
        linkAction: 'open-file',
      },
      {
        id: 'tool_2',
        name: 'read_file',
        args: { file_path: '/workspace/src/App.tsx' },
        result: 'export const App = () => <div>Hello</div>;',
        status: 'completed',
        visibility: 'reasoning',
        uiVariant: 'link',
        linkText: 'src/App.tsx',
        linkAction: 'open-file',
      }
    ],
  },
}

export const Streaming: Story = {
  args: {
    content: "I'll start by listing the directory contents...",
    isStreaming: true,
    items: [
      {
        id: 'tool_1',
        name: 'list_dir',
        args: { path: '/src' },
        status: 'pending',
        visibility: 'reasoning',
      },
    ],
  },
}

export const OnlyTools: Story = {
  args: {
    isStreaming: false,
    items: [
      {
        id: 'tool_1',
        name: 'write_todos',
        args: { todos: ['Fix layout', 'Update colors'] },
        result: 'Todos written successfully.',
        status: 'completed',
        visibility: 'reasoning',
      },
    ],
  },
}
