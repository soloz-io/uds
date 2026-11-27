import * as React from "react"
import type { EvalExperiment, EvalImprovement, EvalImprovementTarget, UseEvalDashboardFeatureReturn } from "./useEvalDashboardFeature.d"
import { nextExperiment } from "@/components/blocks/EvalImprovementPanel"
import { evalDashboardFeatureStateMock, experimentSteps, outcomeOf, playedPullRequest, playedScore, proposedTargets } from "./EvalDashboardFeature.mocks"

/** How long each automatic step of the played run takes, in milliseconds. */
const GRADING_MS = 2000
const PROPOSING_MS = 2500
const STEP_MS = 1500

const CONNECTIONS_URL = "/apps/demo/settings/connections"

const start = (gitConnected: boolean): EvalImprovement => ({
  stage: "grading",
  review: null,
  targets: [],
  git: { connected: gitConnected, account: gitConnected ? "acme" : null, connectionsUrl: CONNECTIONS_URL },
})

const OUTCOME_TEXT = { improved: "Improved", unchanged: "Unchanged", degraded: "Degraded" } as const

const hex = (seed: number) => ((seed * 2654435761) >>> 0).toString(16).padStart(8, "0").slice(0, 7)

/** One tick of a running experiment: its next step starts, or the running one finishes. */
function advance(target: EvalImprovementTarget, e: EvalExperiment): EvalExperiment {
  const steps = e.steps.map((s) => ({ ...s }))
  const running = steps.find((s) => s.status === "running")
  if (!running) {
    const next = steps.find((s) => s.status === "queued")
    if (!next) return e
    next.status = "running"
    next.detail = next.id === "golden" ? "0 of 24 items" : null
    return { ...e, steps }
  }
  if (running.id === "golden" && !running.detail?.startsWith("24")) {
    running.detail = running.detail?.startsWith("0 ") ? "12 of 24 items" : "24 of 24 items"
    return { ...e, steps }
  }
  const seed = target.id.length * 31 + e.number
  running.status = "completed"
  if (running.id === "commit") running.detail = `commit ${hex(seed)}`
  if (running.id === "build") running.detail = `pk-…@sha256:${hex(seed + 7).slice(0, 4)}`
  if (running.id === "golden") {
    const score = playedScore(target, e.changes)
    const outcome = outcomeOf(score)
    running.detail = `main ${score.main.passed}/${score.main.total} · pull request ${score.pullRequest.passed}/${score.pullRequest.total} · ${OUTCOME_TEXT[outcome]}`
    if (outcome === "degraded") running.status = "failed"
    return { ...e, steps, status: "done", outcome, score }
  }
  return { ...e, steps }
}

/** The stage the run is at, from its targets. */
function stageOf(improvement: EvalImprovement): EvalImprovement["stage"] {
  const { targets } = improvement
  if (!targets.length) return improvement.stage
  if (targets.some((t) => t.experiments.some((e) => e.status === "running"))) return "testing"
  if (targets.some((t) => t.changes.some((c) => c.decision === "pending") || nextExperiment(t).unique)) return "proposals"
  if (targets.some((t) => t.experiments.some((e) => e.id === t.head && e.outcome === "improved"))) return "approval"
  return "done"
}

const withStage = (p: EvalImprovement): EvalImprovement => ({ ...p, stage: stageOf(p) })

/**
 * The Evals page with the improvement run played (ADR-063 §7, §8): grading;
 * your review; the improver proposing changes for each target pack; your
 * approval or rejection of each (changeable any time); per pack, "Start
 * experiment N" on an approved group not run before, its changes committed to
 * its pull request, whose head (the future pack) runs all the golden evals
 * against main in one experiment; passing pull
 * requests to review and merge on GitHub. A rejected proposal can be
 * approved later and tested in the next experiment. ▶ plays it again.
 */
