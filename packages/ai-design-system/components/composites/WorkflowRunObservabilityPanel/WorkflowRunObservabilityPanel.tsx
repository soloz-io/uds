import * as React from "react"

import { Badge } from "@/components/primitives/Badge"
import { Button } from "@/components/primitives/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/primitives/DropdownMenu"
import { Input } from "@/components/primitives/Input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/primitives/Tabs"

export type WorkflowRunStatus = "pending" | "running" | "completed" | "failed" | "cancelled"
export type WorkflowSpanResource = "run" | "step" | "hook" | "sleep"

export interface WorkflowRunSummary {
  runId: string
  workflowName: string
  status: WorkflowRunStatus
  createdAt?: string
  startedAt?: string
  completedAt?: string
  duration?: string
  storage?: string
  expiresAt?: string
  moduleSpecifier?: string
  resumeAt?: string
  suspensionReason?: "webhook" | "sleep" | "error" | string
  argumentsPayload?: unknown
  inputPayload?: unknown
  outputPayload?: unknown
}

export interface WorkflowSpanRecord {
  id: string
  label: string
  duration?: string
  state?: "live" | "completed" | "failed"
  lane?: string
  startPercent?: number
  lengthPercent?: number
  subtitle?: string
  resource?: WorkflowSpanResource
  moduleSpecifier?: string
  resumeAt?: string
  suspensionReason?: "webhook" | "sleep" | "error" | string
  argumentsPayload?: unknown
  inputPayload?: unknown
  outputPayload?: unknown
}

export interface WorkflowEventRecord {
  id: string
  title: string
  timestamp?: string
  description?: string
}

export interface WorkflowStreamRecord {
  id: string
  channel: string
  payload: string
  timestamp?: string
}

export interface WorkflowRunAction {
  id: string
  label: string
  onClick?: () => void
  disabled?: boolean
  resourceTypes?: WorkflowSpanResource[]
  tone?: "neutral" | "amber" | "danger"
  surface?: "menu" | "details" | "both"
}

export interface WorkflowRunObservabilityPanelProps {
  run: WorkflowRunSummary
  spans: WorkflowSpanRecord[]
  events: WorkflowEventRecord[]
  streams: WorkflowStreamRecord[]
  searchQuery?: string
  onSearchQueryChange?: (value: string) => void
  selectedSpanId?: string | null
  onSelectSpan?: (spanId: string | null) => void
  actions?: WorkflowRunAction[]
  className?: string
}

export interface WorkflowRunObservabilityTracePanelProps {
  run: WorkflowRunSummary
  spans: WorkflowSpanRecord[]
  events: WorkflowEventRecord[]
  streams: WorkflowStreamRecord[]
  searchQuery?: string
  onSearchQueryChange?: (value: string) => void
  selectedSpanId?: string | null
  onSelectSpan?: (spanId: string | null) => void
  actions?: WorkflowRunAction[]
  className?: string
}

export interface WorkflowRunObservabilityDetailsPanelProps {
  run: WorkflowRunSummary
  spans: WorkflowSpanRecord[]
  events: WorkflowEventRecord[]
  selectedSpanId?: string | null
  onClose?: () => void
  actions?: WorkflowRunAction[]
  className?: string
}

function statusClassName(status: WorkflowRunStatus): string {
  if (status === "completed") return "text-emerald-500"
  if (status === "failed" || status === "cancelled") return "text-red-500"
  if (status === "running") return "text-amber-400"
  return "text-muted-foreground"
}

function spanStateClassName(state: WorkflowSpanRecord["state"]): string {
  if (state === "completed") return "bg-emerald-500/30 border-emerald-400/40"
  if (state === "failed") return "bg-red-500/30 border-red-400/40"
  return "bg-blue-500/25 border-blue-400/40"
}

function actionClassName(tone: WorkflowRunAction["tone"]): string {
  if (tone === "danger") {
    return "h-9 w-full border border-[#5f1c1c] bg-[#4a1414] text-[#f9c5c5] hover:bg-[#611d1d]"
  }

  if (tone === "neutral") {
    return "h-9 w-full border border-[#2a2a2f] bg-[#121318] text-[#e6e7eb] hover:bg-[#1a1c24]"
  }

  return "h-9 w-full border border-[#4e2f06] bg-[#4a2e06] text-[#f2c98d] hover:bg-[#603b08]"
}

