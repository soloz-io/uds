import * as React from "react"
import { cn } from "@/lib/utils"
import type { ExpoAppPreviewProps } from "./interfaces"

/**
 * ExpoAppPreview Block
 *
 * A generic, full-bleed sandboxed iframe container for rendering an Expo /
 * React Native app compiled to web. It is intentionally unopinionated about
 * where the app is served from: `src` may point at a Metro dev server (live
 * reload during development) or a static export (published app).
 *
 * ## Security model
 * The default sandbox retains same-origin (`allow-same-origin`) per the
 * waypoint preview contract. As documented on the props, `allow-scripts`
 * combined with `allow-same-origin` is not a security boundary against the
 * embedded app; pass a sandbox without `allow-same-origin` for untrusted
 * content.
 *
 * ## Host <-> app messaging
 * `onMessage` forwards `message` events whose `event.source` is this iframe's
 * window. It is an optional passthrough of a browser primitive — standalone
 * previews render without it.
 */
export const ExpoAppPreview = React.memo<ExpoAppPreviewProps>(
  ({
    src,
    title = "App preview",
    sandbox = "allow-scripts allow-same-origin allow-forms allow-popups",
    allow,
    loading = false,
    loadingLabel = "Loading app…",
    isEmpty = false,
    emptyLabel = "No preview available",
    error = null,
    errorLabel = "Preview unavailable",
    onLoad,
    onError,
    onMessage,
    registerIframe,
    className,
    iframeClassName,
    ...props
  }) => {
    const iframeRef = React.useRef<HTMLIFrameElement>(null)
    const onMessageRef = React.useRef(onMessage)
    onMessageRef.current = onMessage

    React.useEffect(() => {
      if (!registerIframe) return undefined
      registerIframe(iframeRef.current)
      return () => registerIframe(null)
    }, [registerIframe])

    React.useEffect(() => {
      if (!onMessageRef.current) return undefined
      const handler = (event: MessageEvent): void => {
        if (event.source !== iframeRef.current?.contentWindow) return
        onMessageRef.current?.(event)
      }
      window.addEventListener("message", handler)
      return () => window.removeEventListener("message", handler)
    }, [])

    return (
      <div
        className={cn(
          "relative h-full w-full min-h-0 overflow-hidden bg-background",
          className,
        )}
        {...props}
      >
        <iframe
          ref={iframeRef}
          src={src}
          title={title}
          sandbox={sandbox}
          allow={allow}
          onLoad={onLoad}
          onError={onError}
          className={cn("h-full w-full border-0", iframeClassName)}
        />

        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/80">
            <div
              className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary"
              role="status"
              aria-label={loadingLabel}
            />
            <span className="text-sm text-muted-foreground">{loadingLabel}</span>
          </div>
        )}

        {!loading && isEmpty && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-background/80">
            <span className="text-sm font-medium text-foreground">{emptyLabel}</span>
          </div>
        )}

        {!loading && !isEmpty && error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-background/80">
            <span className="text-sm font-medium text-destructive">{errorLabel}</span>
            <span className="max-w-md text-center text-sm text-muted-foreground">{error}</span>
          </div>
        )}
      </div>
    )
  },
)

ExpoAppPreview.displayName = "ExpoAppPreview"