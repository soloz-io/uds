"use client";

import * as React from "react";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { cn } from "@/lib/utils";

export interface StoryItem {
  id: string;
  sessionId?: string;
  title: string;
  videoTitle?: string;
  subtitle?: string;
  icon?: string;
  time?: string;
  /**
   * The story/video's state, drawn as the story's icon colour:
   * - "failed": red — stopped on an error
   * - "ready": emerald — finished and available
   * - "stopped": muted (grey) — not ready, and nothing is running to finish it
   * - "working": amber (orange) — in progress
   * "generating" and "draft" are the earlier names of "working" and "stopped".
   */
  status?: "failed" | "ready" | "stopped" | "working" | "generating" | "draft";
  /**
   * Whether the story holds a notification the user has not seen (the session expects
   * a response from the user: an unseen question/approval or new message).
   * Shown as a badge dot on the story avatar, only when true.
   */
  unread?: boolean;
  thumbnailUrl?: string;
  avatarColor?: string;
  avatarInitials?: string;
}

export interface StoryHomeItem {
  id?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  icon?: string;
}

export interface StoriesBarProps extends React.HTMLAttributes<HTMLDivElement> {
  stories: StoryItem[];
  activeStoryId?: string | null;
  onStoryClick: (story: StoryItem) => void;
  defaultIcon?: string;
  /** Section title shown above the stories (defaults to "Conversations") */
  title?: string;
  /** Whether the stories bar can be collapsed/expanded. Defaults to true. */
  collapsible?: boolean;
  /** Initial collapsed state when uncontrolled. Defaults to false. */
  defaultCollapsed?: boolean;
  /** Controlled collapsed state. */
  collapsed?: boolean;
  /** Callback fired when collapsed state changes. */
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Storage key to persist collapsed state in localStorage. */
  storageKey?: string;
  /**
   * @deprecated Home / Master chat item is now just a regular story in the `stories` list.
   * Kept for backwards compatibility.
   */
  homeItem?: StoryHomeItem | false;
  /** @deprecated Callback when the home / master chat item is clicked */
  onHomeClick?: () => void;
  /** Backward-compatibility variant prop */
  variant?: "bubbles" | "cards";
}

function getStoryStatusStyle(status?: StoryItem["status"]) {
  switch (status) {
    case "failed":
      return { iconColor: "text-red-500" };
    case "ready":
      return { iconColor: "text-emerald-500" };
    case "working":
    case "generating":
      return { iconColor: "text-amber-500" };
    case "stopped":
    case "draft":
    default:
      return { iconColor: "text-muted-foreground" };
  }
}

/**
 * StoriesBar Composite
 *
 * Displays circular story avatar bubbles. Every bubble is a story in the list.
 * Status is communicated through the icon color (working=amber, ready=emerald, failed=red, stopped=muted).
 * A badge dot appears ONLY when `unread` is true (the session expects user response/has unseen notification).
 */
