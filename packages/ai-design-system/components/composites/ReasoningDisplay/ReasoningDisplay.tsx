"use client";

import {
  Reasoning,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { CollapsibleContent } from "@/components/primitives/Collapsible";
import { Response } from "@/components/ai-elements/response";
import { ToolCallDisplay } from "@/components/composites/ToolCallDisplay";
import type { ToolCall } from "@/components/composites/ToolCallDisplay";

export interface ReasoningDisplayProps {
  items: ToolCall[];
  isStreaming?: boolean;
  content?: string;
  onToolAction?: (toolCall: ToolCall, action: string) => void;
}

export const ReasoningDisplay = ({
  items,
  isStreaming = false,
  content,
  onToolAction,
}: ReasoningDisplayProps) => {
  if (items.length === 0 && !content) return null;

  return (
    <Reasoning isStreaming={isStreaming} defaultOpen={false}>
      <ReasoningTrigger />
      <CollapsibleContent
        className="mt-4 flex flex-col gap-2 data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 text-muted-foreground outline-none data-[state=closed]:animate-out data-[state=open]:animate-in"
      >
        {content && content.trim() && (
          <div className="mb-4">
            <Response className="grid gap-2">{content}</Response>
          </div>
        )}
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <ToolCallDisplay key={item.id} toolCall={item} onToolAction={onToolAction} />
          ))}
        </div>
      </CollapsibleContent>
    </Reasoning>
  );
};
