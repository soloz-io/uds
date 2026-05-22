import type { Meta, StoryObj } from "@storybook/react"
import { Checkbox } from "./Checkbox"
import * as React from "react"

const meta = {
  title: "Primitives/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <Checkbox />,
}

export const Checked: Story = {
  render: () => <Checkbox checked />,
}

export const Disabled: Story = {
  render: () => (
    <div className="flex gap-4">
      <Checkbox disabled />
      <Checkbox disabled checked />
    </div>
  ),
}

export const Indeterminate: Story = {
  render: () => <Checkbox checked="indeterminate" />,
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Accept terms and conditions
      </label>
    </div>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(false)

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id="controlled"
            checked={checked}
            onCheckedChange={setChecked}
          />
          <label htmlFor="controlled" className="text-sm">
            Controlled checkbox
          </label>
        </div>
        <p className="text-sm text-muted-foreground">
          Status: {checked ? "Checked" : "Unchecked"}
        </p>
      </div>
    )
  },
}

export const DarkMode: Story = {
  parameters: {
    backgrounds: { default: "dark" },
  },
  render: () => (
    <div className="dark flex gap-4">
      <Checkbox />
      <Checkbox checked />
      <Checkbox checked="indeterminate" />
    </div>
  ),
}
