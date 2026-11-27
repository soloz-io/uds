/** Which pack a target improves (ADR-063 §6): the eval-judge, or the graded builder pack. */
export type EvalImprovementTargetKind = 'judge' | 'builder';

/** An experiment's outcome (ADR-063 §8.5): the pull request's score against main's. */
export type EvalExperimentOutcome = 'improved' | 'unchanged' | 'degraded';

/** A score on all golden evals: criteria passed over criteria applicable. */
export interface EvalScore {
  passed: number;
  total: number;
}

/**
 * The person's decision on a proposal. Only approved proposals are committed
 * and tested; a rejected one stays listed and can be approved later.
 */
export type EvalChangeDecision = 'pending' | 'approved' | 'rejected';

/** What a change edits (ADR-063 §8.2): instructions, or evaluation criteria. Nothing else. */
export type EvalChangeKind = 'instructions' | 'criteria';

/** One change the improver proposes to a target pack, from the evaluation's shared evidence. */
export interface EvalProposedChange {
  id: string;
  /** Its number within its target, in the order proposed. */
  number: number;
  kind: EvalChangeKind;
  /** The change in a line. */
  title: string;
  /** Why: what in the evidence it addresses. */
  diagnosis: string;
  /** The change, as a diff. */
  diff: string;
  /** The file it changes within the pack, e.g. "agents/judge/instructions/10-decided-cases.md". */
  location: string;
  /** Can change at any time; the next experiment's commit brings the pull request in line with the approved group. */
  decision: EvalChangeDecision;
}

/** One step of an experiment: committing the approved changes, building the pull request's head, running all golden evals. */
export interface EvalExperimentStep {
  id: string;
  label: string;
  /** cancelled: not run, because an earlier step failed. */
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  /** Progress or result, e.g. "5 of 8 records" or "Improvement demonstrated". */
  detail?: string | null;
}

/**
 * One experiment on a target pack (ADR-063 §8.3, §8.8): the pull request's
 * head holding exactly the approved group (the pack as it would be once
 * merged), run on all the pack's golden evals against main.
 */
export interface EvalExperiment {
  id: string;
  number: number;
  /** When it started (ISO): its place on the Experiments Analysis chart. */
  startedAt: string;
  /** The approved group the candidate carries, by change number. */
  changes: number[];
  status: 'running' | 'done';
  /** Both sides' scores on all golden evals, once the run ends. */
  score?: { main: EvalScore; pullRequest: EvalScore } | null;
  /** improved: the pull request scores higher than main; degraded: lower; unchanged: equal. */
  outcome?: EvalExperimentOutcome | null;
  steps: EvalExperimentStep[];
}

/** One target pack of the evaluation's improvement: its proposals, its pull request and its experiments. */
export interface EvalImprovementTarget {
  /** The pack, e.g. "eval-judge" or "business-builders". */
  id: string;
  kind: EvalImprovementTargetKind;
  changes: EvalProposedChange[];
  /** main's score on the pack's golden evals: the chart's starting point. */
  main?: EvalScore | null;
  /** Opened by the first experiment, with only approved changes in it. */
  pullRequest?: { number: number; url: string } | null;
  /**
   * The experiment whose approved group the pull request's head holds: the
   * last one started, or one restored with "Use this experiment". Its result
   * is the one reported for review and merge.
   */
  head?: string | null;
  experiments: EvalExperiment[];
}

export interface EvalImprovementPanelProps {
  /** The evaluation's target packs, one chip each. */
  targets: EvalImprovementTarget[]
  /** Whether testing can run: it commits to GitHub (ADR-059). */
  gitConnected: boolean
  /** The pack shown; defaults to the first. */
  selectedTargetId?: string | null
  onSelectTarget?: (targetId: string) => void
  onApproveChange?: (changeId: string) => void
  onRejectChange?: (changeId: string) => void
  onTestApproved?: (targetId: string) => void
  onOpenPullRequest?: (url: string) => void
  className?: string
}
