"use client";

import * as React from "react";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { cn } from "@/lib/utils";

export interface PlanItem {
  code: string;
  name: string;
  priceUsdCents: number;
  interval?: string;
  credits: number;
  features: string[];
  current?: boolean;
  addOnPriceUsdCentsPerCredit?: number;
  badge?: string;
  description?: string;
  ctaLabel?: string;
}

export interface PlanPickerProps {
  plans: PlanItem[];
  onChoose?: (code: string) => void;
  badge?: string;
  title?: string;
  description?: string;
  className?: string;
}

export const PlanPicker = React.memo<PlanPickerProps>(
  ({
    plans,
    onChoose,
    badge,
    title,
    description,
    className,
  }) => {
    return (
      <div className={cn("w-full max-w-5xl mx-auto py-4", className)}>
        {(badge || title || description) && (
          <div className="text-center mb-8 space-y-2">
            {badge && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                <span>{badge}</span>
              </div>
            )}
            {title && (
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => {
            const priceFormatted =
              plan.priceUsdCents === 0
                ? "$0"
                : `$${(plan.priceUsdCents / 100).toFixed(
                    plan.priceUsdCents % 100 === 0 ? 0 : 2
                  )}`;

            const addOnPriceFormatted =
              plan.addOnPriceUsdCentsPerCredit !== undefined
                ? `$${(plan.addOnPriceUsdCentsPerCredit / 100).toFixed(2)}`
                : null;

            return (
              <div
                key={plan.code}
                className={cn(
                  "rounded-2xl border border-border bg-card p-6 flex flex-col justify-between shadow-sm transition-all",
                  plan.current && "border-primary/50 ring-1 ring-primary/30"
                )}
              >
                <div>
                  {plan.badge && (
                    <div className="text-[11px] font-semibold tracking-wider uppercase text-primary mb-2">
                      {plan.badge}
                    </div>
                  )}

                  <h3 className="text-base font-bold uppercase tracking-wider text-foreground">
                    {plan.name}
                  </h3>

                  <div className="mt-4 mb-2">
                    <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                      {priceFormatted}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                      per {plan.interval || "month"}
                    </span>
                  </div>

                  {plan.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {plan.description}
                    </p>
                  )}

                  <div className="h-px bg-border my-6" />

                  <ul className="space-y-3">
                    <li className="flex items-start gap-2.5 text-sm font-medium text-foreground">
                      <Icon
                        name="check"
                        className="w-4 h-4 text-primary shrink-0 mt-0.5"
                      />
                      <span>{plan.credits.toLocaleString()} credits</span>
                    </li>

                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-sm text-muted-foreground"
                      >
                        <Icon
                          name="check"
                          className="w-4 h-4 text-primary shrink-0 mt-0.5"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}

                    {addOnPriceFormatted && (
                      <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <Icon
                          name="check"
                          className="w-4 h-4 text-primary shrink-0 mt-0.5"
                        />
                        <span>Add-on credits ({addOnPriceFormatted}/credit)</span>
                      </li>
                    )}
                  </ul>
                </div>

                <div className="pt-6">
                  {plan.current ? (
                    <Button
                      disabled
                      variant="outline"
                      className="w-full rounded-xl opacity-70 cursor-not-allowed"
                    >
                      {plan.ctaLabel || "Current plan"}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => onChoose?.(plan.code)}
                      className="w-full rounded-xl cursor-pointer"
                    >
                      {plan.ctaLabel || "Upgrade"}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);

PlanPicker.displayName = "PlanPicker";
