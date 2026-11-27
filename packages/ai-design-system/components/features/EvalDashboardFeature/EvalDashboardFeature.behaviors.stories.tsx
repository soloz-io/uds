import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { expect, within, fn } from "@storybook/test"
import { EvalDashboardFeature } from "./EvalDashboardFeature"
import { evalDashboardFeatureStateMock, workflowMockNodes, workflowMockEdges } from "./EvalDashboardFeature.mocks"
import { NodeEditor } from "@/components/features/NodeEditor"

const workflowMock = (
  <NodeEditor nodes={workflowMockNodes} edges={workflowMockEdges} showMinimap={false} interactive={false} />
)

const meta = {
  title: "Features/EvalDashboardFeature/Behaviors",
  component: EvalDashboardFeature,
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

export const Interactive: Story = {
  args: {
    ...evalDashboardFeatureStateMock,
    actionHandlers: {
      onTriggerEvaluation: fn(),
    },
    workflowContent: workflowMock,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // The existing "Select View" switcher stays; the new views are among its options.
    expect(await canvas.findByText("Golden Evals")).toBeInTheDocument()


  },
}
