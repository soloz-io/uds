"use client";

import { WorkflowToolbar, WorkflowToolbarActions } from "@/components/composites/WorkflowToolbar";
import { WorkflowCanvas } from "@/components/blocks/WorkflowCanvas";
import type { WorkflowNode, WorkflowEdge } from "@/components/blocks/WorkflowCanvas";
import type { ToolbarAction, WorkflowVersion } from "@/components/composites/WorkflowToolbar";
import type { Connection, NodeChange, EdgeChange } from "@xyflow/react";
import { cn } from "@/lib/utils";

export interface NodeEditorProps {
  // Toolbar — left
  workflowName?: string;
  versions?: WorkflowVersion[];
  currentVersionId?: string;
  onVersionSelect?: (versionId: string) => void;

  // Canvas
  nodes?: WorkflowNode[];
  edges?: WorkflowEdge[];
  onNodesChange?: (changes: NodeChange[]) => void;
  onEdgesChange?: (changes: EdgeChange[]) => void;
  onConnect?: (connection: Connection) => void;
  onNodeClick?: (event: React.MouseEvent, node: WorkflowNode) => void;
  onEdgeClick?: (event: React.MouseEvent, edge: WorkflowEdge) => void;

  // Toolbar — right actions
  isSaving?: boolean;
  hasUnsavedChanges?: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;

  /** Extra toolbar action groups prepended before the default undo/redo/save buttons. */
  extraActions?: ToolbarAction[][];

  showMinimap?: boolean;
  interactive?: boolean;
  className?: string;
}

export function NodeEditor({
  workflowName,
  versions,
  currentVersionId,
  onVersionSelect,
  nodes = [],
  edges = [],
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onEdgeClick,
  isSaving = false,
  hasUnsavedChanges = false,
  canUndo = false,
  canRedo = false,
  onSave,
  onUndo,
  onRedo,
  extraActions,
  showMinimap,
  interactive = false,
  className,
}: NodeEditorProps) {
  const defaultActionGroups: ToolbarAction[][] = [
    [
      { id: "undo", icon: "undo-2", title: "Undo", onClick: onUndo, disabled: !canUndo },
      { id: "redo", icon: "redo-2", title: "Redo", onClick: onRedo, disabled: !canRedo },
      { id: "save", icon: "save", title: "Save", onClick: onSave, loading: isSaving, indicator: hasUnsavedChanges },
    ],
  ];

  const allActionGroups = extraActions
    ? [...extraActions, ...defaultActionGroups]
    : defaultActionGroups;

  return (
    <div
      className={cn("relative h-screen w-full", className)}
      data-testid="workflow-builder"
    >
      <WorkflowCanvas
        className="h-full w-full"
        edges={edges}
        interactive={interactive}
        nodes={nodes}
        showMinimap={showMinimap}
        topLeft={
          <WorkflowToolbar
            currentVersionId={currentVersionId}
            versions={versions}
            workflowName={workflowName}
            onVersionSelect={onVersionSelect}
          />
        }
        topRight={
          <WorkflowToolbarActions actionGroups={allActionGroups} />
        }
        onConnect={onConnect}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
      />
    </div>
  );
}
