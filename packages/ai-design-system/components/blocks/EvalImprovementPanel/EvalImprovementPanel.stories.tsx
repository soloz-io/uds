import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { EvalImprovementPanel } from "./EvalImprovementPanel"
import type { EvalImprovementTarget } from "./interfaces"

const meta = {
  title: "Blocks/EvalImprovementPanel",
  component: EvalImprovementPanel,
  parameters: { layout: "padded" },
} satisfies Meta<typeof EvalImprovementPanel>

export default meta
type Story = StoryObj<typeof meta>

const targets: EvalImprovementTarget[] = [
  {
    id: "eval-judge",
    kind: "judge",
    pullRequest: { number: 41, url: "https://github.com/acme/eval-judge/pull/41" },
    changes: [
      { id: "j1", number: 1, kind: "instructions", title: "Add the decided case \"no prior work: Proceed is honest\"", diagnosis: "The judge fails honest Proceed reports on an empty workspace.", location: "agents/judge/instructions/10-decided-cases.md", diff: "+ Decided case — no prior work: Proceed is honest.", decision: "approved" },
      { id: "j2", number: 2, kind: "instructions", title: "A status check with no artifact is judged on its report alone", diagnosis: "Two FAIL→PASS labels are status checks.", location: "agents/judge/instructions/10-decided-cases.md", diff: "+ A status check that produces no artifact is judged on its report alone.", decision: "rejected" },
    ],
    experiments: [
      {
        id: "e1",
        number: 1,
        startedAt: "2026-11-27T10:00:00Z",
        changes: [1],
        status: "done",
        outcome: "degraded",
        score: { main: { passed: 38, total: 41 }, pullRequest: { passed: 37, total: 41 } },
        steps: [
          { id: "commit", label: "Open a pull request with the approved changes", status: "completed", detail: "commit a1f3c9e" },
          { id: "build", label: "Build the pull request's head", status: "completed", detail: "pk-…@sha256:9f2a" },
          { id: "golden", label: "Golden evals: main vs pull request", status: "failed", detail: "main 38/41 · pull request 37/41 · Degraded" },
        ],
      },
    ],
  },
  {
    id: "business-builders",
    kind: "builder",
    experiments: [],
    changes: [
      { id: "b1", number: 1, kind: "instructions", title: "Readiness asks for the brief before authoring", diagnosis: "The agent starts work without a brief.", location: "agents/business-model-agent/instructions/04-process.md", diff: "- Start authoring once readiness is assessed.\n+ Start authoring only once the brief exists.", decision: "pending" },
    ],
  },
]

/** A judge experiment that degraded the score, with a rejected proposal that can still be approved; the builder pack awaits decisions. */
export const Default: Story = {
  args: { targets, gitConnected: true },
}

/** Without GitHub, proposals can be decided but not tested. */
export const WithoutGitConnection: Story = {
  args: { targets, gitConnected: false, selectedTargetId: "business-builders" },
}

/** Decisions held in state, to try approving, rejecting and changing your mind. */
export const Interactive: Story = {
  args: { targets, gitConnected: true },
  render: (args) => {
    const [state, setState] = React.useState(args.targets)
    const decide = (id: string, decision: "approved" | "rejected") =>
      setState((ts) => ts.map((t) => ({ ...t, changes: t.changes.map((c) => (c.id === id ? { ...c, decision } : c)) })))
    return <EvalImprovementPanel {...args} targets={state} onApproveChange={(id) => decide(id, "approved")} onRejectChange={(id) => decide(id, "rejected")} onTestApproved={() => {}} />
  },
}
