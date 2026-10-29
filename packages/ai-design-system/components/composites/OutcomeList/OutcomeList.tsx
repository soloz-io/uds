"use client";

import * as React from "react";
import { Badge } from "@/components/primitives/Badge";
import { Icon } from "@/components/primitives/Icon";
import { cn } from "@/lib/utils";

export interface ComputerOutcome {
  code: string;
  name: string;
  description?: string;
  credits: number;
}

export interface OutcomeListProps {
  outcomes: ComputerOutcome[];
  title?: string;
  description?: string;
  className?: string;
  onSelectOutcome?: (code: string) => void;
  selectedOutcomeCode?: string;
}

export const OutcomeList = React.memo<OutcomeListProps>(
  ({
    outcomes,
    title,
    description,
    className,
    onSelectOutcome,
    selectedOutcomeCode,
  }) => {
    return (
      <div className={cn("w-full space-y-4", className)}>
        {(title || description) && (
          <div className="space-y-1">
            {title && (
              <h3 className="text-base font-semibold text-foreground tracking-tight">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        )}

        {outcomes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No outcomes available for this computer.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {outcomes.map((outcome) => {
              const isSelected = selectedOutcomeCode === outcome.code;
              const isClickable = Boolean(onSelectOutcome);

              return (
                <div
                  key={outcome.code}
                  onClick={() => onSelectOutcome?.(outcome.code)}
                  role={isClickable ? "button" : undefined}
                  tabIndex={isClickable ? 0 : undefined}
                  onKeyDown={
                    isClickable
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onSelectOutcome?.(outcome.code);
                          }
                        }
                      : undefined
                  }
                  className={cn(
                    "rounded-xl border border-border bg-card p-4 flex flex-col justify-between gap-3 text-left transition-all",
                    isClickable &&
                      "hover:border-primary/50 hover:bg-muted/30 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isSelected && "border-primary ring-1 ring-primary bg-muted/20"
                  )}
                >
                  <div className="space-y-1.5">
                    <div className="text-sm font-semibold text-foreground tracking-tight">
                      {outcome.name}
                    </div>
                    {outcome.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {outcome.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-1 flex items-center justify-between">
                    <Badge
                      variant="secondary"
                      className="text-xs font-medium py-1 px-2.5 flex items-center gap-1.5"
                    >
                      <Icon name="sparkles" className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{outcome.credits.toLocaleString()} credits / run</span>
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
);

OutcomeList.displayName = "OutcomeList";
