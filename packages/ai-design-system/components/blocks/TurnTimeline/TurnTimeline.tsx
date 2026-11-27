import * as React from "react"
import { Badge } from "@/components/primitives/Badge"
import { Button } from "@/components/primitives/Button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/primitives/Collapsible"
import { Icon } from "@/components/primitives/Icon"
import { ToolCallDisplay } from "@/components/composites/ToolCallDisplay"
import { cn } from "@/lib/utils"

/** One step of a turn: a message, or a tool call with its result. */
export type TimelineEvent =
  | { kind: "user" | "agent"; agent?: string | null; text: string }
  | { kind: "tool_call"; agent?: string | null; tool: { id: string; name: string; args: Record<string, unknown>; result?: string } };

/** A person's thumbs on a message of the turn: an outcome signal, kept apart from expert labels. */
export interface TimelineFeedback {
  id: string
  rating: "positive" | "negative"
  details?: string | null
}

export interface TimelineTurn {
  /** Null for rows written before turns were recorded. */
  id: string | null
  outcome?: "completed" | "interrupted" | "cancelled" | "failed" | "lost" | null
  outcomeReason?: string | null
  startedAt?: string | null
  durationMs?: number | null
  /** The model each agent ran, as the turn recorded it. */
  models?: Record<string, string> | null
  packVersion?: string | null
  /** Whether sampling selected the turn for evaluation, and why. */
  sampled?: boolean | null
  samplingReason?: string | null
  events: TimelineEvent[]
  feedback?: TimelineFeedback[]
}

export interface TurnTimelineProps {
  turns: TimelineTurn[]
  /** Opens the turn's trace; the message is shown when the trace cannot be opened. */
  onOpenTrace?: (turnId: string) => void
  /** Per turn id, why its trace could not be opened. */
  traceNotices?: Record<string, string>
  onAddToDataset?: (turnId: string) => void
  /** Asks the eval agent about one turn; absent hides the action. */
  onAskAboutTurn?: (turnId: string) => void
  emptyMessage?: string
  className?: string
}

const OUTCOME_VARIANT: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  completed: "success",
  interrupted: "warning",
  cancelled: "secondary",
  failed: "destructive",
  lost: "destructive",
}

function seconds(ms?: number | null) {
  return ms === null || ms === undefined ? null : `${(ms / 1000).toFixed(1)}s`
}

const TurnCard = React.memo<{
  turn: TimelineTurn
  index: number
  onOpenTrace?: (turnId: string) => void
  traceNotice?: string
  onAddToDataset?: (turnId: string) => void
  onAskAboutTurn?: (turnId: string) => void
}>(({ turn, index, onOpenTrace, traceNotice, onAddToDataset, onAskAboutTurn }) => {
  const toolCalls = turn.events.filter((e) => e.kind === "tool_call").length
  const positive = (turn.feedback ?? []).filter((f) => f.rating === "positive").length
  const negative = (turn.feedback ?? []).filter((f) => f.rating === "negative").length
  return (
    <Collapsible defaultOpen={index === 0} className="rounded-lg border border-border bg-card">
      <div className="flex flex-wrap items-center gap-2 px-3 py-2">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="group h-7 gap-1 px-1.5 font-medium">
            <Icon name="chevron-right" size="xs" className="transition-transform group-data-[state=open]:rotate-90" />
            {turn.id ? `Turn ${turn.id.slice(0, 8)}` : "Unrecorded rows"}
          </Button>
        </CollapsibleTrigger>
        {turn.outcome && <Badge variant={OUTCOME_VARIANT[turn.outcome] ?? "secondary"}>{turn.outcome}</Badge>}
        {turn.sampled !== null && turn.sampled !== undefined && (
          <Badge variant={turn.sampled ? "info" : "outline"} title={turn.samplingReason ?? undefined}>
            {turn.sampled ? "sampled" : "not sampled"}
          </Badge>
        )}
        {positive > 0 && <Badge variant="success">{`${positive} 👍`}</Badge>}
        {negative > 0 && <Badge variant="destructive">{`${negative} 👎`}</Badge>}
        <span className="text-xs text-muted-foreground">
          {[turn.startedAt ? new Date(turn.startedAt).toLocaleString() : null, seconds(turn.durationMs), `${toolCalls} tool calls`]
            .filter(Boolean)
            .join(" · ")}
        </span>
        <span className="ml-auto flex items-center gap-1">
          {turn.id && onOpenTrace && (
            <Button variant="outline" size="sm" className="h-7" onClick={() => onOpenTrace(turn.id!)}>
              Trace
            </Button>
          )}
          {turn.id && onAddToDataset && (
            <Button variant="outline" size="sm" className="h-7" onClick={() => onAddToDataset(turn.id!)}>
              Add to dataset
            </Button>
          )}
          {turn.id && onAskAboutTurn && (
            <Button variant="outline" size="sm" className="h-7" onClick={() => onAskAboutTurn(turn.id!)}>
              Ask about this turn
            </Button>
          )}
        </span>
      </div>
      {traceNotice && <p className="px-3 pb-2 text-xs text-muted-foreground">{traceNotice}</p>}
      <CollapsibleContent className="grid gap-2 border-t border-border px-3 py-3">
        {turn.outcomeReason && <p className="text-xs text-muted-foreground">{turn.outcomeReason}</p>}
        {turn.models && (
          <p className="text-xs text-muted-foreground">
            {[turn.packVersion ? `pack ${turn.packVersion}` : null, ...Object.entries(turn.models).map(([agent, model]) => `${agent}: ${model}`)]
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}
        {turn.events.map((event, i) =>
          event.kind === "tool_call" ? (
            <div key={i} className="grid gap-1">
              <span className="text-xs text-muted-foreground">{event.agent ?? "orchestrator"}</span>
              <ToolCallDisplay
                toolCall={{ id: event.tool.id, name: event.tool.name, args: event.tool.args, result: event.tool.result, status: event.tool.result === undefined ? "error" : "completed" }}
              />
            </div>
          ) : (
            <div key={i} className="grid gap-1 text-sm">
              <span className="text-xs text-muted-foreground">{event.kind === "user" ? "user" : (event.agent ?? "orchestrator")}</span>
              <p className={cn("whitespace-pre-wrap", event.kind === "user" && "text-foreground/80")}>{event.text}</p>
            </div>
          ),
        )}
        {(turn.feedback ?? []).filter((f) => f.details).map((f) => (
          <p key={f.id} className="text-xs text-muted-foreground">{`User feedback (${f.rating}): ${f.details}`}</p>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
})
TurnCard.displayName = "TurnCard"

/**
 * A session as its turns, newest-first or oldest-first as given: each turn's
 * outcome, sampling decision, the user's feedback, the models it ran, and its
 * steps with every tool call beside its result.
 */
export const TurnTimeline = React.memo<TurnTimelineProps>(
  ({ turns, onOpenTrace, traceNotices, onAddToDataset, onAskAboutTurn, emptyMessage = "No turns recorded for this session.", className }) => {
    if (turns.length === 0) return <p className={cn("text-sm text-muted-foreground", className)}>{emptyMessage}</p>
    return (
      <div className={cn("grid gap-3", className)}>
        {turns.map((turn, index) => (
          <TurnCard
            key={turn.id ?? `unrecorded-${index}`}
            turn={turn}
            index={index}
            onOpenTrace={onOpenTrace}
            traceNotice={turn.id ? traceNotices?.[turn.id] : undefined}
            onAddToDataset={onAddToDataset}
            onAskAboutTurn={onAskAboutTurn}
          />
        ))}
      </div>
    )
  },
)
TurnTimeline.displayName = "TurnTimeline"
