import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "@storybook/test"
import { TurnTimeline } from "./TurnTimeline"

const meta = {
  title: "Blocks/TurnTimeline",
  component: TurnTimeline,
  parameters: { layout: "padded" },
} satisfies Meta<typeof TurnTimeline>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onOpenTrace: fn(),
    onAddToDataset: fn(),
    traceNotices: { "3e2b5816b9c740f5": "Trace store not available: requested from the Kamarkat platform team (KR-1)" },
    turns: [
      {
        id: "3e2b5816b9c740f5",
        outcome: "completed",
        startedAt: "2026-11-26T05:39:19.997Z",
        durationMs: 11300,
        models: { orchestrator: "deepseek-flash", "business-model-agent": "deepseek-flash" },
        packVersion: "dev",
        sampled: true,
        samplingReason: "Selected at rate 0.2 (point 0.1342)",
        feedback: [{ id: "f1", rating: "negative", details: "It started work although I asked it not to" }],
        events: [
          { kind: "user", text: "Hi! In one short paragraph, what can you help me build?" },
          { kind: "tool_call", agent: "orchestrator", tool: { id: "c1", name: "read_file", args: { path: "/workspace/.global/business.ts" }, result: "File not found" } },
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
  },
}

export const Empty: Story = {
  args: { turns: [] },
}
