import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { OverviewSheet } from "./OverviewSheet";

/**
 * OverviewSheet Composite
 *
 * A versatile slide-out drawer for reviewing structured documents, narration scripts,
 * briefs, or specifications with status badges, metadata summary, and scrollable content.
 */
const meta = {
  title: "Composites/OverviewSheet",
  component: OverviewSheet,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { onOpenChange: fn() },
} satisfies Meta<typeof OverviewSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

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

export const Default: Story = {
  args: {
    open: true,
    narration: mockNarration,
  },
};

export const GenericDocument: Story = {
  args: {
    open: true,
    title: "Feature Specification",
    description: "Multi-model orchestration architecture overview",
    badges: [
      { label: "Approved", icon: "check-circle", variant: "success" },
      { label: "v2.4", variant: "neutral" },
      { label: "High Priority", variant: "warning" },
    ],
    contentTitle: "Specification Body",
    contentBadge: "4 sections",
    content: `## Architecture Overview

1. Distributed Workflows
Each pipeline step runs as an independent ephemeral task that reports state transitions via server-sent events.

2. State Persistence
All session state, artifacts, and generated media are persisted to object storage and referenced via immutable asset identifiers.

3. Live Review
The user reviews generated segments in the StoryPlayer, can open the OverviewSheet to inspect the full script or prompt, and leaves timestamped scene comments.`,
    metadata: [
      { label: "Author", value: "Platform Engineering" },
      { label: "Reviewers", value: "Arun Subramanian, Team" },
      { label: "Estimated Duration", value: "2 sprints" },
    ],
  },
};

export const LongScrollableScript: Story = {
  args: {
    open: true,
    title: "Episode 12 - Deep Dive",
    description: "Long-form narration script",
    badges: [
      { label: "Draft", variant: "warning" },
      { label: "Longform", variant: "neutral" },
    ],
    contentTitle: "Voice-over Script",
    contentBadge: "450 words",
    content: `Paragraph 1: The distributed cloud architecture landscape has shifted dramatically over the past twelve months. What once required bespoke orchestration and massive maintenance overhead is now converging on lightweight, ephemeral primitives.

Paragraph 2: When we first started designing agentic workflows, the assumption was always that containers would be long-lived. You'd spin up an environment, connect over a persistent socket, and let the agent make changes incrementally over hours or days.

Paragraph 3: But in production, long-lived environments leak resources, drift in state, and make reproduction almost impossible. That's why we shifted to single-turn, immutable checkpoints. Every step takes a snapshot, executes the action, validates output against an automated test suite, and emits an event.

Paragraph 4: If something goes wrong, you don't debug a live contaminated state. You simply replay from the last clean checkpoint. The reproducibility gains alone paid for the architecture ten times over.

Paragraph 5: And that brings us to the user experience. Developers don't want black-box magic. They want transparent observability. When an agent creates a narration script, writes code, or renders motion clips, the user needs to inspect the work at every milestone.

Paragraph 6: That is the purpose of this drawer: instant access to the source truth, formatted cleanly with no distraction, scrollable and responsive across every device size.`,
  },
};

export const Empty: Story = {
  args: {
    open: true,
    emptyState: {
      title: "No document selected",
      description: "Select an item or wait for the agent to generate content.",
    },
  },
};
