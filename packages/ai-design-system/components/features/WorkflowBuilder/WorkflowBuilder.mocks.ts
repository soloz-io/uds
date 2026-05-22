/**
 * Mock data for WorkflowBuilder stories and tests
 *
 * Reusable mock data imported by:
 * - WorkflowBuilder.stories.tsx
 * - WorkflowBuilder.behaviors.stories.tsx
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
