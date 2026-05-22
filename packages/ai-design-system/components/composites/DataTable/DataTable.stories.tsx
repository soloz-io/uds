import type { Meta, StoryObj } from '@storybook/react'
import { DataTable } from './DataTable'
import { createColumnHelper } from '@tanstack/react-table'

const meta = {
  title: 'Composites/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof DataTable>

export default meta
type Story = StoryObj<typeof meta>

type Person = { id: number; name: string; email: string; role: string }
const data: Person[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
]

const columnHelper = createColumnHelper<Person>()
const columns = [
  columnHelper.accessor('name', { header: 'Name' }),
  columnHelper.accessor('email', { header: 'Email' }),
  columnHelper.accessor('role', { header: 'Role' }),
]

export const Default: Story = {
  args: {
    data,
    columns,
    searchColumn: 'name',
  },
}
