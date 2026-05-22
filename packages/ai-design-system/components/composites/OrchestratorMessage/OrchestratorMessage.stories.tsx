import type { Meta, StoryObj } from '@storybook/react'
import { OrchestratorMessage } from './OrchestratorMessage'
import { SpecialistMessage } from '../SpecialistMessage'
import { ToolCallDisplay } from '../ToolCallDisplay'
import { Search, BarChart, FileText } from 'lucide-react'

const meta: Meta<typeof OrchestratorMessage> = {
  title: 'Composites/OrchestratorMessage',
  component: OrchestratorMessage,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof OrchestratorMessage>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    message: {
      id: '1',
      content: 'I will coordinate the analysis across multiple specialist agents.',
      avatarSrc: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      avatarName: 'Coordinator',
    },
    showAvatar: true,
  },
}

export const WithoutAvatar: Story = {
  args: {
    message: {
      id: '2',
      content: 'Orchestrating workflow without avatar display...',
    },
    showAvatar: false,
  },
}

export const WithSpecialists: Story = {
  args: {
    message: {
      id: '3',
      content: 'I am delegating tasks to specialized agents for comprehensive analysis.',
      avatarSrc: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      avatarName: 'Coordinator',
    },
    showAvatar: true,
    children: (
      <>
        <SpecialistMessage
          message={{
            id: 'spec_1',
            name: 'research-agent',
            description: 'Gathering relevant information from multiple sources',
            icon: <Search className="size-4" />,
            content: 'Researching the topic and gathering relevant information...',
            status: 'completed',
          }}
          isNested={true}
        />
        <SpecialistMessage
          message={{
            id: 'spec_2',
            name: 'analysis-agent',
            description: 'Performing comprehensive analysis on research data',
            icon: <BarChart className="size-4" />,
            content: 'Analyzing the collected data and extracting insights...',
            status: 'active',
          }}
          isNested={true}
        />
        <SpecialistMessage
          message={{
            id: 'spec_3',
            name: 'summary-agent',
            description: 'Creating comprehensive summary of findings',
            icon: <FileText className="size-4" />,
            content: 'Preparing comprehensive summary of findings...',
            status: 'pending',
          }}
          isNested={true}
        />
      </>
    ),
  },
}

export const WithToolCalls: Story = {
  args: {
    message: {
      id: '4',
      content: 'Executing direct tool calls before delegating to specialists.',
      avatarSrc: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      avatarName: 'Coordinator',
    },
    showAvatar: true,
    children: (
      <>
        <ToolCallDisplay
          toolCall={{
            id: 'tool_1',
            name: 'write_file',
            args: { filename: 'plan.md', content: 'Execution plan...' },
            result: 'File created successfully',
            status: 'completed',
          }}
        />
        <ToolCallDisplay
          toolCall={{
            id: 'tool_2',
            name: 'write_todos',
            args: { todos: ['Task 1', 'Task 2', 'Task 3'] },
            result: 'Todo list created',
            status: 'completed',
          }}
        />
      </>
    ),
  },
}

export const CompleteWorkflow: Story = {
  args: {
    message: {
      id: '5',
      content: 'I will manage this complex workflow with both direct tools and specialist agents.',
      avatarSrc: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
      avatarName: 'Coordinator',
    },
    showAvatar: true,
    children: (
      <>
        <ToolCallDisplay
          toolCall={{
            id: 'tool_1',
            name: 'create_plan',
            args: { objective: 'Complete analysis' },
            result: 'Plan created',
            status: 'completed',
          }}
        />
        <SpecialistMessage
          message={{
            id: 'spec_1',
            name: 'data-collector',
            description: 'Collecting data from multiple sources',
            icon: <Search className="size-4" />,
            content: 'Collecting data from multiple sources...',
            status: 'completed',
            toolCalls: [
              {
                id: 'subtool_1',
                name: 'fetch_data',
                args: { source: 'API' },
                result: 'Data fetched',
                status: 'completed',
              },
            ],
          }}
          isNested={true}
        />
        <SpecialistMessage
          message={{
            id: 'spec_2',
            name: 'processor',
            description: 'Processing and transforming the collected data',
            icon: <BarChart className="size-4" />,
            content: 'Processing and transforming the collected data...',
            status: 'active',
          }}
          isNested={true}
        />
        <SpecialistMessage
          message={{
            id: 'spec_3',
            name: 'reporter',
            description: 'Generating final report with visualizations',
            icon: <FileText className="size-4" />,
            content: 'Generating final report with visualizations...',
            status: 'pending',
          }}
          isNested={true}
        />
      </>
    ),
  },
}
