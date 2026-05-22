import type { Meta, StoryObj } from '@storybook/react'
import { TablePagination } from './TablePagination'
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table'

const meta = {
  title: 'Composites/TablePagination',
  component: TablePagination,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof TablePagination>

export default meta
type Story = StoryObj<typeof meta>

const data = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
}))

export const Default: Story = {
  render: () => {
    const table = useReactTable({
      data,
      columns: [{ accessorKey: 'name', header: 'Name' }],
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
    })
    return <TablePagination table={table} />
  },
}