export function useEvalDashboardFeatureMock(options: { gitConnected?: boolean } = {}): UseEvalDashboardFeatureReturn {
  const gitConnected = options.gitConnected ?? true
  const [selectedItemId, setSelectedItemId] = React.useState<string | null>(evalDashboardFeatureStateMock.inbox.selectedItemId)
  const [improvement, setImprovement] = React.useState<EvalImprovement>(() => start(gitConnected))
  const [run, setRun] = React.useState(0)

  // Grading ends on its own, and your review opens.
  React.useEffect(() => {
    if (improvement.stage !== "grading") return
    const timer = setTimeout(() => setImprovement((p) => ({ ...p, stage: "review", review: { labelled: 0, graded: 41 } })), GRADING_MS)
    return () => clearTimeout(timer)
  }, [improvement.stage, run])

  // The improver proposes its changes.
  React.useEffect(() => {
    if (improvement.stage !== "proposing") return
    const timer = setTimeout(() => setImprovement((p) => ({ ...p, stage: "proposals", targets: proposedTargets() })), PROPOSING_MS)
    return () => clearTimeout(timer)
  }, [improvement.stage])

  // Running experiments advance a step at a time.
  const testing = improvement.targets.some((t) => t.experiments.some((e) => e.status === "running"))
  React.useEffect(() => {
    if (!testing) return
    const timer = setInterval(() => {
      setImprovement((p) =>
        withStage({
          ...p,
          targets: p.targets.map((t) => {
            const experiments = t.experiments.map((e) => (e.status === "running" ? advance(t, e) : e))
            const opened = experiments.some((e) => e.steps[0].status === "completed")
            const pr = playedPullRequest[t.id]
            return { ...t, experiments, pullRequest: t.pullRequest ?? (opened ? { number: pr, url: `https://github.com/acme/${t.id}/pull/${pr}` } : null) }
          }),
        }),
      )
    }, STEP_MS)
    return () => clearInterval(timer)
  }, [testing])

  const onLabelVerdict = React.useCallback(() => {
    setImprovement((p) => (p.stage === "review" && p.review ? { ...p, review: { ...p.review, labelled: p.review.labelled + 1 } } : p))
  }, [])

  const onFinishReview = React.useCallback(() => {
    // The same process for every pack, labels or not: the improver proposes what the evidence supports.
    setImprovement((p) => (p.stage !== "review" ? p : { ...p, stage: "proposing" }))
  }, [])

  const decide = React.useCallback((id: string, decision: "approved" | "rejected") => {
    setImprovement((p) =>
      withStage({
        ...p,
        targets: p.targets.map((t) => ({ ...t, changes: t.changes.map((c) => (c.id === id ? { ...c, decision } : c)) })),
      }),
    )
  }, [])

  const onTestApproved = React.useCallback((targetId: string) => {
    setImprovement((p) => {
      // Without GitHub nothing can be committed or built.
      if (!p.git.connected) return p
      return withStage({
        ...p,
        targets: p.targets.map((t) => {
          if (t.id !== targetId || t.experiments.some((e) => e.status === "running")) return t
          const next = nextExperiment(t)
          if (!next.unique) return t
          const experiment: EvalExperiment = {
            id: `${t.id}-e${next.number}`,
            number: next.number,
            startedAt: new Date().toISOString(),
            changes: next.changes,
            status: "running",
            steps: experimentSteps(t.pullRequest?.number ?? null),
          }
          return { ...t, head: experiment.id, experiments: [...t.experiments, experiment] }
        }),
      })
    })
  }, [])

  // The pull request goes back to the experiment's group (a commit of its recorded tree); its result is reused.
  const onUseExperiment = React.useCallback((targetId: string, experimentId: string) => {
    setImprovement((p) =>
      withStage({
        ...p,
        targets: p.targets.map((t) => {
          const e = t.experiments.find((x) => x.id === experimentId)
          if (t.id !== targetId || !e || e.status !== "done" || t.experiments.some((x) => x.status === "running")) return t
          return { ...t, head: e.id, changes: t.changes.map((c) => ({ ...c, decision: e.changes.includes(c.number) ? "approved" : "rejected" })) }
        }),
      }),
    )
  }, [])

  const onTriggerEvaluation = React.useCallback(() => {
    setImprovement(start(gitConnected))
    setRun((r) => r + 1)
  }, [gitConnected])

  return {
    ...evalDashboardFeatureStateMock,
    inbox: {
      ...evalDashboardFeatureStateMock.inbox,
      items: evalDashboardFeatureStateMock.inbox.items.map((item) =>
        item.id === evalDashboardFeatureStateMock.inbox.selectedItemId ? { ...item, stage: improvement.stage } : item,
      ),
      selectedItemId,
      onSelectItem: setSelectedItemId,
    },
    data: evalDashboardFeatureStateMock.data ? { ...evalDashboardFeatureStateMock.data, improvement } : null,
    actionHandlers: {
      ...evalDashboardFeatureStateMock.actionHandlers,
      onTriggerEvaluation,
      onLabelVerdict,
      onFinishReview,
      onApproveChange: (id) => decide(id, "approved"),
      onRejectChange: (id) => decide(id, "rejected"),
      onTestApproved,
      onUseExperiment,
      onOpenPullRequest: (url) => window.open(url, "_blank", "noopener"),
      onOpenConnections: (url) => window.open(url, "_blank", "noopener"),
    },
  }
}
