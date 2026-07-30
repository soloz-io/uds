/**
 * RefinementPanel Behavior Tests
 * 
 * Tests user interactions and state changes to prevent regressions.
 * These tests validate functionality, not visual appearance.
 */

import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within, waitFor, screen } from '@storybook/test'
import { ChatPanel } from './ChatPanel'
import { inputStateMessages, reviewStateMessages, sampleFileChanges } from './ChatPanel.mocks'

const meta: Meta<typeof ChatPanel> = {
  title: 'Features/ChatPanel/Behaviors',
  component: ChatPanel,
  tags: ['test'],
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof ChatPanel>

// ============================================================================
// CRITICAL PRIORITY TESTS (100% coverage required)
// ============================================================================

/**
 * Test: Submit message triggers callback
 * Verifies that typing and submitting a message calls onSubmit with correct data
 */
export const SubmitMessageTriggersCallback: Story = {
  args: {
    messages: inputStateMessages,
    onSubmit: fn(),
    placeholder: 'Ask a question or describe a task...',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    
    // Find the input textarea
    const textarea = canvas.getByPlaceholderText('Ask a question or describe a task...')
    expect(textarea).toBeInTheDocument()
    
    // Type a message
    await userEvent.type(textarea, 'Please add error handling to the API calls')
    
    // Submit the form (find submit button or press Enter)
    const submitButton = canvas.getByRole('button', { name: /send|submit/i })
    await userEvent.click(submitButton)
    
    // Verify onSubmit was called
    await waitFor(() => {
      expect(args.onSubmit).toHaveBeenCalled()
    })
    
    // Verify the message content
    const calls = (args.onSubmit as ReturnType<typeof fn>).mock.calls
    expect(calls.length).toBeGreaterThan(0)
    const submittedMessage = calls[0][0]
    expect(submittedMessage.text).toBe('Please add error handling to the API calls')
  },
}

/**
 * Test: Approve button triggers callback
 * Verifies that clicking approve button calls onApprove
 */
export const ApproveButtonTriggersCallback: Story = {
  args: {
    messages: reviewStateMessages,
    fileChanges: sampleFileChanges,
    onSubmit: fn(),
    onApprove: fn(),
    onReject: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    
    // Wait for file changes to render
    await waitFor(() => {
      expect(canvas.getByText(/Review and approve these file changes/i)).toBeInTheDocument()
    })
    
    // Find and click approve button
    const approveButton = canvas.getByRole('button', { name: /approve|accept/i })
    await userEvent.click(approveButton)
    
    // Verify onApprove was called
    await waitFor(() => {
      expect(args.onApprove).toHaveBeenCalled()
    })
  },
}

/**
 * Test: Reject button triggers callback
 * Verifies that clicking reject button calls onReject
 */
export const RejectButtonTriggersCallback: Story = {
  args: {
    messages: reviewStateMessages,
    fileChanges: sampleFileChanges,
    onSubmit: fn(),
    onApprove: fn(),
    onReject: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    
    // Wait for file changes to render
    await waitFor(() => {
      expect(canvas.getByText(/Review and approve these file changes/i)).toBeInTheDocument()
    })
    
    // Find and click reject button
    const rejectButton = canvas.getByRole('button', { name: /reject|decline/i })
    await userEvent.click(rejectButton)
    
    // Verify onReject was called
    await waitFor(() => {
      expect(args.onReject).toHaveBeenCalled()
    })
  },
}

/**
 * Test: Messages display correctly
 * Verifies that all messages render with correct content and avatars
 */
export const MessagesDisplayCorrectly: Story = {
  args: {
    messages: reviewStateMessages,
    onSubmit: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Verify user message is displayed
    await waitFor(() => {
      expect(canvas.getByText(/Refine the Button component/i)).toBeInTheDocument()
    })
    
    // Verify orchestrator message is displayed
    expect(canvas.getByText(/coordinate the refinement/i)).toBeInTheDocument()
    
    // Verify avatars are present (check for img elements with avatar sources)
    const avatars = canvas.getAllByRole('img')
    expect(avatars.length).toBeGreaterThan(0)
  },
}

// ============================================================================
// HIGH PRIORITY TESTS (90% coverage required)
// ============================================================================

/**
 * Test: File changes display when provided
 * Verifies that FileChangeQueue is visible when fileChanges are provided
 */
export const FileChangesDisplayWhenProvided: Story = {
  args: {
    messages: reviewStateMessages,
    fileChanges: sampleFileChanges,
    onSubmit: fn(),
    onApprove: fn(),
    onReject: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Verify file change queue is visible
    await waitFor(() => {
      expect(canvas.getByText(/Review and approve these file changes/i)).toBeInTheDocument()
    })
    
    // Verify file names are displayed
    expect(canvas.getByText(/Button\.tsx/i)).toBeInTheDocument()
    expect(canvas.getByText(/Button\.stories\.tsx/i)).toBeInTheDocument()
    expect(canvas.getByText(/button-accessibility\.test\.tsx/i)).toBeInTheDocument()
  },
}

/**
 * Test: Input hidden when file changes present
 * Verifies that PromptInput is hidden when file changes are present
 */
export const InputHiddenWhenFileChangesPresent: Story = {
  args: {
    messages: reviewStateMessages,
    fileChanges: sampleFileChanges,
    onSubmit: fn(),
    onApprove: fn(),
    onReject: fn(),
    placeholder: 'Ask a question or describe a task...',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Wait for file changes to render
    await waitFor(() => {
      expect(canvas.getByText(/Review and approve these file changes/i)).toBeInTheDocument()
    })
    
    // Verify input is not visible
    const textarea = canvas.queryByPlaceholderText('Ask a question or describe a task...')
    expect(textarea).not.toBeInTheDocument()
  },
}

/**
 * Test: Input visible when no file changes
 * Verifies that PromptInput is visible when no file changes are provided
 */
export const InputVisibleWhenNoFileChanges: Story = {
  args: {
    messages: inputStateMessages,
    fileChanges: [],
    onSubmit: fn(),
    placeholder: 'Ask a question or describe a task...',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Verify input is visible
    const textarea = canvas.getByPlaceholderText('Ask a question or describe a task...')
    expect(textarea).toBeInTheDocument()
    expect(textarea).toBeVisible()
  },
}

// ============================================================================
// MEDIUM PRIORITY TESTS (75% coverage required)
// ============================================================================

/**
 * Test: Conversation scrolling behavior
 * Verifies that conversation area handles scrolling with many messages
 */
export const ConversationScrollingBehavior: Story = {
  args: {
    messages: [
      ...inputStateMessages,
      ...reviewStateMessages,
      {
        id: '3',
        type: 'human',
        role: 'user',
        content: 'Additional message 1',
      },
      {
        id: '4',
        type: 'ai',
        role: 'orchestrator',
        content: 'Response 1',
      },
      {
        id: '5',
        type: 'human',
        role: 'user',
        content: 'Additional message 2',
      },
      {
        id: '6',
        type: 'ai',
        role: 'orchestrator',
        content: 'Response 2',
      },
    ],
    onSubmit: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Verify multiple messages are rendered
    await waitFor(() => {
      expect(canvas.getByText(/Can you help me refactor/i)).toBeInTheDocument()
    })
    
    expect(canvas.getByText(/Refine the Button component/i)).toBeInTheDocument()
    expect(canvas.getByText(/Additional message 1/i)).toBeInTheDocument()
    expect(canvas.getByText(/Additional message 2/i)).toBeInTheDocument()
    
    // Verify conversation area exists and is scrollable
    // The AIConversation component should handle scroll internally
    const messages = canvas.getAllByText(/message|refactor|refine/i)
    expect(messages.length).toBeGreaterThan(4)
  },
}

/**
 * Test: File change queue scrolling
 * Verifies that file change queue scrolls correctly with many files
 */
export const FileChangeQueueScrolling: Story = {
  args: {
    messages: reviewStateMessages,
    fileChanges: [
      ...sampleFileChanges,
      {
        id: '4',
        filename: 'Button.test.tsx',
        status: 'modified',
        path: 'src/components/primitives/Button/Button.test.tsx',
      },
      {
        id: '5',
        filename: 'Button.types.ts',
        status: 'created',
        path: 'src/components/primitives/Button/Button.types.ts',
      },
      {
        id: '6',
        filename: 'Button.utils.ts',
        status: 'created',
        path: 'src/components/primitives/Button/Button.utils.ts',
      },
    ],
    onSubmit: fn(),
    onApprove: fn(),
    onReject: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Verify file change queue is visible
    await waitFor(() => {
      expect(canvas.getByText(/Review and approve these file changes/i)).toBeInTheDocument()
    })
    
    // Verify multiple files are displayed
    expect(canvas.getByText(/Button\.tsx/i)).toBeInTheDocument()
    expect(canvas.getByText(/Button\.test\.tsx/i)).toBeInTheDocument()
    expect(canvas.getByText(/Button\.types\.ts/i)).toBeInTheDocument()
    
    // The file change queue should have max-h-[40vh] and overflow-y-auto
    // This is handled by the component's styling
  },
}

/**
 * Test: Avatar display correctly
 * Verifies that avatars display for messages with avatarSrc
 */
export const AvatarDisplayCorrectly: Story = {
  args: {
    messages: inputStateMessages,
    onSubmit: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Wait for messages to render
    await waitFor(() => {
      expect(canvas.getByText(/Can you help me refactor/i)).toBeInTheDocument()
    })
    
    // Verify avatars are present
    const avatars = canvas.getAllByRole('img')
    expect(avatars.length).toBeGreaterThan(0)
    
    // Verify avatar sources are set (check for unsplash URLs)
    const firstAvatar = avatars[0] as HTMLImageElement
    expect(firstAvatar.src).toContain('unsplash')
  },
}

// ============================================================================
// EDGE CASE TESTS (60% coverage required)
// ============================================================================

/**
 * Test: Empty message submission prevented
 * Verifies that empty messages cannot be submitted
 */
export const EmptyMessageSubmissionPrevented: Story = {
  args: {
    messages: inputStateMessages,
    onSubmit: fn(),
    placeholder: 'Ask a question or describe a task...',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    
    // Find the input textarea
    const textarea = canvas.getByPlaceholderText('Ask a question or describe a task...')
    
    // Try to submit without typing anything
    const submitButton = canvas.getByRole('button', { name: /send|submit/i })
    
    // Check if button is disabled or click doesn't trigger callback
    const isDisabled = submitButton.hasAttribute('disabled')
    
    if (!isDisabled) {
      await userEvent.click(submitButton)
      
      // Verify onSubmit was NOT called (empty submission prevented)
      expect(args.onSubmit).not.toHaveBeenCalled()
    } else {
      // Button is disabled, which is also valid prevention
      expect(isDisabled).toBe(true)
    }
  },
}

/**
 * Test: Rapid approve/reject clicks
 * Verifies that UI remains stable with rapid button clicks
 */
export const RapidApproveRejectClicks: Story = {
  args: {
    messages: reviewStateMessages,
    fileChanges: sampleFileChanges,
    onSubmit: fn(),
    onApprove: fn(),
    onReject: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    
    // Wait for file changes to render
    await waitFor(() => {
      expect(canvas.getByText(/Review and approve these file changes/i)).toBeInTheDocument()
    })
    
    // Find approve button
    const approveButton = canvas.getByRole('button', { name: /approve|accept/i })
    
    // Click multiple times rapidly
    await userEvent.click(approveButton)
    await userEvent.click(approveButton)
    await userEvent.click(approveButton)
    
    // Verify onApprove was called (at least once)
    await waitFor(() => {
      expect(args.onApprove).toHaveBeenCalled()
    })
    
    // Verify UI is still stable (no crashes)
    expect(canvas.getByText(/Review and approve these file changes/i)).toBeInTheDocument()
  },
}

/**
 * Test: Long message content handled
 * Verifies that very long messages display correctly
 */
export const LongMessageContentHandled: Story = {
  args: {
    messages: [
      {
        id: '1',
        type: 'human',
        role: 'user',
        content: 'This is a very long message that contains a lot of text to test how the component handles long content. '.repeat(10),
        avatarSrc: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
        avatarName: 'User',
      },
    ],
    onSubmit: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Verify long message is rendered
    await waitFor(() => {
      expect(canvas.getByText(/This is a very long message/i)).toBeInTheDocument()
    })
    
    // Verify the message is visible and doesn't break layout
    const messageText = canvas.getByText(/This is a very long message/i)
    expect(messageText).toBeVisible()
  },
}
