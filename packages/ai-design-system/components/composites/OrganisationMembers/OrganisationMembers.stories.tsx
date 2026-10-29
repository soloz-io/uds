import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { OrganisationMembers, type OrganisationMember } from "./OrganisationMembers";

const sampleMembers: OrganisationMember[] = [
  {
    userId: "usr-1",
    email: "arun@example.com",
    role: "owner",
    isCurrentUser: true,
  },
  {
    userId: "usr-2",
    email: "sarah.lead@company.com",
    role: "admin",
  },
  {
    userId: "usr-3",
    email: "david.editor@company.com",
    role: "spender",
  },
  {
    userId: "usr-4",
    email: "intern@company.com",
    role: "viewer",
  },
];

/**
 * OrganisationMembers Composite Stories
 *
 * Membership roster management table for organisation accounts.
 *
 * ## Features
 * - Member list with email, role badge, and removal actions
 * - Add-member-by-email form with role selection (owner, admin, spender, viewer)
 * - Role modification dropdown
 * - Confirmation dialog before removing a member
 * - Role-based permissions (read-only mode when canManage is false)
 */
const meta = {
  title: "Composites/OrganisationMembers",
  component: OrganisationMembers,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    members: sampleMembers,
    currentUserId: "usr-1",
    canManage: true,
    onAdd: fn(),
    onChangeRole: fn(),
    onRemove: fn(),
  },
} satisfies Meta<typeof OrganisationMembers>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default view with owner management permissions enabled.
 */
export const Default: Story = {
  args: {
    members: sampleMembers,
    currentUserId: "usr-1",
    canManage: true,
  },
};

/**
 * Read-only view for members without management privileges (e.g. viewers or spenders).
 */
export const ReadOnly: Story = {
  args: {
    members: sampleMembers,
    currentUserId: "usr-4",
    canManage: false,
  },
};

/**
 * Single-owner organization state where the sole owner cannot be removed.
 */
export const SingleOwner: Story = {
  args: {
    members: [sampleMembers[0]],
    currentUserId: "usr-1",
    canManage: true,
  },
};

/**
 * Empty roster state.
 */
export const Empty: Story = {
  args: {
    members: [],
    canManage: true,
  },
};
