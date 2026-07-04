import type { Meta, StoryObj } from "@storybook/react"
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator,
  BreadcrumbEllipsis
} from "./Breadcrumb"

/**
 * Breadcrumb Primitive Stories
 *
 * The Breadcrumb component displays the path to the current resource using a hierarchy of links.
 * It is fully accessible and supports custom separators and truncation.
 *
 * ## Features
 * - Accessible navigation with semantic `nav` and `ol` elements
 * - Built-in separator and ellipsis components
 * - Keyboard navigation support
 * - Dark mode support
 */
const meta = {
  title: "Primitives/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  parameters: { 
    layout: "centered",
    docs: {
      description: {
        component: "Displays the path to the current resource using a hierarchy of links.",
      },
    },
  },
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default Breadcrumb usage
 */
export const Default: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/components">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
}

/**
 * Breadcrumb with an ellipsis to indicate truncated paths.
 */
export const WithEllipsis: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/components">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
}

/**
 * Dark mode support
 */
export const DarkMode: Story = {
  render: () => (
    <div 
      className="dark" 
      style={{ 
        padding: '24px', 
        background: 'hsl(222.2 84% 4.9%)', 
        borderRadius: '8px' 
      }}
    >
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/components">Components</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  ),
  parameters: {
    backgrounds: { disable: true },
    docs: {
      description: {
        story: 'Breadcrumbs automatically adapt to dark mode.',
      },
    },
  },
}
