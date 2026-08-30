import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { AIConversation } from './AIConversation'

const meta: Meta<typeof AIConversation> = {
  title: 'Blocks/AIConversation',
  component: AIConversation,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof AIConversation>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    messages: [
      {
        id: '1',
        type: 'human',
        role: 'user',
        content: 'Compare the achievements of LeBron James and Michael Jordan',
        avatarSrc: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
        avatarName: 'User',
      },
      {
        id: '2',
        type: 'ai',
        role: 'orchestrator',
        content: 'I\'ll help you conduct a comprehensive comparison of LeBron James and Michael Jordan\'s achievements. Let me start by recording your question and creating a plan for this research.',
        avatarSrc: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
        avatarName: 'Coordinator',
        toolCalls: [
          {
            id: 'tool_1',
            name: 'write_file',
            args: { filename: 'research_plan.md', content: 'Research plan for comparing LeBron and Jordan' },
            result: 'File created successfully',
            status: 'completed',
          },
          {
            id: 'tool_2',
            name: 'write_todos',
            args: { todos: ['Gather LeBron stats', 'Gather Jordan stats', 'Compare achievements'] },
            result: 'Todo list created',
            status: 'completed',
          },
        ],
        subAgents: [
          {
            id: 'agent_1',
            name: 'task',
            subAgentName: 'research-agent',
            input: 'Research LeBron James career achievements and statistics. I need comprehensive information including NBA championships, Finals MVP awards, regular season MVP awards, All-Star selections, All-NBA team selections, career statistics (points, rebounds, assists, etc.), notable records for finals, playoff...',
            output: null,
            status: 'active',
          },
        ],
      },
    ],
  },
}

export const MultipleAgents: Story = {
  args: {
    messages: [
      {
        id: '1',
        type: 'human',
        role: 'user',
        content: 'Analyze the performance of our web application',
        avatarSrc: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
        avatarName: 'User',
      },
      {
        id: '2',
        type: 'ai',
        role: 'orchestrator',
        content: 'I\'ll coordinate a comprehensive performance analysis using multiple specialized agents.',
        avatarSrc: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
        avatarName: 'Coordinator',
        toolCalls: [
          {
            id: 'tool_1',
            name: 'analyze_performance',
            args: { url: 'https://example.com', metrics: ['LCP', 'FID', 'CLS'] },
            result: 'Performance analysis completed',
            status: 'completed',
          },
          {
            id: 'tool_2',
            name: 'generate_report',
            args: { format: 'detailed', include_recommendations: true },
            result: null,
            status: 'pending',
          },
        ],
        subAgents: [
          {
            id: 'agent_1',
            name: 'performance-analyzer',
            subAgentName: 'performance-agent',
            input: 'Analyze Core Web Vitals and performance metrics',
            output: 'LCP: 2.1s, FID: 45ms, CLS: 0.12',
            status: 'completed',
          },
          {
            id: 'agent_2',
            name: 'security-scanner',
            subAgentName: 'security-agent',
            input: 'Scan for security vulnerabilities and best practices',
            output: null,
            status: 'active',
          },
          {
            id: 'agent_3',
            name: 'accessibility-checker',
            subAgentName: 'a11y-agent',
            input: 'Check WCAG compliance and accessibility issues',
            output: null,
            status: 'pending',
          },
        ],
      },
    ],
  },
}

