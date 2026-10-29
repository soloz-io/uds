import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { OutcomeList } from "./OutcomeList";

const sampleOutcomes = [
  {
    code: "render-scene",
    name: "Render 3D Scene",
    description: "Executes headless Blender rendering on dedicated cloud GPU nodes.",
    credits: 120,
  },
  {
    code: "transcribe-audio",
    name: "Transcribe Full Audio",
    description: "Faster-whisper batch transcription with word-level timestamps.",
    credits: 45,
  },
  {
    code: "export-video-4k",
    name: "4K Remotion Video Export",
    description: "Multi-threaded Remotion composition rendered in ProRes or H.264.",
    credits: 250,
  },
  {
    code: "generate-brief",
    name: "Generate Video Brief",
    description: "Deep reasoning prompt analysis with structured scene plan.",
    credits: 10,
  },
];

/**
 * OutcomeList Composite Stories
 *
 * Displays a Computer builder's executable outcomes with per-run credit costs.
 *
 * ## Features
 * - Lists outcomes with name, description, and credit badge ("N credits / run")
 * - Optional interactive selection state
 * - Clean card container with header and icon accents
 * - Empty state representation
 */
const meta = {
  title: "Composites/OutcomeList",
  component: OutcomeList,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    outcomes: sampleOutcomes,
    onSelectOutcome: fn(),
  },
} satisfies Meta<typeof OutcomeList>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default view with standard outcome catalog and credit prices.
 */
export const Default: Story = {
  args: {
    title: "Computer Outcomes",
    description: "Every execution consumes credits based on compute intensity.",
    outcomes: sampleOutcomes,
  },
};

/**
 * Interactive selection mode with an outcome pre-selected.
 */
export const Selectable: Story = {
  args: {
    title: "Select an Outcome to Run",
    outcomes: sampleOutcomes,
    selectedOutcomeCode: "render-scene",
  },
};

/**
 * Empty state when no outcomes are defined for this builder.
 */
export const Empty: Story = {
  args: {
    outcomes: [],
  },
};
