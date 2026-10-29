"use client";

import * as React from "react";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/utils";

export interface CreditHistoryItem {
  id: string;
  at: string;
  label: string;
  credits: number;
}

export interface CreditsHistoryProps {
  items: CreditHistoryItem[];
  hasMore?: boolean;
  isLoading?: boolean;
  onLoadMore?: () => void;
  className?: string;
  title?: string;
}

function formatDayHeader(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const now = new Date();
    const isToday =
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate();
    if (isToday) return "Today";

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      d.getFullYear() === yesterday.getFullYear() &&
      d.getMonth() === yesterday.getMonth() &&
      d.getDate() === yesterday.getDate();
    if (isYesterday) return "Yesterday";

    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  } catch {
    return dateStr;
  }
}

export const CreditsHistory = React.memo<CreditsHistoryProps>(
  ({
    items,
    hasMore = false,
    isLoading = false,
    onLoadMore,
    className,
    title = "Credits history",
  }) => {
    // Group items by day
    const grouped = React.useMemo(() => {
      const groups: { day: string; entries: CreditHistoryItem[] }[] = [];
      const map = new Map<string, CreditHistoryItem[]>();

      for (const item of items) {
        const day = formatDayHeader(item.at);
        let list = map.get(day);
        if (!list) {
          list = [];
          map.set(day, list);
          groups.push({ day, entries: list });
        }
        list.push(item);
      }

      return groups;
    }, [items]);

    return (
      <div className={cn("w-full space-y-4", className)}>
        {title && (
          <h3 className="text-base font-semibold text-foreground tracking-tight">
            {title}
          </h3>
        )}

        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No credits activity yet.
          </div>
        ) : (
          <div className="space-y-6">
            {grouped.map(({ day, entries }) => (
              <div key={day} className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {day}
                </div>

                <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
                  {entries.map((item) => {
                    const isPositive = item.credits > 0;
                    const formatted = isPositive
                      ? `+${item.credits.toLocaleString()}`
                      : item.credits.toLocaleString();

                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3.5 text-sm gap-4 hover:bg-muted/30 transition-colors"
                      >
                        <span className="font-medium text-foreground truncate">
                          {item.label}
                        </span>
                        <span
                          className={cn(
                            "tabular-nums font-semibold shrink-0 text-sm",
                            isPositive
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-foreground"
                          )}
                        >
                          {formatted}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {hasMore && (
              <div className="pt-2">
                <Button
                  variant="outline"
                  onClick={onLoadMore}
                  disabled={isLoading}
                  className="w-full cursor-pointer"
                >
                  {isLoading ? "Loading..." : "Load more"}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

CreditsHistory.displayName = "CreditsHistory";
