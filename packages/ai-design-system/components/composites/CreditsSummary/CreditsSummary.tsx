"use client";

import * as React from "react";
import { Button } from "@/components/primitives/Button";
import { Badge } from "@/components/primitives/Badge";
import { Icon } from "@/components/primitives/Icon";
import { cn } from "@/lib/utils";

export interface IncludedCredits {
  amount: number;
  expiresAt?: string;
}

export interface AddOnCredits {
  amount: number;
  frozen?: boolean;
}

export interface CreditsSummaryProps {
  total: number;
  included?: IncludedCredits;
  addOn?: AddOnCredits;
  planName?: string;
  onUpgrade?: () => void;
  onBuyCredits?: () => void;
  className?: string;
}

export const CreditsSummary = React.memo<CreditsSummaryProps>(
  ({
    total,
    included,
    addOn,
    planName,
    onUpgrade,
    onBuyCredits,
    className,
  }) => {
    return (
      <div
        className={cn(
          "rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6",
          className
        )}
      >
        {/* Header row with the plan and its Upgrade; without a plan, Upgrade is the action below */}
        {planName && (
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">
                {planName}
              </h3>
            </div>
            {onUpgrade && (
              <Button
                size="sm"
                onClick={onUpgrade}
                className="shrink-0 cursor-pointer font-medium"
              >
                Upgrade
              </Button>
            )}
          </div>
        )}

        {/* Primary Credits balance line */}
        <div className="pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-foreground font-semibold">
              <Icon name="sparkles" className="w-5 h-5 text-primary" />
              <span className="text-base">Credits</span>
            </div>
            <div className="text-3xl font-extrabold tabular-nums tracking-tight text-foreground">
              {total.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Sub-breakdown rows */}
        {(included !== undefined || addOn !== undefined) && (
          <div className="rounded-xl border border-border/70 bg-muted/20 p-4 space-y-3">
            {included !== undefined && (
              <div className="flex items-center justify-between text-sm">
                <div>
                  <div className="font-medium text-foreground">
                    Included credits
                  </div>
                  {included.expiresAt && (
                    <div className="text-xs text-muted-foreground">
                      Expires {included.expiresAt}
                    </div>
                  )}
                </div>
                <div className="font-semibold tabular-nums text-foreground">
                  {included.amount.toLocaleString()}
                </div>
              </div>
            )}

            {included !== undefined && addOn !== undefined && (
              <div className="h-px bg-border/60" />
            )}

            {addOn !== undefined && (
              <div className="flex items-center justify-between text-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">
                      Add-on credits
                    </span>
                    {addOn.frozen && addOn.amount > 0 && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0 font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30"
                      >
                        Frozen
                      </Badge>
                    )}
                  </div>
                  {addOn.frozen && addOn.amount > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Spendable again once the account has a plan
                    </p>
                  )}
                </div>
                <div
                  className={cn(
                    "font-semibold tabular-nums",
                    addOn.frozen ? "text-muted-foreground" : "text-foreground"
                  )}
                >
                  {addOn.amount.toLocaleString()}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-3 pt-2">
          {onBuyCredits && (
            <Button
              variant="outline"
              onClick={onBuyCredits}
              className="cursor-pointer"
            >
              Buy credits
            </Button>
          )}
          {onUpgrade && !planName && (
            <Button onClick={onUpgrade} className="cursor-pointer">
              Upgrade
            </Button>
          )}
        </div>
      </div>
    );
  }
);

CreditsSummary.displayName = "CreditsSummary";
