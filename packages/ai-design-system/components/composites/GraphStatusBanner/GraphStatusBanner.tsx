"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/primitives/Alert";
import { Icon } from "@/components/primitives/Icon";
import { cn } from "@/lib/utils";

/** The state of the data a graph shows: current, updating, or failed with details. */
export interface GraphStatusBannerProps {
  tone: "neutral" | "info" | "warning" | "error";
  title: string;
  details?: string[];
  className?: string;
}

const ICON: Record<GraphStatusBannerProps["tone"], string> = {
  neutral: "circle-check",
  info: "refresh-cw",
  warning: "alert-circle",
  error: "circle-x",
};

/** A compact banner for the state of a graph's data, announced to assistive technology. */
export function GraphStatusBanner({ tone, title, details, className }: GraphStatusBannerProps) {
  return (
    <Alert variant={tone === "error" ? "destructive" : "default"} className={cn("max-w-sm", className)}>
      <Icon name={ICON[tone]} size="sm" />
      <AlertTitle>{title}</AlertTitle>
      {details && details.length > 0 && (
        <AlertDescription>
          <ul className="max-h-40 overflow-auto font-mono text-xs">
            {details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </AlertDescription>
      )}
    </Alert>
  );
}
