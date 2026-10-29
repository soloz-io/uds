import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { CreditsHistory } from "./CreditsHistory";

const sampleItems = [
  {
    id: "h-1",
    at: new Date(Date.now() - 86400000).toISOString(),
    label: "Greeting task run",
    credits: -184,
  },
  {
    id: "h-2",
    at: "2026-10-08T14:32:00Z",
    label: "Greeting task run",
    credits: -631,
  },
  {
    id: "h-3",
    at: "2026-10-08T12:10:00Z",
    label: "Greeting task run",
    credits: -4,
  },
  {
    id: "h-4",
    at: "2026-10-08T10:05:00Z",
    label: "Greeting task run",
    credits: -30,
  },
  {
    id: "h-5",
    at: "2025-07-02T18:00:00Z",
    label: "NBA Finals Night Cinematic Video Concept",
    credits: -23,
  },
  {
    id: "h-6",
    at: "2025-07-02T09:00:00Z",
    label: "Bonus for new users",
    credits: 1000,
  },
];

/**
 * CreditsHistory Composite Stories
 *
 * Activity ledger of credit additions and deductions grouped chronologically by day.
 *
 * ## Features
 * - Automatic day grouping (Today, Yesterday, past dates)
 * - Positive credit highlights with + prefix
 * - Pagination via "Load more" trigger
 * - Empty state representation
 */
const meta = {
  title: "Composites/CreditsHistory",
  component: CreditsHistory,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    items: sampleItems,
    onLoadMore: fn(),
  },
} satisfies Meta<typeof CreditsHistory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: sampleItems,
    hasMore: true,
  },
};

export const HasMore: Story = {
  args: {
    items: sampleItems,
    hasMore: true,
  },
};

export const LoadingMore: Story = {
  args: {
    items: sampleItems,
    hasMore: true,
    isLoading: true,
  },
};

export const Empty: Story = {
  args: {
    items: [],
    hasMore: false,
  },
};
