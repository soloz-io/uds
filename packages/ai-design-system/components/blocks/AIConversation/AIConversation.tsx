import * as React from "react"
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
  type ConversationProps,
} from "@/components/ai-elements/conversation"
import type { ToolCall, SubAgent } from "@/components/composites"
import { UserMessage } from "@/components/composites/UserMessage"
import { SpecialistMessage } from "@/components/composites/SpecialistMessage"
import { OrchestratorMessage } from "@/components/composites/OrchestratorMessage"
import { ToolCallDisplay } from "@/components/composites/ToolCallDisplay"
import { ReasoningDisplay } from "@/components/composites/ReasoningDisplay"
import { ApprovalCard } from "@/components/composites/ApprovalCard"

/**
 * AIConversation Section
 *
 * A section-level component specifically designed for AI agent conversations.
 * Uses the Conversation AI element with AgentMessage blocks to display
 * multi-agent workflows with tool calls and sub-agent indicators.
 *
 * Based on reference implementation from deep-agents-ui ChatInterface.
 */

interface AIMessage {
  id: string;
  type: 'human' | 'ai';
  role: string;
  content: string;
  avatarSrc?: string;
  avatarName?: string;
  toolCalls?: ToolCall[];
  subAgents?: SubAgent[];
  isLoading?: boolean;
}

export interface AIConversationProps
  extends Omit<ConversationProps, "children"> {
  /**
   * Array of AI messages to display
   */
  messages: AIMessage[]
  /**
   * Whether to show avatars for messages
   */
  showAvatars?: boolean
  /**
   * Handler for sub-agent selection
   */
  onSelectSubAgent?: (subAgent: SubAgent) => void
  /**
   * Currently selected sub-agent
   */
  selectedSubAgent?: SubAgent | null
  /**
   * Empty state configuration
   */
  emptyState?: {
    title?: string
    description?: string
    icon?: React.ReactNode
  }
  /**
   * Callback fired when a tool action (like a link click) is triggered
   */
  onToolAction?: (toolCall: ToolCall, action: string) => void
}

/**
 * AIConversation component - displays AI agent conversations with tool calls and sub-agents
 */
export const AIConversation = React.memo<AIConversationProps>(
  ({
    messages,
    showAvatars = true,
    onSelectSubAgent,
    selectedSubAgent,
    emptyState,
    onToolAction,
    ...conversationProps
  }) => {
    const isEmpty = React.useMemo(
      () => messages.length === 0,
      [messages.length]
    )

    const emptyStateTitle = React.useMemo(
      () => emptyState?.title || "No conversation yet",
      [emptyState?.title]
    )

    const emptyStateDescription = React.useMemo(
      () =>
        emptyState?.description ||
        "Start a conversation to see AI agent interactions",
      [emptyState?.description]
    )

    const toMessageString = (content: unknown): string =>
      typeof content === 'string' ? content : ''

    const renderedMessages = React.useMemo(
      () =>
        messages.map((message) => {
          const contentStr = toMessageString(message.content)

          // Render based on role field
          if (message.role === "user") {
            return (
              <UserMessage
                key={message.id}
                message={{
                  id: message.id,
                  content: contentStr,
                  avatarSrc: message.avatarSrc,
                  avatarName: message.avatarName,
                }}
                showAvatar={showAvatars}
              />
            )
          }

          if (message.role === "orchestrator") {
            // Extract sub-agents from the message
            const subAgents = message.subAgents || []

            // Filter tool calls that aren't "task" type (those become sub-agents)
            // Also completely hide "ask_user" and "ask_question" tools so they are ONLY rendered in the prompt input area
            const allToolCalls =
              message.toolCalls?.filter(
                (tc) => tc.name !== "task" && tc.name !== "ask_user"
              ) || []

            // Split into reasoning tools (shown collapsed) and direct tools (shown normally)
            const reasoningCalls = allToolCalls.filter((tc) => tc.visibility === "reasoning")
            const directToolCalls = allToolCalls.filter((tc) => tc.visibility !== "reasoning")

            const hasContent = contentStr.trim() !== ""
            const hasReasoning = reasoningCalls.length > 0
            const reasoningText = hasReasoning ? contentStr : undefined
            const displayContentStr = hasReasoning ? "" : contentStr
            const hasDisplayContent = displayContentStr.trim() !== ""

            if (!hasDisplayContent && directToolCalls.length === 0 && reasoningCalls.length === 0 && subAgents.length === 0 && !message.isLoading) {
              return null;
            }

            const isStreaming = reasoningCalls.some((tc) => tc.status === "pending")

            return (
              <OrchestratorMessage
                key={message.id}
                message={{
                  id: message.id,
                  content: displayContentStr,
                  avatarSrc: message.avatarSrc,
                  avatarName: message.avatarName,
                  isLoading: message.isLoading && !hasReasoning,
                }}
                showAvatar={showAvatars && hasDisplayContent}
              >
                {/* Render reasoning-section for hidden tool results */}
                {hasReasoning && (
                  <ReasoningDisplay content={reasoningText} items={reasoningCalls} isStreaming={isStreaming} />
                )}

                {/* Render direct tool calls */}
                {directToolCalls.map((tc) => (
                  <ToolCallDisplay key={tc.id} toolCall={tc} onToolAction={onToolAction} />
                ))}

                {/* Render specialist sub-agents */}
                {subAgents.map((subAgent) => (
                  <SpecialistMessage
                    key={subAgent.id}
                    message={{
                      id: subAgent.id,
                      name: subAgent.subAgentName,
                      description: undefined,
                      content: typeof subAgent.output === 'string' ? subAgent.output : (subAgent.output ? JSON.stringify(subAgent.output) : ''),
                      status: subAgent.status,
                      toolCalls: [],
                    }}
                    isNested={true}
                  />
                ))}
              </OrchestratorMessage>
            )
          }

          // Default to specialist message for any other AI messages
          return (
            <SpecialistMessage
              key={message.id}
              message={{
                id: message.id,
                name: message.avatarName || "Agent",
                content: contentStr,
                toolCalls: message.toolCalls?.filter((tc) => tc.name !== "task"),
                status: "completed",
              }}
              isNested={false}
            />
          )
        }),
      [messages, showAvatars]
    )

    return (
      <Conversation {...conversationProps}>
        <ConversationContent>
          {isEmpty ? (
            <ConversationEmptyState
              title={emptyStateTitle}
              description={emptyStateDescription}
              icon={emptyState?.icon}
            />
          ) : (
            renderedMessages
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
    )
  }
)

AIConversation.displayName = "AIConversation"