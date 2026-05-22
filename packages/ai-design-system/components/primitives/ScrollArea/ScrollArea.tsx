"use client";

import * as React from "react";
import {
  ScrollArea as ShadcnScrollArea,
  ScrollBar as ShadcnScrollBar,
} from "@/components/ui/scroll-area";

export type ScrollAreaProps = React.ComponentProps<typeof ShadcnScrollArea>;
export type ScrollBarProps = React.ComponentProps<typeof ShadcnScrollBar>;

export const ScrollArea = React.memo<ScrollAreaProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnScrollArea>, ScrollAreaProps>(
    (props, ref) => {
      return <ShadcnScrollArea ref={ref} {...props} />;
    }
  )
);
ScrollArea.displayName = "ScrollArea";

export const ScrollBar = React.memo<ScrollBarProps>(
  React.forwardRef<React.ElementRef<typeof ShadcnScrollBar>, ScrollBarProps>(
    (props, ref) => {
      return <ShadcnScrollBar ref={ref} {...props} />;
    }
  )
);
ScrollBar.displayName = "ScrollBar";