function formatPayload(value: unknown): string {
  if (value === null || value === undefined) return "-"
  if (typeof value === "string") return value

  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

export const WorkflowRunObservabilityTracePanel = React.memo<WorkflowRunObservabilityTracePanelProps>(
  ({ run, spans, events, streams, searchQuery = "", onSearchQueryChange, selectedSpanId, onSelectSpan, actions, className }) => {
    const maxTimelinePercent = Math.max(
      ...spans.map((span) => (span.startPercent ?? 0) + (span.lengthPercent ?? 20)),
      100
    )
    const runMenuActions = React.useMemo(
      () =>
        (actions ?? []).filter((action) => {
          const isRunScoped = !action.resourceTypes?.length || action.resourceTypes.includes("run")
          if (!isRunScoped) return false
          return action.surface === "menu" || action.surface === "both" || !action.surface
        }),
      [actions]
    )

    return (
      <div className={`flex h-full min-h-0 flex-1 flex-col gap-3 overflow-hidden rounded-xl border border-[#2a2a2f] bg-[#050506] p-4 text-[#e6e7eb] ${className ?? ""}`}>
        <div className="space-y-3 border-b border-[#1f2024] pb-3">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <h3 className="font-semibold text-[50px] leading-[0.95] tracking-[-0.02em]">{run.workflowName}</h3>
              <div className="font-mono text-[#9ea0a8] text-xs">{run.runId}</div>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    aria-label="More actions"
                    className="h-8 w-8 rounded-md border border-[#2a2a2f] bg-[#111216] p-0 text-[#b8bac2] hover:bg-[#16181d]"
                    size="sm"
                    variant="ghost"
                  >
                    ...
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[180px]">
                  {runMenuActions.length ? (
                    runMenuActions.map((action) => (
                      <DropdownMenuItem
                        disabled={action.disabled}
                        key={action.id}
                        onClick={action.onClick}
                      >
                        {action.label}
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem disabled>No actions available</DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <span aria-hidden className={`ml-2 inline-block size-2 rounded-full ${statusClassName(run.status).replace("text", "bg")}`} />
              <span className={`font-medium text-sm capitalize ${statusClassName(run.status)}`}>{run.status}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs md:grid-cols-6">
            <div>
              <div className="text-[#838590]">Created</div>
              <div className="pt-0.5 text-[22px] leading-none">{run.createdAt ?? "-"}</div>
            </div>
            <div>
              <div className="text-[#838590]">Completed</div>
              <div className="pt-0.5 text-[22px] leading-none">{run.completedAt ?? "-"}</div>
            </div>
            <div>
              <div className="text-[#838590]">Duration</div>
              <div className="pt-0.5 text-[22px] leading-none">{run.duration ?? "-"}</div>
            </div>
            <div>
              <div className="text-[#838590]">Expiry</div>
              <div className="pt-0.5 text-[22px] leading-none">{run.expiresAt ?? "-"}</div>
            </div>
            <div>
              <div className="text-[#838590]">Storage</div>
              <div className="pt-0.5 text-[22px] leading-none">{run.storage ?? "-"}</div>
            </div>
            <div>
              <div className="text-[#838590]">Started</div>
              <div className="pt-0.5 text-[22px] leading-none">{run.startedAt ?? "-"}</div>
            </div>
          </div>
        </div>

        <Tabs className="flex min-h-0 flex-1 flex-col overflow-hidden" defaultValue="trace">
          <div className="flex items-center justify-between gap-3">
            <TabsList className="h-9 rounded-md border border-[#2a2a2f] bg-[#0e0f13] p-1">
              <TabsTrigger className="rounded px-3 text-xs data-[state=active]:bg-[#f5f5f5] data-[state=active]:text-[#09090b]" value="trace">Trace</TabsTrigger>
              <TabsTrigger className="rounded px-3 text-xs data-[state=active]:bg-[#f5f5f5] data-[state=active]:text-[#09090b]" value="events">Events</TabsTrigger>
              <TabsTrigger className="rounded px-3 text-xs data-[state=active]:bg-[#f5f5f5] data-[state=active]:text-[#09090b]" value="streams">Streams</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent className="min-h-0 flex-1 overflow-hidden" value="trace">
            <div className="flex h-full min-h-0 flex-col rounded-lg border border-[#2a2a2f] bg-[#07080b]">
              <div className="border-b border-[#23242a] p-2">
                <Input
                  className="h-9 border-[#2a2a2f] bg-[#07080b] text-[#e6e7eb] placeholder:text-[#73757f]"
                  onChange={(event) => onSearchQueryChange?.(event.target.value)}
                  placeholder="Search spans..."
                  value={searchQuery}
                />
              </div>

              <div className="border-b border-[#23242a] p-2">
                <div className="relative h-11 rounded-md border border-[#2a2a2f] bg-[#101116]">
                  <div className="absolute inset-y-0 left-1/4 w-px bg-[#23242a]" />
                  <div className="absolute inset-y-0 left-1/2 w-px bg-[#23242a]" />
                  <div className="absolute inset-y-0 left-3/4 w-px bg-[#23242a]" />
                  {spans.map((span, index) => {
                    const left = span.startPercent ?? index * 10
                    const width = Math.max(span.lengthPercent ?? 20, 8)
                    return (
                      <div
                        className="absolute h-1 rounded-full bg-[#84858b]"
                        key={`${span.id}-overview`}
                        style={{
                          left: `${Math.min(left, maxTimelinePercent)}%`,
                          top: `${7 + index * 8}px`,
                          width: `${Math.min(width, maxTimelinePercent - left)}%`,
                        }}
                      />
                    )
                  })}
                </div>
                <div className="mt-2 grid grid-cols-6 text-[10px] text-[#8a8c96]">
                  <span>0</span>
                  <span className="text-center">15s</span>
                  <span className="text-center">30s</span>
                  <span className="text-center">45s</span>
                  <span className="text-center">1m</span>
                  <span className="text-right">1m 30s</span>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-auto p-2">
                {spans.length === 0 ? (
                  <div className="text-[#8a8c96] text-sm">No spans yet.</div>
                ) : (
                  <div className="space-y-2">
                    {spans.map((span, index) => {
                      const selected = selectedSpanId === span.id
                      const left = span.startPercent ?? index * 10
                      const width = Math.max(span.lengthPercent ?? 22, 8)
                      return (
                        <button
                          className={`relative h-[54px] w-full overflow-hidden rounded-md border text-left transition-colors ${selected ? "border-[#2f73ff] bg-[#12274a]" : "border-[#2a2a2f] bg-[#090a0f] hover:bg-[#11131a]"}`}
                          key={span.id}
                          onClick={() => onSelectSpan?.(span.id)}
                          type="button"
                        >
                          <div
                            className={`absolute inset-y-2 rounded-sm border ${spanStateClassName(span.state)}`}
                            style={{
                              left: `${Math.min(left, maxTimelinePercent)}%`,
                              width: `${Math.min(width, maxTimelinePercent - left)}%`,
                            }}
                          />
                          <div className="relative z-10 flex items-center justify-between gap-3 px-3 py-2">
                            <div>
                              <div className="font-medium text-sm">{span.label}</div>
                              <div className="text-[#9ea0a8] text-xs">{span.subtitle ?? span.id}</div>
                            </div>
                            <div className="text-right text-xs">
                              <div>{span.duration ?? "-"}</div>
                              <div className="text-[#9ea0a8]">{span.lane ?? ""}</div>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent className="min-h-0 flex-1 overflow-hidden" value="events">
            <div className="h-full min-h-0 space-y-2 overflow-auto rounded-lg border border-[#2a2a2f] bg-[#07080b] p-3">
              {events.length === 0 ? (
                <div className="text-[#8a8c96] text-sm">No events yet.</div>
              ) : (
                events.map((event) => (
                  <div className="rounded-md border border-[#2a2a2f] bg-[#090a0f] p-2" key={event.id}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium text-sm">{event.title}</div>
                      <div className="text-[#8a8c96] text-xs">{event.timestamp ?? ""}</div>
                    </div>
                    {event.description ? (
                      <p className="mt-1 text-[#8a8c96] text-xs">{event.description}</p>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent className="min-h-0 flex-1 overflow-hidden" value="streams">
            <div className="h-full min-h-0 space-y-2 overflow-auto rounded-lg border border-[#2a2a2f] bg-[#07080b] p-3">
              {streams.length === 0 ? (
                <div className="text-[#8a8c96] text-sm">No streams yet.</div>
              ) : (
                streams.map((stream) => (
                  <div className="rounded-md border border-[#2a2a2f] bg-[#090a0f] p-2" key={stream.id}>
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <div className="font-medium">{stream.channel}</div>
                      <div className="text-[#8a8c96]">{stream.timestamp ?? ""}</div>
                    </div>
                    <pre className="mt-1 overflow-auto font-mono text-xs text-[#cfd1d9]">{stream.payload}</pre>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    )
  }
)

WorkflowRunObservabilityTracePanel.displayName = "WorkflowRunObservabilityTracePanel"

export const WorkflowRunObservabilityDetailsPanel = React.memo<WorkflowRunObservabilityDetailsPanelProps>(
  ({ run, spans, events, selectedSpanId, onClose, actions, className }) => {
    const selectedSpan = React.useMemo(
      () => spans.find((span) => span.id === selectedSpanId) ?? null,
      [spans, selectedSpanId]
    )

    const filteredActions = React.useMemo(() => {
      if (!selectedSpan?.resource) return []

      return (actions ?? []).filter((action) => {
        const isResourceMatch = !action.resourceTypes?.length || action.resourceTypes.includes(selectedSpan.resource!)
        if (!isResourceMatch) return false
        return action.surface === "details" || action.surface === "both" || !action.surface
      })
    }, [actions, selectedSpan?.resource])

    if (!selectedSpan) return null

    return (
      <aside className={`flex h-full min-h-0 flex-col rounded-lg border border-[#2a2a2f] bg-[#07080b] p-3 ${className ?? ""}`} data-testid="trace-details-panel">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm">Details</h4>
          <div className="flex items-center gap-2 text-xs">
            {selectedSpan.resource ? (
              <Badge className="bg-[#20232b] text-[#f5f7ff] capitalize" variant="secondary">
                {selectedSpan.resource}
              </Badge>
            ) : null}
            {selectedSpan.state ? (
              <Badge className="bg-[#20232b] text-[#f5f7ff]" variant="secondary">{selectedSpan.state}</Badge>
            ) : null}
            <Button
              className="h-7 w-7 rounded-md border border-[#2a2a2f] bg-[#111216] p-0 text-[#b8bac2] hover:bg-[#16181d]"
              onClick={onClose}
              size="sm"
              type="button"
              variant="ghost"
            >
              x
            </Button>
          </div>
        </div>

        <div className="mt-3 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">

        <div className="space-y-3 text-xs">
          <div>
            <div className="text-[#8a8c96]">Span</div>
            <div>{selectedSpan.label}</div>
          </div>
          <div>
            <div className="text-[#8a8c96]">ID</div>
            <div className="font-mono break-all">{selectedSpan.id}</div>
          </div>
          <div>
            <div className="text-[#8a8c96]">Duration</div>
            <div>{selectedSpan.duration ?? "-"}</div>
          </div>
        </div>

        <div className="space-y-2 border-t border-[#23242a] pt-3">
          <div className="text-[#8a8c96] text-xs uppercase tracking-wide">Actions</div>
          {filteredActions.length ? (
            filteredActions.map((action) => (
              <Button
                className={actionClassName(action.tone)}
                disabled={action.disabled}
                key={action.id}
                onClick={action.onClick}
                size="sm"
                variant="ghost"
              >
                {action.label}
              </Button>
            ))
          ) : (
            <div className="text-[#8a8c96] text-sm">No actions available.</div>
          )}
        </div>

        <div className="space-y-2 border-t border-[#23242a] pt-3 text-xs">
          <div className="text-[#8a8c96] text-xs uppercase tracking-wide">Run Details</div>
          <div className="grid grid-cols-[108px_1fr] gap-y-1">
            <span className="text-[#8a8c96]">Module</span>
            <span className="break-all">{selectedSpan.moduleSpecifier ?? run.moduleSpecifier ?? "-"}</span>
            <span className="text-[#8a8c96]">RunId</span>
            <span className="break-all">{run.runId}</span>
            <span className="text-[#8a8c96]">CreatedAt</span>
            <span>{run.startedAt ?? run.createdAt ?? "-"}</span>
            <span className="text-[#8a8c96]">ResumeAt</span>
            <span>{selectedSpan.resumeAt ?? run.resumeAt ?? "-"}</span>
            <span className="text-[#8a8c96]">Suspension</span>
            <span>{selectedSpan.suspensionReason ?? run.suspensionReason ?? "-"}</span>
          </div>

          <div className="space-y-2 pt-2">
            <div className="text-[#8a8c96] text-xs uppercase tracking-wide">Arguments</div>
            <pre className="max-h-24 overflow-auto rounded border border-[#2a2a2f] bg-[#090a0f] p-2 font-mono text-[11px] text-[#cfd1d9]">{formatPayload(selectedSpan.argumentsPayload ?? run.argumentsPayload)}</pre>
          </div>

          <div className="space-y-2">
            <div className="text-[#8a8c96] text-xs uppercase tracking-wide">Input</div>
            <pre className="max-h-24 overflow-auto rounded border border-[#2a2a2f] bg-[#090a0f] p-2 font-mono text-[11px] text-[#cfd1d9]">{formatPayload(selectedSpan.inputPayload ?? run.inputPayload)}</pre>
          </div>

          <div className="space-y-2">
            <div className="text-[#8a8c96] text-xs uppercase tracking-wide">Output</div>
            <pre className="max-h-24 overflow-auto rounded border border-[#2a2a2f] bg-[#090a0f] p-2 font-mono text-[11px] text-[#cfd1d9]">{formatPayload(selectedSpan.outputPayload ?? run.outputPayload)}</pre>
          </div>
        </div>

        <div className="space-y-2 border-t border-[#23242a] pt-3">
          <div className="font-medium text-sm">Events ({events.length})</div>
          <div className="max-h-32 divide-y divide-[#23242a] overflow-auto rounded border border-[#2a2a2f] bg-[#090a0f]">
            {events.slice(0, 3).map((event) => (
              <div className="px-2 py-1 text-xs" key={event.id}>
                <div>{event.title}</div>
                {event.timestamp ? (
                  <div className="text-[#8a8c96]">{event.timestamp}</div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        </div>
      </aside>
    )
  }
)

WorkflowRunObservabilityDetailsPanel.displayName = "WorkflowRunObservabilityDetailsPanel"

export const WorkflowRunObservabilityPanel = React.memo<WorkflowRunObservabilityPanelProps>(
  ({
    run,
    spans,
    events,
    streams,
    searchQuery = "",
    onSearchQueryChange,
    selectedSpanId,
    onSelectSpan,
    actions,
    className,
  }) => {
    return (
      <div className={`flex flex-1 flex-col gap-3 rounded-xl border border-[#2a2a2f] bg-[#050506] p-4 text-[#e6e7eb] ${className ?? ""}`}>
        <div className={`grid min-h-[560px] grid-cols-1 gap-3 ${selectedSpanId ? "lg:grid-cols-[1fr_356px]" : ""}`}>
          <WorkflowRunObservabilityTracePanel
            actions={actions}
            events={events}
            onSearchQueryChange={onSearchQueryChange}
            onSelectSpan={onSelectSpan}
            run={run}
            searchQuery={searchQuery}
            selectedSpanId={selectedSpanId}
            spans={spans}
            streams={streams}
          />
          {selectedSpanId ? (
            <WorkflowRunObservabilityDetailsPanel
              actions={actions}
              events={events}
              onClose={() => onSelectSpan?.(null)}
              run={run}
              selectedSpanId={selectedSpanId}
              spans={spans}
            />
          ) : null}
        </div>
      </div>
    )
  }
)

WorkflowRunObservabilityPanel.displayName = "WorkflowRunObservabilityPanel"
