import type { Meta, StoryObj } from '@storybook/react'
import { FormReports } from './FormReports'
import type { FormReportsFieldDefinition } from './FormReportsDrawerForm'
import type { FormReportsColumn, FormReportsEntity } from './FormReportsTable'

const sampleColumns: FormReportsColumn[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
]

const sampleItems: FormReportsEntity[] = [
  { id: 1, name: "Alice Smith", email: "alice@example.com", role: "Admin" },
  { id: 2, name: "Bob Jones", email: "bob@example.com", role: "Editor" },
  { id: 3, name: "Carol Lee", email: "carol@example.com", role: "Viewer" },
]

const sampleFields: FormReportsFieldDefinition[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "email", label: "Email", type: "text", required: true },
  { name: "role", label: "Role", type: "select", options: [{ value: "Admin", label: "Admin" }, { value: "Editor", label: "Editor" }, { value: "Viewer", label: "Viewer" }] },
]

const meta = {
  title: 'Composites/FormReports',
  component: FormReports,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof FormReports>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: sampleItems,
    columns: sampleColumns,
    fields: sampleFields,
  },
}

export const Empty: Story = {
  args: {
    items: [],
    columns: sampleColumns,
    fields: sampleFields,
  },
}
