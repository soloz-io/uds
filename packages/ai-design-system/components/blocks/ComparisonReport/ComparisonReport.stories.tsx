import type { Meta, StoryObj } from "@storybook/react"
import { ComparisonReport } from "./ComparisonReport"

const meta = {
  title: "Blocks/ComparisonReport",
  component: ComparisonReport,
  parameters: { layout: "padded" },
} satisfies Meta<typeof ComparisonReport>

export default meta
type Story = StoryObj<typeof meta>

const criteria = [
  {
    index: 3,
    name: "Few, high-impact questions",
    guardrail: false,
    baseline: { rate: 0.5, passes: 3, applicable: 6, spread: 0.29, passK: null },
    candidate: { rate: 0.83, passes: 5, applicable: 6, spread: 0.0, passK: null },
    delta: 0.33,
  },
  {
    index: 7,
    name: "Only its own model",
    guardrail: true,
    baseline: { rate: 1, passes: 6, applicable: 6, spread: 0, passK: 1 },
    candidate: { rate: 0.83, passes: 5, applicable: 6, spread: 0.29, passK: 0.5 },
    delta: -0.17,
  },
]

export const Complete: Story = {
  args: {
    status: "complete",
    problems: [],
    environment: ["Agent state only: the replay starts from the source checkpoint with an empty workspace"],
    guardrailRegressions: ["Only its own model"],
    repetitions: 3,
    criteria,
  },
}

export const Incomplete: Story = {
  args: {
    status: "incomplete",
    problems: ["Replay 01M8 #2 of run 01M9 is failed: The evaluation failed: judge unavailable"],
    environment: [],
    guardrailRegressions: [],
    repetitions: 3,
    criteria,
  },
}
