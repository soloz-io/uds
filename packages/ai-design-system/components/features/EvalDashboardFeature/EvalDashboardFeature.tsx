import * as React from "react"
import { InboxPanel } from "@/components/blocks/InboxPanel"
import { SectionLayout } from "@/components/blocks/SectionLayout"
import { DashboardChart } from "@/components/composites/DashboardChart"
import { EvalSessionDetailsPanel, EvalTriggerButton } from "@/components/blocks/EvalSessionDetailsPanel"
import { TurnTimeline } from "@/components/blocks/TurnTimeline"
import { ComparisonReport } from "@/components/blocks/ComparisonReport"
import { CandidateReview } from "@/components/composites/CandidateReview"
import { EnhancedDataTable } from "@/components/composites/DataTable"
import { AnnouncementBanner } from "@/components/composites/AnnouncementBanner"
import { EvalImprovementPanel, nextExperiment } from "@/components/blocks/EvalImprovementPanel"
import { TaskQueue } from "@/components/composites/TaskQueue"
import { DYNAMIC_TABLE_SCHEMA_VERSION, dynamicTableSchema } from "ui-schema-contracts"
import type { DashboardRow } from "@/components/composites/DataTable"
import { IconButton } from "@/components/composites/IconButton"
import type { FileDownloadResult } from "@/components/composites/FileTreeExplorer"
import { cn } from "@/lib/utils"
import type {
  EvalDashboardFeatureInboxState,
  EvalDashboardFeatureData,
  EvalDashboardFeatureActionHandlers,
} from "./useEvalDashboardFeature.d"


const tableSchema = (columns: Array<Record<string, unknown>>, emptyMessage: string) =>
  dynamicTableSchema.parse({
    schemaVersion: DYNAMIC_TABLE_SCHEMA_VERSION,
    rowKey: "id",
    enableRowSelection: false,
    enablePagination: true,
    emptyMessage,
    columns,
  })

const FEEDBACK_TABLE = tableSchema(
  [
    { key: "rating", label: "Rating", renderType: "badge", width: 110 },
    { key: "details", label: "What they said" },
    { key: "reply", label: "On the reply" },
    { key: "agent", label: "Agent", width: 160 },
    { key: "turn", label: "Turn", width: 110 },
    { key: "at", label: "When", renderType: "datetime", width: 180 },
  ],
  "No feedback on this session's replies.",
)
// One reward per graded turn, as Harbor's rollouts table shows one per rollout (rollout-columns.tsx).
const REWARDS_TABLE = tableSchema(
  [
    { key: "turn", label: "Turn", width: 110 },
    { key: "agent", label: "Agent", width: 180 },
    { key: "model", label: "Model", width: 150 },
    { key: "reward", label: "Reward", width: 100, align: "right" },
    { key: "definition", label: "Reward definition", width: 170 },
    { key: "breakdown", label: "Breakdown" },
    { key: "at", label: "Graded", renderType: "datetime", width: 180 },
  ],
  "No graded turn has a reward yet.",
)

/** Views the feature composes itself; the others are EvalSessionDetailsPanel's. */
const OWN_VIEWS = new Set(["turns", "feedback", "rewards", "improvement"])

/** What the inbox says while an evaluation's improvement run is under way (ADR-063 §7). */
const STAGE_TEXT: Record<string, string> = {
  grading: "Grading…",
  review: "Awaiting your review",
  proposing: "Proposing changes…",
  proposals: "Awaiting your approval",
  testing: "Testing changes…",
  approval: "Pull requests to review",
  done: "Improvement done",
  "nothing-to-improve": "Nothing to improve",
}

const TARGET_LABEL: Record<string, string> = { judge: "Judge", builder: "Builder" }

const EXPERIMENT_OUTCOME_TEXT: Record<string, string> = { improved: "Improved", unchanged: "Unchanged", degraded: "Degraded" }

/** An experiment's score, main against the pull request, e.g. "38/41 → 40/41". */
const scoreText = (e: { score?: { main: { passed: number; total: number }; pullRequest: { passed: number; total: number } } | null }) =>
  e.score ? `${e.score.main.passed}/${e.score.main.total} → ${e.score.pullRequest.passed}/${e.score.pullRequest.total}` : null

