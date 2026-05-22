"use client";

import * as React from "react";
import {
  HoverCard as ShadcnHoverCard,
  HoverCardContent as ShadcnHoverCardContent,
  HoverCardTrigger as ShadcnHoverCardTrigger,
} from "@/components/ui/hover-card";

export type HoverCardProps = React.ComponentProps<typeof ShadcnHoverCard>;
export type HoverCardTriggerProps = React.ComponentProps<typeof ShadcnHoverCardTrigger>;
export type HoverCardContentProps = React.ComponentProps<typeof ShadcnHoverCardContent>;

export const HoverCard = React.memo<HoverCardProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnHoverCard>, HoverCardProps>(
    (props, ref) => {
      return <ShadcnHoverCard {...props} />;
    }
  )
);
HoverCard.displayName = "HoverCard";

export const HoverCardTrigger = React.memo<HoverCardTriggerProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnHoverCardTrigger>, HoverCardTriggerProps>(
    (props, ref) => {
      return <ShadcnHoverCardTrigger ref={ref} {...props} />;
    }
  )
);
HoverCardTrigger.displayName = "HoverCardTrigger";

export const HoverCardContent = React.memo<HoverCardContentProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnHoverCardContent>, HoverCardContentProps>(
    (props, ref) => {
      return <ShadcnHoverCardContent ref={ref} {...props} />;
    }
  )
);
HoverCardContent.displayName = "HoverCardContent";
