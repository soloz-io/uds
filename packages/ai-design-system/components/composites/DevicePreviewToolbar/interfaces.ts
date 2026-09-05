import type { DevicePreset } from "@/components/composites/DevicePreviewNode"

export interface DevicePreviewRoute {
  /** Route path, e.g. `/login`. */
  id: string
  /** Display label, e.g. `Login`. */
  label: string
}

export interface DevicePreviewToolbarProps {
  /** Routes available to view. Include an "All" entry (e.g.
   * `{ id: ALL_ROUTES_ROUTE_ID, label: 'All' }`) to let the user pick the
   * all-routes grid view from here — this component renders whatever it's
   * given, it has no built-in notion of an "all routes" id. */
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
