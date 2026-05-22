import * as React from "react"
import {
  Tool,
  ToolHeader,
  ToolContent,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool"

/**
 * ToolCallDisplay Block
 *
 * A block component that extends the Tool AI element to display tool execution details
 * with expandable input parameters and output results. Copied logic from reference implementation.
 */

export interface ToolCall {
  id: string
  name: string
  args: Record<string, unknown>
  result?: string
  status: "pending" | "completed" | "error"
}

export interface ToolCallDisplayProps {
  /**
   * Tool call data to display
   */
  toolCall: ToolCall
  /**
   * Whether the tool call is initially expanded
   */
  defaultExpanded?: boolean
}

/**
 * ToolCallDisplay component - displays tool execution with expandable details
 */
export const ToolCallDisplay = React.memo<ToolCallDisplayProps>(
  ({ toolCall, defaultExpanded = false }) => {
    const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)

    const { name, args, result, status } = React.useMemo(() => {
      const toolName = toolCall.name || "Unknown Tool"
      const toolArgs = toolCall.args || {}
      let parsedArgs: Record<string, unknown> = {}
      try {
        parsedArgs = typeof toolArgs === "string" ? JSON.parse(toolArgs) : toolArgs
      } catch {
        parsedArgs = { raw: toolArgs }
      }
      const toolResult = toolCall.result || null
      const toolStatus = toolCall.status || "completed"

      return {
        name: toolName,
        args: parsedArgs,
        result: toolResult,
        status: toolStatus,
      }
    }, [toolCall])

    const toggleExpanded = React.useCallback(() => {
      setIsExpanded((prev) => !prev)
    }, [])

    const hasContent = React.useMemo(() => {
      return result !== null || Object.keys(args).length > 0
    }, [result, args])

    // Map our status to Tool AI element status
    const toolState = React.useMemo(() => {
      switch (status) {
        case "pending":
          return "input-available" as const
        case "completed":
          return "output-available" as const
        case "error":
          return "output-error" as const
        default:
          return "output-available" as const
      }
    }, [status])

    return (
      <Tool defaultOpen={isExpanded}>
        <ToolHeader
          title={name}
          type={`tool-${name}` as const}
          state={toolState}
        />
        <ToolContent>
          {Object.keys(args).length > 0 && (
            <ToolInput input={args} />
          )}
          {result && (
            <ToolOutput
              output={result}
              errorText={status === "error" ? result : undefined}
            />
          )}
        </ToolContent>
      </Tool>
    )
  }
)

ToolCallDisplay.displayName = "ToolCallDisplay"