export const StoriesBar = React.forwardRef<HTMLDivElement, StoriesBarProps>(
  (
    {
      stories,
      activeStoryId,
      onStoryClick,
      defaultIcon = "clapperboard",
      title = "Conversations",
      collapsible = true,
      defaultCollapsed = false,
      collapsed,
      onCollapsedChange,
      storageKey,
      homeItem: _homeItem,
      onHomeClick: _onHomeClick,
      className,
      ...props
    },
    ref
  ) => {
    void _homeItem;
    void _onHomeClick;
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);
    const totalItems = stories.length;

    const [internalCollapsed, setInternalCollapsed] = React.useState<boolean>(() => {
      if (typeof window !== "undefined" && storageKey) {
        try {
          const stored = localStorage.getItem(storageKey);
          if (stored !== null) return stored === "true";
        } catch {
          // ignore localStorage read error
        }
      }
      return defaultCollapsed ?? false;
    });

    const isCollapsed = collapsible ? (collapsed !== undefined ? collapsed : internalCollapsed) : false;

    const toggleCollapsed = () => {
      const next = !isCollapsed;
      if (collapsed === undefined) {
        setInternalCollapsed(next);
      }
      if (typeof window !== "undefined" && storageKey) {
        try {
          localStorage.setItem(storageKey, String(next));
        } catch {
          // ignore localStorage write error
        }
      }
      onCollapsedChange?.(next);
    };

    const handleScrollLeft = () => {
      scrollContainerRef.current?.scrollBy({ left: -180, behavior: "smooth" });
    };

    const handleScrollRight = () => {
      scrollContainerRef.current?.scrollBy({ left: 180, behavior: "smooth" });
    };

    return (
      <div
        ref={ref}
        className={cn("w-full border-b border-border bg-background shrink-0", className)}
        data-testid="stories-bar"
        {...props}
      >
        {/* Header row: Conversations + scroll arrows */}
        {title && (
          <div
            className={cn(
              "flex items-center justify-between px-3.5 select-none",
              isCollapsed ? "py-2.5" : "pt-2.5 pb-1"
            )}
          >
            {collapsible ? (
              <button
                type="button"
                onClick={toggleCollapsed}
                className="flex items-center gap-1.5 text-sm font-semibold text-foreground tracking-tight hover:text-foreground/80 transition-colors cursor-pointer group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm"
                aria-expanded={!isCollapsed}
                aria-controls="stories-bubbles-list"
                data-testid="btn-toggle-stories-collapse"
              >
                <span>{title}</span>
                <Icon
                  name="chevron-down"
                  className={cn(
                    "w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-transform duration-200",
                    isCollapsed && "-rotate-90"
                  )}
                  aria-hidden="true"
                />
              </button>
            ) : (
              <span className="text-sm font-semibold text-foreground tracking-tight">
                {title}
              </span>
            )}
            {!isCollapsed && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleScrollLeft}
                  disabled={totalItems <= 1}
                  className="h-6 w-6 rounded-md border border-border/60 bg-background/50 hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                  aria-label="Scroll left"
                >
                  <Icon name="chevron-left" className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleScrollRight}
                  disabled={totalItems <= 1}
                  className="h-6 w-6 rounded-md border border-border/60 bg-background/50 hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
                  aria-label="Scroll right"
                >
                  <Icon name="chevron-right" className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Stories bubbles list: every item is a story */}
        {!isCollapsed && (
          <div
            id="stories-bubbles-list"
            ref={scrollContainerRef}
            className="flex items-center gap-1.5 px-3.5 py-2 overflow-x-auto no-scrollbar scroll-smooth"
          >
          {stories.map((story) => {
            const isActive = story.id === activeStoryId;
            const statusStyle = getStoryStatusStyle(story.status);
            const iconName = story.icon || defaultIcon;

            return (
              <Button
                key={story.id}
                variant="ghost"
                onClick={() => onStoryClick(story)}
                className={cn(
                  "flex flex-col items-center gap-1.5 h-auto px-2.5 py-2 rounded-xl cursor-pointer group shrink-0 transition-all duration-200 hover:bg-accent/60 dark:hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive && "bg-accent/30 dark:bg-accent/20"
                )}
                data-testid={`btn-story-${story.id}`}
                aria-label={`Open story: ${story.title}`}
              >
                <div className="relative w-9 h-9 shrink-0 aspect-square rounded-full transition-transform group-hover:scale-105">
                  <div
                    className={cn(
                      "w-full h-full rounded-full flex items-center justify-center border transition-all overflow-hidden select-none",
                      isActive
                        ? "border-primary bg-muted/60 ring-2 ring-primary ring-offset-2 ring-offset-background"
                        : "border-border/50 bg-muted/40"
                    )}
                  >
                    {story.thumbnailUrl ? (
                      <img
                        src={story.thumbnailUrl}
                        alt={story.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Icon
                        name={iconName}
                        className={cn("w-4 h-4 transition-colors", statusStyle.iconColor)}
                      />
                    )}
                  </div>

                  {/* Badge dot appears ONLY when story.unread is true */}
                  {story.unread && (
                    <span
                      className="absolute bottom-0 right-0 inline-flex rounded-full h-2.5 w-2.5 bg-primary ring-1.5 ring-background"
                      data-testid={`story-badge-${story.id}`}
                      aria-label="Unread notification"
                    />
                  )}
                </div>

                <span
                  className={cn(
                    "text-[10px] leading-tight truncate max-w-[56px] text-center",
                    isActive
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                  title={story.title}
                >
                  {story.title}
                </span>
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
  }
);

StoriesBar.displayName = "StoriesBar";
