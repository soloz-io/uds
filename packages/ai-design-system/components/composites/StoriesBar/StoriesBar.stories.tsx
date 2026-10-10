import type { Meta, StoryObj } from "@storybook/react";
import { StoriesBar, type StoryItem } from "./StoriesBar";
import { fn } from "@storybook/test";

/**
 * StoriesBar Composite Stories
 *
 * Displays circular story avatar bubbles. Every bubble is a story, with the channel
 * session story pinned first (icon "sparkles").
 * Status is communicated through the icon color (working=amber, ready=emerald, failed=red, stopped=muted).
 * A badge dot appears ONLY when `unread` is true (the session expects user response/has unseen notification).
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
  { id: "channel", title: "Channel", icon: "sparkles", status: "working" },
  { id: "story-1", title: "Devin iOS", status: "ready", unread: true },
  { id: "story-2", title: "Waypoint", status: "ready" },
  { id: "story-3", title: "Design Sys", status: "working" },
  { id: "story-4", title: "Workspace", status: "working", unread: true },
  { id: "story-5", title: "Render", status: "failed", unread: true },
  { id: "story-6", title: "ZeroOps", status: "stopped" },
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
 * Channel active (default state when channel chat is open)
 */
export const ChannelActive: Story = {
  args: {
    activeStoryId: null,
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
