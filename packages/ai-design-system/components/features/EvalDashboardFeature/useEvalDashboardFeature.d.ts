import type { TimelineTurn } from '@/components/blocks/TurnTimeline';
import type { ComparisonReportProps } from '@/components/blocks/ComparisonReport';
import type { CandidateStatus } from '@/components/composites/CandidateReview';

export interface EvalConversationalFeedback {
  id: string;
  rating: 'positive' | 'negative';
  /** What the person said about the reply. */
  details?: string | null;
  /** The reply it is about, as written. */
  reply?: string | null;
  agent?: string | null;
  turnId?: string | null;
  at: string;
}

export interface EvalDatasetRun {
  id: string;
  dataset: string;
  /** Stated when the run started; never inferred. */
  phase: 'baseline' | 'candidate';
  pack: string;
  datasetVersion: number;
  repetitions: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  error?: string | null;
  createdAt: string;
  comparison?: ComparisonReportProps | null;
}

export interface EvalImprovementCandidate {
  id: string;
  pack: string;
  agent: string;
  status: CandidateStatus;
  requirements: string;
  rationale?: string | null;
  basePackVersion?: string | null;
  artifactDigest?: string | null;
  diff?: string | null;
  decisionReason?: string | null;
  error?: string | null;
  createdAt: string;
  comparison?: ComparisonReportProps | null;
}

/**
 * Where one evaluation is in its improvement run (ADR-063 §7): the judge
 * grades; the person reviews once; the improver proposes changes; the person
 * approves which to test; approved changes are tested; validated changes go to
 * pull requests for the person to review and merge.
 */
export type EvalImprovementStage =
  | 'grading'
  | 'review'
  | 'proposing'
  | 'proposals'
  | 'testing'
  | 'approval'
  | 'done'
  | 'nothing-to-improve';

import type {
  EvalImprovementTargetKind,
  EvalExperimentOutcome,
  EvalScore,
  EvalChangeDecision,
  EvalChangeKind,
  EvalProposedChange,
  EvalExperimentStep,
  EvalExperiment,
  EvalImprovementTarget,
} from '@/components/blocks/EvalImprovementPanel';
export type {
  EvalImprovementTargetKind,
  EvalExperimentOutcome,
  EvalScore,
  EvalChangeDecision,
  EvalChangeKind,
  EvalProposedChange,
  EvalExperimentStep,
  EvalExperiment,
  EvalImprovementTarget,
};

/** Whether the app is connected to GitHub, where changes are committed and built (ADR-059). */
export interface EvalGitConnection {
  connected: boolean;
  /** The GitHub account the app's installation belongs to. */
  account?: string | null;
  /** The app's Connections page. */
  connectionsUrl: string;
}

/** One evaluation's improvement run: one source of evidence, changes to the judge and the builders (ADR-063 §8). */
export interface EvalImprovement {
  stage: EvalImprovementStage;
  /** The person's review, while it's open. */
  review?: { labelled: number; graded: number } | null;
  targets: EvalImprovementTarget[];
  git: EvalGitConnection;
}

/** A graded turn's reward under one reward definition. */
export interface EvalTurnReward {
  id: string;
  turnId: string;
  agent: string;
  model?: string | null;
  /** 0..1; null when no term of the definition applied. */
  reward: number | null;
  /** True when a failed guardrail set the reward to 0. */
  gated: boolean;
  /** The definition it was computed under, e.g. "readiness v2". */
  definition: string;
  /** Each term by criterion name, e.g. "Few, high-impact questions ✓ ×1". */
  breakdown: string[];
  at: string;
}

export interface GoldenEvalResult {
  id: number;
  category: string;
  metric: string;
  /** 1 pass, 0 fail, "N/A" the criterion did not apply, "-" not graded yet. */
  pass: 0 | 1 | 'N/A' | '-';
  reasoning: string;
  /** The agent graded; absent for platform-wide criteria. */
  agent?: string | null;
  /** "code" for a declared tool-call check, "judge" for the judge model. */
  evaluator?: 'code' | 'judge';
  suite?: 'guardrail' | 'north-star';
  /** A person's verdict on this row, if labelled. */
  humanVerdict?: 'PASS' | 'FAIL' | 'N/A' | null;
  humanExplanation?: string | null;
  [k: string]: unknown;
}

/** An eval run's outcome. failed and cancelled carry their reason. */
export type EvalRunStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface EvalSessionInfo {
  id: string;
  date: string;
  score: number;
  total: number;
  /** The newest evaluation attempt's outcome, null when never evaluated. */
  status?: EvalRunStatus | null;
  /** Where its improvement run is, when one is under way. */
  stage?: EvalImprovementStage | null;
  latency?: string;
  tokens?: number;
}

export interface EvalDashboardFeatureInboxState {
  items: EvalSessionInfo[];
  selectedItemId: string | null;
  onSelectItem: (id: string | null) => void;
  isLoading?: boolean;
  error?: string;
}

