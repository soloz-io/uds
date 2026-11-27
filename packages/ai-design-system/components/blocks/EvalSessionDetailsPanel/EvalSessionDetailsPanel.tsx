import * as React from "react"
import { DYNAMIC_TABLE_SCHEMA_VERSION, dynamicTableSchema } from "ui-schema-contracts"
import { ScrollArea } from "@/components/primitives/ScrollArea"
import { Tabs, TabsContent } from "@/components/primitives/Tabs"
import { EnhancedDataTable } from "@/components/composites/DataTable"
import type { DashboardRow } from "@/components/composites/DataTable"
import { Button } from "@/components/primitives/Button"
import { Icon } from "@/components/primitives/Icon"
import { IconButton } from "@/components/composites/IconButton"

const CopyButton = ({ text, className }: { text: string; className?: string }) => {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = React.useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error("Failed to copy:", err)
      }
    },
    [text]
  )

  return (
    <IconButton
      icon={copied ? "check" : "copy"}
      size="sm"
      variant="secondary"
      className={className}
      title={copied ? "Copied!" : "Copy"}
      onClick={handleCopy}
    />
  )
}

/** A recommended change to the eval criteria themselves. */
export interface EvalCriteriaRecommendation {
  kind: string
  agent?: string
  criterion_id?: number
  change: string
  rationale: string
}

export type EvalVerdict = "PASS" | "FAIL" | "N/A"

export interface EvalSessionDetails {
  id: string
  date: string
  goldenEvals: DashboardRow[]
  /** changeStatus: where the change made from it stands (draft … accepted), when one was made. */
  recommendations: Array<{ id: number; change: string; rationale: string; changeStatus?: string }>
  evalRecommendations?: Array<EvalCriteriaRecommendation & { id: number; changeStatus?: string }>
  systemPrompt?: string
  outputTranscript?: string
  /** Agents that wrote lines in the transcript, for the Outputs filter. */
  transcriptAgents?: string[]
  /** The newest evaluation attempt; a failed or cancelled one is shown with its reason. */
  latestEvalRun?: { id: string; status: string; error: string | null; at: string } | null
  /** The eval run the verdicts below belong to. */
  evalRunId?: string | null
}

export interface EvalSessionDetailsPanelProps {
  sessionDetails: EvalSessionDetails
  activeTab: string
  actionHandlers?: {
    onTriggerEvaluation?: () => void
    onDownloadPrompt?: () => Promise<import('@/components/composites/FileTreeExplorer').FileDownloadResult | undefined>
    /** Records a person's verdict on one graded criterion; absent hides labelling. */
    onLabelVerdict?: (row: DashboardRow, verdict: EvalVerdict, explanation: string) => void
    /** Asks the eval agent why the judge graded one criterion as it did; absent hides the action. */
    onAskAboutVerdict?: (row: DashboardRow) => void
  }
  workflowContent?: React.ReactNode
  /** Selecting a recommendation: which table, and its id. */
  onSelectRecommendation?: (kind: "agent" | "evals", id: number) => void
  /** Shown under the recommendations: the selected recommendation's change and its evidence. */
  recommendationDetail?: React.ReactNode
}

const VERDICTS: EvalVerdict[] = ["PASS", "FAIL", "N/A"]

export const EvalTriggerButton = ({ onClick, loading }: { onClick: () => void; loading?: boolean }) => (
  <Button onClick={onClick} variant="default" size="sm" className="h-8 w-8 p-0" disabled={loading} title={loading ? 'Evaluating...' : 'Trigger'}>
    <Icon name={loading ? 'loader-2' : 'play'} className={`w-4 h-4${loading ? ' animate-spin' : ''}`} />
  </Button>
)

/** The status of the change made from a recommendation, shown when any recommendation has one. */
const CHANGE_STATUS_COLUMN = { key: "changeStatus", label: "Change", renderType: "status" as const, width: 130 }

const recommendationTableSchema = (withChanges: boolean) =>
  dynamicTableSchema.parse({
    schemaVersion: DYNAMIC_TABLE_SCHEMA_VERSION,
    rowKey: "change",
    enableFiltering: true,
    enablePagination: false,
    enableRowSelection: false,
    columns: [
      { key: "change", label: "Recommendation", renderType: "text" },
      { key: "rationale", label: "Rationale", renderType: "text" },
      ...(withChanges ? [CHANGE_STATUS_COLUMN] : []),
    ],
  })

