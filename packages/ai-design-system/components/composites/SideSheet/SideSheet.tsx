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
  /** Optional semantic icon name from the DS icon registry shown alongside the title */
  icon?: string;
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
  /**
   * Render as a non-modal floating sheet docked inside a relative parent container
   * (e.g., workflow canvas inspector) instead of a viewport-blocking modal drawer.
   */
  inline?: boolean;
  /** Class name for the outer drawer container */
  className?: string;
  /** Class name for the inner scrollable content area */
  contentClassName?: string;
  /** Size on desktop (defaults to 'sm' matching standard shadcn sm:max-w-sm) */
  size?: "sm" | "md" | "lg" | "xl";
}

const SIDE_SHEET_SIZES: Record<"sm" | "md" | "lg" | "xl", string> = {
  sm: "data-[vaul-drawer-direction=right]:sm:max-w-sm data-[vaul-drawer-direction=left]:sm:max-w-sm sm:max-w-sm",
  md: "data-[vaul-drawer-direction=right]:sm:max-w-md data-[vaul-drawer-direction=left]:sm:max-w-md sm:max-w-md",
  lg: "data-[vaul-drawer-direction=right]:sm:max-w-lg data-[vaul-drawer-direction=left]:sm:max-w-lg sm:max-w-lg",
  xl: "data-[vaul-drawer-direction=right]:sm:max-w-xl data-[vaul-drawer-direction=left]:sm:max-w-xl sm:max-w-xl",
};

const INLINE_SHEET_SIZES: Record<"sm" | "md" | "lg" | "xl", string> = {
  sm: "w-[384px] min-w-[360px] max-w-[calc(100%-1.5rem)]",
  md: "w-[400px] min-w-[384px] max-w-[calc(100%-1.5rem)]",
  lg: "w-[440px] min-w-[400px] max-w-[calc(100%-1.5rem)]",
  xl: "w-[512px] min-w-[420px] max-w-[calc(100%-1.5rem)]",
};

/**
 * Reusable SideSheet composite component.
 * Provides a slide-out panel from the side (desktop) or bottom (mobile).
 */
export const SideSheet = React.memo<SideSheetProps>(
  ({
    open,
    onOpenChange,
    title,
    icon,
    description,
    children,
    footer,
    side = "right",
    responsive = true,
    showCloseButton = false,
    inline = false,
    className,
    contentClassName,
    size = "sm",
  }) => {
    const isMobile = useIsMobile();
    const effectiveDirection = responsive && isMobile ? "bottom" : side;
    const isBottom = effectiveDirection === "bottom";
    const isTop = effectiveDirection === "top";
    const isRight = effectiveDirection === "right";
    const isLeft = effectiveDirection === "left";
    const sizeClass = SIDE_SHEET_SIZES[size] || SIDE_SHEET_SIZES.sm;
    const inlineSizeClass = INLINE_SHEET_SIZES[size] || INLINE_SHEET_SIZES.md;

    if (inline) {
      if (!open) return null;
      return (
        <aside
          aria-label={typeof title === "string" ? title : "Inspector"}
          data-testid="sidesheet-inline"
          className={cn(
            "absolute top-3 bottom-3 z-30 flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-2xl",
            side === "left" ? "left-3" : "right-3",
            inlineSizeClass,
            className
          )}
        >
          {(title !== undefined || description !== undefined || showCloseButton) && (
            <div className="flex items-start justify-between gap-2 border-b border-border p-4 shrink-0 text-left">
              <div className="flex items-start gap-2.5 min-w-0 flex-1">
                {icon && (
                  <Icon
                    name={icon}
                    size="sm"
                    className="mt-0.5 shrink-0 text-muted-foreground"
                    strokeWidth={1.5}
                  />
                )}
                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                  {title && (
                    <h3 className="text-sm font-semibold leading-snug truncate text-foreground">
                      {title}
                    </h3>
                  )}
                  {description && (
                    <p className="text-xs text-muted-foreground break-words">
                      {description}
                    </p>
                  )}
                </div>
              </div>
              {showCloseButton && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenChange(false)}
                  className="h-7 w-7 rounded-full shrink-0 -mr-1 -mt-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label="Close sheet"
                  data-testid="btn-sidesheet-close"
                >
                  <Icon name="x" className="w-4 h-4" />
                </Button>
              )}
            </div>
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
            <div className="p-3 border-t border-border shrink-0">
              {footer}
            </div>
          )}
        </aside>
      );
    }

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
            isRight && `h-full w-full ${sizeClass} border-y-0 border-r-0 border-l border-border`,
            isLeft && `h-full w-full ${sizeClass} border-y-0 border-l-0 border-r border-border`,
            className
          )}
          style={{
            ...(isBottom || isTop ? { height: "74vh", maxHeight: "75vh" } : {}),
          }}
          data-testid="sidesheet"
        >
          {(title !== undefined || description !== undefined || showCloseButton) && (
            <DrawerHeader className="p-4 border-b border-border flex items-center justify-between shrink-0 text-left">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {icon && (
                  <Icon name={icon} size="sm" className="shrink-0 text-muted-foreground" strokeWidth={1.5} />
                )}
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
