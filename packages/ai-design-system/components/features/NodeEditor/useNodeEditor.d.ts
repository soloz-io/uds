import type { Connection, NodeChange, EdgeChange } from "@xyflow/react";
import type { WorkflowNode, WorkflowEdge } from "@/components/blocks/WorkflowCanvas";
import type { WorkflowVersion } from "@/components/composites/WorkflowToolbar";

export type { WorkflowVersion };

export interface UseNodeEditorReturn {
  // Workflow state
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  workflowName: string;
  workflowVisibility: "public" | "private";

  // Version state
  versions: WorkflowVersion[];
  currentVersionId: string;
  onVersionSelect: (versionId: string) => void;

  // UI state
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  canUndo: boolean;
  canRedo: boolean;

  // Canvas handlers
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  // Toolbar actions
  onSave: () => void;
  onCancel: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onWorkflowSelect: (workflowId: string) => void;

  // Workflow list
  workflows: Array<{ id: string; name: string }>;
  currentWorkflowId?: string;
}

export type UseNodeEditor = (workflowId?: string) => UseNodeEditorReturn;

export function useNodeEditor(workflowId?: string): UseNodeEditorReturn {
  throw new Error("useNodeEditor must be implemented by the consuming application");
}
