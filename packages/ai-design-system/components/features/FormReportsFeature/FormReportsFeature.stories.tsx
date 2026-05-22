import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { FormReportsFeature } from "./FormReportsFeature"
import {
  formReportsColumns,
  formReportsEntityName,
  formReportsFields,
  formReportsItems,
  formReportsRowActions,
} from "./FormReportsFeature.mocks"
import { useFormReportsFeatureMock } from "./useFormReportsFeature.mock"

const meta = {
  title: "Features/FormReportsFeature",
  component: FormReportsFeature,
  tags: ["autodocs"],
  globals: {
    theme: "dark-neutral",
  },
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof FormReportsFeature>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    entityName: formReportsEntityName,
    fields: formReportsFields,
    columns: formReportsColumns,
    rowActions: formReportsRowActions,
    items: formReportsItems,
  },
}

export const WithStateManagement: Story = {
  args: {
    entityName: formReportsEntityName,
    fields: formReportsFields,
    columns: formReportsColumns,
    rowActions: formReportsRowActions,
    items: formReportsItems,
  },
  render: () => {
    const state = useFormReportsFeatureMock()

    return <FormReportsFeature {...state} />
  },
}
