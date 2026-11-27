import type { EvalExperimentOutcome, EvalExperimentStep, EvalScore, EvalImprovement, EvalImprovementTarget, EvalProposedChange, UseEvalDashboardFeatureReturn } from "./useEvalDashboardFeature.d"
import type { TaskItem } from "@/components/composites/TaskQueue"
import type { WorkflowNode, WorkflowEdge } from "@/components/blocks/WorkflowCanvas"
import type { RefinementMessage } from "@/components/features/ChatPanel"

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
    recommendations: [
      {
        change: "When the user waives questions, record every model-changing default as an assumption instead of asking.",
        rationale: "Two sessions failed 'Few, high-impact questions' after the user asked for defaults.",
        candidate: {
          id: "cand_01",
          pack: "business-builders",
          agent: "business-model-agent",
          status: "evaluated",
          requirements: "When the user waives questions, record every model-changing default as an assumption instead of asking.",
          rationale: "Adds an explicit waived-questions branch to the readiness instructions.",
          basePackVersion: "dev",
          artifactDigest: "sha256:4dc4a12ac3f9b7890087ca77c770",
          diff: "--- a/packages/business-builders/agents/business-model-agent/instructions/02-process.md\n+++ b/packages/business-builders/agents/business-model-agent/instructions/02-process.md\n@@ -10,3 +10,5 @@\n-Ask the user for missing facts.\n+Ask the user for missing facts, unless they asked you not to:\n+then record each default as an ASM-BIZ- assumption.",
          createdAt: "2026-07-16T12:20:00Z",
        },
      },
      { change: "Batch clarifying questions into one turn.", rationale: "The agent asked three questions across three turns." },
    ],
    goldenEvals: [
      { id: 1, category: 'Goal Completion', metric: "Was the user's objective accomplished?", pass: 1, reasoning: "The agent successfully generated the video based on the provided topic." },
      { id: 2, category: 'Conversation Progress', metric: "Does every response advance the task?", pass: 1, reasoning: "Every turn advanced the task without stalling." },
      { id: 3, category: 'Clarification Strategy', metric: "Did clarifications resolve high-impact uncertainty efficiently?", pass: 0, reasoning: "The agent asked too many clarifying questions that could have been batched." },
    ],
    systemPrompt: "// Raw System Prompt Input\nYou are the orchestrator...",
    outputTranscript: "// Raw Transcript Output\nUser: hi\nAI: How can I help you today?",
    turns: [
      {
        id: "3e2b5816b9c740f5",
        outcome: "completed",
        startedAt: "2026-07-16T10:00:00Z",
        durationMs: 11300,
        models: { orchestrator: "deepseek-flash", "business-model-agent": "deepseek-flash" },
        packVersion: "dev",
        sampled: true,
        samplingReason: "Selected at rate 0.2 (point 0.1342)",
        feedback: [{ id: "fb_01", rating: "negative", details: "It started work although I asked it not to" }],
        events: [
          { kind: "user", text: "Hi! In one short paragraph, what can you help me build? Please don't start any work yet." },
          { kind: "tool_call", agent: "orchestrator", tool: { id: "call_1", name: "read_file", args: { path: "/workspace/.global/business.ts" }, result: "Error: file not found" } },
          { kind: "agent", agent: "orchestrator", text: "I help you design and build AI-native applications." },
        ],
      },
      {
        id: "be58d79b0e2f4a11",
        outcome: "cancelled",
        outcomeReason: "Execution cancelled by user",
        durationMs: 5100,
        sampled: false,
        samplingReason: "The turn ended cancelled; only completed turns are evaluated",
        events: [{ kind: "user", text: "Build the business model for a coffee shop loyalty app." }],
      },
    ],
    feedback: [
      {
        id: "fb_01",
        rating: "negative",
        details: "It started work although I asked it not to",
        reply: "I help you design and build AI-native applications.",
        agent: "orchestrator",
        turnId: "3e2b5816b9c740f5",
        at: "2026-07-16T10:01:00Z",
      },
    ],
    datasetRuns: [
      { id: "run_cand", dataset: "Readiness", phase: "candidate", pack: "pk-cand-01m8", datasetVersion: 1, repetitions: 3, status: "completed", createdAt: "2026-07-16T12:12:00Z", comparison: {
        status: "complete",
        problems: [],
        environment: ["Agent state only: the replay starts from the source checkpoint with an empty workspace"],
        guardrailRegressions: [],
        repetitions: 3,
        criteria: [
          { index: 2, name: "Few, high-impact questions", guardrail: false, baseline: { rate: 0.5, passes: 3, applicable: 6, spread: 0.29, passK: null }, candidate: { rate: 0.83, passes: 5, applicable: 6, spread: 0, passK: null }, delta: 0.33 },
          { index: 5, name: "Only its own model", guardrail: true, baseline: { rate: 1, passes: 6, applicable: 6, spread: 0, passK: 1 }, candidate: { rate: 1, passes: 6, applicable: 6, spread: 0, passK: 1 }, delta: 0 },
        ],
      } },
      { id: "run_base", dataset: "Readiness", phase: "baseline", pack: "business-builders", datasetVersion: 1, repetitions: 3, status: "completed", createdAt: "2026-07-16T12:10:00Z" },
    ],
    rewards: [
      {
        id: "rw_3e2b",
        turnId: "3e2b5816b9c740f5",
        agent: "business-model-agent",
        model: "deepseek-flash",
        reward: 0.67,
        gated: false,
        definition: "readiness v2",
        breakdown: ["Few, high-impact questions ✓ ×2", "Readiness produces no artifact ✗ ×1", "Only its own model ✓ (guardrail)"],
        at: "2026-07-16T10:02:00Z",
      },
      {
        id: "rw_0602",
        turnId: "0602d014aa3c4f1b",
        agent: "business-model-agent",
        model: "deepseek-flash",
        reward: 0,
        gated: true,
        definition: "readiness v2",
        breakdown: ["Only its own model ✗ (guardrail)"],
        at: "2026-07-16T10:09:00Z",
      },
    ],
  },
  actionHandlers: {
    onTriggerEvaluation: () => {},
    onDownloadPrompt: async () => undefined,
    onLabelVerdict: () => {},
    onAddTurnToDataset: () => {},
    onAskAboutVerdict: () => {},
    onAskAboutTurn: () => {},
  }
}

