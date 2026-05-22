"use client";

import * as React from "react";
import {
  Collapsible as ShadcnCollapsible,
  CollapsibleContent as ShadcnCollapsibleContent,
  CollapsibleTrigger as ShadcnCollapsibleTrigger,
} from "@/components/ui/collapsible";

export type CollapsibleProps = React.ComponentProps<typeof ShadcnCollapsible>;
export type CollapsibleTriggerProps = React.ComponentProps<typeof ShadcnCollapsibleTrigger>;
export type CollapsibleContentProps = React.ComponentProps<typeof ShadcnCollapsibleContent>;

export const Collapsible = React.memo<CollapsibleProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnCollapsible>, CollapsibleProps>(
    (props, ref) => {
      return <ShadcnCollapsible {...props} />;
    }
  )
);
Collapsible.displayName = "Collapsible";

export const CollapsibleTrigger = React.memo<CollapsibleTriggerProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnCollapsibleTrigger>, CollapsibleTriggerProps>(
    (props, ref) => {
      return <ShadcnCollapsibleTrigger ref={ref} {...props} />;
    }
  )
);
CollapsibleTrigger.displayName = "CollapsibleTrigger";

export const CollapsibleContent = React.memo<CollapsibleContentProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnCollapsibleContent>, CollapsibleContentProps>(
    (props, ref) => {
      return <ShadcnCollapsibleContent ref={ref} {...props} />;
    }
  )
);
CollapsibleContent.displayName = "CollapsibleContent";
