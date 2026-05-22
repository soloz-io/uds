import type { Meta, StoryObj } from '@storybook/react'
import { SpecialistMessage } from './SpecialistMessage'
import { FileText, Search, BarChart, CheckCircle } from 'lucide-react'

const meta: Meta<typeof SpecialistMessage> = {
  title: 'Composites/SpecialistMessage',
  component: SpecialistMessage,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof SpecialistMessage>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default state - always expanded, no collapse trigger
 */
export const Default: Story = {
  args: {
    message: {
      id: '1',
      name: 'research-agent',
      description: 'Conducting research on the requested topic',
      icon: <Search className="size-4" />,
      content: 'I conducted extensive research on the requested topic. Here are my findings: The analysis shows significant trends in the data, with key patterns emerging across multiple dimensions. I recommend proceeding with the proposed approach based on these insights.',
      status: 'completed',
    },
    collapsible: false,
    isNested: false,
  },
}

/**
 * With description summary - shows in header
 */
export const WithDescription: Story = {
  args: {
    message: {
      id: '2',
      name: 'analysis-agent',
      description: 'Analyzing data and generating insights',
      icon: <BarChart className="size-4" />,
      content: 'I analyzed the data and generated comprehensive insights. Here are the key findings from my research that you should consider for the next steps in the implementation process.',
      status: 'completed',
    },
    collapsible: false,
    isNested: false,
  },
}

/**
 * With tool calls displayed inline
 */
export const WithToolCalls: Story = {
  args: {
    message: {
      id: '3',
      name: 'file-agent',
      description: 'Processing files and generating reports',
      icon: <FileText className="size-4" />,
      content: 'I processed the files and generated a comprehensive report. The analysis includes data from multiple sources and provides actionable recommendations.',
      status: 'completed',
      toolCalls: [
        {
          id: 'tool_1',
          name: 'write_file',
          args: { filename: 'report.md', content: 'Analysis results...' },
          result: 'File created successfully at /workspace/report.md',
          status: 'completed',
        },
        {
          id: 'tool_2',
          name: 'read_file',
          args: { filename: 'data.json' },
          result: '{"records": 150, "status": "processed", "timestamp": "2024-01-15T10:30:00Z"}',
          status: 'completed',
        },
        {
          id: 'tool_3',
          name: 'analyze_data',
          args: { dataset: 'sales_data.csv' },
          result: 'Analysis complete. Found 5 key trends and 12 anomalies requiring attention.',
          status: 'completed',
        },
      ],
    },
    collapsible: false,
    isNested: false,
  },
}

/**
 * Collapsible variant - collapsed by default with trigger
 */
export const CollapsibleCollapsed: Story = {
  args: {
    message: {
      id: '4',
      name: 'documentation-agent',
      description: "Comprehensive review of codebase documentation completed",
      icon: <FileText className="size-4" />,
      content: `I've completed a comprehensive review of the codebase documentation.

Here's what I found:

## Current State
The documentation covers most of the core features but lacks detailed examples in several key areas. The API reference is well-structured but could benefit from more usage scenarios.

## Recommendations
1. Add interactive code examples for each major feature
2. Include troubleshooting guides for common issues
3. Expand the getting started tutorial with real-world use cases
4. Add architecture diagrams to explain system components
5. Document best practices and anti-patterns

## Implementation Plan
I suggest prioritizing the API documentation updates first, followed by the tutorial enhancements. This approach will provide immediate value to new users while setting the foundation for more advanced documentation.

The estimated effort is 2-3 weeks with a dedicated technical writer, or 4-5 weeks if handled by the engineering team alongside development work.`,
      status: 'completed',
    },
    collapsible: true,
    defaultOpen: false,
    isNested: false,
  },
}

/**
 * Collapsible variant - expanded by default with trigger
 */
export const CollapsibleExpanded: Story = {
  args: {
    message: {
      id: '5',
      name: 'planning-agent',
      description: 'Creating detailed implementation plan with timeline',
      icon: <CheckCircle className="size-4" />,
      content: 'I created a detailed implementation plan with timeline and resource allocation. The plan includes 5 phases over 6 months with clear milestones and success criteria for each phase.',
      status: 'completed',
    },
    collapsible: true,
    defaultOpen: true,
    isNested: false,
  },
}

/**
 * Nested under orchestrator - indented with left margin
 */
export const Nested: Story = {
  args: {
    message: {
      id: '6',
      name: 'sub-agent',
      description: 'Working on delegated sub-task',
      content: 'This specialist message is nested under an orchestrator. Notice the left indentation indicating the hierarchical relationship.',
      status: 'completed',
    },
    collapsible: false,
    isNested: true,
  },
}

/**
 * Without description - only title in header
 */
export const WithoutDescription: Story = {
  args: {
    message: {
      id: '7',
      name: 'quick-agent',
      content: 'Task completed successfully with no additional details needed.',
      status: 'completed',
    },
    collapsible: false,
    isNested: false,
  },
}

/**
 * Multiple specialists - default always-expanded style
 */
export const MultipleSpecialistsExpanded: Story = {
  render: () => (
    <div className="space-y-4">
      <SpecialistMessage
        message={{
          id: '1',
          name: 'research-agent',
          description: 'Gathering relevant information from multiple sources',
          icon: <Search className="size-4" />,
          content: 'I researched the topic and gathered relevant information from multiple sources. The findings indicate strong market demand and favorable conditions for implementation.',
          status: 'completed',
        }}
        collapsible={false}
      />
      <SpecialistMessage
        message={{
          id: '2',
          name: 'analysis-agent',
          description: 'Performing comprehensive analysis on research data',
          icon: <BarChart className="size-4" />,
          content: 'Based on the research data, I performed a comprehensive analysis. The results show three key opportunities and two potential risks that should be addressed in the planning phase.',
          status: 'completed',
          toolCalls: [
            {
              id: 'tool_1',
              name: 'analyze_market_data',
              args: { dataset: 'market_trends.csv' },
              result: 'Analysis complete. Market growth rate: 15% annually.',
              status: 'completed',
            },
          ],
        }}
        collapsible={false}
      />
      <SpecialistMessage
        message={{
          id: '3',
          name: 'planning-agent',
          description: 'Creating implementation roadmap',
          icon: <CheckCircle className="size-4" />,
          content: 'I created a detailed implementation plan with timeline and resource allocation. The plan includes 5 phases over 6 months with clear milestones and success criteria.',
          status: 'completed',
        }}
        collapsible={false}
      />
    </div>
  ),
}

/**
 * Multiple specialists - collapsible for space efficiency
 */
export const MultipleSpecialistsCollapsible: Story = {
  render: () => (
    <div className="space-y-4">
      <SpecialistMessage
        message={{
          id: '1',
          name: 'research-agent',
          description: 'Gathering relevant information from multiple sources',
          icon: <Search className="size-4" />,
          content: 'I researched the topic and gathered relevant information from multiple sources. The findings indicate strong market demand and favorable conditions for implementation.',
          status: 'completed',
        }}
        collapsible={true}
        defaultOpen={false}
      />
      <SpecialistMessage
        message={{
          id: '2',
          name: 'analysis-agent',
          description: 'Performing comprehensive analysis on research data',
          icon: <BarChart className="size-4" />,
          content: 'Based on the research data, I performed a comprehensive analysis. The results show three key opportunities and two potential risks that should be addressed in the planning phase.',
          status: 'completed',
          toolCalls: [
            {
              id: 'tool_1',
              name: 'analyze_market_data',
              args: { dataset: 'market_trends.csv' },
              result: 'Analysis complete. Market growth rate: 15% annually.',
              status: 'completed',
            },
          ],
        }}
        collapsible={true}
        defaultOpen={false}
      />
      <SpecialistMessage
        message={{
          id: '3',
          name: 'planning-agent',
          description: 'Creating implementation roadmap',
          icon: <CheckCircle className="size-4" />,
          content: 'I created a detailed implementation plan with timeline and resource allocation. The plan includes 5 phases over 6 months with clear milestones and success criteria.',
          status: 'completed',
        }}
        collapsible={true}
        defaultOpen={false}
      />
    </div>
  ),
}
