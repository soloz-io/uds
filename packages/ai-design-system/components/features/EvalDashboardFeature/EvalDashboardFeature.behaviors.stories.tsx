import type { Meta, StoryObj } from "@storybook/react"
import { expect, within, userEvent, fn } from "@storybook/test"
import { EvalDashboardFeature } from "./EvalDashboardFeature"
import { evalDashboardFeatureStateMock } from "./EvalDashboardFeature.mocks"

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
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Check if the tabs exist
    const tabs = await canvas.findAllByRole("tab")
    expect(tabs.length).toBeGreaterThan(0)
    
    // Switch to Outputs tab
    const outputsTab = canvas.getByRole("tab", { name: /Outputs/i })
    await userEvent.click(outputsTab)
  },
}
