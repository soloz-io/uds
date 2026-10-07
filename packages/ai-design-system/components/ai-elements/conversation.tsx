"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowDownIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";

export type ConversationProps = ComponentProps<typeof StickToBottom>;

export const Conversation = ({ className, ...props }: ConversationProps) => (
  <StickToBottom
    className={cn("relative flex-1 overflow-hidden", className)}
    initial="smooth"
    resize="smooth"
    role="log"
    {...props}
  />
);

export type ConversationContentProps = ComponentProps<
  typeof StickToBottom.Content
>;

export const ConversationContent = ({
  className,
  ...props
}: ConversationContentProps) => (
  <StickToBottom.Content className={cn("p-4", className)} {...props} />
);

export type ConversationEmptyStateProps = ComponentProps<"div"> & {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
};

export const ConversationEmptyState = ({
  className,
  title = "No messages yet",
  description = "Start a conversation to see messages here",
  icon,
  children,
  ...props
}: ConversationEmptyStateProps) => (
  <div
    className={cn(
      "flex size-full flex-col items-center justify-center gap-3 p-8 text-center",
      className
    )}
    {...props}
  >
    {children ?? (
      <>
        {icon && <div className="text-muted-foreground">{icon}</div>}
        <div className="space-y-1">
          <h3 className="font-medium text-sm">{title}</h3>
          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
        </div>
      </>
    )}
  </div>
);

export type ConversationScrollButtonProps = ComponentProps<typeof Button>;

export const ConversationScrollButton = ({
  className,
  ...props
}: ConversationScrollButtonProps) => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  const handleScrollToBottom = useCallback(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  return (
    !isAtBottom && (
      <Button
        className={cn(
          "absolute bottom-4 left-[50%] translate-x-[-50%] rounded-full",
          className
        )}
        onClick={handleScrollToBottom}
        size="icon"
        type="button"
        variant="outline"
        {...props}
      >
        <ArrowDownIcon className="size-4" />
      </Button>
    )
  );
};

export type ConversationOlderMessagesProps = {
  /** Older messages exist above the first one shown. */
  hasOlder: boolean;
  /** A page of older messages is being loaded. */
  loading?: boolean;
  /** Load the page before the first message shown. */
  onLoadOlder: () => void;
  /** How many messages are shown: when it grows from a load, the view is held in place. */
  messageCount: number;
};

/**
 * Loads older messages when the top of the conversation scrolls into view, and
 * keeps the view where it was when they arrive above it -- otherwise the page
 * lands on the newly loaded messages and the reader loses their place. (The
 * browser's own scroll anchoring does nothing at the very top of a scroller.)
 * Render it first inside ConversationContent.
 */
export const ConversationOlderMessages = ({
  hasOlder,
  loading = false,
  onLoadOlder,
  messageCount,
}: ConversationOlderMessagesProps) => {
  const { scrollRef } = useStickToBottomContext();
  const sentinel = useRef<HTMLDivElement | null>(null);
  // The scroller's height and offset when a load began, to restore against.
  const before = useRef<{ height: number; top: number } | null>(null);

  useEffect(() => {
    const node = sentinel.current;
    const root = scrollRef.current;
    if (!node || !root || !hasOlder) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || loading || before.current) return;
        before.current = { height: root.scrollHeight, top: root.scrollTop };
        onLoadOlder();
      },
      { root, rootMargin: "200px 0px 0px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasOlder, loading, onLoadOlder, scrollRef]);

  useLayoutEffect(() => {
    const root = scrollRef.current;
    const was = before.current;
    if (!root || !was || loading) return;
    root.scrollTop = was.top + (root.scrollHeight - was.height);
    before.current = null;
  }, [messageCount, loading, scrollRef]);

  if (!hasOlder) return null;
  return (
    <div ref={sentinel} className="flex justify-center py-2 text-xs text-muted-foreground" aria-live="polite">
      {loading ? "Loading earlier messages…" : null}
    </div>
  );
};
