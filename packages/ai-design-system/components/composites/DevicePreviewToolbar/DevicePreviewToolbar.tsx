"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/Select";
import { cn } from "@/lib/utils";
import { DEVICE_PRESETS } from "@/components/composites/DevicePreviewNode";
import { type DevicePreviewToolbarProps } from "./interfaces";

/**
 * DevicePreviewToolbar Composite
 *
 * Center header for the device-preview canvas. Route selector and a
 * device-preset switcher, rendered in the canvas `topCenter` panel slot.
 *
 * No mode toggle: this used to offer up to four view-mode icons (`Play`,
 * `Single Route`, `Interactive`, `All Routes`). All four were removed —
 * `play`/`single` rendered identically in `buildPreviewGraph` (neither
 * branch ever distinguished them), `grid` ("All Routes View") was really a
 * choice of which route(s) to show rather than a way of viewing one
 * device (now the "All" entry in the Route select, e.g.
 * `ALL_ROUTES_ROUTE_ID` in useDevicePreviewCanvas.ts), and the last
 * remaining icon ("Single Route View") was already fully redundant with
 * picking a specific route from that same select — the device preview is
 * always interactive now, there is no non-interactive mode left to choose.
 *
 * All controls are optional on the callback side — a consumer may render only
 * the route/preset selectors, or neither.
 *
 * ## Accessibility
 * - Selects expose accessible labels.
 */
export function DevicePreviewToolbar({
  routes,
  activeRoute,
  onRouteChange,
  devicePresets = DEVICE_PRESETS,
  devicePresetId,
  onDevicePresetChange,
  className,
}: DevicePreviewToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-md border bg-secondary/80 px-1.5 py-1 shadow-md backdrop-blur",
        className,
      )}
      data-testid="device-preview-toolbar"
    >
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
