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

    const groupedMessages = React.useMemo(() => {
      const result: AIMessage[] = [];
      let currentGroup: AIMessage | null = null;

      for (const msg of messages) {
        if (msg.role === "orchestrator") {
          const isFinalResponse =
            !msg.isLoading &&
            (!msg.toolCalls || msg.toolCalls.length === 0) &&
            (!msg.subAgents || msg.subAgents.length === 0);

          if (!isFinalResponse) {
            if (currentGroup) {
              if (msg.content) {
                currentGroup.content = currentGroup.content
                  ? `${currentGroup.content}\n\n${msg.content}`
                  : msg.content;
              }
              if (msg.toolCalls) {
                const existingToolCalls = currentGroup.toolCalls || [];
                const updatedToolCalls = [...existingToolCalls];
                for (const newCall of msg.toolCalls) {
                  const existingIndex = updatedToolCalls.findIndex(tc => tc.id === newCall.id);
                  if (existingIndex >= 0) {
                    updatedToolCalls[existingIndex] = newCall;
                  } else {
                    updatedToolCalls.push(newCall);
                  }
                }
                currentGroup.toolCalls = updatedToolCalls;
              }
              if (msg.subAgents) {
                const existingSubAgents = currentGroup.subAgents || [];
                const updatedSubAgents = [...existingSubAgents];
                for (const newAgent of msg.subAgents) {
                  const existingIndex = updatedSubAgents.findIndex(a => a.id === newAgent.id);
                  if (existingIndex >= 0) {
                    updatedSubAgents[existingIndex] = newAgent;
                  } else {
                    // Merge consecutive subAgents with the same name
                    if (
                      updatedSubAgents.length > 0 &&
                      updatedSubAgents[updatedSubAgents.length - 1].subAgentName === newAgent.subAgentName
                    ) {
                      const prev = updatedSubAgents[updatedSubAgents.length - 1];
                      let mergedOutput = prev.output;
                      if (newAgent.output) {
                        const prevStr = typeof prev.output === 'string' ? prev.output : (prev.output ? JSON.stringify(prev.output) : '');
                        const newStr = typeof newAgent.output === 'string' ? newAgent.output : JSON.stringify(newAgent.output);
                        mergedOutput = prevStr ? `${prevStr}\n\n${newStr}` : newStr;
                      }
                      updatedSubAgents[updatedSubAgents.length - 1] = {
                        ...newAgent,
                        id: prev.id, // keep the original id so React keys don't jump
                        input: prev.input, // keep original input or combine? Just keep original
                        output: mergedOutput
                      };
                    } else {
                      updatedSubAgents.push(newAgent);
                    }
                  }
                }
                currentGroup.subAgents = updatedSubAgents;
              }
              currentGroup.isLoading = msg.isLoading;
            } else {
              currentGroup = {
                ...msg,
                toolCalls: msg.toolCalls ? [...msg.toolCalls] : undefined,
                subAgents: msg.subAgents ? [...msg.subAgents] : undefined,
              };
              result.push(currentGroup);
            }
          } else {
            currentGroup = null;
            result.push(msg);
          }
        } else {
          currentGroup = null;
          result.push(msg);
        }
      }
      return result;
    }, [messages]);

    const renderedMessages = React.useMemo(
      () =>
        groupedMessages.map((message, index) => {
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

            const hasReasoning = reasoningCalls.length > 0 || subAgents.length > 0 || directToolCalls.length > 0 || (message.isLoading && contentStr.trim() !== "");
            const reasoningText = hasReasoning ? contentStr : undefined
            const displayContentStr = hasReasoning ? "" : contentStr
            const hasDisplayContent = displayContentStr.trim() !== ""

            if (!hasDisplayContent && directToolCalls.length === 0 && reasoningCalls.length === 0 && subAgents.length === 0 && !message.isLoading) {
              return null;
            }

            const isStreaming = message.isLoading || reasoningCalls.some((tc) => tc.status === "pending") || subAgents.some(sa => sa.status === "active") || directToolCalls.some(tc => tc.status === "pending")

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
                {/* Render reasoning-section for hidden tool results and subagents */}
                {hasReasoning && (
                  <ReasoningDisplay 
                    content={reasoningText} 
                    items={reasoningCalls} 
                    isStreaming={isStreaming} 
                    onToolAction={onToolAction}
                    defaultOpen={isStreaming || index === groupedMessages.length - 1}
                  >
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
                  </ReasoningDisplay>
                )}
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
      [groupedMessages, showAvatars, onToolAction]
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