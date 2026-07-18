import type { Meta, StoryObj } from "@storybook/react"
import { EvalSessionDetailsPanel } from "./EvalSessionDetailsPanel"

const meta = {
  title: "Blocks/EvalSessionDetailsPanel",
  component: EvalSessionDetailsPanel,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="h-[500px] w-full border rounded-md overflow-hidden bg-background">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof EvalSessionDetailsPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    activeTab: "golden-evals",
    sessionDetails: {
      id: "sess_1",
      date: "2023-01-01T00:00:00.000Z",
      goldenEvals: [
        { id: 1, category: "Accuracy", metric: "Correct Answer", pass: 1, reasoning: "Matched expectation." }
      ],
      systemPrompt: "You are a helpful AI.",
      outputTranscript: "Hello world!",
    },
  },
}
