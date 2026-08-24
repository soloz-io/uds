"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { BookmarkIcon } from "lucide-react";
import type { ComponentProps, HTMLAttributes } from "react";

// ── Checkpoint ────────────────────────────────────────────────────────────────
// Root container: renders [icon] [trigger] [Separator] in a flex row.
// The Separator stretches to fill remaining width automatically.

export type CheckpointProps = HTMLAttributes<HTMLDivElement>;

export const Checkpoint = ({
  className,
  children,
  ...props
}: CheckpointProps) => (
  <div
    className={cn(
      "flex items-center gap-0.5 overflow-hidden text-muted-foreground",
      className
    )}
    {...props}
  >
    {children}
    <Separator className="flex-1" />
  </div>
);

// ── CheckpointIcon ────────────────────────────────────────────────────────────
// Defaults to BookmarkIcon. Pass children to use a custom icon.

export type CheckpointIconProps = ComponentProps<typeof BookmarkIcon>;

export const CheckpointIcon = ({
  className,
  children,
  ...props
}: CheckpointIconProps) =>
  children ? (
    <span className={cn("size-4 shrink-0", className)}>{children}</span>
  ) : (
    <BookmarkIcon
      aria-hidden="true"
      className={cn("size-4 shrink-0", className)}
      {...props}
    />
  );

// ── CheckpointTrigger ─────────────────────────────────────────────────────────
// The clickable restore button. Extends shadcn/ui Button.

export type CheckpointTriggerProps = ComponentProps<typeof Button> & {
  /** Optional tooltip shown on hover and used as aria-label when no children. */
  tooltip?: string;
};

export const CheckpointTrigger = ({
  children,
  tooltip,
  variant = "ghost",
  size = "sm",
  className,
  ...props
}: CheckpointTriggerProps) => (
  <Button
    aria-label={tooltip ?? "Restore checkpoint"}
    className={cn(
      "h-8 gap-1.5 px-3 text-muted-foreground hover:text-foreground",
      className
    )}
    size={size}
    title={tooltip}
    type="button"
    variant={variant}
    {...props}
  >
    {children}
  </Button>
);

Checkpoint.displayName = "Checkpoint";
CheckpointIcon.displayName = "CheckpointIcon";
CheckpointTrigger.displayName = "CheckpointTrigger";