export const NestedSubAgents: Story = {
  args: {
    messages: [
      {
        id: '1',
        type: 'human',
        role: 'user',
        content: 'Generate a 30 second product demo video with motion graphics overlays',
        avatarSrc: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
        avatarName: 'User',
      },
      {
        id: '2',
        type: 'ai',
        role: 'orchestrator',
        content: '',
        avatarSrc: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
        avatarName: 'Coordinator',
        subAgents: [
          {
            id: 'call_00_soED4oref3iyY11T',
            name: 'task',
            subAgentName: 'media-generator-agent',
            input: 'Generate a 30 second product demo video with motion graphics overlays',
            status: 'active',
            // Nested children — video-sequencer and motion-graphics are both
            // dispatched by media-generator-agent (task() calls), and stream
            // their own tool-call-started/tool-output-delta/tool-finished
            // events. This is what AIConversation must render one level deep.
            subAgents: [
              {
                id: 'call_00_9LyCOvjRGrApV6II',
                name: 'task',
                subAgentName: 'video-sequencer',
                input: 'Sequence the raw clips into a 30s cut with transitions',
                output: 'Sequenced 12 clips into a 30s timeline. Exported sequence.json (30069 bytes).',
                status: 'completed',
              },
              {
                id: 'call_00_pQZBX2VUDWwmKQUz',
                name: 'task',
                subAgentName: 'motion-graphics',
                input: 'Add lower-thirds, logo animation, and title card overlays',
                output: 'Rendering title card overlay (2 of 4 assets)...',
                status: 'active',
              },
            ],
          },
        ],
        blocks: [
          { type: 'text', id: 'text-1', text: "I'll generate this using two specialized sub-agents." },
          {
            type: 'subAgent',
            id: 'call_00_soED4oref3iyY11T',
            subAgent: {
              id: 'call_00_soED4oref3iyY11T',
              name: 'task',
              subAgentName: 'media-generator-agent',
              input: 'Generate a 30 second product demo video with motion graphics overlays',
              status: 'active',
              subAgents: [
                {
                  id: 'call_00_9LyCOvjRGrApV6II',
                  name: 'task',
                  subAgentName: 'video-sequencer',
                  input: 'Sequence the raw clips into a 30s cut with transitions',
                  output: 'Sequenced 12 clips into a 30s timeline. Exported sequence.json (30069 bytes).',
                  status: 'completed',
                },
                {
                  id: 'call_00_pQZBX2VUDWwmKQUz',
                  name: 'task',
                  subAgentName: 'motion-graphics',
                  input: 'Add lower-thirds, logo animation, and title card overlays',
                  output: 'Rendering title card overlay (2 of 4 assets)...',
                  status: 'active',
                },
              ],
            },
          },
        ],
      },
    ],
  },
}

export const Empty: Story = {
  args: {
    messages: [],
  },
}

export const UserOnly: Story = {
  args: {
    messages: [
      {
        id: '1',
        type: 'human',
        role: 'user',
        content: 'First user message asking about something',
        avatarSrc: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
        avatarName: 'User',
      },
      {
        id: '2',
        type: 'human',
        role: 'user',
        content: 'Second user message with follow-up question',
        avatarSrc: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
        avatarName: 'User',
      },
      {
        id: '3',
        type: 'human',
        role: 'user',
        content: 'Third user message providing additional context',
        avatarSrc: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
        avatarName: 'User',
      },
    ],
  },
}

export const WithCheckpointRestore: Story = {
  args: {
    messages: [
      {
        id: '1',
        type: 'human',
        role: 'user',
        content: 'What is React?',
        avatarSrc: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
        avatarName: 'User',
      },
      {
        id: '2',
        type: 'ai',
        role: 'orchestrator',
        content: 'React is a JavaScript library for building user interfaces. It was developed by Facebook and is now maintained by Meta and a community of developers.',
        avatarSrc: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
        avatarName: 'Coordinator',
        checkpointId: 'cp-step-1',
      },
      {
        id: '3',
        type: 'human',
        role: 'user',
        content: 'How does component state work?',
        avatarSrc: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
        avatarName: 'User',
      },
      {
        id: '4',
        type: 'ai',
        role: 'orchestrator',
        content: 'State in React represents values that can change over time and trigger component re-renders when updated.',
        avatarSrc: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
        avatarName: 'Coordinator',
        checkpointId: 'cp-step-2',
      },
    ],
    onRestoreCheckpoint: fn(),
  },
}