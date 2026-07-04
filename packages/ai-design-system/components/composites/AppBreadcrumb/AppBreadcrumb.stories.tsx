import type { Meta, StoryObj } from "@storybook/react";
import { AppBreadcrumb } from "./AppBreadcrumb";

/**
 * AppBreadcrumb Composite Stories
 *
 * The AppBreadcrumb provides an easy way to render breadcrumbs by passing
 * an array of data, automatically handling separators and active states.
 */
const meta = {
  title: "Composites/AppBreadcrumb",
  component: AppBreadcrumb,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof AppBreadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default AppBreadcrumb usage
 */
export const Default: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Workflows", href: "/workflows" },
      { label: "My Workflow" },
    ],
  },
};

/**
 * With an ellipsis
 */
export const WithEllipsis: Story = {
  args: {
    items: [
      { label: "Home", href: "/" },
      { label: "Folders", href: "/folders" },
      { label: "Subfolder", href: "/folders/1" },
      { label: "Document" },
    ],
    showEllipsis: true,
  },
};
