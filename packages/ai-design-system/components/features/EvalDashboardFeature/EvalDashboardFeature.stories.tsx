import type { Meta, StoryObj } from "@storybook/react"
import { EvalDashboardFeature } from "./EvalDashboardFeature"
import { evalDashboardFeatureStateMock } from "./EvalDashboardFeature.mocks"
import { useEvalDashboardFeatureMock } from "./useEvalDashboardFeature.mock"

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
  },
}

export const WithStateManagement: Story = {
  render: () => {
    const state = useEvalDashboardFeatureMock()
    return <EvalDashboardFeature {...state} className="h-[100dvh]" />
  },
}
