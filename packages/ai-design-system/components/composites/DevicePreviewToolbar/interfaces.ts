import type { DevicePreset } from "@/components/composites/DevicePreviewNode"

/**
 * View modes for the device-preview canvas.
 *
 * - `play` — run the current route fullscreen-ish (single device, no chrome)
 * - `single` — single device showing one `?route=` screen
 * - `interactive` — single device, pointer events reach the app (tap-through)
 * - `grid` — all routes side-by-side, same app src with `?route=` per device
 */
export type DevicePreviewViewMode = "play" | "single" | "interactive" | "grid";

export interface DevicePreviewRoute {
  /** Route path, e.g. `/login`. */
  id: string
  /** Display label, e.g. `Login`. */
  label: string
}

export interface DevicePreviewToolbarProps {
  /** Active view mode. */
  viewMode: DevicePreviewViewMode
  /** Called when the user switches view mode. */
  onViewModeChange?: (mode: DevicePreviewViewMode) => void
  /** Routes available for the single/grid modes. */
  routes?: DevicePreviewRoute[]
  /** Active route id. */
  activeRoute?: string
  /** Called when the user selects a route. */
  onRouteChange?: (routeId: string) => void
  /** Device presets to offer. Defaults to the curated design-system table. */
  devicePresets?: DevicePreset[]
  /** Active device preset id. */
  devicePresetId?: string
  /** Called when the user changes the device preset. */
  onDevicePresetChange?: (presetId: string) => void
  className?: string
}