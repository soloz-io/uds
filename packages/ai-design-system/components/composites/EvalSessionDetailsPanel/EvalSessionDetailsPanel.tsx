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
  systemPrompt?: string
  outputTranscript?: string
}

export interface EvalSessionDetailsPanelProps {
  sessionDetails: EvalSessionDetails
  activeTab: string
}

export const EvalTriggerButton = ({ onClick }: { onClick: () => void }) => (
  <Button onClick={onClick} size="sm">
    <Icon name="Play" className="w-4 h-4 mr-2" />
    Trigger Evaluation
  </Button>
)

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
  ({ sessionDetails, activeTab }) => {
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
          </div>
        </Tabs>
      </div>
    )
  }
)

EvalSessionDetailsPanel.displayName = "EvalSessionDetailsPanel"
