import * as React from 'react'
import { Button } from '@/components/primitives/Button'

/**
 * Props for the WorkspaceEmptyState composite component.
 */
export interface WorkspaceEmptyStateProps {
  /** Primary message shown to the user. Defaults to "This session's workspace is not running." */
  label?: string
  /** Callback to wake/start the workspace. When provided, a "Start workspace" button is rendered. */
  onWake?: () => void
  /** When true, the wake button shows a loading state ("Starting…"). */
  isWaking?: boolean
  /** Additional CSS classes applied to the root container. */
  className?: string
}

/**
 * WorkspaceEmptyState
 *
 * Composite shown when a session's workspace pod is stopped and there are no
 * documents to display. Renders a descriptive label and, when `onWake` is
 * provided, a button to restart the workspace.
 *
 * Features (e.g. TextEditor) use this composite so that no primitive (Button)
 * leaks into the feature layer or the public package API.
 *
 * @example
 * ```tsx
 * <WorkspaceEmptyState
 *   onWake={() => void wakeSandbox()}
 *   isWaking={waking}
 * />
 * ```
 */
export const WorkspaceEmptyState = React.memo<WorkspaceEmptyStateProps>(
  ({ label, onWake, isWaking, className }) => {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-3 h-full w-full${className ? ` ${className}` : ''}`}
      >
        <div className="text-muted-foreground text-sm">
          {label ?? "This session's workspace is not running."}
        </div>
        {onWake && (
          <Button
            variant="outline"
            size="sm"
            onClick={onWake}
            disabled={isWaking}
          >
            {isWaking ? 'Starting…' : 'Start workspace'}
          </Button>
        )}
      </div>
    )
  }
)

WorkspaceEmptyState.displayName = 'WorkspaceEmptyState'
