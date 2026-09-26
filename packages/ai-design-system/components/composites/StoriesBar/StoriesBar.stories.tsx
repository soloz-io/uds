import type { Meta, StoryObj } from "@storybook/react";
import { StoriesBar, type StoryItem } from "./StoriesBar";
import { fn } from "@storybook/test";

/**
 * StoriesBar Composite Stories
 *
 * Displays circular story avatar bubbles with status indicators and titles.
 */
const meta = {
  title: "Composites/StoriesBar",
  component: StoriesBar,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    onStoryClick: fn(),
  },
} satisfies Meta<typeof StoriesBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockStories: StoryItem[] = [
  {
    id: "story-1",
    title: "Devin iOS",
    status: "ready",
  },
  {
    id: "story-2",
    title: "Waypoint",
    status: "ready",
  },
  {
    id: "story-3",
    title: "Design Sys",
    status: "generating",
  },
  {
    id: "story-4",
    title: "Workspace",
    status: "ready",
  },
  {
    id: "story-5",
    title: "ZeroOps",
    status: "draft",
  },
];

/**
 * Default usage with active story
 */
export const Default: Story = {
  args: {
    activeStoryId: "story-1",
    stories: mockStories,
  },
};

/**
 * Empty stories bar
 */
export const EmptyState: Story = {
  args: {
    activeStoryId: null,
    stories: [],
  },
};
