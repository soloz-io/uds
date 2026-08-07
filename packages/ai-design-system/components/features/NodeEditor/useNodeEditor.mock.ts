import { useState, useCallback } from "react";
import { applyNodeChanges, applyEdgeChanges, addEdge } from "@xyflow/react";
import type { Connection, NodeChange, EdgeChange } from "@xyflow/react";
import type { WorkflowNode, WorkflowEdge } from "@/components/blocks/WorkflowCanvas";
import type { UseNodeEditorReturn } from "./useNodeEditor";

const mockNodes: WorkflowNode[] = [
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
  {
    id: "3",
    type: "transition",
    position: { x: 300, y: 250 },
    data: { label: "Order Approved", type: "transition", status: "idle" },
  },
];

const mockEdges: WorkflowEdge[] = [
  { id: "e1-2", source: "1", target: "2", type: "animated" },
  { id: "e2-3", source: "2", target: "3", type: "animated" },
];

const mockWorkflows = [
  { id: "wf-1", name: "Order Processing Workflow" },
  { id: "wf-2", name: "User Onboarding" },
  { id: "wf-3", name: "Payment Flow" },
];

const mockVersions = [
  { id: "v1", label: "v1" },
  { id: "v2", label: "v2" },
  { id: "v3", label: "v3" },
  { id: "v4", label: "v4" },
];

export function useNodeEditorMock(workflowId?: string): UseNodeEditorReturn {
  const [nodes, setNodes] = useState<WorkflowNode[]>(mockNodes);
  const [edges, setEdges] = useState<WorkflowEdge[]>(mockEdges);
  const [workflowName, setWorkflowName] = useState("Order Processing Workflow");
  const [currentVersionId, setCurrentVersionId] = useState("v4");
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds) as WorkflowNode[]);
    setHasUnsavedChanges(true);
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds) as WorkflowEdge[]);
    setHasUnsavedChanges(true);
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge({ ...connection, type: "animated" }, eds) as WorkflowEdge[]);
    setHasUnsavedChanges(true);
  }, []);

  const onSave = useCallback(async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    setHasUnsavedChanges(false);
  }, []);

  const onCancel = useCallback(() => {
    setNodes(mockNodes);
    setEdges(mockEdges);
    setHasUnsavedChanges(false);
  }, []);

  const onVersionSelect = useCallback((versionId: string) => {
    setCurrentVersionId(versionId);
  }, []);

  const onWorkflowSelect = useCallback((id: string) => {
    if (id === "new") {
      setWorkflowName("New Workflow");
      setNodes([]);
      setEdges([]);
    } else {
      const wf = mockWorkflows.find((w) => w.id === id);
      if (wf) setWorkflowName(wf.name);
    }
  }, []);

  const onPublish = useCallback(() => {
    console.warn("useNodeEditor.mock: onPublish not implemented");
  }, []);

  return {
    nodes,
    edges,
    workflowName,
    workflowVisibility: "private",
    versions: mockVersions,
    currentVersionId,
    onVersionSelect,
    onPublish,
    isSaving,
    hasUnsavedChanges,
    canUndo: false,
    canRedo: false,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onSave,
    onCancel,
    onUndo: () => {},
    onRedo: () => {},
    onWorkflowSelect,
    workflows: mockWorkflows,
    currentWorkflowId: workflowId ?? "wf-1",
  };
}
