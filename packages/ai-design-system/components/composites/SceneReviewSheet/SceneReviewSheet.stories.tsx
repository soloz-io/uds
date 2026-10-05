import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { SceneReviewSheet } from "./SceneReviewSheet";

/**
 * SceneReviewSheet Composite
 *
 * The review drawer of a rendered video's scenes: each comment on the scene on
 * screen with its status and history, and "Apply changes", which confirms the
 * scenes the drafts touch before sending them.
 */
const meta = {
  title: "Composites/SceneReviewSheet",
  component: SceneReviewSheet,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { onOpenChange: fn(), onApply: fn(), onRemoveDraft: fn() },
} satisfies Meta<typeof SceneReviewSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

const ago = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();

export const WithStatuses: Story = {
  args: {
    open: true,
    description: "2 comments across 2 scenes",
    draftCount: 1,
    comments: [
      {
        id: "c-1",
        sceneLabel: "Scene 3",
        authorName: "Arun Subramanian",
        createdAt: ago(42),
        content: "Make the headline black.",
        status: "completed",
        resultVersion: "v2",
        history: [
          { status: "pending", at: ago(41), by: "User" },
          { status: "in-progress", at: ago(40), by: "Agent" },
          { status: "completed", at: ago(30), by: "Agent", version: "v2", note: "Headline recoloured." },
        ],
      },
      {
        id: "c-2",
        sceneLabel: "Scene 7",
        authorName: "Arun Subramanian",
        createdAt: ago(3),
        content: "Slow the zoom on the phone.",
        status: "draft",
      },
    ],
  },
};

export const ApplyUnavailable: Story = {
  args: {
    open: true,
    description: "1 comment across 1 scene",
    draftCount: 1,
    applyDisabled: true,
    applyDisabledReason: "A new version is being made. You can send more changes once it is ready.",
    comments: [
      { id: "c-3", sceneLabel: "Scene 3", authorName: "Arun Subramanian", createdAt: ago(5), content: "Brighter background.", status: "in-progress" },
    ],
  },
};

export const GroupedByVersion: Story = {
  args: {
    open: true,
    description: "4 comments across 4 scenes",
    draftCount: 1,
    comments: [
      { id: "g-1", group: "Drafts", sceneLabel: "Scene 2", authorName: "Arun Subramanian", createdAt: ago(2), content: "Tighter crop.", status: "draft" },
      { id: "g-2", group: "In progress", sceneLabel: "Scene 5", authorName: "Arun Subramanian", createdAt: ago(8), content: "Warmer light.", status: "in-progress" },
      {
        id: "g-3", group: "v4", sceneLabel: "Scene 3", authorName: "Arun Subramanian", createdAt: ago(40), content: "Make the first line bolder.",
        status: "completed", resultVersion: "v4",
        history: [
          { status: "pending", at: ago(39), by: "User" },
          { status: "completed", at: ago(30), by: "Agent", version: "v4", note: "The first line is bolder — in v4." },
        ],
      },
      { id: "g-4", group: "v3", sceneLabel: "Scene 1", authorName: "Arun Subramanian", createdAt: ago(90), content: "Green glasses.", status: "completed", resultVersion: "v3" },
    ],
  },
};
