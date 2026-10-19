import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { StoryPlayer, type StorySegment } from "./StoryPlayer";
import { SceneReviewSheet, type SceneReviewComment } from "../SceneReviewSheet";
import { OverviewSheet } from "../OverviewSheet";
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
    onSegmentClick: fn(),
    onSceneClick: fn(),
    onPlayingChange: fn(),
    onDownload: fn(),
    onExport: fn(),
    onOverviewClick: fn(),
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

const mockNarration = {
  frontmatter: {
    status: "ready",
    title: "Building iOS App on Devin",
    description: "Voice-over script for 45s product breakdown",
  },
  dataBlock: {
    content_style: "viral",
    target_duration_seconds: 46.8,
    word_count: 170,
    speed: 1.1,
  },
  body: `iOS apps used to mean one thing: you needed a Mac. And nobody told the AI — every AI coding tool lived on Linux clouds. So native iOS was off the table.

But Devin just fixed that. It got a real Mac in the cloud. Devin outposts on namespace dev boxes powered by Apple's M-series chips with Xcode and the iOS simulator.

Here's the move. Type 1 prompt: "Build and play a flappy bird clone on iOS". Devin scaffolds the Swift project, builds it, boots the simulator, and then it gets scary good.

Devin installs the app, plays it, and tests it like a human. Recording proof. An AI teammate that ships and self-tests its own iOS app. For indie founders, that's idea to App Store without chaining yourself to a Mac. The no-Mac era is over. Point your next prompt at Devin and watch.`,
  isValid: true,
};

const ago = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();

const mockComments: SceneReviewComment[] = [
  {
    id: "c-1",
    sceneLabel: "Scene 1",
    authorName: "Arun Subramanian",
    createdAt: ago(25),
    content: "Make the opening hook faster and bolder.",
    status: "completed",
    resultVersion: "v2",
    history: [
      { status: "pending", at: ago(24), by: "User" },
      { status: "completed", at: ago(15), by: "Agent", version: "v2", note: "Opening hook tightened." },
    ],
  },
  {
    id: "c-2",
    sceneLabel: "Scene 2",
    authorName: "Arun Subramanian",
    createdAt: ago(5),
    content: "Highlight the Xcode simulator window clearly.",
    status: "draft",
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

// Nothing rendered yet: the download button's place offers the export.
export const Exportable: Story = {
  args: {
    stories: mockStories,
    title: "Building iOS App on Devin",
    isPlaying: false,
  },
};

export const ExportUnavailable: Story = {
  args: {
    stories: mockStories,
    title: "Building iOS App on Devin",
    isPlaying: false,
    exportDisabled: true,
    exportDisabledReason: "Every scene must be ready before the video can be exported.",
  },
};

export const Exporting: Story = {
  args: {
    stories: mockStories,
    title: "Building iOS App on Devin",
    isPlaying: false,
    isExporting: true,
  },
};

export const WithOverviewBadge: Story = {
  args: {
    stories: mockStories,
    videoUrl: VIDEO_URL,
    title: "Building iOS App on Devin",
    isPlaying: false,
    overviewBadge: true,
    isOverviewOpen: false,
    commentCount: 2,
    isCommentsOpen: false,
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

export const HighlightedSegment: Story = {
  args: {
    stories: [
      mockStories[0],
      {
        ...mockStories[1],
        highlighted: true,
      },
      mockStories[2],
    ],
    videoUrl: VIDEO_URL,
    title: "Building iOS App on Devin",
    isPlaying: false,
  },
};

/**
 * Interactive story with both Overview (Narration) and Comments sidesheets wired up.
 * Clicking the Overview icon toggles the Narration sidesheet with narration content.
 * Clicking the Comment icon toggles the Scene Review sidesheet with comments.
 */
export const InteractiveWithSidesheets: Story = {
  render: () => {
    const [isOverviewOpen, setIsOverviewOpen] = React.useState(false);
    const [isCommentsOpen, setIsCommentsOpen] = React.useState(false);
    const [isPlaying, setIsPlaying] = React.useState(false);

    return (
      <div className="relative w-full h-screen overflow-hidden bg-black">
        <StoryPlayer
          stories={mockStories}
          videoUrl={VIDEO_URL}
          title="Building iOS App on Devin"
          isPlaying={isOverviewOpen || isCommentsOpen ? false : isPlaying}
          onPlayingChange={setIsPlaying}
          overviewBadge={true}
          isOverviewOpen={isOverviewOpen}
          onOverviewClick={() => {
            setIsOverviewOpen((prev) => !prev);
            setIsCommentsOpen(false);
            setIsPlaying(false);
          }}
          commentCount={mockComments.length}
          isCommentsOpen={isCommentsOpen}
          onCommentClick={() => {
            setIsCommentsOpen((prev) => !prev);
            setIsOverviewOpen(false);
            setIsPlaying(false);
          }}
          onSubmit={(message) => {
            console.log("Submit message:", message);
          }}
        />

        <OverviewSheet
          open={isOverviewOpen}
          onOpenChange={(open) => {
            setIsOverviewOpen(open);
            if (open) setIsPlaying(false);
          }}
          narration={mockNarration}
          className="sm:max-w-sm"
        />

        <SceneReviewSheet
          open={isCommentsOpen}
          onOpenChange={(open) => {
            setIsCommentsOpen(open);
            if (open) setIsPlaying(false);
          }}
          comments={mockComments}
          draftCount={1}
          description="2 comments across 2 scenes"
          className="sm:max-w-sm"
        />
      </div>
    );
  },
};
