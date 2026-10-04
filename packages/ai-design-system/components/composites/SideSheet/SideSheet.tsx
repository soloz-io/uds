"use client";

import * as React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/primitives/Drawer";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import { cn } from "@/lib/utils";

const subscribeMobile = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  const media = window.matchMedia("(max-width: 767px)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};

const getMobileSnapshot = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 767px)").matches;
};

const getMobileServerSnapshot = () => false;

function useIsMobile() {
  return React.useSyncExternalStore(
    subscribeMobile,
    getMobileSnapshot,
    getMobileServerSnapshot
  );
}

export interface SideSheetProps {
  /** Controls open/close state */
  open: boolean;
  /** Callback fired when open state changes */
  onOpenChange: (open: boolean) => void;
  /** Title displayed in the header */
  title?: React.ReactNode;
  /** Optional subtitle/description displayed below the title */
  description?: React.ReactNode;
  /** Main sheet content */
  children: React.ReactNode;
  /** Optional actions/buttons rendered in the footer */
  footer?: React.ReactNode;
  /** Slide direction on desktop (defaults to 'right') */
  side?: "right" | "left" | "bottom" | "top";
  /** Whether to adapt to bottom sheet presentation on mobile screens (< 768px) */
  responsive?: boolean;
  /** Whether to display a close 'x' button in the header */
  showCloseButton?: boolean;
  /** Class name for the outer drawer container */
  className?: string;
  /** Class name for the inner scrollable content area */
  contentClassName?: string;
}

/**
 * Reusable SideSheet composite component.
 * Provides a slide-out panel from the side (desktop) or bottom (mobile).
 */
export const SideSheet = React.memo<SideSheetProps>(
  ({
    open,
    onOpenChange,
    title,
    description,
    children,
    footer,
    side = "right",
    responsive = true,
    showCloseButton = false,
    className,
    contentClassName,
  }) => {
    const isMobile = useIsMobile();
    const effectiveDirection = responsive && isMobile ? "bottom" : side;
    const isBottom = effectiveDirection === "bottom";
    const isTop = effectiveDirection === "top";
    const isRight = effectiveDirection === "right";
    const isLeft = effectiveDirection === "left";

    return (
      <Drawer
        key={effectiveDirection}
        open={open}
        onOpenChange={onOpenChange}
        direction={effectiveDirection}
        dismissible={true}
      >
        <DrawerContent
          className={cn(
            "flex flex-col p-0 focus:outline-none bg-background text-foreground shadow-2xl",
            isBottom && "h-[74vh] max-h-[75vh] w-full sm:max-w-2xl mx-auto rounded-t-2xl border-t border-x border-b-0 border-border data-[vaul-drawer-direction=bottom]:mt-0 data-[vaul-drawer-direction=bottom]:rounded-t-2xl",
            isTop && "h-[74vh] max-h-[75vh] w-full sm:max-w-2xl mx-auto rounded-b-2xl border-b border-x border-t-0 border-border data-[vaul-drawer-direction=top]:mb-0 data-[vaul-drawer-direction=top]:rounded-b-2xl",
            isRight && "h-full w-full sm:max-w-md border-y-0 border-r-0 border-l border-border",
            isLeft && "h-full w-full sm:max-w-md border-y-0 border-l-0 border-r border-border",
            className
          )}
          style={{
            ...(isBottom || isTop ? { height: "74vh", maxHeight: "75vh" } : {}),
          }}
          data-testid="sidesheet"
        >
          {(title !== undefined || description !== undefined || showCloseButton) && (
            <DrawerHeader className="p-4 border-b border-border flex items-center justify-between shrink-0 text-left">
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                {title && (
                  <DrawerTitle className="text-base font-semibold truncate text-foreground">
                    {title}
                  </DrawerTitle>
                )}
                {description && (
                  <DrawerDescription className="text-xs text-muted-foreground">
                    {description}
                  </DrawerDescription>
                )}
              </div>
              {showCloseButton && (
                <DrawerClose asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full shrink-0 -mr-1 text-muted-foreground hover:text-foreground cursor-pointer"
                    aria-label="Close sheet"
                    data-testid="btn-sidesheet-close"
                  >
                    <Icon name="x" className="w-4 h-4" />
                  </Button>
                </DrawerClose>
              )}
            </DrawerHeader>
          )}

          <div
            className={cn(
              "flex-1 min-h-0 overflow-y-auto p-4 flex flex-col",
              contentClassName
            )}
          >
            {children}
          </div>

          {footer && (
            <DrawerFooter className="p-3 border-t border-border shrink-0">
              {footer}
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    );
  }
);

SideSheet.displayName = "SideSheet";

// Export compound subcomponents for customized composition
export {
  Drawer as SideSheetRoot,
  DrawerTrigger as SideSheetTrigger,
  DrawerClose as SideSheetClose,
  DrawerContent as SideSheetContent,
  DrawerHeader as SideSheetHeader,
  DrawerFooter as SideSheetFooter,
  DrawerTitle as SideSheetTitle,
  DrawerDescription as SideSheetDescription,
};
