import type { Meta, StoryObj } from "@storybook/react";
import { SessionHeader } from "./SessionHeader";
import { fn } from "@storybook/test";

/**
 * SessionHeader Composite Stories
 *
 * The SessionHeader displays the current active session title and provides
 * actions to start a new session or view previous sessions.
 */
const meta = {
  title: "Composites/SessionHeader",
  component: SessionHeader,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    onNewSession: fn(),
    onCloseSession: fn(),
    onSelectSession: fn(),
  }
} satisfies Meta<typeof SessionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockSessions = [
  { id: "1", title: "Debug Authentication Flow", created_at: "2026-07-01T10:00:00Z" },
  { id: "2", title: "Refactor Database Queries", created_at: "2026-07-02T14:30:00Z" },
  { id: "3", title: "Update Dependencies", created_at: "2026-07-03T09:15:00Z" },
];

/**
 * Default usage with an active session
 */
export const Default: Story = {
  args: {
    activeSessionId: "1",
    sessions: mockSessions,
  },
};

/**
 * Usage when there are no active or past sessions
 */
export const EmptyState: Story = {
  args: {
    activeSessionId: null,
    sessions: [],
  },
};
