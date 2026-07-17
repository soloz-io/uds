import type { UseEvalDashboardFeatureReturn } from "./useEvalDashboardFeature.d"

export const evalDashboardFeatureStateMock: UseEvalDashboardFeatureReturn = {
  inbox: {
    items: [
      { id: 'sess_1', date: '2026-07-16T10:00:00Z', score: 38, total: 41, latency: '2.3s', tokens: 4500 },
      { id: 'sess_2', date: '2026-07-16T11:30:00Z', score: 40, total: 41, latency: '1.9s', tokens: 3200 },
      { id: 'sess_3', date: '2026-07-16T12:45:00Z', score: 41, total: 41, latency: '2.1s', tokens: 3800 },
    ],
    selectedItemId: 'sess_1',
    onSelectItem: () => {},
  },
  data: {
    goldenEvals: [
      { id: 1, category: 'Goal Completion', metric: "Was the user's objective accomplished?", pass: 1, reasoning: "The agent successfully generated the video based on the provided topic." },
      { id: 2, category: 'Conversation Progress', metric: "Does every response advance the task?", pass: 1, reasoning: "Every turn advanced the task without stalling." },
      { id: 3, category: 'Clarification Strategy', metric: "Did clarifications resolve high-impact uncertainty efficiently?", pass: 0, reasoning: "The agent asked too many clarifying questions that could have been batched." },
    ],
    systemPrompt: "// Raw System Prompt Input\nYou are the orchestrator...",
    outputTranscript: "// Raw Transcript Output\nUser: hi\nAI: How can I help you today?",
  },
  actionHandlers: {
    onTriggerEvaluation: () => {},
  }
}