const evalRecommendationTableSchema = (withChanges: boolean) =>
  dynamicTableSchema.parse({
    schemaVersion: DYNAMIC_TABLE_SCHEMA_VERSION,
    rowKey: "id",
    enableFiltering: true,
    enablePagination: false,
    enableRowSelection: false,
    columns: [
      { key: "kind", label: "Kind", renderType: "badge" },
      { key: "agent", label: "Agent", renderType: "text" },
      { key: "change", label: "Change to the evals", renderType: "text" },
      { key: "rationale", label: "Rationale", renderType: "text" },
      ...(withChanges ? [CHANGE_STATUS_COLUMN] : []),
    ],
  })

const goldenEvalTableSchema = (labelling: boolean) =>
  dynamicTableSchema.parse({
    schemaVersion: DYNAMIC_TABLE_SCHEMA_VERSION,
    rowKey: "id",
    enableFiltering: true,
    enablePagination: false,
    enableRowSelection: false,
    columns: [
      { key: "category", label: "Category", renderType: "text" },
      { key: "metric", label: "Metric (Question)", renderType: "text" },
      { key: "evaluator", label: "Type", renderType: "badge" },
      { key: "suite", label: "Suite", renderType: "badge" },
      { key: "pass", label: "Score", renderType: "badge" },
      { key: "reasoning", label: "Reasoning", renderType: "text" },
      ...(labelling
        ? [
            {
              key: "humanVerdict",
              label: "Your label",
              renderType: "badge",
              inputType: "select",
              editable: true,
              options: VERDICTS.map((v) => ({ label: v, value: v })),
            },
            { key: "humanExplanation", label: "Why", renderType: "text", inputType: "textarea", editable: true },
          ]
        : []),
    ],
  })

const LABEL_ACTION = { key: "edit", label: "Label this verdict", icon: "tag" }
const ASK_ACTION = { key: "ask", label: "Ask why", icon: "message-circle" }

/** Outputs filtered to the lines one agent wrote (`[agent] role: …`), or all. */
function transcriptFor(transcript: string, agent: string | null): string {
  if (!agent) return transcript
  return transcript
    .split("\n")
    .filter((line) => line.startsWith(`[${agent}] `))
    .join("\n")
}