export interface EvalDashboardFeatureProps {
  inbox: EvalDashboardFeatureInboxState
  data: EvalDashboardFeatureData | null
  actionHandlers?: EvalDashboardFeatureActionHandlers
  className?: string
  workflowContent?: React.ReactNode
  /** The eval agent's chat about the selected evaluation, shown beside the details; absent hides it. */
  agentPanel?: React.ReactNode
  /** What the person is looking at, for the eval agent: the open view and the selected recommendation. */
  onContextChange?: (context: EvalDashboardViewContext) => void
}

export interface EvalDashboardViewContext {
  view: string
  recommendation: { kind: "agent" | "evals"; index: number } | null
  /** The Improvement view's open pack, and the experiment whose details are shown. */
  improvement?: { pack: string | null; experiment: number | null } | null
}

export const EvalDashboardFeature = React.memo<EvalDashboardFeatureProps>(
  ({ inbox, data, actionHandlers, className, workflowContent, agentPanel, onContextChange }) => {
    const [showInbox, setShowInbox] = React.useState(true)
    const [showAgent, setShowAgent] = React.useState(false)
    // Asking opens the chat the question goes to.
    const askHandlers = React.useMemo(
      () =>
        actionHandlers && agentPanel
          ? {
              ...actionHandlers,
              onAskAboutVerdict: actionHandlers.onAskAboutVerdict
                ? (row: Record<string, unknown>) => {
                    setShowAgent(true)
                    actionHandlers.onAskAboutVerdict?.(row)
                  }
                : undefined,
              onAskAboutTurn: actionHandlers.onAskAboutTurn
                ? (turnId: string) => {
                    setShowAgent(true)
                    actionHandlers.onAskAboutTurn?.(turnId)
                  }
                : undefined,
            }
          : { ...actionHandlers, onAskAboutVerdict: undefined, onAskAboutTurn: undefined },
      [actionHandlers, agentPanel]
    )
    const [activeTab, setActiveTab] = React.useState("golden-evals")
    const [selectedRecommendation, setSelectedRecommendation] = React.useState<{ kind: "agent" | "evals"; id: number } | null>(null)
    const [isDownloading, setIsDownloading] = React.useState(false)
    const downloadRef = React.useRef<HTMLAnchorElement>(null)

    const handleDownloadClick = React.useCallback(async () => {
      if (!actionHandlers?.onDownloadPrompt || isDownloading) return
      setIsDownloading(true)
      try {
        const result: FileDownloadResult | undefined = await actionHandlers.onDownloadPrompt()
        if (!result) return
        const url = URL.createObjectURL(result.blob)
        const anchor = downloadRef.current
        if (anchor) {
          anchor.href = url
          anchor.download = result.filename
          anchor.click()
        }
        URL.revokeObjectURL(url)
      } finally {
        setIsDownloading(false)
      }
    }, [actionHandlers?.onDownloadPrompt, isDownloading])

    const selectedSession = React.useMemo(() =>
      inbox.items.find(s => s.id === inbox.selectedItemId) || null
      , [inbox.items, inbox.selectedItemId])

    // Calculate average score for the trend section (project-wide from runsHistory)
    const avgScore = React.useMemo(() => {
      const runs = data?.runsHistory || [];
      if (runs.length === 0) return "0.0";
      const sum = runs.reduce((acc, curr) => acc + curr.score, 0);
      return (sum / runs.length).toFixed(1);
    }, [data?.runsHistory]);

    const inboxItems = React.useMemo(() => {
      return inbox.items.map(session => ({
        id: session.id,
        title: session.id,
        // A failed or cancelled latest attempt is said, never shown as a score.
        subtitle:
          session.stage && STAGE_TEXT[session.stage]
            ? STAGE_TEXT[session.stage]
            : session.status === 'failed'
              ? 'Evaluation failed'
              : session.status === 'cancelled'
                ? 'Evaluation cancelled'
                : session.status === 'pending' || session.status === 'running'
                  ? 'Evaluating…'
                  : `Score: ${session.score}/${session.total}`,
        timestamp: new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }))
    }, [inbox.items]);

    const mockChartData = React.useMemo(() => {
      const runs = data?.runsHistory || [];
      // Sort items chronologically for the chart
      const sortedItems = [...runs].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )

      return sortedItems.map(run => ({
        date: run.date,
        // We map score to 'desktop' since DashboardChart is hardcoded for now
        desktop: run.score,
        mobile: 0
      }))
    }, [data?.runsHistory]);

    const sessionDetails = selectedSession ? {
      id: selectedSession.id,
      date: selectedSession.date,
      goldenEvals: (data?.goldenEvals || []) as DashboardRow[],
      recommendations: (data?.recommendations ?? []).map((r, i) => ({ id: i, change: r.change, rationale: r.rationale, changeStatus: r.candidate?.status })),
      evalRecommendations: (data?.evalRecommendations ?? []).map((r, i) => ({ id: i, ...r, candidate: undefined, changeStatus: r.candidate?.status })),
      systemPrompt: data?.systemPrompt,
      outputTranscript: data?.outputTranscript,
      transcriptAgents: data?.transcriptAgents,
      latestEvalRun: data?.latestEvalRun,
      evalRunId: data?.evalRunId
    } : null

    // The change made from the selected recommendation, shown under the recommendations.
    const selectedCandidate =
      (selectedRecommendation?.kind === "agent"
        ? data?.recommendations?.[selectedRecommendation.id]?.candidate
        : selectedRecommendation?.kind === "evals"
          ? data?.evalRecommendations?.[selectedRecommendation.id]?.candidate
          : null) ?? null
    const recommendationDetail = selectedCandidate ? (
      <div className="grid gap-4 border-t border-border pt-4">
        <CandidateReview
          pack={selectedCandidate.pack}
          agent={selectedCandidate.agent}
          status={selectedCandidate.status}
          requirements={selectedCandidate.requirements}
          rationale={selectedCandidate.rationale}
          basePackVersion={selectedCandidate.basePackVersion}
          artifactDigest={selectedCandidate.artifactDigest}
          diff={selectedCandidate.diff}
          decisionReason={selectedCandidate.decisionReason}
          error={selectedCandidate.error}
          onOpenDecision={actionHandlers?.onOpenDecision ? () => actionHandlers.onOpenDecision?.(selectedCandidate.id) : undefined}
        />
        {selectedCandidate.comparison && <ComparisonReport {...selectedCandidate.comparison} />}
      </div>
    ) : null
    // The evaluation's improvement run, above every view (ADR-063 §7): the
    // person's turn as a banner with its one action, and the changes under test
    // as stories, judge and builder side by side.
    const improvement = data?.improvement
    const [selectedTargetId, setSelectedTargetId] = React.useState<string | null>(null)
    const targets = improvement?.targets ?? []
    // The experiment whose details show under the chart: clicking its point toggles it.
    const [selectedExperimentId, setSelectedExperimentId] = React.useState<string | null>(null)
    const selectedExperiment = React.useMemo(() => {
      for (const t of targets) {
        const e = t.experiments.find((x) => `${t.id}:${x.id}` === selectedExperimentId)
        if (e) return { target: t, experiment: e }
      }
      return null
    }, [targets, selectedExperimentId])
    // What the page shows goes with every message to the chat, so "this experiment" means the one open.
    const contextPack = selectedExperiment?.target.id ?? selectedTargetId ?? targets[0]?.id ?? null
    const contextExperiment = selectedExperiment?.experiment.number ?? null
    React.useEffect(() => {
      onContextChange?.({
        view: activeTab,
        recommendation: selectedRecommendation ? { kind: selectedRecommendation.kind, index: selectedRecommendation.id } : null,
        improvement: improvement ? { pack: contextPack, experiment: contextExperiment } : null,
      })
    }, [activeTab, selectedRecommendation, onContextChange, improvement, contextPack, contextExperiment])
    const toggleExperiment = React.useCallback((id: string) => {
      setSelectedExperimentId((cur) => (cur === id ? null : id))
      setSelectedTargetId(id.split(":")[0])
    }, [])
    // The experiments chart, in the page where the experiments bar was: one point per
    // finished experiment of the open pack, the pull request's score against main's
    // (as %), green when higher, red when lower, grey when equal, the top scorer emphasized.
    const chartPack = selectedExperiment?.target ?? targets.find((t) => t.id === selectedTargetId) ?? targets.find((t) => t.experiments.length) ?? null
    const chart = React.useMemo(() => {
      const pct = (sc: { passed: number; total: number }) => Math.round((sc.passed / Math.max(1, sc.total)) * 1000) / 10
      // main first, by default: the open pack's, or the session's own score before any pack is proposed.
      const main = chartPack?.main ?? (selectedSession ? { passed: selectedSession.score, total: selectedSession.total } : null)
      const done = (chartPack?.experiments ?? []).filter((e) => e.status === "done" && e.score)
      const top = done.length ? done.reduce((best, e) => (e.score!.pullRequest.passed >= best.score!.pullRequest.passed ? e : best), done[0]) : null
      const color = (e: (typeof done)[number]) => (e.outcome === "improved" ? "#10b981" : e.outcome === "degraded" ? "#ef4444" : "#9ca3af")
      const mainPoint = main
        ? [{ id: "main", date: selectedSession?.date ?? new Date(0).toISOString(), desktop: pct(main), mobile: pct(main), color: "#9ca3af", tick: "main", label: `main · ${main.passed}/${main.total}` }]
        : []
      return {
        series: [
          ...mainPoint,
          ...done.map((e) => ({
            id: `${chartPack!.id}:${e.id}`,
            date: e.startedAt,
            desktop: pct(e.score!.pullRequest),
            mobile: pct(e.score!.main),
            color: color(e),
            emphasized: e.id === top?.id,
            tick: `#${e.number}`,
            label: `Experiment ${e.number} · ${e.changes.length} change${e.changes.length === 1 ? "" : "s"} · ${EXPERIMENT_OUTCOME_TEXT[e.outcome ?? "unchanged"]} ${scoreText(e)}`,
          })),
        ],
        title: chartPack ? `Experiments Analysis · ${chartPack.id}` : "Experiments Analysis",
        description: top
          ? `Pull request score against main per experiment (%). Top: experiment ${top.number}, ${scoreText(top)}`
          : main
            ? `main scores ${main.passed}/${main.total}. Each experiment you start is added here.`
            : "Each experiment you start is added here.",
        shortDescription: top ? `Top: experiment ${top.number}` : main ? `main ${main.passed}/${main.total}` : "",
      }
    }, [chartPack, selectedSession])
    const openTarget = React.useCallback((id: string) => {
      setSelectedTargetId(id)
      setActiveTab("improvement")
    }, [])
    const pendingTargets = targets.filter((t) => t.changes.some((c) => c.decision === "pending"))
    const pendingCount = targets.reduce((n, t) => n + t.changes.filter((c) => c.decision === "pending").length, 0)
    const readyTargets = targets.filter((t) => !t.experiments.some((e) => e.status === "running") && nextExperiment(t).unique)
    const passedTargets = targets.filter((t) => t.experiments.some((e) => e.id === t.head && e.outcome === "improved"))
    // Proposals are decided whenever they are waiting, even while another pack's experiment runs.
    const deciding = Boolean(improvement?.targets.length)
    const runningCount = targets.reduce((n, t) => n + t.experiments.filter((e) => e.status === "running").length, 0)
    // One banner: the person's next action, most urgent first.
    const banner: React.ReactNode = !improvement ? null : improvement.stage === "review" ? (
      <AnnouncementBanner
        message={`Grading is done. Label any grade you disagree with (${improvement.review?.labelled ?? 0} labelled so far), then finish your review.`}
        actionText="Finish review"
        onAction={actionHandlers?.onFinishReview}
      />
    ) : improvement.stage === "proposing" ? (
      <AnnouncementBanner message="The improver is reading your labels and the grades to propose changes to the judge and the builder." />
    ) : improvement.stage === "grading" ? (
      <AnnouncementBanner message="The judge is grading this session." />
    ) : improvement.stage === "nothing-to-improve" ? (
      <AnnouncementBanner message="No labels: there's nothing to improve the judge against. Run ▶ again to review." />
    ) : deciding && !improvement.git.connected && (pendingCount > 0 || readyTargets.length > 0) ? (
      <AnnouncementBanner
        message="Connect this app to GitHub before starting an experiment: the approved group is committed to a pull request, and the experiment runs on a build of that commit."
        actionText="Open Connections"
        onAction={() => actionHandlers?.onOpenConnections?.(improvement.git.connectionsUrl)}
      />
    ) : deciding && pendingCount > 0 ? (
      <AnnouncementBanner
        message={`The improver proposes ${pendingCount} change${pendingCount > 1 ? "s" : ""} across ${pendingTargets.length} pack${pendingTargets.length > 1 ? "s" : ""}. Approve or reject each, then start an experiment on the approved group.`}
        actionText="Review proposals"
        onAction={() => openTarget(pendingTargets[0].id)}
      />
    ) : deciding && readyTargets.length > 0 ? (
      <AnnouncementBanner
        message={`A new approved group is ready for an experiment in ${readyTargets.map((t) => t.id).join(" and ")}. Each experiment runs all golden evals, at a cost.`}
        actionText="Open"
        onAction={() => openTarget(readyTargets[0].id)}
      />
    ) : runningCount > 0 ? (
      <AnnouncementBanner message={`${runningCount} experiment${runningCount > 1 ? "s" : ""} running. Each step's result shows in its pack.`} />
    ) : passedTargets.length > 0 ? (
      <AnnouncementBanner
        message={`${passedTargets.map((t) => `${t.id} #${t.pullRequest?.number}`).join(" and ")} ${passedTargets.length > 1 ? "score" : "scores"} higher than main on all golden evals. Review and merge on GitHub.`}
        actionText="Review pull requests"
        onAction={() => openTarget(passedTargets[0].id)}
      />
    ) : (
      <AnnouncementBanner message="Every approved change has been tested. Rejected proposals stay listed; approve one to test it." />
    )
    // The experiments chart and the clicked experiment's details: a section of its own,
    // dragged smaller to minimize it and larger to expand it, like the page's other sections.
    const experimentsPanel: React.ReactNode = improvement ? (
      <div className="flex h-full min-h-0 flex-col gap-2 overflow-auto px-4 py-2">
          <div className="h-56 shrink-0">
            <DashboardChart
              series={chart.series}
              title={chart.title}
              description={chart.description}
              shortDescription={chart.shortDescription}
              timeRanges={[{ value: "10", label: "Last 10" }, { value: "20", label: "Last 20" }, { value: "30", label: "Last 30" }]}
              desktopLabel="Pull request"
              mobileLabel="main"
              showMobile
              mobileColor="var(--muted-foreground)"
              filled={false}
              yDomain={["dataMin - 2", "dataMax + 2"]}
              xAxis="sequence"
              onPointClick={(point) => point.id && point.id !== "main" && toggleExperiment(point.id)}
              selectedPointId={selectedExperimentId}
              className="p-0"
              chartClassName="flex-1 min-h-[100px]"
            />
          </div>
        {selectedExperiment && (
          <TaskQueue
            key={selectedExperimentId ?? undefined}
            showStop={false}
            title={`${TARGET_LABEL[selectedExperiment.target.kind]} · ${selectedExperiment.target.id} · experiment ${selectedExperiment.experiment.number} · ${selectedExperiment.experiment.changes.length} change${
              selectedExperiment.experiment.changes.length === 1 ? "" : "s"
            } (${selectedExperiment.experiment.changes.map((n) => `#${n}`).join(", ")}) · ${
              selectedExperiment.experiment.status === "running"
                ? "running"
                : selectedExperiment.experiment.outcome
                  ? `${EXPERIMENT_OUTCOME_TEXT[selectedExperiment.experiment.outcome]} · main → pull request ${scoreText(selectedExperiment.experiment)}`
                  : "no result"
            }`}
            tasks={selectedExperiment.experiment.steps.map((st) => ({ id: st.id, command: st.label, title: st.detail ? `${st.label} · ${st.detail}` : st.label, status: st.status }))}
            action={
              selectedExperiment.target.head === selectedExperiment.experiment.id ? (
                <span className="text-xs text-muted-foreground">In the pull request</span>
              ) : selectedExperiment.experiment.status === "done" && actionHandlers?.onUseExperiment ? (
                <IconButton
                  icon="history"
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                  title="Use this experiment: set the pull request back to its approved group, reusing its result"
                  disabled={selectedExperiment.target.experiments.some((e) => e.status === "running")}
                  onClick={() => actionHandlers.onUseExperiment?.(selectedExperiment.target.id, selectedExperiment.experiment.id)}
                />
              ) : undefined
            }
          />
        )}
      </div>
    ) : null
    const improvementBanner: React.ReactNode = improvement ? <div className="border-b px-4 py-2">{banner}</div> : null

    const ownView: React.ReactNode = (() => {
      switch (activeTab) {
        case "turns":
          return (
            <TurnTimeline
              turns={data?.turns ?? []}
              traceNotices={data?.traceNotices}
              onOpenTrace={actionHandlers?.onOpenTrace}
              onAddToDataset={actionHandlers?.onAddTurnToDataset}
              onAskAboutTurn={askHandlers.onAskAboutTurn}
            />
          )
        case "feedback":
          return (
            <EnhancedDataTable
              data={(data?.feedback ?? []).map((f) => ({
                id: f.id,
                rating: f.rating === "positive" ? "👍 positive" : "👎 negative",
                details: f.details ?? "",
                reply: f.reply ?? "",
                agent: f.agent ?? "orchestrator",
                turn: f.turnId ? f.turnId.slice(0, 8) : "",
                at: f.at,
              }))}
              tableSchema={FEEDBACK_TABLE}
              rowActions={[]}
            />
          )
        case "improvement":
          return (
            <EvalImprovementPanel
              className="p-4"
              targets={targets}
              gitConnected={improvement?.git.connected ?? false}
              selectedTargetId={selectedTargetId}
              onSelectTarget={setSelectedTargetId}
              onApproveChange={actionHandlers?.onApproveChange}
              onRejectChange={actionHandlers?.onRejectChange}
              onTestApproved={actionHandlers?.onTestApproved}
              onOpenPullRequest={actionHandlers?.onOpenPullRequest}
            />
          )
        case "rewards":
          return (
            <EnhancedDataTable
              data={(data?.rewards ?? []).map((r) => ({
                id: r.id,
                turn: r.turnId.slice(0, 8),
                agent: r.agent,
                model: r.model ?? "",
                reward: r.reward === null ? "—" : r.gated ? "0 (guardrail)" : r.reward.toFixed(2),
                definition: r.definition,
                breakdown: r.breakdown.join(" · "),
                at: r.at,
              }))}
              tableSchema={REWARDS_TABLE}
              rowActions={[]}
            />
          )
        default:
          return null
      }
    })()
    // The open view, below the experiments section when there is one.
    const viewContent: React.ReactNode = OWN_VIEWS.has(activeTab) ? (
      <div className="h-full overflow-auto p-4">{ownView}</div>
    ) : sessionDetails ? (
      <EvalSessionDetailsPanel
        sessionDetails={sessionDetails}
        activeTab={activeTab}
        actionHandlers={askHandlers}
        workflowContent={workflowContent}
        onSelectRecommendation={(kind, id) => setSelectedRecommendation({ kind, id })}
        recommendationDetail={recommendationDetail}
      />
    ) : null

    return (
      <>
      <div className={cn("h-full w-full overflow-hidden bg-background", className)}>
        <SectionLayout
          dragHandleColor="border"
          orientation="vertical"
          resizable={true}
          padded={false}
          className="h-full"
          storageKey="eval-dashboard-outer"
          sections={[
            ...(mockChartData.length > 0 ? [{
              id: "graph",
              defaultSize: 28,
              minSize: 20,
              maxSize: 60,
              content: (
                <div className="h-full w-full bg-muted/10 p-4 border-b">
                  <DashboardChart
                    series={mockChartData}
                    title="Experiments Analysis"
                    description={`Average Score: ${avgScore} (per run)`}
                    shortDescription={`Avg: ${avgScore}`}
                    timeRanges={[
                      { value: "10", label: "Last 10 Runs", shortLabel: "Last 10" },
                      { value: "20", label: "Last 20 Runs", shortLabel: "Last 20" },
                      { value: "30", label: "Last 30 Runs", shortLabel: "Last 30" }
                    ]}
                    timeRange={actionHandlers?.timeRange}
                    onTimeRangeChange={actionHandlers?.onTimeRangeChange}
                    desktopLabel="Score"
                    mobileLabel=""
                    showMobile={false}
                    className="p-0"
                    chartClassName="flex-1 min-h-[100px]"
                  />
                </div>
              )
            }] : []),
            {
              id: "content",
              defaultSize: mockChartData.length > 0 ? 80 : 100,
              minSize: 40,
              variant: "ghost",
              content: (
                <div className="h-full w-full min-h-0">
                  <SectionLayout
                    dragHandleColor="border"
                    orientation="horizontal"
                    resizable={false}
                    padded={false}
                    sections={[
                      ...(showInbox ? [{
                        id: "inbox",
                        defaultSize: 25,
                        minSize: 20,
                        maxSize: 45,
                        content: (
                          <InboxPanel
                            items={inboxItems}
                            selectedItemId={inbox.selectedItemId}
                            onSelectItem={inbox.onSelectItem}
                            searchPlaceholder="Search sessions..."
                            isLoading={inbox.isLoading}
                            emptyMessage={inbox.error || "No sessions found"}
                            className="h-full bg-muted/5 border-r"
                            title="Sessions"
                          />
                        )
                      }] : []),
                      {
                        id: "details",
                        defaultSize: (showInbox ? 75 : 100) - (agentPanel && showAgent ? 30 : 0),
                        minSize: 50,
                        header: sessionDetails ? {
                          showTitle: false,
                          showSidebarToggle: false,
                          tabsPosition: "center",
                          buttonSwitcherProps: {
                            // Grouped by what is looked at; views offered only when the consumer provides their data.
                            items: [
                              ...(data?.turns ? [{ name: "Turns", id: "turns", group: "Session" }] : []),
                              { name: "Outputs", id: "outputs", group: "Session" },
                              { name: "Session Instructions", id: "prompts", group: "Session" },
                              ...(data?.feedback ? [{ name: "Feedback", id: "feedback", group: "Session" }] : []),
                              { name: "Golden Evals", id: "golden-evals", group: "Grading" },
                              { name: "Recommendations", id: "recommendations", group: "Grading" },
                              ...(data?.improvement ? [{ name: "Experiments", id: "improvement" }] : []),
                              ...(workflowContent ? [{ name: "Workflow", id: "workflow", group: "Eval run" }] : []),
                              ...(data?.rewards ? [{ name: "Rewards", id: "rewards", group: "Eval run" }] : []),
                            ],
                            activeId: activeTab,
                            onSelect: setActiveTab,
                            placeholder: "Select View",
                          },
                          chatToggleProps: {
                            isOpen: showInbox,
                            label: showInbox ? "Hide Inbox" : "Show Inbox",
                            onClick: () => setShowInbox(!showInbox)
                          },
                          actions: actionHandlers?.onTriggerEvaluation ? (
                            <div className="flex items-center gap-2">
                              <EvalTriggerButton onClick={actionHandlers.onTriggerEvaluation} loading={actionHandlers.isTriggering} />
                              {agentPanel && (
                                <IconButton onClick={() => setShowAgent(!showAgent)} variant={showAgent ? "default" : "outline"} size="sm" className="h-8 w-8 p-0" title={showAgent ? "Hide the eval agent" : "Ask the eval agent"} icon="message-circle" iconClassName="w-4 h-4" />
                              )}
                              {actionHandlers.onDownloadPrompt && (
                                <IconButton onClick={handleDownloadClick} variant="outline" size="sm" className="h-8 w-8 p-0" title={isDownloading ? 'Preparing...' : 'Download Prompt'} icon={isDownloading ? 'loader-2' : 'download'} iconClassName={`w-4 h-4${isDownloading ? ' animate-spin' : ''}`} />
                              )}
                            </div>
                          ) : undefined,
                        } : undefined,
                        content: sessionDetails ? (
                          <div className="flex h-full min-h-0 flex-col">
                            {improvementBanner}
                            <div className="min-h-0 flex-1">
                              {experimentsPanel ? (
                                <SectionLayout
                                  dragHandleColor="border"
                                  orientation="vertical"
                                  resizable={true}
                                  padded={false}
                                  className="h-full"
                                  storageKey="eval-dashboard-experiments"
                                  sections={[
                                    { id: "experiments", defaultSize: 40, minSize: 8, maxSize: 85, content: <div className="h-full border-b">{experimentsPanel}</div> },
                                    { id: "view", defaultSize: 60, minSize: 15, content: viewContent },
                                  ]}
                                />
                              ) : (
                                viewContent
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1 flex items-center justify-center text-muted-foreground bg-background h-full">
                            Select a session to view details
                          </div>
                        )
                      },
                      ...(agentPanel && showAgent ? [{
                        id: "agent",
                        defaultSize: 30,
                        minSize: 25,
                        maxSize: 50,
                        content: <div className="h-full min-h-0 border-l">{agentPanel}</div>,
                      }] : []),
                    ]}
                  />
                </div>
              )
            }
          ]}
        />
        </div>
        <a ref={downloadRef} style={{ display: 'none' }} />
      </>
    )
  }
)
 
EvalDashboardFeature.displayName = "EvalDashboardFeature"
