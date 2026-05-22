import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { expect, fn, userEvent, within } from "@storybook/test"

import { FormReportsFeature } from "./FormReportsFeature"
import {
  formReportsColumns,
  formReportsEntityName,
  formReportsFields,
  formReportsItems,
  formReportsRowActions,
} from "./FormReportsFeature.mocks"

const onCreateClick = fn()
const onDrawerOpenChange = fn()
const onSubmit = fn()
const onRowAction = fn()

const meta = {
  title: "Features/FormReportsFeature/Behaviors",
  component: FormReportsFeature,
  tags: ["test"],
  globals: {
    theme: "dark-neutral",
  },
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof FormReportsFeature>

export default meta
type Story = StoryObj<typeof meta>

const args = {
  entityName: formReportsEntityName,
  fields: formReportsFields,
  columns: formReportsColumns,
  rowActions: formReportsRowActions,
  items: formReportsItems,
  actionHandlers: {
    onCreateClick,
    onDrawerOpenChange,
    onSubmit,
    table: {
      onRowAction,
    },
  },
}

export const OpenCreateDrawer: Story = {
  args,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole("button", { name: /Create/i }))
    await expect(onCreateClick).toHaveBeenCalled()
    await expect(onDrawerOpenChange).toHaveBeenCalled()
    await expect(await canvas.findByText("Create Feature Flag")).toBeInTheDocument()
  },
}

export const SubmitDrawerForm: Story = {
  args,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole("button", { name: /Create/i }))
    const slugInput = await canvas.findByLabelText(/Slug/i)
    await userEvent.clear(slugInput)
    await userEvent.type(slugInput, "my-new-flag")

    await userEvent.click(canvas.getByRole("button", { name: /^Create$/i }))
    await expect(onSubmit).toHaveBeenCalled()
  },
}

export const TriggerRowAction: Story = {
  args,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const menuButtons = await canvas.findAllByRole("button", { name: /Open menu/i })
    await userEvent.click(menuButtons[0])
    await userEvent.click(await canvas.findByRole("menuitem", { name: /Edit/i }))

    await expect(onRowAction).toHaveBeenCalled()
  },
}
