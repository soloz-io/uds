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
    style: { width: 260, height: 380 },
    data: {
      label: "Key Partners",
      description: "Strategic alliances, cloud providers & integrations",
      type: "spatialContainer",
      themeColor: "blue",
      variant: "extruded3d",
      icon: "handshake",
      badgeText: "2 Vendors",
    },
  },
  {
    id: "cp-1",
    type: "state",
    parentId: "cp",
    extent: "parent",
    position: { x: 20, y: 60 },
    data: { label: "AWS Cloud Infrastructure", description: "Compute & Storage", type: "state", status: "success" },
  },
  {
    id: "cp-2",
    type: "state",
    parentId: "cp",
    extent: "parent",
    position: { x: 20, y: 180 },
    data: { label: "Stripe Payments", description: "Billing Gateway", type: "state", status: "success" },
  },

  // 2. Key Activities (Parent Container)
  {
    id: "ka",
    type: "spatialContainer",
    position: { x: 330, y: 40 },
    style: { width: 260, height: 180 },
    data: {
      label: "Key Activities",
      description: "Platform core development & AI training",
      type: "spatialContainer",
      themeColor: "emerald",
      variant: "extruded3d",
      icon: "activity",
      badgeText: "Engineering",
    },
  },
  {
    id: "ka-1",
    type: "transition",
    parentId: "ka",
    extent: "parent",
    position: { x: 20, y: 60 },
    data: { label: "LLM Fine-tuning", type: "transition", status: "running" },
  },

  // 3. Key Resources (Parent Container)
  {
    id: "kr",
    type: "spatialContainer",
    position: { x: 330, y: 240 },
    style: { width: 260, height: 180 },
    data: {
      label: "Key Resources",
      description: "Proprietary IP & engineering talent",
      type: "spatialContainer",
      themeColor: "emerald",
      variant: "extruded3d",
      icon: "database",
      badgeText: "Assets",
    },
  },
  {
    id: "kr-1",
    type: "state",
    parentId: "kr",
    extent: "parent",
    position: { x: 20, y: 60 },
    data: { label: "Agentic Architecture IP", description: "Core Engine", type: "state", status: "idle" },
  },

  // 4. Value Propositions (Parent Container)
  {
    id: "vp",
    type: "spatialContainer",
    position: { x: 620, y: 40 },
    style: { width: 280, height: 380 },
    data: {
      label: "Value Propositions",
      description: "Core products and automated design system solutions",
      type: "spatialContainer",
      themeColor: "indigo",
      variant: "extruded3d",
      icon: "box",
      badgeText: "Core Offerings",
    },
  },
  {
    id: "vp-1",
    type: "state",
    parentId: "vp",
    extent: "parent",
    position: { x: 20, y: 60 },
    data: { label: "Autonomous Node Editor", description: "Spatial & Canvas UI", type: "state", status: "running" },
  },
  {
    id: "vp-2",
    type: "state",
    parentId: "vp",
    extent: "parent",
    position: { x: 20, y: 180 },
    data: { label: "AI Design System", description: "Layered Governance", type: "state", status: "success" },
  },

  // 5. Customer Relationships (Parent Container)
  {
    id: "cr",
    type: "spatialContainer",
    position: { x: 930, y: 40 },
    style: { width: 260, height: 180 },
    data: {
      label: "Customer Relationships",
      description: "Self-service onboarding & dedicated support",
      type: "spatialContainer",
      themeColor: "purple",
      variant: "glassmorphism",
      icon: "heart",
      badgeText: "High Touch",
    },
  },
  {
    id: "cr-1",
    type: "transition",
    parentId: "cr",
    extent: "parent",
    position: { x: 20, y: 60 },
    data: { label: "Dedicated Account Lead", type: "transition", status: "idle" },
  },

  // 6. Channels (Parent Container)
  {
    id: "ch",
    type: "spatialContainer",
    position: { x: 930, y: 240 },
    style: { width: 260, height: 180 },
    data: {
      label: "Channels",
      description: "Direct web IDE, API endpoints & SDK",
      type: "spatialContainer",
      themeColor: "amber",
      variant: "extruded3d",
      icon: "truck",
      badgeText: "Distribution",
    },
  },
  {
    id: "ch-1",
    type: "state",
    parentId: "ch",
    extent: "parent",
    position: { x: 20, y: 60 },
    data: { label: "Cloud Web IDE", description: "Direct Browser", type: "state", status: "idle" },
  },

  // 7. Customer Segments (Parent Container)
  {
    id: "cs",
    type: "spatialContainer",
    position: { x: 1220, y: 40 },
    style: { width: 260, height: 380 },
    data: {
      label: "Customer Segments",
      description: "Target enterprise teams and AI developers",
      type: "spatialContainer",
      themeColor: "purple",
      variant: "extruded3d",
      icon: "users",
      badgeText: "Enterprise B2B",
    },
  },
  {
    id: "cs-1",
    type: "state",
    parentId: "cs",
    extent: "parent",
    position: { x: 20, y: 60 },
    data: { label: "SaaS Product Teams", description: "Designers & Engineers", type: "state", status: "idle" },
  },

  // 8. Cost Structure (Parent Container)
  {
    id: "cost",
    type: "spatialContainer",
    position: { x: 40, y: 440 },
    style: { width: 700, height: 160 },
    data: {
      label: "Cost Structure",
      description: "Fixed compute, GPU training clusters & salary overhead",
      type: "spatialContainer",
      themeColor: "rose",
      variant: "flat",
      icon: "wallet",
      badgeText: "$150k / mo",
    },
  },
  {
    id: "cost-1",
    type: "transition",
    parentId: "cost",
    extent: "parent",
    position: { x: 20, y: 55 },
    data: { label: "GPU Inference Costs", type: "transition", status: "idle" },
  },
  {
    id: "cost-2",
    type: "state",
    parentId: "cost",
    extent: "parent",
    position: { x: 360, y: 55 },
    data: { label: "R&D Licensing", description: "Proprietary models", type: "state", status: "idle" },
  },

  // 9. Revenue Streams (Parent Container)
  {
    id: "rev",
    type: "spatialContainer",
    position: { x: 770, y: 440 },
    style: { width: 710, height: 160 },
    data: {
      label: "Revenue Streams",
      description: "Enterprise licenses, seats & API token usage",
      type: "spatialContainer",
      themeColor: "cyan",
      variant: "extruded3d",
      icon: "wallet",
      badgeText: "ARR $2.4M",
    },
  },
  {
    id: "rev-1",
    type: "state",
    parentId: "rev",
    extent: "parent",
    position: { x: 20, y: 55 },
    data: { label: "Enterprise Annual Seat License", description: "Per-user pricing", type: "state", status: "success" },
  },
  {
    id: "rev-2",
    type: "transition",
    parentId: "rev",
    extent: "parent",
    position: { x: 370, y: 55 },
    data: { label: "API Usage Metering", type: "transition", status: "idle" },
  },
];

export const mockSpatialEdges: WorkflowEdge[] = [
  { id: "e-ka-vp", source: "ka", target: "vp", type: "animated" },
  { id: "e-vp-cr", source: "vp", target: "cr", type: "animated" },
  { id: "e-cr-cs", source: "cr", target: "cs", type: "animated" },
  { id: "e-vp-ch", source: "vp", target: "ch", type: "straight" },
  { id: "e-ch-cs", source: "ch", target: "cs", type: "animated" },
];

