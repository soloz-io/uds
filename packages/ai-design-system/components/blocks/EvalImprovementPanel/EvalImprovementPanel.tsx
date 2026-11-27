import * as React from "react"
import { Badge } from "@/components/primitives/Badge"
import { Button } from "@/components/primitives/Button"
import { Icon } from "@/components/primitives/Icon"
import { CandidateReview } from "@/components/composites/CandidateReview"
import { cn } from "@/lib/utils"
import type { EvalImprovementPanelProps, EvalImprovementTarget, EvalProposedChange } from "./interfaces"

const TARGET_LABEL: Record<string, string> = { judge: "Judge", builder: "Builder" }

const DECISION_TEXT = { pending: "Awaiting your decision" }

const sameGroup = (a: number[], b: number[]) => a.length === b.length && a.every((n) => b.includes(n))

/**
 * The pack's next experiment: its number, the approved group it would run on,
 * and whether that group is new. An experiment starts only on an approved
 * group no earlier experiment of the pack ran on.
 */
export function nextExperiment(target: EvalImprovementTarget): { number: number; changes: number[]; unique: boolean } {
  const changes = target.changes.filter((c) => c.decision === "approved").map((c) => c.number).sort((a, b) => a - b)
  return {
    number: target.experiments.length + 1,
    changes,
    unique: changes.length > 0 && !target.experiments.some((e) => sameGroup(e.changes, changes)),
  }
}

function ProposalItem({
  change,
  open,
  onToggle,
  onApprove,
  onReject,
}: {
  change: EvalProposedChange
  open: boolean
  onToggle: () => void
  onApprove?: () => void
  onReject?: () => void
}) {
  return (
    <div className={cn("rounded-lg border", change.decision === "rejected" && "opacity-70")}>
      <div className="flex items-center gap-3 px-3 py-2">
        <button type="button" className="flex min-w-0 flex-1 items-center gap-2 text-left" onClick={onToggle} aria-expanded={open}>
          <Icon name={open ? "chevron-down" : "chevron-right"} className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate text-sm">
            #{change.number} {change.title}
          </span>
          <Badge variant="outline" className="shrink-0 text-[10px]">
            {change.kind}
          </Badge>
        </button>
        {change.decision === "pending" && <span className="shrink-0 text-xs text-muted-foreground">{DECISION_TEXT.pending}</span>}
        <div className="flex shrink-0 gap-1">
            {onApprove && (
              <Button size="sm" variant={change.decision === "approved" ? "default" : "outline"} className="h-7 text-xs" onClick={onApprove} aria-pressed={change.decision === "approved"}>
                Approve
              </Button>
            )}
            {onReject && (
              <Button size="sm" variant={change.decision === "rejected" ? "secondary" : "outline"} className="h-7 text-xs" onClick={onReject} aria-pressed={change.decision === "rejected"}>
                Reject
              </Button>
            )}
        </div>
      </div>
      {open && (
        <div className="border-t p-3 text-xs">
          <CandidateReview
            pack={change.location}
            agent={`#${change.number} ${change.title}`}
            status={change.decision === "approved" ? "accepted" : change.decision === "rejected" ? "rejected" : "draft"}
            requirements={change.location}
            rationale={change.diagnosis}
            diff={change.diff}
          />
        </div>
      )}
    </div>
  )
}

/**
 * The Improvement view (ADR-063 §7, §8): one chip per target pack, as the
 * Outputs view has one per agent. A pack shows every proposal to approve or
 * reject, and its pull request. "Start experiment N" brings the pull request
 * in line with the approved group and runs all the pack's golden evals on its
 * head (the pack as it would be once merged) against main; it is enabled only
 * for an approved group no earlier experiment ran on. Experiments themselves
 * are shown by the page, in its experiments bar.
 */
export function EvalImprovementPanel({
  targets,
  gitConnected,
  selectedTargetId,
  onSelectTarget,
  onApproveChange,
  onRejectChange,
  onTestApproved,
  onOpenPullRequest,
  className,
}: EvalImprovementPanelProps) {
  const [ownTargetId, setOwnTargetId] = React.useState<string | null>(null)
  const [openChangeId, setOpenChangeId] = React.useState<string | null>(null)
  const targetId = selectedTargetId ?? ownTargetId
  const target = targets.find((t) => t.id === targetId) ?? targets[0]
  if (!target) return <div className="p-4 text-sm text-muted-foreground">The improver hasn&apos;t proposed any change yet.</div>

  const next = nextExperiment(target)
  const running = target.experiments.some((e) => e.status === "running")
  const pending = target.changes.filter((c) => c.decision === "pending").length
  const select = (id: string) => {
    setOwnTargetId(id)
    onSelectTarget?.(id)
  }

  return (
    <div className={cn("grid gap-4", className)}>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Target pack">
        {targets.map((t) => {
          const waiting = t.changes.filter((c) => c.decision === "pending").length
          return (
            <Button key={t.id} size="sm" variant={t.id === target.id ? "default" : "outline"} className="h-7 text-xs" onClick={() => select(t.id)}>
              {TARGET_LABEL[t.kind]} · {t.id}
              {waiting > 0 && <span className="ml-1 opacity-70">({waiting})</span>}
            </Button>
          )
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {target.changes.length} proposal{target.changes.length === 1 ? "" : "s"}
          {pending > 0 ? `, ${pending} awaiting your decision` : ""}
        </span>
        <div className="ml-auto flex gap-2">
          {target.pullRequest && onOpenPullRequest && (
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => onOpenPullRequest(target.pullRequest!.url)}>
              <Icon name="external-link" className="mr-1 h-3 w-3" />
              Pull request #{target.pullRequest.number}
            </Button>
          )}
          {onTestApproved && (
            <Button
              size="sm"
              className="h-7 text-xs"
              disabled={!gitConnected || running || !next.unique}
              title={
                !gitConnected
                  ? "Connect GitHub to start an experiment"
                  : running
                    ? "An experiment is running"
                    : next.changes.length === 0
                      ? "Approve a proposal to start an experiment"
                      : !next.unique
                        ? "An experiment already ran on this approved group"
                        : `Runs all golden evals on the pull request with ${next.changes.length} change${next.changes.length === 1 ? "" : "s"}`
              }
              onClick={() => onTestApproved(target.id)}
            >
              Start experiment {next.number}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-2">
        {target.changes.map((c) => (
          <ProposalItem
            key={c.id}
            change={c}
            open={openChangeId === c.id}
            onToggle={() => setOpenChangeId(openChangeId === c.id ? null : c.id)}
            onApprove={onApproveChange ? () => c.decision !== "approved" && onApproveChange(c.id) : undefined}
            onReject={onRejectChange ? () => c.decision !== "rejected" && onRejectChange(c.id) : undefined}
          />
        ))}
      </div>

    </div>
  )
}
