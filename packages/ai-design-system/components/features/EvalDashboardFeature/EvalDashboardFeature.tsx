import * as React from "react"
import { InboxPanel } from "@/components/blocks/InboxPanel"
import { SectionLayout } from "@/components/blocks/SectionLayout"
import { DashboardChart } from "@/components/composites/DashboardChart"
import { EvalSessionDetailsPanel, EvalTriggerButton } from "@/components/composites/EvalSessionDetailsPanel"
import type { DashboardRow } from "@/components/composites/DataTable"
import { cn } from "@/lib/utils"
import type {
  EvalDashboardFeatureInboxState,
  EvalDashboardFeatureData,
  EvalDashboardFeatureActionHandlers,
} from "./useEvalDashboardFeature.d"


export interface EvalDashboardFeatureProps {
  inbox: EvalDashboardFeatureInboxState
  data: EvalDashboardFeatureData | null
  actionHandlers?: EvalDashboardFeatureActionHandlers
  className?: string
}

export const EvalDashboardFeature = React.memo<EvalDashboardFeatureProps>(
  ({ inbox, data, actionHandlers, className }) => {
    const [showInbox, setShowInbox] = React.useState(true)
    const [activeTab, setActiveTab] = React.useState("golden-evals")

    const selectedSession = React.useMemo(() =>
      inbox.items.find(s => s.id === inbox.selectedItemId) || null
      , [inbox.items, inbox.selectedItemId])

    // Calculate average score for the trend section
    const avgScore = React.useMemo(() => {
      if (inbox.items.length === 0) return "0.0";
      const sum = inbox.items.reduce((acc, curr) => acc + curr.score, 0);
      return (sum / inbox.items.length).toFixed(1);
    }, [inbox.items]);

    const inboxItems = React.useMemo(() => {
      return inbox.items.map(session => ({
        id: session.id,
        title: session.id,
        subtitle: `Score: ${session.score}/${session.total}`,
        timestamp: new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }))
    }, [inbox.items]);

    const mockChartData = React.useMemo(() => {
      // Sort items chronologically for the chart
      const sortedItems = [...inbox.items].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )

      return sortedItems.map(session => ({
        date: session.date,
        // We map score to 'desktop' since DashboardChart is hardcoded for now
        desktop: session.score,
        mobile: 0
      }))
    }, [inbox.items]);

    const sessionDetails = selectedSession ? {
      id: selectedSession.id,
      date: selectedSession.date,
      goldenEvals: (data?.goldenEvals || []) as DashboardRow[],
      systemPrompt: data?.systemPrompt,
      outputTranscript: data?.outputTranscript
    } : null

    return (
      <div className={cn("h-full w-full overflow-hidden bg-background", className)}>
        <SectionLayout
          dragHandleColor="border"
          orientation="vertical"
          resizable={true}
          padded={false}
          className="h-full"
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
                    description={`Average Score: ${avgScore} / 41`}
                    shortDescription={`Avg: ${avgScore}`}
                    timeRanges={[
                      { value: "10", label: "Last 10 Sessions", shortLabel: "Last 10" },
                      { value: "20", label: "Last 20 Sessions", shortLabel: "Last 20" },
                      { value: "30", label: "Last 30 Sessions", shortLabel: "Last 30" }
                    ]}
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
              defaultSize: mockChartData.length > 0 ? 65 : 100,
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
                        defaultSize: showInbox ? 75 : 100,
                        minSize: 50,
                        header: sessionDetails ? {
                          showTitle: false,
                          showSidebarToggle: false,
                          tabsPosition: "center",
                          tabs: [
                            { label: "Golden Evals", value: "golden-evals" },
                            { label: "System Prompts", value: "prompts" },
                            { label: "Outputs", value: "outputs" }
                          ],
                          defaultTab: activeTab,
                          onTabChange: setActiveTab,
                          chatToggleProps: {
                            isOpen: showInbox,
                            label: showInbox ? "Hide Inbox" : "Show Inbox",
                            onClick: () => setShowInbox(!showInbox)
                          },
                          actions: actionHandlers?.onTriggerEvaluation ? (
                            <EvalTriggerButton onClick={actionHandlers.onTriggerEvaluation} />
                          ) : undefined
                        } : undefined,
                        content: sessionDetails ? (
                          <EvalSessionDetailsPanel
                            sessionDetails={sessionDetails}
                            activeTab={activeTab}
                          />
                        ) : (
                          <div className="flex-1 flex items-center justify-center text-muted-foreground bg-background h-full">
                            Select a session to view details
                          </div>
                        )
                      }
                    ]}
                  />
                </div>
              )
            }
          ]}
        />
      </div>
    )
  }
)

EvalDashboardFeature.displayName = "EvalDashboardFeature"