/** The eval agent's chat about the selected evaluation: a person's question, then the ▶ workflow's alignment. */
export const evalAgentMessages: RefinementMessage[] = [
  {
    id: "m1",
    type: "human",
    role: "user",
    content: "Why did \"Few, high-impact questions\" get FAIL?",
    // "Ask why" sends the verdict as the message's attachment.
    attachments: [
      {
        id: "m1-context-0",
        kind: "item",
        mime: "application/x-item",
        filename: "Few, high-impact questions",
        source: { type: "item", value: "Few, high-impact questions" },
        title: "Few, high-impact questions",
        description: "orchestrator · judge: FAIL · your label: PASS",
        badge: "Verdict",
      },
    ],
  },
  {
    id: "m2",
    type: "ai",
    role: "orchestrator",
    avatarName: "Evals",
    content:
      "The criterion passes when the agent asks at most three questions, each changing the design. On turn 3e2b5816 the agent asked five, two of them about naming (\"What should the app be called?\", \"Any preferred colour?\"). The judge read those two as not changing the design, so it failed the turn.\n\nYour label says PASS because naming was needed for the brief. The wording does not say whether naming questions count; that is why the judge and you differ.",
  },
  {
    id: "m3",
    type: "human",
    role: "user",
    content: "Align the judge for this evaluation",
  },
  {
    id: "m4",
    type: "ai",
    role: "orchestrator",
    avatarName: "Evals",
    content:
      "\"Few, high-impact questions\": 14 labelled records (9 tuning, 5 held out).\n- Recall 0.83 (5 of 6 labelled failures caught), false-positive rate 0.38 (3 of 8 labelled passes failed).\n- All 3 false failures are turns where the agent asked for a name the brief needed.\n\nProposed wording adds the decided case: \"Questions the brief cannot be written without (the app's name, its users) count as high-impact.\" On the 5 held-out records the false-positive rate goes from 0.40 to 0.00 and recall stays 1.00. It is in Recommendations for you to accept or reject.\n\n\"Lean on the orchestrator\": 2 labelled records, too few to decide. About 8 more labels would decide it.",
  },
]

// ── The proposal, played: one evaluation improving the judge and the builder (ADR-063 §7, §8) ──

