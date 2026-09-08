import type { Node } from "@xyflow/react"

/**
 * Device presets for the DevicePreviewNode.
 *
 * The design system ships a curated, hardcoded table (Expo exposes no
 * device-dimension catalog). Consumers may replace the list entirely —
 * e.g. hydrate it from a BFF in a later phase.
 */
export interface DevicePreset {
  id: string
  /** Human-readable label shown in the preset switcher. */
  label: string
  /** CSS px viewport width of the previewed device. */
  width: number
  /** CSS px viewport height of the previewed device. */
  height: number
  /** Use the responsive (resizable) preset for non-fixed sizes. */
  isResponsive?: boolean
}

/** Default curated device presets (Storybook/Chromatic-style hardcoded table). */
export const DEVICE_PRESETS: DevicePreset[] = [
  { id: "iphone-8-plus", label: "iPhone 8 Plus", width: 414, height: 736 },
  { id: "iphone-16-pro", label: "iPhone 16 Pro", width: 393, height: 852 },
  { id: "pixel-7", label: "Pixel 7", width: 412, height: 915 },
  { id: "ipad-mini", label: "iPad Mini", width: 744, height: 1133 },
  { id: "responsive", label: "Responsive", width: 420, height: 780, isResponsive: true },
]

export const DEFAULT_PRESET_ID = "iphone-16-pro"

export const getPreset = (presetId?: string): DevicePreset =>
  DEVICE_PRESETS.find((p) => p.id === presetId) ??
  DEVICE_PRESETS.find((p) => p.id === DEFAULT_PRESET_ID) ??
  DEVICE_PRESETS[0]

/** Payload emitted when the user requests a screenshot of the preview. */
export interface DeviceScreenshotRequest {
  /** Active route, when the node renders a specific screen. */
  route?: string
  /** The live iframe element to rasterize (html-to-image on the consumer side). */
  iframe: HTMLIFrameElement
}

export interface DevicePreviewActionPort {
  id: string;
  label?: string;
  top: number;
}

/**
 * Data contract for the `devicePreview` canvas node.
 *
 * The node owns no capture logic and no app-URL logic — `src` is supplied by
 * the consumer (e.g. waypoint) and the iframe element is exposed via
 * `registerIframe` for capture tooling to use.
 */
export interface DevicePreviewNodeData {
  type: "devicePreview"
  /** App URL rendered inside the device screen (dev server or static export). */
  src: string
  /** Active route (e.g. `/login`); shown as a badge and sent with screenshots. */
  route?: string
  /** App display name shown in the node header/footer (e.g. grid labels). */
  label?: string
  /** Current device preset id (see `DEVICE_PRESETS`). */
  presetId?: string
  /** Visual scale factor for compact canvas mode (e.g. 0.6). Defaults to 0.6 when hideControls is true, 1.0 otherwise. */
  scale?: number
  /** Workflow-agnostic status badge, kept for canvas-wide consistency. */
  status?: "idle" | "running" | "success" | "error"
  /** Called when the user changes the device preset. */
  onPresetChange?: (presetId: string) => void
  /** Called when the user clicks the screenshot button. */
  onTakeScreenshot?: (request: DeviceScreenshotRequest) => void
  /** Called when the user clicks the reload button. Defaults to remounting the iframe. */
  onReload?: () => void
  /** Receives the iframe element once mounted (null on unmount). */
  registerIframe?: (el: HTMLIFrameElement | null) => void
  /** Show the route badge overlay (e.g. all-routes grid mode). */
  showRouteBadge?: boolean
  /** Allow pointer events to reach the iframe (interactive mode). */
  interactive?: boolean
  /** Show a loading overlay while true (e.g. building). */
  loading?: boolean
  /** Show an empty-state overlay when true (e.g. no build deployed yet). */
  isEmpty?: boolean
  /** Show an error overlay with this message. */
  error?: string | null
  /** Dynamic action ports (DOM reflection) anchored to specific vertical offsets */
  actionPorts?: DevicePreviewActionPort[]
  /** Hide floating per-node controls (used on multi-screen workflow canvas) */
  hideControls?: boolean
  /**
   * Tells the live app running inside this iframe that it is one of several
   * simultaneously-mounted, fixed-route tiles (the canvas's "All routes"
   * grid), not the one interactive device. Appended to the iframe `src` as
   * `&frozen=1` — see `effectiveSrc` below. The app itself (not this
   * component) is what honors it: a real button press still fires the
   * navigation-trigger message (so the canvas edge still animates), but the
   * app suppresses the actual screen change, so the tile never drifts off
   * the route it's labeled with. `interactive` must be true alongside this
   * for the click to reach the button at all.
   */
  frozen?: boolean
  /**
   * Canvas-owned transition triggers, rendered as small overlay buttons
   * stacked at the bottom of the device screen. Unused by the device-
   * preview grid as of `frozen` above — a real in-app button, not a
   * synthetic one, is what drives that view's edge animation now. Left
   * in place as general capability for any other canvas that still wants
   * a click target independent of what's running inside the iframe.
   * Clicking one calls `onTrigger` directly; this component only renders
   * the buttons and forwards the click, the consumer decides what it does.
   */
  transitions?: Array<{ id: string; label: string; onTrigger: () => void }>
  [key: string]: unknown
}

export type DevicePreviewNode = Node<DevicePreviewNodeData, "devicePreview">