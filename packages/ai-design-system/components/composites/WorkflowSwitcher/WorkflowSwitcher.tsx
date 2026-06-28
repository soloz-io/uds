import * as React from "react"
import { Button } from "@/components/primitives/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/primitives/DropdownMenu"
import { Icon } from "@/components/primitives/Icon"

export interface WorkflowItem {
  id: string
  name: string
}

export interface WorkflowSwitcherProps {
  workflows: WorkflowItem[]
  currentWorkflowId?: string | null
  onSelectWorkflow: (id: string) => void
  className?: string
}

export const WorkflowSwitcher = React.memo<WorkflowSwitcherProps>(
  ({ workflows, currentWorkflowId, onSelectWorkflow, className }) => {
    const currentWorkflow = workflows.find((w) => w.id === currentWorkflowId)

    return (
      <div className={className}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="h-9 border hover:bg-black/5 dark:hover:bg-white/5"
              size="sm"
              title="Select workflow"
              variant="secondary"
            >
              <span className="truncate max-w-[150px]">
                {currentWorkflow?.name ?? "Select Workflow"}
              </span>
              <Icon name="chevron-down" size="xs" className="ml-1 opacity-50 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {workflows.map((w) => (
              <DropdownMenuItem
                className="flex items-center justify-between"
                key={w.id}
                onClick={() => onSelectWorkflow(w.id)}
              >
                <span className="truncate pr-4">{w.name}</span>
                {w.id === currentWorkflowId && <Icon name="check" size="sm" className="ml-auto shrink-0" />}
              </DropdownMenuItem>
            ))}
            {workflows.length === 0 && (
              <div className="px-2 py-1.5 text-sm text-muted-foreground text-center">
                No workflows found
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }
)

WorkflowSwitcher.displayName = "WorkflowSwitcher"
