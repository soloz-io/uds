import * as React from "react"
import {
  Table as ShadcnTable,
  TableHeader as ShadcnTableHeader,
  TableBody as ShadcnTableBody,
  TableFooter as ShadcnTableFooter,
  TableRow as ShadcnTableRow,
  TableHead as ShadcnTableHead,
  TableCell as ShadcnTableCell,
  TableCaption as ShadcnTableCaption,
} from "../../ui/table"

/**
 * Table Primitive
 *
 * A foundational table component that wraps shadcn/ui Table with design system
 * enhancements. This primitive serves as the single source of truth for all tabular
 * data display across the application.
 *
 * @example
 * ```tsx
 * <Table>
 *   <TableHeader>
 *     <TableRow>
 *       <TableHead>Name</TableHead>
 *       <TableHead>Email</TableHead>
 *     </TableRow>
 *   </TableHeader>
 *   <TableBody>
 *     <TableRow>
 *       <TableCell>John Doe</TableCell>
 *       <TableCell>john@example.com</TableCell>
 *     </TableRow>
 *   </TableBody>
 * </Table>
 * ```
 *
 * @see https://ui.shadcn.com/docs/components/table - shadcn/ui Table documentation
 */

/**
 * Table component props
 */
export type TableProps = React.HTMLAttributes<HTMLTableElement>

/**
 * Table component
 *
 * A semantic table component for displaying tabular data, built on shadcn/ui foundation.
 * Optimized with React.memo for performance in high-frequency rendering scenarios.
 *
 * Features:
 * - Semantic HTML table structure
 * - Responsive overflow handling
 * - Consistent styling across the application
 * - Dark mode support
 * - Accessible table structure
 */
export const Table = React.memo(
  React.forwardRef<HTMLTableElement, TableProps>((props, ref) => {
    return <ShadcnTable ref={ref} {...props} />
  })
)

Table.displayName = "Table"

/**
 * TableHeader component props
 */
export type TableHeaderProps = React.HTMLAttributes<HTMLTableSectionElement>

/**
 * TableHeader component
 *
 * Wraps table header rows with proper semantic markup.
 */
export const TableHeader = React.memo(
  React.forwardRef<HTMLTableSectionElement, TableHeaderProps>((props, ref) => {
    return <ShadcnTableHeader ref={ref} {...props} />
  })
)

TableHeader.displayName = "TableHeader"

/**
 * TableBody component props
 */
export type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement>

/**
 * TableBody component
 *
 * Wraps table body rows with proper semantic markup.
 */
export const TableBody = React.memo(
  React.forwardRef<HTMLTableSectionElement, TableBodyProps>((props, ref) => {
    return <ShadcnTableBody ref={ref} {...props} />
  })
)

TableBody.displayName = "TableBody"

/**
 * TableFooter component props
 */
export type TableFooterProps = React.HTMLAttributes<HTMLTableSectionElement>

/**
 * TableFooter component
 *
 * Wraps table footer rows with proper semantic markup.
 */
export const TableFooter = React.memo(
  React.forwardRef<HTMLTableSectionElement, TableFooterProps>((props, ref) => {
    return <ShadcnTableFooter ref={ref} {...props} />
  })
)

TableFooter.displayName = "TableFooter"

/**
 * TableRow component props
 */
export type TableRowProps = React.HTMLAttributes<HTMLTableRowElement>

/**
 * TableRow component
 *
 * Represents a single row in the table.
 */
export const TableRow = React.memo(
  React.forwardRef<HTMLTableRowElement, TableRowProps>((props, ref) => {
    return <ShadcnTableRow ref={ref} {...props} />
  })
)

TableRow.displayName = "TableRow"

/**
 * TableHead component props
 */
export type TableHeadProps = React.ThHTMLAttributes<HTMLTableCellElement>

/**
 * TableHead component
 *
 * Represents a header cell in the table.
 */
export const TableHead = React.memo(
  React.forwardRef<HTMLTableCellElement, TableHeadProps>((props, ref) => {
    return <ShadcnTableHead ref={ref} {...props} />
  })
)

TableHead.displayName = "TableHead"

/**
 * TableCell component props
 */
export type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement>

/**
 * TableCell component
 *
 * Represents a data cell in the table.
 */
export const TableCell = React.memo(
  React.forwardRef<HTMLTableCellElement, TableCellProps>((props, ref) => {
    return <ShadcnTableCell ref={ref} {...props} />
  })
)

TableCell.displayName = "TableCell"

/**
 * TableCaption component props
 */
export type TableCaptionProps = React.HTMLAttributes<HTMLTableCaptionElement>

/**
 * TableCaption component
 *
 * Provides a caption for the table for accessibility.
 */
export const TableCaption = React.memo(
  React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>((props, ref) => {
    return <ShadcnTableCaption ref={ref} {...props} />
  })
)

TableCaption.displayName = "TableCaption"
