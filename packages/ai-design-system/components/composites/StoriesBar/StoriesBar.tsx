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
  status?: "ready" | "generating" | "draft";
  thumbnailUrl?: string;
  avatarColor?: string;
  avatarInitials?: string;
}

export interface StoriesBarProps extends React.HTMLAttributes<HTMLDivElement> {
  stories: StoryItem[];
  activeStoryId?: string | null;
  onStoryClick: (story: StoryItem) => void;
  defaultIcon?: string;
}

function getStoryStatusStyle(status?: StoryItem["status"]) {
  switch (status) {
    case "generating":
      return {
        iconColor: "text-amber-500",
        badgeBg: "bg-amber-500",
      };
    case "ready":
      return {
        iconColor: "text-emerald-500",
        badgeBg: "bg-emerald-500",
      };
    case "draft":
    default:
      return {
        iconColor: "text-muted-foreground",
        badgeBg: "bg-muted-foreground",
      };
  }
}

export const StoriesBar = React.forwardRef<HTMLDivElement, StoriesBarProps>(
  ({ stories, activeStoryId, onStoryClick, defaultIcon = "clapperboard", className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("w-full border-b border-border bg-background shrink-0", className)}
        data-testid="stories-bar"
        {...props}
      >
        <div className="flex items-center gap-2.5 px-3 py-1.5 overflow-x-auto no-scrollbar scroll-smooth">
          {stories.map((story) => {
            const isActive = story.id === activeStoryId;
            const isGenerating = story.status === "generating";
            const statusStyle = getStoryStatusStyle(story.status);
            const iconName = story.icon || defaultIcon;

            return (
              <Button
                key={story.id}
                variant="ghost"
                onClick={() => onStoryClick(story)}
                className="flex flex-col items-center gap-1 h-auto p-0 hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg cursor-pointer group shrink-0"
                data-testid={`btn-story-${story.id}`}
                aria-label={`Open story: ${story.title}`}
              >
                <div
                  className={cn(
                    "relative w-9 h-9 shrink-0 aspect-square rounded-full transition-transform group-hover:scale-105",
                    isActive
                      ? "ring-2 ring-primary ring-offset-1 ring-offset-background"
                      : "ring-1 ring-border/60"
                  )}
                >
                  <div className="w-full h-full rounded-full flex items-center justify-center border border-border/50 bg-muted/40 shadow-xs overflow-hidden select-none">
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

                  {isGenerating ? (
                    <span className="absolute bottom-0 right-0 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                    </span>
                  ) : (
                    <span
                      className={cn(
                        "absolute bottom-0 right-0 inline-flex rounded-full h-2 w-2 ring-1.5 ring-background",
                        statusStyle.badgeBg
                      )}
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
      </div>
    );
  }
);

StoriesBar.displayName = "StoriesBar";
