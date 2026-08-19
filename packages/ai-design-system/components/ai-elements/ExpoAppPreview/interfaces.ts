import type * as React from "react"

/**
 * Props for the ExpoAppPreview Block.
 *
 * A generic, dependency-free container that renders a full-bleed sandboxed
 * iframe pointing at an Expo/React Native app compiled to web (dev server or
 * static export). It owns no knowledge of how the `src` is produced or served —
 * consumers (e.g. waypoint) compute the URL and pass it in.
 */
export interface ExpoAppPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Absolute or same-origin URL of the app to render in the iframe. */
  src: string
  /** Accessible name for the iframe (default: "App preview"). */
  title?: string
  /**
   * iframe `sandbox` attribute. Defaults to ADR-033's contract:
   * `allow-scripts allow-same-origin allow-forms allow-popups`.
   *
   * Security note: `allow-scripts` combined with `allow-same-origin` lets the
   * embedded app remove its own sandbox restrictions, so this is an isolation
   * boundary for reliable rendering, not a security boundary against the
   * embedded app. Omit `allow-same-origin` when the embedded app is untrusted.
   */
  sandbox?: string
  /** iframe `allow` attribute (e.g. feature policy overrides). Optional. */
  allow?: string
  /** Show a loading overlay (spinner + label) while true. */
  loading?: boolean
  /** Label shown with the spinner while loading. */
  loadingLabel?: string
  /** Show an empty-state overlay when true (e.g. no build deployed yet). */
  isEmpty?: boolean
  /** Label shown in the empty state. */
  emptyLabel?: string
  /** When truthy, show an error overlay with this message. */
  error?: string | null
  /** Label shown above the error message. */
  errorLabel?: string
  /** Fired when the iframe finishes loading. */
  onLoad?: () => void
  /** Fired when the iframe errors. */
  onError?: () => void
  /**
   * Receives the iframe element once mounted (and `null` on unmount).
   * Lets consumers capture a screenshot (e.g. html-to-image) without the
   * block owning capture tooling.
   */
  registerIframe?: (el: HTMLIFrameElement | null) => void
  /**
   * Receives host-side `message` events originating from the iframe window
   * (browser postMessage primitive; optional passthrough — not required for
   * standalone rendering).
   */
  onMessage?: (event: MessageEvent) => void
  /** Extra classes for the iframe element. */
  iframeClassName?: string
}