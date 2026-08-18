import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ExpoAppPreview } from './ExpoAppPreview'

const HARNESS = 'http://localhost:4173/expo-preview'

function PreviewDemo({
  src,
  args,
}: {
  src: string
  args?: Partial<React.ComponentProps<typeof ExpoAppPreview>>
}) {
  const [loaded, setLoaded] = React.useState(false)
  const [lastMessage, setLastMessage] = React.useState<string | null>(null)
  const [messageCount, setMessageCount] = React.useState(0)

  return (
    <div className="flex h-screen flex-col gap-2 p-4">
      <div className="h-full min-h-0">
        <ExpoAppPreview
          src={src}
          onLoad={() => setLoaded(true)}
          onMessage={(event) => {
            const data = event.data as { type?: string } | null
            setLastMessage(data?.type ?? 'unknown')
            setMessageCount((count) => count + 1)
          }}
          {...args}
        />
      </div>
      <div className="flex items-center justify-between rounded-md border bg-muted px-3 py-1.5 text-xs text-muted-foreground">
        <span>
          {loaded ? 'iframe loaded' : 'loading…'} · {src}
        </span>
        <span>
          host messages: {messageCount}
          {lastMessage ? ` · last: ${lastMessage}` : ''}
        </span>
      </div>
    </div>
  )
}

/**
 * ExpoAppPreview Block Stories
 *
 * Renders an Expo / React Native app compiled to web inside a full-bleed,
 * sandboxed iframe. The same block serves both preview modes:
 *
 * - **Dev (live reload):** `src` points at the waypoint preview route, which
 *   the POC harness proxies to the app's Metro dev server. Editing the app
 *   source hot-reloads the iframe in place (Fast Refresh over the tunneled
 *   WebSocket) — no host page reload.
 * - **Published:** `src` points at the same route serving a static
 *   `expo export` from the app's directory, including assets and SPA fallback.
 *
 * ## Requirements
 * These stories load real apps and require the POC stack to be running:
 * `cd waypoint/scratch-pad/expo-preview-app && npm run start` (Metro dev
 * server) and `cd waypoint/scratch-pad/preview-harness && npm start` (ADR-033
 * route harness on :4173).
 *
 * ## Host <-> app messaging
 * The demo app posts `expo-app:ready` / `expo-app:action` messages to the
 * host; they surface via `onMessage` in the footer below the preview.
 */
/**
 * Dev-mode story with a live-reload toolbar.
 *
 * The button calls the POC harness's dev-only `toggle-subtitle` endpoint,
 * which edits the demo app source (login subtitle). Metro picks up the change
 * and hot-reloads the iframe over the tunneled Fast Refresh WebSocket — no
 * reload of the story page. The counter updates from `expo-app:reloaded`
 * messages the app posts to the host after each applied update, and the same
 * count is visible inside the app (green "hot reloads applied" badge).
 */
function LiveReloadDemo({ src }: { src: string }) {
  const [loaded, setLoaded] = React.useState(false)
  const [hmrConnected, setHmrConnected] = React.useState(false)
  const [reloads, setReloads] = React.useState(0)
  const [toggling, setToggling] = React.useState(false)
  const [subtitle, setSubtitle] = React.useState<string | null>(null)

  const toggleSubtitle = async () => {
    setToggling(true)
    try {
      const res = await fetch(`${HARNESS}/demo-app/dev/toggle-subtitle`, { method: 'POST' })
      const data = (await res.json()) as { subtitle?: string; error?: string }
      if (data.error) setSubtitle(`error: ${data.error}`)
      else setSubtitle(data.subtitle ?? '')
    } catch (err) {
      setSubtitle(`error: ${String(err)}`)
    } finally {
      setToggling(false)
    }
  }

  return (
    <div className="flex h-screen flex-col gap-2 p-4">
      <div className="flex items-center justify-between gap-3 rounded-md border bg-muted px-3 py-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={toggling}
            onClick={toggleSubtitle}
            className="rounded border border-border bg-background px-2.5 py-1 font-medium text-foreground shadow-sm hover:bg-accent disabled:opacity-50"
          >
            {toggling ? 'Editing source…' : 'Edit app source (toggle subtitle)'}
          </button>
          <span>
            live reloads applied: <b className="tabular-nums text-foreground">{reloads}</b>
            {subtitle ? ` · subtitle: ${subtitle}` : ''}
          </span>
        </div>
        <span>
          {hmrConnected ? 'HMR connected (live)' : loaded ? 'iframe loaded…' : 'loading…'}
        </span>
      </div>
      <div className="h-full min-h-0">
        <ExpoAppPreview
          src={src}
          onLoad={() => setLoaded(true)}
          onMessage={(event) => {
            const data = event.data as { type?: string; count?: number } | null
            if (data?.type === 'expo-app:hmr-connected') {
              setHmrConnected(true)
            } else if (data?.type === 'expo-app:reloaded') {
              setReloads(data.count ?? ((reloads) => reloads + 1))
            }
          }}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Click the button to make a real edit to the app source; the change hot-reloads into the
        iframe (watch the in-app &quot;hot reloads applied&quot; badge and the counter above).
      </p>
    </div>
  )
}

const meta = {
  title: 'Blocks/ExpoAppPreview',
  component: ExpoAppPreview,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ExpoAppPreview>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Dev mode (live reload)
 *
 * Loads the native app through the harness dev route (proxy to the Metro dev
 * server). While the app is being developed, source edits hot-reload in this
 * iframe in real time. Use the "Edit app source" button to trigger a real
 * source edit from the browser and watch it hot-reload.
 */
export const DevLiveReload: Story = {
  render: () => <LiveReloadDemo src={`${HARNESS}/demo-app/`} />,
}

/**
 * Dev mode with app args
 *
 * The app reads `appId` / `name` query parameters and renders them in its UI —
 * the shape of per-app routing waypoint will use.
 */
export const WithAppArgs: Story = {
  render: () => (
    <PreviewDemo src={`${HARNESS}/demo-app/?appId=demo-app&name=Soloz%20Mobile`} />
  ),
}

/**
 * Published mode
 *
 * The same block, same route contract, but serving the static `expo export`
 * (relative assets under the `/expo-preview/:appId/` subpath).
 */
export const PublishedApp: Story = {
  render: () => <PreviewDemo src={`${HARNESS}/demo-published/`} />,
}

/**
 * Loading state
 *
 * Shows the loading overlay while a preview is being prepared.
 */
export const Loading: Story = {
  render: () => <PreviewDemo src={`${HARNESS}/demo-app/`} args={{ loading: true }} />,
}

/**
 * Empty state
 *
 * Shown when no build is deployed for the app.
 */
export const Empty: Story = {
  render: () => (
    <PreviewDemo
      src={`${HARNESS}/demo-app/`}
      args={{ isEmpty: true, emptyLabel: 'No preview yet — deploy the app to preview it here' }}
    />
  ),
}

/**
 * Error state
 *
 * Shown when the preview cannot be reached (e.g. dev server not running).
 */
export const Error: Story = {
  render: () => (
    <PreviewDemo
      src={`${HARNESS}/demo-app/`}
      args={{
        error:
          'The app dev server is not reachable on :8081. Start it with `npm run start` in the app project.',
      }}
    />
  ),
}