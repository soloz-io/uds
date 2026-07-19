import type { UseEvalDashboardFeatureReturn } from "./useEvalDashboardFeature.d"
import type { WorkflowNode, WorkflowEdge } from "@/components/blocks/WorkflowCanvas"

export const workflowMockNodes: WorkflowNode[] = [
  { id: 'trigger-1', type: 'trigger', position: { x: 100, y: 20 }, data: { label: 'Agentic Eval', type: 'trigger', status: 'idle' } },
  { id: 'state-1', type: 'state', position: { x: 250, y: 20 }, data: { label: 'Initialize Eval', type: 'state', description: 'Parse session messages and config', status: 'idle' } },
  { id: 'transition-1', type: 'transition', position: { x: 400, y: 20 }, data: { label: 'Parse Session', type: 'transition', status: 'idle' } },
  { id: 'state-2', type: 'state', position: { x: 250, y: 140 }, data: { label: 'Fetch System Prompt', type: 'state', description: 'Load system prompt from session', status: 'idle' } },
  { id: 'transition-2', type: 'transition', position: { x: 400, y: 140 }, data: { label: 'Check Config', type: 'transition', description: 'Check if multi-agent config exists', status: 'idle' } },
  { id: 'state-2b', type: 'state', position: { x: 250, y: 260 }, data: { label: 'Fetch Config Prompt', type: 'state', description: 'Load agent config system prompt', status: 'idle' } },
  { id: 'transition-2b', type: 'transition', position: { x: 400, y: 260 }, data: { label: 'Format Prompt', type: 'transition', description: 'Build multi-agent system prompt', status: 'idle' } },
  { id: 'state-3', type: 'state', position: { x: 250, y: 380 }, data: { label: 'Build Messages', type: 'state', description: 'Construct LLM message payload', status: 'idle' } },
  { id: 'transition-3', type: 'transition', position: { x: 400, y: 380 }, data: { label: 'LLM Call', type: 'transition', status: 'idle' } },
  { id: 'state-4', type: 'state', position: { x: 250, y: 500 }, data: { label: 'Parse Eval', type: 'state', description: 'Parse LLM eval response', status: 'idle' } },
  { id: 'transition-4', type: 'transition', position: { x: 400, y: 500 }, data: { label: 'Persist', type: 'transition', status: 'idle' } },
  { id: 'state-5', type: 'state', position: { x: 250, y: 620 }, data: { label: 'Complete', type: 'state', description: 'Eval finished', status: 'idle', isTerminal: true } },
]

export const workflowMockEdges: WorkflowEdge[] = [
  { id: 'e-trigger-1', source: 'trigger-1', target: 'state-1' },
  { id: 'e-1-transition-1', source: 'state-1', target: 'transition-1' },
  { id: 'e-transition-1-2', source: 'transition-1', target: 'state-2' },
  { id: 'e-2-transition-2', source: 'state-2', target: 'transition-2' },
  { id: 'e-transition-2-2b', source: 'transition-2', target: 'state-2b' },
  { id: 'e-2b-transition-2b', source: 'state-2b', target: 'transition-2b' },
  { id: 'e-transition-2b-3', source: 'transition-2b', target: 'state-3' },
  { id: 'e-3-transition-3', source: 'state-3', target: 'transition-3' },
  { id: 'e-transition-3-4', source: 'transition-3', target: 'state-4' },
  { id: 'e-4-transition-4', source: 'state-4', target: 'transition-4' },
  { id: 'e-transition-4-5', source: 'transition-4', target: 'state-5' },
]

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
    recommendations: [],
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
