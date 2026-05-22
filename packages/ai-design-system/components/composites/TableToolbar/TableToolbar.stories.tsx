import type { Meta, StoryObj } from '@storybook/react'
import { TableToolbar } from './TableToolbar'
import { useReactTable, getCoreRowModel, getFilteredRowModel, createColumnHelper } from '@tanstack/react-table'
import { Button } from '@/components/primitives/Button'

const meta = {
  title: 'Composites/TableToolbar',
  component: TableToolbar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof TableToolbar>

export default meta
type Story = StoryObj<typeof meta>

type Person = { id: number; name: string; email: string }
const data: Person[] = [{ id: 1, name: 'John', email: 'john@example.com' }]
const columnHelper = createColumnHelper<Person>()

export const Default: Story = {
  render: () => {
    const columns = [
      columnHelper.accessor('name', { header: 'Name' }),
      columnHelper.accessor('email', { header: 'Email' }),
    ]
    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
    })
    return <TableToolbar table={table} searchColumn="name" />
  },
}

export const WithActions: Story = {
  render: () => {
    const columns = [
      columnHelper.accessor('name', { header: 'Name' }),
      columnHelper.accessor('email', { header: 'Email' }),
    ]
    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
    })
    return (
      <TableToolbar
        table={table}
        searchColumn="name"
        actions={
          <Button size="sm" variant="default">
            Add New
          </Button>
        }
      />
    )
  },
}
