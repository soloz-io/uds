/**
 * Mock data for RefinementPanel stories and tests
 * 
 * This file contains reusable mock data that can be imported by:
 * - RefinementPanel.stories.tsx (regular stories)
 * - RefinementPanel.behaviors.stories.tsx (behavior tests)
 * - Any other test files that need RefinementPanel mock data
 */

import type { RefinementMessage } from './ChatPanel'
import type { FileChangeData } from '@/components/composites/FileQueue'
import type { ActionRequest } from '@/components/composites/ApprovalCard'

/**
 * Sample conversation history for input state
 */
export const inputStateMessages: RefinementMessage[] = [
  {
    id: '1',
    type: 'human',
    role: 'user',
    content: 'Can you help me refactor this component to use TypeScript?',
    avatarSrc:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
    avatarName: 'User',
  },
  {
    id: '2',
    type: 'ai',
    role: 'orchestrator',
    content:
      "I'll help you refactor the component to TypeScript. Let me analyze the code and create a plan.",
    avatarSrc:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    avatarName: 'Coordinator',
    toolCalls: [
      {
        id: 'tool_1',
        name: 'read_file',
        args: { filename: 'Component.jsx' },
        result: 'File read successfully',
        status: 'completed',
      },
    ],
  },
]

/**
 * Sample messages for multi-agent review state
 */
export const reviewStateMessages: RefinementMessage[] = [
  {
    id: '1',
    type: 'human',
    role: 'user',
    content: 'Refine the Button component to add better accessibility support',
    avatarSrc:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
    avatarName: 'User',
  },
  {
    id: '2',
    type: 'ai',
    role: 'orchestrator',
    content:
      "I'll coordinate the refinement of the Button component with accessibility improvements. Let me delegate this to specialized agents.",
    avatarSrc:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    avatarName: 'Coordinator',
    toolCalls: [
      {
        id: 'tool_1',
        name: 'read_file',
        args: { filename: 'Button.tsx', path: 'src/components/primitives/Button/' },
        result: 'File content retrieved',
        status: 'completed',
      },
      {
        id: 'tool_2',
        name: 'analyze_accessibility',
        args: { component: 'Button', standards: ['WCAG 2.1 AA'] },
        result: 'Analysis complete',
        status: 'completed',
      },
    ],
    subAgents: [
      {
        id: 'agent_1',
        name: 'accessibility-specialist',
        subAgentName: 'a11y-agent',
        input:
          'Review Button component for WCAG 2.1 Level AA compliance. Check keyboard navigation, ARIA attributes, focus management, and screen reader support.',
        output:
          'Found 3 accessibility issues: missing aria-label for icon-only buttons, insufficient focus indicators, and missing keyboard shortcuts documentation.',
        status: 'completed',
      },
      {
        id: 'agent_2',
        name: 'code-refactor-specialist',
        subAgentName: 'refactor-agent',
        input:
          'Refactor Button component to add proper ARIA attributes, enhance focus styles, and improve keyboard navigation support.',
        output: undefined,
        status: 'active',
      },
    ],
  },
  {
    id: '3',
    type: 'human',
    role: 'user',
    content: 'Can we also make sure the colors meet the contrast requirements for dark mode?',
    avatarSrc:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
    avatarName: 'User',
  },
  {
    id: '4',
    type: 'ai',
    role: 'orchestrator',
    content: 'Absolutely. I will have the accessibility specialist double-check the color contrast ratios in both light and dark mode.',
    avatarSrc:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    avatarName: 'Coordinator',
    subAgents: [
      {
        id: 'agent_3',
        name: 'accessibility-specialist',
        subAgentName: 'a11y-agent',
        input: 'Verify color contrast ratios for the new Button styles in both light and dark mode themes according to WCAG 2.1 AA.',
        output: 'Contrast ratios checked: Primary button passes at 4.5:1 on light mode, but fails on dark mode (3.2:1). Adjusting the primary-dark token to #66b2ff to meet the 4.5:1 requirement.',
        status: 'completed',
      }
    ]
  },
  {
    id: '5',
    type: 'human',
    role: 'user',
    content: 'Perfect! How about the hover state? Does it also pass?',
    avatarSrc:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
    avatarName: 'User',
  },
  {
    id: '6',
    type: 'ai',
    role: 'orchestrator',
    content: 'Good catch. Let me check the hover and active states for both themes.',
    avatarSrc:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    avatarName: 'Coordinator',
    subAgents: [
      {
        id: 'agent_4',
        name: 'accessibility-specialist',
        subAgentName: 'a11y-agent',
        input: 'Verify color contrast for hover and active states.',
        output: 'Hover states pass contrast checks. The active state requires a slight tweak for the outline variant. Applied fixes.',
        status: 'completed',
      }
    ]
  },
]

/**
 * Sample file changes for review state
 */
/**
 * Sample single-question approval request (HITL interactive question)
 */
export const approvalQuestionRequest: ActionRequest = {
  name: "ask_user",
  description: "The agent needs your input to determine the workflow order",
  args: {
    question: "Where in the workflow timeline should the SEO review step run?",
    options: [
      "(Recommended) Before the main human content approval, so the editor can see the SEO recommendations and scores when reviewing the script.",
      "After the main human content approval, so that the general content is finalized first before being tuned for SEO."
    ],
    is_multi_select: false,
  },
};

/**
 * Sample multi-question approval request (HITL poll with multiple questions)
 */
export const approvalMultiQuestionRequest: ActionRequest = {
  name: "ask_user",
  description: "The agent needs your preferences to proceed",
  args: {
    questions: [
      {
        question: "Choose preferred publication channel:",
        options: ["YouTube", "Vimeo", "TikTok", "Instagram Reels"],
        is_multi_select: false,
      },
      {
        question: "Which departments need to sign off on budget?",
        options: ["Marketing", "Finance", "Legal", "Operations"],
        is_multi_select: true,
      },
    ],
  },
};

export const sampleFileChanges: FileChangeData[] = [
  {
    id: '1',
    filename: 'Button.tsx',
    status: 'modified',
    path: 'src/components/primitives/Button/Button.tsx',
  },
  {
    id: '2',
    filename: 'Button.stories.tsx',
    status: 'modified',
    path: 'src/components/primitives/Button/Button.stories.tsx',
  },
  {
    id: '3',
    filename: 'button-accessibility.test.tsx',
    status: 'created',
    path: 'src/components/primitives/Button/button-accessibility.test.tsx',
  },
]