export const EvalSessionDetailsPanel = React.memo<EvalSessionDetailsPanelProps>(
  ({ sessionDetails, activeTab, workflowContent, actionHandlers, onSelectRecommendation, recommendationDetail }) => {
    const onLabelVerdict = actionHandlers?.onLabelVerdict
    const [outputAgent, setOutputAgent] = React.useState<string | null>(null)
    const onAskAboutVerdict = actionHandlers?.onAskAboutVerdict
    const verdictActions = [...(onLabelVerdict ? [LABEL_ACTION] : []), ...(onAskAboutVerdict ? [ASK_ACTION] : [])]
    // A label is saved once, when its row's editing ends: the table reports
    // every keystroke of "Why", and saving each would store partial reasons.
    const pendingLabel = React.useRef<DashboardRow | null>(null)
    const labelHandlers = React.useMemo(
      () =>
        onLabelVerdict || onAskAboutVerdict
          ? {
              onInlineEditSave: (_rowId: number | string, field: string, _value: string, row: DashboardRow) => {
                if (field === "humanVerdict" || field === "humanExplanation") pendingLabel.current = row
              },
              onEditModeChange: (rowId: number | string | null) => {
                if (rowId !== null) return
                const row = pendingLabel.current
                pendingLabel.current = null
                if (!row || !onLabelVerdict) return
                const verdict = row.humanVerdict as EvalVerdict | undefined
                if (!verdict || !VERDICTS.includes(verdict)) return
                onLabelVerdict(row, verdict, String(row.humanExplanation ?? ""))
              },
              onRowAction: (action: string, row: DashboardRow) => {
                if (action === "ask") onAskAboutVerdict?.(row)
              },
            }
          : undefined,
      [onLabelVerdict, onAskAboutVerdict]
    )
    return (
      <div className="flex flex-col h-full bg-background">
        <Tabs value={activeTab} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 min-h-0 overflow-hidden relative">
            <TabsContent value="golden-evals" className="absolute inset-0 m-0 p-0 overflow-hidden flex flex-col">
              <div className="p-4 flex-1 min-h-0 flex flex-col gap-3">
                {sessionDetails.latestEvalRun &&
                  (sessionDetails.latestEvalRun.status === "failed" || sessionDetails.latestEvalRun.status === "cancelled") && (
                    <div
                      role="alert"
                      className={`text-xs rounded border px-3 py-2 text-foreground ${
                        sessionDetails.latestEvalRun.status === "failed"
                          ? "border-destructive/50 bg-destructive/10"
                          : "border-amber-500/40 bg-amber-500/10"
                      }`}
                    >
                      <div className="font-medium">
                        Evaluation {sessionDetails.latestEvalRun.status} ·{" "}
                        {new Date(sessionDetails.latestEvalRun.at).toLocaleString()}
                      </div>
                      <div className="mt-1 whitespace-pre-wrap">{sessionDetails.latestEvalRun.error}</div>
                      {sessionDetails.evalRunId && sessionDetails.evalRunId !== sessionDetails.latestEvalRun.id && (
                        <div className="mt-1 text-muted-foreground">The verdicts below are from an earlier completed evaluation.</div>
                      )}
                    </div>
                  )}
                {sessionDetails.goldenEvals && sessionDetails.goldenEvals.length > 0 ? (
                  <EnhancedDataTable
                    data={sessionDetails.goldenEvals}
                    tableSchema={goldenEvalTableSchema(!!onLabelVerdict)}
                    handlers={labelHandlers}
                    rowActions={verdictActions.length > 0 ? verdictActions : undefined}
                  />
                ) : (
                  <div className="text-sm text-muted-foreground flex-1 flex items-center justify-center">No evaluation data available.</div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="absolute inset-0 m-0 p-0 overflow-hidden flex flex-col">
              <div className="p-4 flex-1 min-h-0 flex flex-col gap-4 overflow-auto">
                {sessionDetails.recommendations && sessionDetails.recommendations.length > 0 ? (
                  <EnhancedDataTable
                    data={sessionDetails.recommendations}
                    tableSchema={recommendationTableSchema(sessionDetails.recommendations.some((r) => r.changeStatus))}
                    handlers={onSelectRecommendation ? { onRowClick: (row) => onSelectRecommendation("agent", Number(row.id)) } : undefined}
                  />
                ) : (
                  <div className="text-sm text-muted-foreground flex items-center justify-center py-6">No recommendations available.</div>
                )}
                {sessionDetails.evalRecommendations && sessionDetails.evalRecommendations.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <div className="text-sm font-medium">Improve the evals</div>
                    <EnhancedDataTable
                      data={sessionDetails.evalRecommendations as unknown as DashboardRow[]}
                      tableSchema={evalRecommendationTableSchema(sessionDetails.evalRecommendations.some((r) => r.changeStatus))}
                      rowActions={[]}
                      handlers={onSelectRecommendation ? { onRowClick: (row) => onSelectRecommendation("evals", Number(row.id)) } : undefined}
                    />
                  </div>
                )}
                {recommendationDetail}
              </div>
            </TabsContent>

            <TabsContent value="prompts" className="absolute inset-0 m-0 p-0">
              <ScrollArea className="h-full">
                <div className="p-4 relative group">
                  {sessionDetails.systemPrompt && (
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <CopyButton 
                        text={sessionDetails.systemPrompt}
                        className="h-8 w-8 p-0"
                      />
                    </div>
                  )}
                  <pre className="text-xs font-mono bg-muted p-4 rounded whitespace-pre-wrap">
                    {sessionDetails.systemPrompt || "No system prompt available."}
                  </pre>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="outputs" className="absolute inset-0 m-0 p-0">
              <ScrollArea className="h-full">
                {sessionDetails.transcriptAgents && sessionDetails.transcriptAgents.length > 0 && (
                  <div className="px-4 pt-4 flex flex-wrap gap-2" role="group" aria-label="Filter transcript by agent">
                    {[null, ...sessionDetails.transcriptAgents].map((agent) => (
                      <Button
                        key={agent ?? "all"}
                        size="sm"
                        variant={outputAgent === agent ? "default" : "outline"}
                        className="h-7 text-xs"
                        onClick={() => setOutputAgent(agent)}
                      >
                        {agent ?? "All"}
                      </Button>
                    ))}
                  </div>
                )}
                <div className="p-4 relative group">
                  {sessionDetails.outputTranscript && (
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <CopyButton 
                        text={sessionDetails.outputTranscript}
                        className="h-8 w-8 p-0"
                      />
                    </div>
                  )}
                  <pre className="text-xs font-mono bg-muted p-4 rounded whitespace-pre-wrap">
                    {transcriptFor(sessionDetails.outputTranscript ?? "", outputAgent) || "No transcript available."}
                  </pre>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="workflow" className="absolute inset-0 m-0 p-0">
              {workflowContent || (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No workflow data available.
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    )
  }
)

EvalSessionDetailsPanel.displayName = "EvalSessionDetailsPanel"