const judgeDiagnosis =
  "The judge fails \"Honest decision report\" when the agent answers Proceed on an empty workspace; your label says that's honest. Its instructions have no decided case for \"no prior work\"."
const builderDiagnosis =
  "Across the verdicts, recommendations and feedback, the business-model agent starts work without a brief: \"Readiness produces no artifact\" fails 3 of 4 graded turns."

const proposal = (c: Omit<EvalProposedChange, "decision" | "kind"> & { kind?: EvalProposedChange["kind"] }): EvalProposedChange => ({ kind: "instructions", decision: "pending", ...c })

/** What the improver proposes after your review: every change for each target pack, each to approve or reject. */
export function proposedTargets(): EvalImprovementTarget[] {
  return [
    {
      id: "eval-judge",
      kind: "judge",
      main: { passed: 38, total: 41 },
      experiments: [],
      changes: [
        proposal({
          id: "j1",
          number: 1,
          title: "Add the decided case \"no prior work: Proceed is honest\"",
          diagnosis: judgeDiagnosis,
          location: "agents/judge/instructions/10-decided-cases.md",
          diff: "+ Decided case — no prior work: when the workspace is empty, a report that says so and\n+ answers Proceed is honest. Do not fail it for missing gate results.",
        }),
        proposal({
          id: "j2",
          number: 2,
          title: "A status check with no artifact is judged on its report alone",
          diagnosis: "Two of your FAIL→PASS labels are status checks: the judge failed them for a missing artifact the turn was never asked to make.",
          location: "agents/judge/instructions/10-decided-cases.md",
          diff: "+ A status check that produces no artifact is judged on its report alone.",
        }),
      ],
    },
    {
      id: "business-builders",
      kind: "builder",
      main: { passed: 38, total: 41 },
      experiments: [],
      changes: [
        proposal({
          id: "b1",
          number: 1,
          title: "Readiness asks for the brief before authoring",
          diagnosis: builderDiagnosis,
          location: "agents/business-model-agent/instructions/04-process.md",
          diff: "- Start authoring once readiness is assessed.\n+ Start authoring only once the brief exists; if it doesn't, ask for it and stop.",
        }),
        proposal({
          id: "b2",
          number: 2,
          title: "Name the missing input in the decision report",
          diagnosis: "When the agent stops, its report says \"not ready\" without naming what is missing; two feedback comments ask what to provide.",
          location: "agents/business-model-agent/instructions/06-report.md",
          diff: "+ When you stop, name each missing input and who can provide it.",
        }),
        proposal({
          id: "b3",
          number: 3,
          kind: "criteria",
          title: "Clarify \"Few, high-impact questions\": a question the brief can't be written without counts",
          diagnosis: "3 of your labels pass turns the judge failed under this criterion: each asked for the app's name or its users, which the brief needs.",
          location: "evals/business-model-agent-evals.ts",
          diff: "+ Questions the brief cannot be written without (the app's name, its users) count as high-impact.",
        }),
      ],
    },
  ]
}

/** The steps of one experiment: commit the approved changes, build the pull request's head (the future pack), run all its golden evals against main. */
export function experimentSteps(prNumber: number | null): EvalExperimentStep[] {
  return [
    { id: "commit", label: prNumber ? `Commit the approved group to pull request #${prNumber}` : "Open a pull request with the approved group", status: "queued" },
    { id: "build", label: "Build the pull request's head", status: "queued" },
    { id: "golden", label: "Golden evals: main vs pull request", status: "queued" },
  ]
}

/**
 * How the played experiments score, from the changes a candidate carries
 * (main scores 38/41): the judge improves once it has #2 and loses a point
 * with #1 alone; the builder gains with #1 and more with #2.
 */
export function playedScore(target: EvalImprovementTarget, changes: number[]): { main: EvalScore; pullRequest: EvalScore } {
  const total = 41
  const main = 38
  const delta = target.kind === "judge" ? (changes.includes(2) ? 2 : -1) : (changes.includes(1) ? 1 : 0) + (changes.includes(2) ? 1 : 0)
  return { main: { passed: main, total }, pullRequest: { passed: Math.min(total, main + delta), total } }
}

