import * as React from "react"
import { DYNAMIC_TABLE_SCHEMA_VERSION, dynamicTableSchema } from "ui-schema-contracts"
import { ScrollArea } from "@/components/primitives/ScrollArea"
import { Tabs, TabsContent } from "@/components/primitives/Tabs"
import { EnhancedDataTable } from "@/components/composites/DataTable"
import type { DashboardRow } from "@/components/composites/DataTable"
import { Button } from "@/components/primitives/Button"
import { Icon } from "@/components/primitives/Icon"

export interface EvalSessionDetails {
  id: string
  date: string
  goldenEvals: DashboardRow[]
  recommendations: Array<{ id: number; name: string; rationale: string }>
  systemPrompt?: string
  outputTranscript?: string
}

export interface EvalSessionDetailsPanelProps {
  sessionDetails: EvalSessionDetails
  activeTab: string
  actionHandlers?: { onTriggerEvaluation?: () => void }
  workflowContent?: React.ReactNode
}

export const EvalTriggerButton = ({ onClick, loading }: { onClick: () => void; loading?: boolean }) => (
  <Button onClick={onClick} variant="default" size="sm" className="h-8 w-8 p-0" disabled={loading} title={loading ? 'Evaluating...' : 'Trigger'}>
    <Icon name={loading ? 'loader-2' : 'play'} className={`w-4 h-4${loading ? ' animate-spin' : ''}`} />
  </Button>
)

const recommendationTableSchema = dynamicTableSchema.parse({
  schemaVersion: DYNAMIC_TABLE_SCHEMA_VERSION,
  rowKey: "name",
  enableFiltering: true,
  enablePagination: false,
  enableRowSelection: false,
  columns: [
    { key: "name", label: "Recommendation", renderType: "text" },
    { key: "rationale", label: "Rationale", renderType: "text" },
  ],
})

const goldenEvalTableSchema = dynamicTableSchema.parse({
  schemaVersion: DYNAMIC_TABLE_SCHEMA_VERSION,
  rowKey: "id",
  enableFiltering: true,
  enablePagination: false,
  enableRowSelection: false,
  columns: [
    { key: "category", label: "Category", renderType: "text" },
    { key: "metric", label: "Metric (Question)", renderType: "text" },
    { key: "pass", label: "Score", renderType: "badge" },
    { key: "reasoning", label: "Reasoning", renderType: "text" },
  ],
})

export const EvalSessionDetailsPanel = React.memo<EvalSessionDetailsPanelProps>(
  ({ sessionDetails, activeTab, actionHandlers: _actionHandlers, workflowContent }) => {
    return (
      <div className="flex flex-col h-full bg-background">
        <Tabs value={activeTab} className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 min-h-0 overflow-hidden relative">
            <TabsContent value="golden-evals" className="absolute inset-0 m-0 p-0 overflow-hidden flex flex-col">
              <div className="p-4 flex-1 min-h-0 flex flex-col">
                {sessionDetails.goldenEvals && sessionDetails.goldenEvals.length > 0 ? (
                  <EnhancedDataTable
                    data={sessionDetails.goldenEvals}
                    tableSchema={goldenEvalTableSchema}
                  />
                ) : (
                  <div className="text-sm text-muted-foreground flex-1 flex items-center justify-center">No evaluation data available.</div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="absolute inset-0 m-0 p-0 overflow-hidden flex flex-col">
              <div className="p-4 flex-1 min-h-0 flex flex-col">
                {sessionDetails.recommendations && sessionDetails.recommendations.length > 0 ? (
                  <EnhancedDataTable
                    data={sessionDetails.recommendations}
                    tableSchema={recommendationTableSchema}
                  />
                ) : (
                  <div className="text-sm text-muted-foreground flex-1 flex items-center justify-center">No recommendations available.</div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="prompts" className="absolute inset-0 m-0 p-0">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <pre className="text-xs font-mono bg-muted p-4 rounded whitespace-pre-wrap">
                    {sessionDetails.systemPrompt || "No system prompt available."}
                  </pre>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="outputs" className="absolute inset-0 m-0 p-0">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <pre className="text-xs font-mono bg-muted p-4 rounded whitespace-pre-wrap">
                    {sessionDetails.outputTranscript || "No transcript available."}
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
