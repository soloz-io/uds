import * as React from 'react'
import { Button } from '@/components/primitives/Button'
import { cn } from '@/lib/utils'

/**
 * Lifecycle status of the workspace/sandbox.
 */
export type WorkspaceWakeStatus = 'idle' | 'waking' | 'starting' | 'error'

/**
 * Props for the WorkspaceEmptyState / SandboxWakePane composite component.
 */
export interface WorkspaceEmptyStateProps {
  /**
   * Current status of the workspace/sandbox.
   * When provided, status messages and button states follow the wake lifecycle.
   */
  status?: WorkspaceWakeStatus
  /**
   * Detail message or step when starting (e.g. 'installing' dependencies or 'ready' serving).
   */
  detail?: 'ready' | 'installing' | 'not-ready' | 'supervision-failed' | 'unreachable' | string | null
  /**
   * Error message displayed when status is 'error'.
   */
  error?: string | null
  /** Primary message shown to the user. Overrides default message for the current status. */
  label?: string
  /** Callback to wake/start the workspace. When provided, a wake/start button is rendered. */
  onWake?: () => void
  /** When true, the wake button shows a loading state ("Starting…"). (Backward compatibility) */
  isWaking?: boolean
  /** Text for wake button when in idle state. Defaults to "Start workspace". */
  wakeButtonText?: string
  /** Button style variant. Defaults to 'amber' when `status` is provided, otherwise 'outline'. */
  buttonVariant?: 'amber' | 'outline' | 'default'
  /** Additional CSS classes applied to the root container. */
  className?: string
  /** Label for secondary or general action button */
  actionLabel?: string
  /** Callback for action button */
  onAction?: () => void
  /** Additional CSS classes for action button */
  actionClassName?: string
}

/**
 * WorkspaceEmptyState / SandboxWakePane
 *
 * Composite shown when a session's workspace pod is stopped, waking, or starting.
 * Renders a descriptive state message and, when `onWake` is provided, a button to restart the workspace.
 *
 * Features (e.g. TextEditor, AppBuilderPage, ChannelScreen) use this composite so that
 * sandbox lifecycle UI is unified across Waypoint and downstream consumers.
 *
 * @example
 * ```tsx
 * <WorkspaceEmptyState
 *   status="idle"
 *   onWake={() => void wakeSandbox()}
 * />
 * ```
 */
export const WorkspaceEmptyState = React.memo<WorkspaceEmptyStateProps>(
  ({
    status,
    detail,
    error,
    label,
    onWake,
    isWaking,
    wakeButtonText,
    buttonVariant,
    actionLabel,
    onAction,
    actionClassName,
    className,
  }) => {
    const effectiveStatus: WorkspaceWakeStatus =
      status ?? (isWaking ? 'starting' : 'idle')
    const canWake = effectiveStatus === 'idle' || effectiveStatus === 'error'

    let defaultMessage: string
    if (effectiveStatus === 'error') {
      defaultMessage = error || 'Could not start the workspace'
    } else if (effectiveStatus === 'waking') {
      defaultMessage = 'Starting the process…'
    } else if (effectiveStatus === 'starting') {
      if (detail === 'installing') {
        defaultMessage =
          'Installing dependencies — this can take a minute. The preview appears when it finishes.'
      } else if (detail === 'ready') {
        defaultMessage = 'Preview is serving — loading it now…'
      } else {
        defaultMessage =
          'Sandbox is up but not serving yet. The preview appears when it is.'
      }
    } else if (status === 'idle') {
      defaultMessage =
        'The server is not running. Waking it up does not message the agent.'
    } else {
      defaultMessage = "This session's workspace is not running."
    }

    const statusMessage = label ?? defaultMessage

    let buttonLabel = wakeButtonText || 'Start workspace'
    if (effectiveStatus === 'waking') {
      buttonLabel = 'Waking up…'
    } else if (effectiveStatus === 'starting') {
      buttonLabel = 'Starting…'
    } else if (effectiveStatus === 'error') {
      buttonLabel = 'Try again'
    }

    const variant = buttonVariant ?? (status ? 'amber' : 'outline')

    return (
      <div
        className={cn(
          'flex h-full w-full flex-col items-center justify-center gap-3',
          className,
        )}
      >
        {onWake && (
          variant === 'amber' ? (
            <button
              type="button"
              disabled={!canWake}
              className="h-9 rounded-md border border-[#4e2f06] bg-[#4a2e06] text-[#f2c98d] hover:bg-[#603b08] disabled:opacity-60 px-4 text-sm font-medium transition-colors"
              onClick={canWake ? onWake : undefined}
            >
              {buttonLabel}
            </button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={canWake ? onWake : undefined}
              disabled={!canWake}
            >
              {buttonLabel}
            </Button>
          )
        )}

        <span
          className={cn(
            'text-xs',
            effectiveStatus === 'error'
              ? 'text-destructive'
              : 'text-muted-foreground',
          )}
        >
          {statusMessage}
        </span>

        {onAction && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAction}
            className={actionClassName}
          >
            {actionLabel ?? 'Browse files'}
          </Button>
        )}
      </div>
    )
  },
)

WorkspaceEmptyState.displayName = 'WorkspaceEmptyState'

/**
 * SandboxWakePane is an alias for WorkspaceEmptyState, providing a semantic name
 * for preview canvases and sandbox wake areas.
 */
export const SandboxWakePane = WorkspaceEmptyState
export type SandboxWakePaneProps = WorkspaceEmptyStateProps
