export interface GoldenEvalResult {
  id: number;
  category: string;
  metric: string;
  pass: 0 | 1;
  reasoning: string;
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

export interface EvalDashboardFeatureData {
  goldenEvals: GoldenEvalResult[];
  recommendations: EvalRecommendation[];
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
}

export interface UseEvalDashboardFeatureReturn {
  inbox: EvalDashboardFeatureInboxState;
  data: EvalDashboardFeatureData | null;
  actionHandlers?: EvalDashboardFeatureActionHandlers;
}

export function useEvalDashboardFeature(): UseEvalDashboardFeatureReturn;
