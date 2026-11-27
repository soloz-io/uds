import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { EvalDashboardFeature } from "./EvalDashboardFeature"
import { evalAgentMessages, evalDashboardFeatureStateMock, improvementChat, workflowMockNodes, workflowMockEdges } from "./EvalDashboardFeature.mocks"
import { useEvalDashboardFeatureMock } from "./useEvalDashboardFeature.mock"
import { NodeEditor } from "@/components/features/NodeEditor"
import { ChatPanel } from "@/components/features/ChatPanel"

const workflowMock = (
  <NodeEditor nodes={workflowMockNodes} edges={workflowMockEdges} showMinimap={false} interactive={false} />
)

const meta = {
  title: "Features/EvalDashboardFeature",
  component: EvalDashboardFeature,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  render: (args) => (
    <div className="h-screen w-full">
      <EvalDashboardFeature {...args} />
    </div>
  )
} satisfies Meta<typeof EvalDashboardFeature>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ...evalDashboardFeatureStateMock,
    workflowContent: workflowMock,
  },
}

/**
 * The proposal played (ADR-063 §7, §8): grading; your review (label a grade
 * with "Label this verdict", then Finish review); the improver proposing
 * changes for each target pack (Improvement view, one chip per pack); you
 * approve or reject each, and can change a decision any time. "Start
 * experiment N" runs all golden evals on the pull request holding the approved
 * group; it is enabled only for a group no earlier experiment ran on.
 * Experiments appear in the bar; click one to see its changes and steps under
 * the bar: green when the pull request scores higher than main, red when
 * lower, grey when equal; the pack's top scorer carries the badge. The
 * judge's #1 alone lowers the score; approve #2 and start
 * experiment 2. Passing pull requests link to GitHub to review and merge. Open
 * the chat (the speech bubble) to follow the improver; ▶ plays it again.
 */
const noop = () => {}

export const WithStateManagement: Story = {
  render: () => {
    const state = useEvalDashboardFeatureMock()
    const chat = improvementChat(state.data?.improvement)
    return (
      <EvalDashboardFeature
        {...state}
        workflowContent={workflowMock}
        agentPanel={<ChatPanel messages={chat.messages} tasks={chat.tasks} onSubmit={noop} />}
        className="h-[100dvh]"
      />
    )
  },
}

/** The eval agent's chat beside the details: "Ask why" on a graded row and "Ask about this turn" open it. */
export const WithEvalAgent: Story = {
  render: () => {
    const state = useEvalDashboardFeatureMock()
    return (
      <EvalDashboardFeature
        {...state}
        workflowContent={workflowMock}
        agentPanel={<ChatPanel messages={evalAgentMessages} onSubmit={() => {}} />}
        className="h-[100dvh]"
      />
    )
  },
}

/**
 * The same run for an app not connected to GitHub: once the improver proposes
 * changes, the page asks to connect GitHub (Settings → Connections): proposals
 * can be decided, but no experiment can start, because the approved group is
 * committed to a pull request and built from that commit.
 */
export const WithoutGitConnection: Story = {
  render: () => {
    const state = useEvalDashboardFeatureMock({ gitConnected: false })
    const chat = improvementChat(state.data?.improvement)
    return (
      <EvalDashboardFeature
        {...state}
        workflowContent={workflowMock}
        agentPanel={<ChatPanel messages={chat.messages} tasks={chat.tasks} onSubmit={() => {}} />}
        className="h-[100dvh]"
      />
    )
  },
}
