"use client";

import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import type { ToolCall } from "../ToolCallDisplay";

export interface ReasoningDisplayProps {
  items: ToolCall[];
  isStreaming?: boolean;
  content?: string;
}

function formatResult(item: ToolCall): string {
  let content = `**Tool: ${item.name}**\n\n`;
  
  if (item.args && Object.keys(item.args).length > 0) {
    const argsJson = JSON.stringify(item.args, null, 2);
    content += `**Input:**\n\`\`\`json\n${argsJson}\n\`\`\`\n\n`;
  }
  
  if (item.result) {
    content += `**Output:**\n${item.result}\n\n`;
  } else if (item.status === "pending") {
    content += `*Running...*\n\n`;
  }
  
  return content.trim();
}

export const ReasoningDisplay = ({
  items,
  isStreaming = false,
  content,
}: ReasoningDisplayProps) => {
  if (items.length === 0) return null;

  const resultsStr = items.map(formatResult).filter(Boolean).join("\n\n---\n\n");
  
  let finalContent = "";
  if (content && content.trim()) {
    finalContent += `${content.trim()}\n\n`;
  }
  if (resultsStr) {
    if (finalContent) finalContent += "---\n\n";
    finalContent += resultsStr;
  }

  return (
    <Reasoning isStreaming={isStreaming} defaultOpen={false}>
      <ReasoningTrigger />
      <ReasoningContent>{finalContent || "No output"}</ReasoningContent>
    </Reasoning>
  );
};
