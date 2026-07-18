import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { EvalDashboardFeature } from "./EvalDashboardFeature"
import { evalDashboardFeatureStateMock, workflowMockNodes, workflowMockEdges } from "./EvalDashboardFeature.mocks"
import { useEvalDashboardFeatureMock } from "./useEvalDashboardFeature.mock"
import { NodeEditor } from "@/components/features/NodeEditor"

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

export const WithStateManagement: Story = {
  render: () => {
    const state = useEvalDashboardFeatureMock()
    return <EvalDashboardFeature {...state} workflowContent={workflowMock} className="h-[100dvh]" />
  },
}
