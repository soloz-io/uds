import type { Meta, StoryObj } from "@storybook/react";
import { ReactFlowProvider } from "@xyflow/react";
import { SpecialistNode } from "./SpecialistNode";
import "@xyflow/react/dist/style.css";

const meta = {
  title: "Composites/SpecialistNode",
  component: SpecialistNode,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ReactFlowProvider>
        <div className="p-6">
          <Story />
        </div>
      </ReactFlowProvider>
    ),
  ],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof SpecialistNode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "brand-discovery-agent",
    type: "specialist",
    data: {
      label: "Brand Discovery",
      description: "Audience persona and brand guidelines",
      type: "specialist",
      skills: ["brand-discovery"],
      tools: ["read_file", "write_file", "load_skill"],
      status: "idle",
    },
    selected: false,
    dragging: false,
    zIndex: 0,
    isConnectable: true,
    positionAbsoluteX: 0,
    positionAbsoluteY: 0,
  },
};

export const WithApprovalAndOverflow: Story = {
  args: {
    ...Default.args,
    id: "scene-renderer",
    data: {
      label: "Scene Renderer",
      description: "GPU jobs and video slice compilation",
      type: "specialist",
      skills: ["video-render", "scene-qa", "audio-sync", "subtitle-burn"],
      tools: ["comfyui/submit", "s3-upload", "videoCompile", "ffprobe"],
      interruptOn: { "comfyui/submit": { allowed_decisions: ["approve", "reject"] } },
      status: "idle",
    },
    selected: true,
  },
};
