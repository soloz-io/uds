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

export interface EvalSessionInfo {
  id: string;
  date: string;
  score: number;
  total: number;
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
}

/** A recommended change to the eval criteria themselves. */
export interface EvalCriteriaRecommendation {
  kind: string;
  agent?: string;
  criterion_id?: number;
  change: string;
  rationale: string;
}

export interface EvalDashboardFeatureData {
  goldenEvals: GoldenEvalResult[];
  recommendations: EvalRecommendation[];
  evalRecommendations?: EvalCriteriaRecommendation[];
  /** The eval run the verdicts belong to; labels attach to it. */
  evalRunId?: string | null;
  /** Agents that wrote lines in the transcript, for the Outputs filter. */
  transcriptAgents?: string[];
  /** The session's pack, whose criteria the rows are (null when unknown). */
  criteriaPack?: string | null;
  /** Set when the rows are the platform's fallback criteria, saying why. */
  criteriaNotice?: string | null;
  systemPrompt: string;
  outputTranscript: string;
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
  /** Records a person's verdict on one graded row; absent hides labelling. */
  onLabelVerdict?: (row: Record<string, unknown>, verdict: 'PASS' | 'FAIL' | 'N/A', explanation: string) => void;
}

export interface UseEvalDashboardFeatureReturn {
  inbox: EvalDashboardFeatureInboxState;
  data: EvalDashboardFeatureData | null;
  actionHandlers?: EvalDashboardFeatureActionHandlers;
}

export function useEvalDashboardFeature(): UseEvalDashboardFeatureReturn;
