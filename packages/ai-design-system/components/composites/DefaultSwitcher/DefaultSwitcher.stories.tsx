import * as React from "react"
import { DefaultSwitcher, DefaultSwitcherItem } from "./DefaultSwitcher"
import type { Meta, StoryObj } from "@storybook/react"

const meta = {
  title: "Composites/DefaultSwitcher",
  component: DefaultSwitcher,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DefaultSwitcher>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    themes: [
      { label: "Light", value: "light" },
      { label: "Dark", value: "dark" },
      { label: "System", value: "system" },
    ],
    placeholder: "Select theme...",
  },
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState<string>()
    const themes: DefaultSwitcherItem[] = [
      { label: "Blue", value: "blue" },
      { label: "Green", value: "green" },
      { label: "Purple", value: "purple" },
    ]

    return (
      <div className="flex flex-col gap-4 min-w-[200px]">
        <div className="text-sm text-muted-foreground">Selected: {value || "None"}</div>
        <DefaultSwitcher themes={themes} value={value} onValueChange={setValue} />

        <p style={{ marginTop: '16px', fontSize: '14px' }}>Selected: {value}</p>
      </div>
    )
  },
}
