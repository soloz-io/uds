import * as React from "react"
import { DYNAMIC_TABLE_SCHEMA_VERSION, dynamicTableSchema } from "ui-schema-contracts"
import { Alert, AlertDescription, AlertTitle } from "@/components/primitives/Alert"
import { Badge } from "@/components/primitives/Badge"
import { EnhancedDataTable } from "@/components/composites/DataTable"
import type { DashboardRow } from "@/components/composites/DataTable"
import { cn } from "@/lib/utils"

/** One criterion's result on each side: pass rate over every replay, spread across repetitions, pass^k for guardrails. */
export interface ComparisonSide {
  rate: number | null
  passes: number
  applicable: number
  spread: number | null
  passK: number | null
}

export interface ComparisonCriterion {
  index: number
  name: string
  guardrail: boolean
  baseline: ComparisonSide | null
  candidate: ComparisonSide | null
  delta: number | null
}

export interface ComparisonReportProps {
  /** Only "complete" can support accepting a candidate. */
  status: "complete" | "incomplete" | "not_comparable"
  /** Why the comparison is incomplete or not comparable. */
  problems: string[]
  /** Differences that cannot be pinned, named for the reviewer. */
  environment: string[]
  guardrailRegressions: string[]
  repetitions: number
  criteria: ComparisonCriterion[]
  className?: string
}

const pct = (n: number | null | undefined) => (n === null || n === undefined ? "—" : `${Math.round(n * 100)}%`)
const side = (s: ComparisonSide | null) => (s ? `${pct(s.rate)} (${s.passes}/${s.applicable})` : "—")
const spread = (s: ComparisonSide | null) => (s?.spread === null || s?.spread === undefined ? "—" : s.spread.toFixed(2))

const SCHEMA = dynamicTableSchema.parse({
  schemaVersion: DYNAMIC_TABLE_SCHEMA_VERSION,
  rowKey: "id",
  enableRowSelection: false,
  enablePagination: false,
  columns: [
    { key: "suite", label: "Suite", renderType: "badge", width: 100 },
    { key: "name", label: "Criterion" },
    { key: "baseline", label: "Baseline" },
    { key: "candidate", label: "Candidate" },
    { key: "delta", label: "Δ pts", align: "right" },
    { key: "spread", label: "Spread (b / c)" },
    { key: "passK", label: "pass^k (b / c)" },
  ],
})

const TITLES = {
  complete: "Complete: every replay was graded and the runs differ only in the candidate",
  incomplete: "Incomplete: this comparison cannot support accepting a candidate",
  not_comparable: "Not comparable: the runs differ in more than the candidate",
} as const

/**
 * A baseline run against a candidate run on the same dataset version: per
 * criterion pass rates, the change, the spread across repetitions and pass^k
 * on guardrails, with every reason the evidence is weak said first.
 */
export const ComparisonReport = React.memo<ComparisonReportProps>(
  ({ status, problems, environment, guardrailRegressions, repetitions, criteria, className }) => {
    const rows = React.useMemo<DashboardRow[]>(
      () =>
        criteria.map((c) => ({
          id: c.index,
          suite: c.guardrail ? "guardrail" : "north-star",
          name: c.name,
          baseline: side(c.baseline),
          candidate: side(c.candidate),
          delta: c.delta === null ? "—" : `${c.delta > 0 ? "+" : ""}${Math.round(c.delta * 100)}`,
          spread: `${spread(c.baseline)} / ${spread(c.candidate)}`,
          passK: c.guardrail ? `${pct(c.baseline?.passK)} / ${pct(c.candidate?.passK)}` : "—",
        })),
      [criteria],
    )
    return (
      <div className={cn("grid gap-3", className)}>
        <Alert variant={status === "complete" ? "default" : "destructive"}>
          <AlertTitle>{TITLES[status]}</AlertTitle>
          {problems.length > 0 && (
            <AlertDescription>
              <ul className="list-disc pl-4">
                {problems.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </AlertDescription>
          )}
        </Alert>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline">{`${repetitions} repetitions per item`}</Badge>
          {guardrailRegressions.length > 0 && <Badge variant="destructive">{`Guardrail regressions: ${guardrailRegressions.join(", ")}`}</Badge>}
        </div>
        {environment.length > 0 && (
          <ul className="list-disc pl-4 text-xs text-muted-foreground">
            {environment.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        )}
        <EnhancedDataTable data={rows} tableSchema={SCHEMA} rowActions={[]} />
      </div>
    )
  },
)
ComparisonReport.displayName = "ComparisonReport"
