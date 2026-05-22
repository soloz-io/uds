import type { Meta, StoryObj } from '@storybook/react'
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from './Table'

/**
 * Table Primitive Stories
 *
 * The Table component is a foundational primitive for displaying tabular data.
 * It extends shadcn/ui's Table with design system-specific enhancements and maintains
 * full accessibility compliance (WCAG 2.1 Level AA).
 *
 * ## Features
 * - Semantic HTML table structure
 * - Responsive overflow handling
 * - Consistent styling across the application
 * - Dark mode support
 * - Accessible table structure
 *
 * ## Accessibility
 * - Uses semantic table elements
 * - Proper header associations with scope attributes
 * - Caption support for screen readers
 * - Keyboard navigation support
 * - Maintains proper color contrast ratios
 *
 * ## Usage Guidelines
 *
 * ### Do's
 * - Use for displaying structured tabular data
 * - Include TableCaption for accessibility
 * - Use TableHead for column headers
 * - Ensure proper header-cell associations
 *
 * ### Don'ts
 * - Don't use tables for layout purposes
 * - Don't omit table headers
 * - Don't nest tables unnecessarily
 * - Don't use tables for non-tabular data
 */
const meta = {
  title: 'Primitives/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A semantic table component for displaying tabular data, built on shadcn/ui foundation.',
      },
    },
  },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default table
 *
 * Basic table with header and body rows.
 */
export const Default: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>John Doe</TableCell>
          <TableCell>john@example.com</TableCell>
          <TableCell>Admin</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Jane Smith</TableCell>
          <TableCell>jane@example.com</TableCell>
          <TableCell>User</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Bob Johnson</TableCell>
          <TableCell>bob@example.com</TableCell>
          <TableCell>User</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}

/**
 * With Caption
 *
 * Table with an accessible caption for screen readers.
 */
export const WithCaption: Story = {
  render: () => (
    <Table>
      <TableCaption>A list of team members and their roles</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>John Doe</TableCell>
          <TableCell>john@example.com</TableCell>
          <TableCell>Admin</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Jane Smith</TableCell>
          <TableCell>jane@example.com</TableCell>
          <TableCell>User</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  parameters: {
    docs: {
      description: {
        story: 'TableCaption provides context for screen reader users.',
      },
    },
  },
}

/**
 * With Footer
 *
 * Table with a footer row for totals or summaries.
 */
export const WithFooter: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead className="text-right">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Widget A</TableCell>
          <TableCell>5</TableCell>
          <TableCell className="text-right">$50.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Widget B</TableCell>
          <TableCell>3</TableCell>
          <TableCell className="text-right">$30.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Widget C</TableCell>
          <TableCell>2</TableCell>
          <TableCell className="text-right">$20.00</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total</TableCell>
          <TableCell className="text-right">$100.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
  parameters: {
    docs: {
      description: {
        story: 'TableFooter is useful for displaying totals or summary information.',
      },
    },
  },
}

/**
 * With Alignment
 *
 * Table demonstrating different text alignments.
 */
export const WithAlignment: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="text-right">Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Widget A</TableCell>
          <TableCell className="text-center">In Stock</TableCell>
          <TableCell className="text-right">$50.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Widget B</TableCell>
          <TableCell className="text-center">Low Stock</TableCell>
          <TableCell className="text-right">$30.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Widget C</TableCell>
          <TableCell className="text-center">Out of Stock</TableCell>
          <TableCell className="text-right">$20.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Use text alignment classes to align content appropriately (numbers right-aligned, status centered).',
      },
    },
  },
}

/**
 * With Many Columns
 *
 * Table with multiple columns demonstrating horizontal scrolling.
 */
export const WithManyColumns: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Salary</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>001</TableCell>
          <TableCell>John Doe</TableCell>
          <TableCell>john@example.com</TableCell>
          <TableCell>Admin</TableCell>
          <TableCell>Engineering</TableCell>
          <TableCell>Active</TableCell>
          <TableCell className="text-right">$120,000</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>002</TableCell>
          <TableCell>Jane Smith</TableCell>
          <TableCell>jane@example.com</TableCell>
          <TableCell>Manager</TableCell>
          <TableCell>Sales</TableCell>
          <TableCell>Active</TableCell>
          <TableCell className="text-right">$95,000</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>003</TableCell>
          <TableCell>Bob Johnson</TableCell>
          <TableCell>bob@example.com</TableCell>
          <TableCell>Developer</TableCell>
          <TableCell>Engineering</TableCell>
          <TableCell>Active</TableCell>
          <TableCell className="text-right">$85,000</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Tables with many columns automatically handle overflow with horizontal scrolling.',
      },
    },
  },
}

/**
 * With Row States
 *
 * Table demonstrating different row states (hover, selected).
 */
export const WithRowStates: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>John Doe</TableCell>
          <TableCell>john@example.com</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
        <TableRow data-state="selected">
          <TableCell>Jane Smith</TableCell>
          <TableCell>jane@example.com</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Bob Johnson</TableCell>
          <TableCell>bob@example.com</TableCell>
          <TableCell>Inactive</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Rows support hover and selected states via data-state attribute.',
      },
    },
  },
}

/**
 * Dark Mode Preview
 *
 * Table in dark mode to verify theming compatibility.
 */
export const DarkMode: Story = {
  render: () => (
    <div className="dark" style={{ padding: '24px', background: 'hsl(222.2 84% 4.9%)', borderRadius: '8px' }}>
      <Table>
        <TableCaption>A list of team members in dark mode</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Salary</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>John Doe</TableCell>
            <TableCell>john@example.com</TableCell>
            <TableCell>Admin</TableCell>
            <TableCell className="text-right">$120,000</TableCell>
          </TableRow>
          <TableRow data-state="selected">
            <TableCell>Jane Smith</TableCell>
            <TableCell>jane@example.com</TableCell>
            <TableCell>Manager</TableCell>
            <TableCell className="text-right">$95,000</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Bob Johnson</TableCell>
            <TableCell>bob@example.com</TableCell>
            <TableCell>Developer</TableCell>
            <TableCell className="text-right">$85,000</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$300,000</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Tables automatically adapt to dark mode with appropriate contrast and visibility.',
      },
    },
    backgrounds: { disable: true },
  },
}
