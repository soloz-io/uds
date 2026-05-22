import type { Meta, StoryObj } from '@storybook/react'
import { AgentIndicator } from './AgentIndicator'

const meta: Meta<typeof AgentIndicator> = {
  title: 'Composites/AgentIndicator',
  component: AgentIndicator,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof AgentIndicator>

export default meta
type Story = StoryObj<typeof meta>

export const Pending: Story = {
  args: {
    subAgent: {
      id: 'agent_1',
      name: 'task',
      subAgentName: 'content_writer',
      input: 'Generate tutorial narration for React hooks',
      status: 'pending',
    },
    isSelected: false,
  },
}

export const Active: Story = {
  args: {
    subAgent: {
      id: 'agent_2',
      name: 'task',
      subAgentName: 'video_producer',
      input: 'Compile video segments with transitions',
      status: 'active',
    },
    isSelected: false,
  },
}

export const Completed: Story = {
  args: {
    subAgent: {
      id: 'agent_3',
      name: 'task',
      subAgentName: 'project_analyzer',
      input: 'Analyze codebase structure and dependencies',
      output: 'Analysis complete: 15 components, 8 utilities, 3 services',
      status: 'completed',
    },
    isSelected: false,
  },
}

export const Error: Story = {
  args: {
    subAgent: {
      id: 'agent_4',
      name: 'task',
      subAgentName: 'asset_generator',
      input: 'Generate audio narration from script',
      output: 'Failed: API key invalid',
      status: 'error',
    },
    isSelected: false,
  },
}

export const Selected: Story = {
  args: {
    subAgent: {
      id: 'agent_5',
      name: 'task',
      subAgentName: 'segmentation',
      input: 'Create video timeline with chapter markers',
      output: 'Created 8 segments with timing metadata',
      status: 'completed',
    },
    isSelected: true,
  },
}

export const LongInput: Story = {
  args: {
    subAgent: {
      id: 'agent_6',
      name: 'task',
      subAgentName: 'use_case_discoverer',
      input:
        'Identify educational use cases for this codebase by analyzing the project structure, reading key files, identifying learning objectives, and generating comprehensive tutorial content that demonstrates best practices.',
      status: 'active',
    },
    isSelected: false,
  },
}

export const ObjectInput: Story = {
  args: {
    subAgent: {
      id: 'agent_7',
      name: 'task',
      subAgentName: 'coding_tutorial_generator',
      input: {
        project_path: '/app/examples/react-hooks',
        tutorial_type: 'beginner',
        topics: ['useState', 'useEffect', 'custom hooks'],
        duration: 300,
      },
      status: 'pending',
    },
    isSelected: false,
  },
}

export const MultipleAgents: Story = {
  render: () => (
    <div className="space-y-2 max-w-md">
      <AgentIndicator
        subAgent={{
          id: 'agent_1',
          name: 'task',
          subAgentName: 'project_analyzer',
          input: 'Analyze codebase structure',
          output: 'Analysis complete',
          status: 'completed',
        }}
        isSelected={false}
      />
      <AgentIndicator
        subAgent={{
          id: 'agent_2',
          name: 'task',
          subAgentName: 'content_writer',
          input: 'Generate narration script',
          status: 'active',
        }}
        isSelected={true}
      />
      <AgentIndicator
        subAgent={{
          id: 'agent_3',
          name: 'task',
          subAgentName: 'video_producer',
          input: 'Compile final video',
          status: 'pending',
        }}
        isSelected={false}
      />
    </div>
  ),
}
