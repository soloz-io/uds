/**
 * Mock data for NodeEditor stories and tests
 *
 * Reusable mock data imported by:
 * - NodeEditor.stories.tsx
 * - NodeEditor.behaviors.stories.tsx
 */

import type { WorkflowNode, WorkflowEdge } from "@/components/blocks/WorkflowCanvas";
import type { WorkflowVersion } from "@/components/composites/WorkflowToolbar";

export const mockVersions: WorkflowVersion[] = [
  { id: "v1", label: "v1" },
  { id: "v2", label: "v2" },
  { id: "v3", label: "v3" },
  { id: "v4", label: "v4" },
];

export const mockNodes: WorkflowNode[] = [
  {
    id: "1",
    type: "transition",
    position: { x: 300, y: 50 },
    data: { label: "Start", type: "transition", status: "idle" },
  },
  {
    id: "2",
    type: "state",
    position: { x: 300, y: 150 },
    data: { label: "Approve Order", description: "Review and approve", type: "state", status: "idle" },
  },
];

export const mockEdges: WorkflowEdge[] = [
  { id: "e1-2", source: "1", target: "2", type: "animated" },
];

export const mockSpatialNodes: WorkflowNode[] = [
  // 1. Key Partners (Parent Container)
  {
    id: "cp",
    type: "spatialContainer",
    position: { x: 40, y: 40 },
    style: { width: 280, height: 380 },
    data: {
      label: "Key Partners",
      description: "Strategic alliances, cloud providers & integrations",
      type: "spatialContainer",
      themeColor: "blue",
      variant: "extruded3d",
      icon: "handshake",
      badgeText: "2 Vendors",
      items: [
        { id: "cp-1", label: "AWS Cloud Infrastructure", description: "Compute & Storage" },
        { id: "cp-2", label: "Stripe Payments", description: "Billing Gateway" },
      ],
    },
  },

  // 2. Key Activities (Parent Container)
  {
    id: "ka",
    type: "spatialContainer",
    position: { x: 350, y: 40 },
    style: { width: 280, height: 180 },
    data: {
      label: "Key Activities",
      description: "Platform core development & AI training",
      type: "spatialContainer",
      themeColor: "emerald",
      variant: "extruded3d",
      icon: "activity",
      badgeText: "Engineering",
      items: [
        { id: "ka-1", label: "LLM Fine-tuning", description: "Model Optimization" },
      ],
    },
  },

  // 3. Key Resources (Parent Container)
  {
    id: "kr",
    type: "spatialContainer",
    position: { x: 350, y: 250 },
    style: { width: 280, height: 180 },
    data: {
      label: "Key Resources",
      description: "Proprietary IP & engineering talent",
      type: "spatialContainer",
      themeColor: "emerald",
      variant: "extruded3d",
      icon: "database",
      badgeText: "Assets",
      items: [
        { id: "kr-1", label: "Agentic Architecture IP", description: "Core Engine" },
      ],
    },
  },

  // 4. Value Propositions (Parent Container)
  {
    id: "vp",
    type: "spatialContainer",
    position: { x: 660, y: 40 },
    style: { width: 300, height: 380 },
    data: {
      label: "Value Propositions",
      description: "Core products and automated design system solutions",
      type: "spatialContainer",
      themeColor: "indigo",
      variant: "extruded3d",
      icon: "box",
      badgeText: "Core Offerings",
      items: [
        { id: "vp-1", label: "Autonomous Node Editor", description: "Spatial & Canvas UI" },
        { id: "vp-2", label: "AI Design System", description: "Layered Governance" },
        { id: "vp-3", label: "Multi-Agent Canvas", description: "Orchestration Pipeline" },
      ],
    },
  },

  // 5. Customer Relationships (Parent Container)
  {
    id: "cr",
    type: "spatialContainer",
    position: { x: 990, y: 40 },
    style: { width: 300, height: 180 },
    data: {
      label: "Customer Relationships",
      description: "Self-service onboarding & dedicated support",
      type: "spatialContainer",
      themeColor: "purple",
      variant: "extruded3d",
      icon: "heart",
      badgeText: "High Touch",
      items: [
        { id: "cr-1", label: "Dedicated Account Lead", description: "Enterprise SLAs" },
      ],
    },
  },

  // 6. Channels (Parent Container)
  {
    id: "ch",
    type: "spatialContainer",
    position: { x: 990, y: 250 },
    style: { width: 300, height: 180 },
    data: {
      label: "Channels",
      description: "Direct web IDE, API endpoints & SDK",
      type: "spatialContainer",
      themeColor: "amber",
      variant: "extruded3d",
      icon: "truck",
      badgeText: "Distribution",
      items: [
        { id: "ch-1", label: "Cloud Web IDE", description: "Direct Browser" },
      ],
    },
  },

  // 7. Customer Segments (Parent Container)
  {
    id: "cs",
    type: "spatialContainer",
    position: { x: 1320, y: 40 },
    style: { width: 280, height: 380 },
    data: {
      label: "Customer Segments",
      description: "Target enterprise teams and AI developers",
      type: "spatialContainer",
      themeColor: "purple",
      variant: "extruded3d",
      icon: "users",
      badgeText: "Enterprise B2B",
      items: [
        { id: "cs-1", label: "SaaS Product Teams", description: "Designers & Engineers" },
      ],
    },
  },

  // 8. Cost Structure (Parent Container)
  {
    id: "cost",
    type: "spatialContainer",
    position: { x: 40, y: 465 },
    style: { width: 760, height: 160 },
    data: {
      label: "Cost Structure",
      description: "Fixed compute, GPU training clusters & salary overhead",
      type: "spatialContainer",
      themeColor: "rose",
      variant: "extruded3d",
      icon: "wallet",
      badgeText: "$150k / mo",
      items: [
        { id: "cost-1", label: "GPU Inference Costs", description: "Compute Infrastructure" },
        { id: "cost-2", label: "R&D Licensing", description: "Proprietary models" },
      ],
    },
  },

  // 9. Revenue Streams (Parent Container)
  {
    id: "rev",
    type: "spatialContainer",
    position: { x: 840, y: 465 },
    style: { width: 760, height: 160 },
    data: {
      label: "Revenue Streams",
      description: "Enterprise licenses, seats & API token usage",
      type: "spatialContainer",
      themeColor: "cyan",
      variant: "extruded3d",
      icon: "wallet",
      badgeText: "ARR $2.4M",
      items: [
        { id: "rev-1", label: "Enterprise Annual Seat License", description: "Per-user pricing" },
        { id: "rev-2", label: "API Usage Metering", description: "Pay-as-you-go" },
      ],
    },
  },
];

export const mockSpatialEdges: WorkflowEdge[] = [
  { id: "e-ka-vp", source: "ka", target: "vp", type: "animated" },
  { id: "e-vp-cr", source: "vp", target: "cr", type: "animated" },
  { id: "e-cr-cs", source: "cr", target: "cs", type: "animated" },
  { id: "e-vp-ch", source: "vp", target: "ch", type: "straight" },
  { id: "e-ch-cs", source: "ch", target: "cs", type: "animated" },
];

