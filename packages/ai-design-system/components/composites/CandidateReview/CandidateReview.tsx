import * as React from "react"
import { Badge } from "@/components/primitives/Badge"
import { Button } from "@/components/primitives/Button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/primitives/Card"
import { cn } from "@/lib/utils"

export type CandidateStatus =
  | "draft"
  | "building"
  | "evaluated"
  | "accepted"
  | "rejected"
  | "error"
  | string

export interface CandidateReviewProps {
  pack?: string
  agent?: string
  status?: CandidateStatus
  requirements?: string
  rationale?: string | null
  basePackVersion?: string | null
  artifactDigest?: string | null
  diff?: string | null
  decisionReason?: string | null
  error?: string | null
  onOpenDecision?: () => void
  /** The button's label (default "View Decision"), e.g. "Open pull request". */
  openLabel?: string
  className?: string
}

export const CandidateReview: React.FC<CandidateReviewProps> = ({
  pack,
  agent,
  status,
  requirements,
  rationale,
  basePackVersion,
  artifactDigest,
  diff,
  decisionReason,
  error,
  onOpenDecision,
  openLabel = "View Decision",
  className,
}) => {
  return (
    <Card className={cn("border border-border bg-card", className)}>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            {pack} / {agent}
          </CardTitle>
          {status && <Badge variant="outline">{status}</Badge>}
        </div>
        {requirements && (
          <CardDescription className="text-xs text-muted-foreground mt-1">
            {requirements}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-3">
        {rationale && (
          <div className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Rationale: </span>
            {rationale}
          </div>
        )}
        {basePackVersion && (
          <div className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Base Version: </span>
            {basePackVersion}
          </div>
        )}
        {artifactDigest && (
          <div className="text-xs font-mono text-muted-foreground truncate">
            <span className="font-semibold text-foreground">Digest: </span>
            {artifactDigest}
          </div>
        )}
        {decisionReason && (
          <div className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Decision: </span>
            {decisionReason}
          </div>
        )}
        {error && (
          <div className="text-xs text-destructive">
            <span className="font-semibold">Error: </span>
            {error}
          </div>
        )}
        {diff && (
          <div className="rounded border border-border bg-muted/40 p-3 font-mono text-xs overflow-x-auto">
            <pre className="whitespace-pre-wrap">{diff}</pre>
          </div>
        )}
        {onOpenDecision && (
          <Button variant="outline" size="sm" onClick={onOpenDecision}>
            {openLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
