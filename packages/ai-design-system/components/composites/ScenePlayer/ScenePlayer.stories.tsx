import type { Meta, StoryObj } from "@storybook/react";
import { ScenePlayer, type SceneItem } from "./ScenePlayer";
import { fn } from "@storybook/test";

/**
 * ScenePlayer Composite Stories
 *
 * Full-screen segmented video player for scene-by-scene review with progress tracks,
 * mute toggle, step zones, and publish action.
 */
const meta = {
  title: "Composites/ScenePlayer",
  component: ScenePlayer,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    onBack: fn(),
    onClose: fn(),
    onSubmit: fn(),
    onPublish: fn(),
    onSceneChange: fn(),
  },
} satisfies Meta<typeof ScenePlayer>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockScenes: SceneItem[] = [
  {
    id: "001",
    sceneNumber: 1,
    totalScenes: 3,
    start_sec: 0,
    duration_sec: 1.6,
    templateId: "grid2_compare_visual",
    caption: "iOS apps used to mean one",
    scene_clip_url:
      "https://hel1.your-objectstorage.com/waypoint-s3-dev/01M32NJZHXKCX1CQKVEVA49SJT/playground-1790017380397-6ffe0ec0/artifacts/scenes/scene001/clip.mp4",
  },
  {
    id: "002",
    sceneNumber: 2,
    totalScenes: 3,
    start_sec: 1.6,
    duration_sec: 1.5,
    templateId: "full_visual_loop",
    caption: "thing you needed a Mac. And nobody",
    scene_clip_url:
      "https://hel1.your-objectstorage.com/waypoint-s3-dev/01M32NJZHXKCX1CQKVEVA49SJT/playground-1790017380397-6ffe0ec0/artifacts/scenes/scene002/clip.mp4",
  },
  {
    id: "003",
    sceneNumber: 3,
    totalScenes: 3,
    start_sec: 3.1,
    duration_sec: 1.5,
    templateId: "full_talking_head",
    caption: "told the AI, every AI",
    scene_clip_url:
      "https://hel1.your-objectstorage.com/waypoint-s3-dev/01M32NJZHXKCX1CQKVEVA49SJT/playground-1790017380397-6ffe0ec0/artifacts/scenes/scene003/clip.mp4",
  },
];

/**
 * Default usage with multiple scenes
 */
export const Default: Story = {
  args: {
    scenes: mockScenes,
    title: "Devin for iOS",
    avatarInitials: "D",
  },
};

/**
 * Empty scenes fallback
 */
export const EmptyState: Story = {
  args: {
    scenes: [],
    title: "No Scenes",
  },
};
