"use client";

import { Button } from "@/components/primitives/Button";
import { ButtonGroup } from "@/components/primitives/ButtonGroup";
import { Icon } from "@/components/primitives/Icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/Select";
import { cn } from "@/lib/utils";
import { DEVICE_PRESETS } from "@/components/composites/DevicePreviewNode";
import {
  type DevicePreviewToolbarProps,
  type DevicePreviewViewMode,
} from "./interfaces";

const MODE_ICONS: Record<DevicePreviewViewMode, string> = {
  play: "play",
  single: "layout-grid",
  interactive: "phone",
  grid: "columns-3",
};

const MODE_TITLES: Record<DevicePreviewViewMode, string> = {
  play: "Play",
  single: "Single Route",
  interactive: "Interactive",
  grid: "All Routes",
};

/**
 * DevicePreviewToolbar Composite
 *
 * Center header for the device-preview canvas. Groups the four view modes
 * (`Play`, `Single Route`, `Interactive`, `All Routes`), a route selector and
 * a device-preset switcher into one toolbar rendered in the canvas `topCenter`
 * panel slot.
 *
 * All controls are optional on the callback side — a consumer may render only
 * the modes, or only the route/preset selectors.
 *
 * ## Accessibility
 * - Mode buttons are grouped (`ButtonGroup`) and carry tooltips + titles.
 * - Selects expose accessible labels.
 */
export function DevicePreviewToolbar({
  viewMode,
  onViewModeChange,
  routes,
  activeRoute,
  onRouteChange,
  devicePresets = DEVICE_PRESETS,
  devicePresetId,
  onDevicePresetChange,
  className,
}: DevicePreviewToolbarProps) {
  const modes = Object.keys(MODE_ICONS) as DevicePreviewViewMode[];

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-md border bg-secondary/80 px-1.5 py-1 shadow-md backdrop-blur",
        className,
      )}
      data-testid="device-preview-toolbar"
    >
      <ButtonGroup orientation="horizontal">
        {modes.map((mode) => {
          const active = mode === viewMode;
          return (
            <Button
              key={mode}
              size="icon"
              variant="secondary"
              className={cn(
                "h-8 w-8",
                active && "bg-primary/15 text-primary hover:bg-primary/15",
              )}
              onClick={() => onViewModeChange?.(mode)}
              title={MODE_TITLES[mode]}
              aria-label={MODE_TITLES[mode]}
              aria-pressed={active}
            >
              <Icon name={MODE_ICONS[mode]} size="sm" />
            </Button>
          );
        })}
      </ButtonGroup>

      {routes && routes.length > 0 && (
        <Select value={activeRoute} onValueChange={onRouteChange}>
          <SelectTrigger className="h-8 w-[140px] text-xs" aria-label="Route">
            <SelectValue placeholder="Route" />
          </SelectTrigger>
          <SelectContent>
            {routes.map((route) => (
              <SelectItem key={route.id} value={route.id}>
                {route.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Select value={devicePresetId} onValueChange={onDevicePresetChange}>
        <SelectTrigger
          className="h-8 w-[150px] text-xs"
          aria-label="Device preset"
        >
          <SelectValue placeholder="Device" />
        </SelectTrigger>
        <SelectContent>
          {devicePresets.map((preset) => (
            <SelectItem key={preset.id} value={preset.id}>
              {preset.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

DevicePreviewToolbar.displayName = "DevicePreviewToolbar";