export const outcomeOf = (score: { main: EvalScore; pullRequest: EvalScore }): EvalExperimentOutcome =>
  score.pullRequest.passed > score.main.passed ? "improved" : score.pullRequest.passed < score.main.passed ? "degraded" : "unchanged"

/** The pull request each pack's first experiment opens in the played run. */
export const playedPullRequest: Record<string, number> = { "eval-judge": 41, "business-builders": 42 }

/** A pack's top-scoring finished experiment, by the pull request's score; the latest wins a tie. */
export function topScoring(target: EvalImprovementTarget) {
  let best: EvalImprovementTarget["experiments"][number] | null = null
  for (const e of target.experiments) if (e.status === "done" && e.score && (!best || e.score.pullRequest.passed >= (best.score?.pullRequest.passed ?? -1))) best = e
  return best
}

/** The eval-improver's chat while the run plays: its messages, and the experiment steps under way as tasks. */
export function improvementChat(improvement: EvalImprovement | null | undefined): { messages: RefinementMessage[]; tasks: TaskItem[] } {
  if (!improvement || improvement.stage === "grading" || improvement.stage === "review") return { messages: [], tasks: [] }
  const say = (id: string, content: string): RefinementMessage => ({ id, type: "ai", role: "orchestrator", avatarName: "Evals", content })
  const messages: RefinementMessage[] = []
  if (improvement.stage === "proposing") messages.push(say("p0", "Reading your labels beside the judge's grades, and this evaluation's verdicts, recommendations and feedback…"))
  if (improvement.targets.length) {
    const lines = improvement.targets.map((t) => `- **${t.id}:** ${t.changes.length} change${t.changes.length === 1 ? "" : "s"}`)
    messages.push(
      say(
        "p1",
        `From this evaluation I propose:\n\n${lines.join("\n")}\n\nApprove or reject each. When you test a pack, its approved changes go into its pull request, and the pull request's head (the pack as it would be once merged) runs all the golden evals against main; rejected ones stay listed for later.`,
      ),
    )
  }
  for (const t of improvement.targets) {
    for (const e of t.experiments.filter((x) => x.status === "done")) {
      const sc = e.score ? `main ${e.score.main.passed}/${e.score.main.total}, pull request ${e.score.pullRequest.passed}/${e.score.pullRequest.total}` : "no score"
      messages.push(say(`e-${t.id}-${e.number}`, `**${t.id}**, experiment ${e.number} (changes ${e.changes.map((n) => `#${n}`).join(", ")}): ${sc}, ${e.outcome ?? "no result"}.${e.outcome === "improved" ? ` Review and merge pull request #${t.pullRequest?.number} on GitHub.` : ""}`))
    }
  }
  // Asked "which experiment is best?", the improver compares a pack's finished experiments (read_experiments_cli) and recommends; you decide.
  for (const t of improvement.targets) {
    const done = t.experiments.filter((e) => e.status === "done")
    if (done.length < 2) continue
    const best = topScoring(t)!
    const lines = done.map((e) => `- **Experiment ${e.number}** (${e.changes.length} change${e.changes.length === 1 ? "" : "s"}: ${e.changes.map((n) => `#${n}`).join(", ")}): pull request ${e.score?.pullRequest.passed}/${e.score?.pullRequest.total} against main ${e.score?.main.passed}/${e.score?.main.total}, ${e.outcome}`)
    const head = t.experiments.find((e) => e.id === t.head)
    messages.push(
      say(
        `best-${t.id}`,
        `**${t.id}**, compared on all golden evals against main:\n\n${lines.join("\n")}\n\nI recommend experiment ${best.number}.${
          head?.id === best.id ? ` It is what pull request #${t.pullRequest?.number} holds now.` : ` The pull request holds experiment ${head?.number}; open experiment ${best.number} in the bar and use it to set the pull request back to its group without re-running.`
        }`,
      ),
    )
  }
  const tasks: TaskItem[] = improvement.targets.flatMap((t) =>
    t.experiments
      .filter((e) => e.status === "running")
      .flatMap((e) =>
        e.steps
          .filter((st) => st.status === "running")
          .map((st) => ({ id: `${t.id}-${e.number}-${st.id}`, command: `${t.id} · experiment ${e.number} · ${st.label}`, status: "running" as const, description: st.detail ?? undefined })),
      ),
  )
  return { messages, tasks }
}
