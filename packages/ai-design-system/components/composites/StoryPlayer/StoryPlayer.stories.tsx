import type { Meta, StoryObj } from "@storybook/react";
import { StoryPlayer, type StorySegment } from "./StoryPlayer";
import { fn } from "@storybook/test";

/**
 * StoryPlayer Composite Stories
 *
 * Full-screen segmented video player for story-by-story review with progress tracks,
 * mute toggle, step zones, and prompt action.
 */
const meta = {
  title: "Composites/StoryPlayer",
  component: StoryPlayer,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    onBack: fn(),
    onClose: fn(),
    onSubmit: fn(),
    onPublish: fn(),
    onStoryChange: fn(),
    onSceneChange: fn(),
    onPlayingChange: fn(),
    onDownload: fn(),
    onCommentClick: fn(),
  },
} satisfies Meta<typeof StoryPlayer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The whole video (video mode); each segment below is a span of it, with its own clip (scenes mode). */
const VIDEO_URL =
  "https://hel1.your-objectstorage.com/waypoint-s3-dev/01M32NJZHXKCX1CQKVEVA49SJT/playground-1790017380397-6ffe0ec0/artifacts/video.mp4";

const mockStories: StorySegment[] = [
  {
    id: "001",
    segmentNumber: 1,
    totalSegments: 3,
    start_sec: 0,
    duration_sec: 1.6,
    caption: "iOS apps used to mean one thing",
    clip_url:
      "https://hel1.your-objectstorage.com/waypoint-s3-dev/01M32NJZHXKCX1CQKVEVA49SJT/playground-1790017380397-6ffe0ec0/artifacts/scenes/scene001/clip.mp4",
  },
  {
    id: "002",
    segmentNumber: 2,
    totalSegments: 3,
    start_sec: 1.6,
    duration_sec: 1.5,
    caption: "You needed a Mac",
    clip_url:
      "https://hel1.your-objectstorage.com/waypoint-s3-dev/01M32NJZHXKCX1CQKVEVA49SJT/playground-1790017380397-6ffe0ec0/artifacts/scenes/scene002/clip.mp4",
  },
  {
    id: "003",
    segmentNumber: 3,
    totalSegments: 3,
    start_sec: 3.1,
    duration_sec: 1.5,
    caption: "And nobody told the AI",
    clip_url:
      "https://hel1.your-objectstorage.com/waypoint-s3-dev/01M32NJZHXKCX1CQKVEVA49SJT/playground-1790017380397-6ffe0ec0/artifacts/scenes/scene003/clip.mp4",
  },
];

export const Default: Story = {
  args: {
    stories: mockStories,
    videoUrl: VIDEO_URL,
    title: "Building iOS App on Devin",
    isPlaying: true,
  },
};

export const WithComments: Story = {
  args: {
    stories: mockStories,
    videoUrl: VIDEO_URL,
    title: "Building iOS App on Devin",
    isPlaying: false,
    commentCount: 2,
    isCommentsOpen: false,
  },
};

export const Paused: Story = {
  args: {
    stories: mockStories,
    videoUrl: VIDEO_URL,
    title: "Building iOS App on Devin",
    isPlaying: false,
  },
};

export const Muted: Story = {
  args: {
    stories: mockStories,
    videoUrl: VIDEO_URL,
    title: "Building iOS App on Devin",
    initialMuted: true,
  },
};

export const ScenesMode: Story = {
  args: {
    stories: mockStories,
    videoUrl: VIDEO_URL,
    title: "Building iOS App on Devin",
    playbackMode: "scenes",
  },
};