export interface EvalRecommendation {
  change: string;
  rationale: string;
  priority?: number;
  expected_metrics?: number[];
  /** The change made from this recommendation, when one was: built, compared and decided. */
  candidate?: EvalImprovementCandidate | null;
}

/** A recommended change to the eval criteria themselves. */
export interface EvalCriteriaRecommendation {
  kind: string;
  agent?: string;
  criterion_id?: number;
  change: string;
  rationale: string;
  /** The change made from this recommendation, when one was. */
  candidate?: EvalImprovementCandidate | null;
}

export interface EvalDashboardFeatureData {
  goldenEvals: GoldenEvalResult[];
  recommendations: EvalRecommendation[];
  evalRecommendations?: EvalCriteriaRecommendation[];
  /** The eval run the verdicts belong to; labels attach to it. */
  evalRunId?: string | null;
  /** The newest evaluation attempt, which may be newer than the verdicts shown. */
  latestEvalRun?: { id: string; status: EvalRunStatus; error: string | null; at: string } | null;
  /** Agents that wrote lines in the transcript, for the Outputs filter. */
  transcriptAgents?: string[];
  /** The session's pack, whose criteria the rows are. */
  criteriaPack?: string;
  systemPrompt: string;
  outputTranscript: string;
  /** The session's turns as recorded: outcome, sampling decision, the user's feedback, models and tool calls. */
  turns?: TimelineTurn[];
  /** Per turn id, why its trace could not be opened. */
  traceNotices?: Record<string, string>;
  /**
   * Conversational feedback on the session's replies: a person's thumbs and
   * what they said (an annotation of kind HUMAN named user_feedback, as Phoenix
   * records it). Kept apart from the expert labels on the graded criteria.
   */
  feedback?: EvalConversationalFeedback[];
  /** The app's dataset runs; a candidate run carries its comparison with the baseline. */
  datasetRuns?: EvalDatasetRun[];
  /** One reward per graded turn, as Harbor shows one per rollout: the training signal for fine-tuning. */
  rewards?: EvalTurnReward[];
  /** The evaluation's improvement run, when one exists (ADR-063 §7, §8). */
  improvement?: EvalImprovement | null;
  runsHistory?: Array<{
    id: string;
    session_id: string;
    date: string;
    score: number;
    total: number;
  }>;
}

import type { FileDownloadResult } from '@/components/composites/FileTreeExplorer';

export interface EvalDashboardFeatureActionHandlers {
  onTriggerEvaluation?: () => void;
  onDownloadPrompt?: () => Promise<FileDownloadResult | undefined>;
  isTriggering?: boolean;
  timeRange?: string;
  onTimeRangeChange?: (range: string) => void;
  /** Opens a turn's trace; absent hides the link. */
  onOpenTrace?: (turnId: string) => void;
  /** Adds a turn to the app's evaluation dataset; absent hides the action. */
  onAddTurnToDataset?: (turnId: string) => void;
  /** Opens where a person decides on an evaluated improvement candidate. */
  onOpenDecision?: (candidateId: string) => void;
  /** Records a person's verdict on one graded row; absent hides labelling. */
  onLabelVerdict?: (row: Record<string, unknown>, verdict: 'PASS' | 'FAIL' | 'N/A', explanation: string) => void;
  /** Asks the eval agent why the judge graded one criterion as it did; absent hides the action. */
  onAskAboutVerdict?: (row: Record<string, unknown>) => void;
  /** Asks the eval agent about one turn; absent hides the action. */
  onAskAboutTurn?: (turnId: string) => void;
  /** Ends the person's review: their labels go to the improver (ADR-063 §7). */
  onFinishReview?: () => void;
  /** Approves a proposal; nothing is committed or run until an experiment starts. */
  onApproveChange?: (changeId: string) => void;
  /** Rejects a proposal; it stays listed, and a decision can change at any time. */
  onRejectChange?: (changeId: string) => void;
  /** Starts a pack's next experiment on its approved group, when no earlier experiment ran on that group: the group is committed to the pull request (opened if none) and all golden evals run on its head against main. */
  onTestApproved?: (targetId: string) => void;
  /**
   * Sets a pack's pull request back to an earlier experiment's approved group
   * and reuses that experiment's result: no build, no run (ADR-063 §8.9).
   */
  onUseExperiment?: (targetId: string, experimentId: string) => void;
  /** Opens a change's pull request on GitHub, to review and merge it. */
  onOpenPullRequest?: (url: string) => void;
  /** Opens the app's Connections page, to connect GitHub. */
  onOpenConnections?: (url: string) => void;
}

export interface UseEvalDashboardFeatureReturn {
  inbox: EvalDashboardFeatureInboxState;
  data: EvalDashboardFeatureData | null;
  actionHandlers?: EvalDashboardFeatureActionHandlers;
}

export function useEvalDashboardFeature(): UseEvalDashboardFeatureReturn;
