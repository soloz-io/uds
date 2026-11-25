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
  recommendations: Array<{ id: number; change: string; rationale: string }>
  evalRecommendations?: Array<EvalCriteriaRecommendation & { id: number }>
  systemPrompt?: string
  outputTranscript?: string
  /** Agents that wrote lines in the transcript, for the Outputs filter. */
  transcriptAgents?: string[]
  /** Said above the criteria when they are not the session's pack's own. */
  criteriaNotice?: string | null
}

export interface EvalSessionDetailsPanelProps {
  sessionDetails: EvalSessionDetails
  activeTab: string
  actionHandlers?: {
    onTriggerEvaluation?: () => void
    onDownloadPrompt?: () => Promise<import('@/components/composites/FileTreeExplorer').FileDownloadResult | undefined>
    /** Records a person's verdict on one graded criterion; absent hides labelling. */
    onLabelVerdict?: (row: DashboardRow, verdict: EvalVerdict, explanation: string) => void
  }
  workflowContent?: React.ReactNode
}

const VERDICTS: EvalVerdict[] = ["PASS", "FAIL", "N/A"]

export const EvalTriggerButton = ({ onClick, loading }: { onClick: () => void; loading?: boolean }) => (
  <Button onClick={onClick} variant="default" size="sm" className="h-8 w-8 p-0" disabled={loading} title={loading ? 'Evaluating...' : 'Trigger'}>
    <Icon name={loading ? 'loader-2' : 'play'} className={`w-4 h-4${loading ? ' animate-spin' : ''}`} />
  </Button>
)

const recommendationTableSchema = dynamicTableSchema.parse({
  schemaVersion: DYNAMIC_TABLE_SCHEMA_VERSION,
  rowKey: "change",
  enableFiltering: true,
  enablePagination: false,
  enableRowSelection: false,
  columns: [
    { key: "change", label: "Recommendation", renderType: "text" },
    { key: "rationale", label: "Rationale", renderType: "text" },
  ],
})

const evalRecommendationTableSchema = dynamicTableSchema.parse({
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

const LABEL_ACTIONS = [{ key: "edit", label: "Label this verdict", icon: "tag" }]

/** Outputs filtered to the lines one agent wrote (`[agent] role: …`), or all. */
function transcriptFor(transcript: string, agent: string | null): string {
  if (!agent) return transcript
  return transcript
    .split("\n")
    .filter((line) => line.startsWith(`[${agent}] `))
    .join("\n")
}

export const EvalSessionDetailsPanel = React.memo<EvalSessionDetailsPanelProps>(
  ({ sessionDetails, activeTab, workflowContent, actionHandlers }) => {
    const onLabelVerdict = actionHandlers?.onLabelVerdict
    const [outputAgent, setOutputAgent] = React.useState<string | null>(null)
    const labelHandlers = React.useMemo(
      () =>
        onLabelVerdict
          ? {
              onInlineEditSave: (_rowId: number | string, field: string, _value: string, row: DashboardRow) => {
                if (field !== "humanVerdict" && field !== "humanExplanation") return
                const verdict = row.humanVerdict as EvalVerdict | undefined
                if (!verdict || !VERDICTS.includes(verdict)) return
                onLabelVerdict(row, verdict, String(row.humanExplanation ?? ""))
              },
            }
          : undefined,
      [onLabelVerdict]
    )
    return (
      <div className="flex flex-col h-full bg-background">
        <Tabs value={activeTab} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 min-h-0 overflow-hidden relative">
            <TabsContent value="golden-evals" className="absolute inset-0 m-0 p-0 overflow-hidden flex flex-col">
              <div className="p-4 flex-1 min-h-0 flex flex-col gap-3">
                {sessionDetails.criteriaNotice && (
                  <div role="status" className="text-xs rounded border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-foreground">
                    {sessionDetails.criteriaNotice}
                  </div>
                )}
                {sessionDetails.goldenEvals && sessionDetails.goldenEvals.length > 0 ? (
                  <EnhancedDataTable
                    data={sessionDetails.goldenEvals}
                    tableSchema={goldenEvalTableSchema(!!onLabelVerdict)}
                    handlers={labelHandlers}
                    rowActions={onLabelVerdict ? LABEL_ACTIONS : undefined}
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
                    tableSchema={recommendationTableSchema}
                  />
                ) : (
                  <div className="text-sm text-muted-foreground flex items-center justify-center py-6">No recommendations available.</div>
                )}
                {sessionDetails.evalRecommendations && sessionDetails.evalRecommendations.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <div className="text-sm font-medium">Improve the evals</div>
                    <EnhancedDataTable
                      data={sessionDetails.evalRecommendations as unknown as DashboardRow[]}
                      tableSchema={evalRecommendationTableSchema}
                      rowActions={[]}
                    />
                  </div>
                )}
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
