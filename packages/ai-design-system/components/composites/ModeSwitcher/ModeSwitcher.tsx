"use client";

import * as React from "react";
import { Badge } from "@/components/primitives/Badge";
import { Button } from "@/components/primitives/Button";
import { Icon } from "@/components/primitives/Icon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/primitives/Tooltip";
import { cn } from "@/lib/utils";

export type Mode = "demo" | "dev";

export interface ModeSwitcherProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  className?: string;
}

export const ModeSwitcher = React.memo<ModeSwitcherProps>(
  ({ mode, onModeChange, className }) => {
    const isDemo = mode === "demo";

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className={cn("relative", className)}
            onClick={() => onModeChange(isDemo ? "dev" : "demo")}
            size="icon"
            variant="ghost"
          >
            {isDemo ? (
              <>
                <Icon name="database" className="size-4 text-orange-600" />
                <Badge
                  className="absolute -top-1.5 -right-1.5 h-4 px-1 text-[9px] leading-none bg-orange-600 text-white border-0"
                  variant="default"
                >
                  DEMO
                </Badge>
              </>
            ) : (
              <Icon name="server" className="size-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isDemo
              ? "Using demo data — click to switch to live data"
              : "Using live data — click to switch to demo data"}
          </p>
        </TooltipContent>
      </Tooltip>
    );
  },
);

ModeSwitcher.displayName = "ModeSwitcher";
