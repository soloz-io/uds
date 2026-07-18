"use client";

import { useMemo } from "react";
import { WorkflowToolbar, WorkflowToolbarActions } from "@/components/composites/WorkflowToolbar";
import { WorkflowCanvas } from "@/components/blocks/WorkflowCanvas";
import type { WorkflowNode, WorkflowEdge } from "@/components/blocks/WorkflowCanvas";
import type { ToolbarAction, WorkflowVersion } from "@/components/composites/WorkflowToolbar";
import type { Connection, NodeChange, EdgeChange } from "@xyflow/react";
import { cn } from "@/lib/utils";

const GLOW: Record<string, string> = {
  active: "0 0 14px 5px rgba(99, 102, 241, 0.9)",
  pending: "0 0 14px 5px rgba(251, 146, 60, 1)",
  done: "0 0 10px 3px rgba(34, 197, 94, 0.75)",
  error: "0 0 14px 5px rgba(239, 68, 68, 0.9)",
};

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
  hideDefaultActions?: boolean;
  className?: string;

  /** Per-node highlight states: { [nodeId]: 'active' | 'pending' | 'done' | 'error' } */
  nodeHighlights?: Record<string, string>;
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
  hideDefaultActions = false,
  className,
  nodeHighlights,
}: NodeEditorProps) {
  const highlightedNodes = useMemo(
    () =>
      nodes.map((n: WorkflowNode) => {
        const glow = nodeHighlights?.[n.id];
        if (!glow) return n;
        return {
          ...n,
          style: { ...(n.style ?? {}), boxShadow: GLOW[glow] },
        };
      }),
    [nodes, nodeHighlights],
  );
  const defaultActionGroups: ToolbarAction[][] = [
    [
      { id: "undo", icon: "undo-2", title: "Undo", onClick: onUndo, disabled: !canUndo },
      { id: "redo", icon: "redo-2", title: "Redo", onClick: onRedo, disabled: !canRedo },
      { id: "save", icon: "save", title: "Save", onClick: onSave, loading: isSaving, indicator: hasUnsavedChanges },
    ],
  ];

  let allActionGroups: ToolbarAction[][] = [];
  if (extraActions) allActionGroups = [...allActionGroups, ...extraActions];
  if (!hideDefaultActions) allActionGroups = [...allActionGroups, ...defaultActionGroups];

  return (
    <div
      className={cn("relative h-screen w-full", className)}
      data-testid="workflow-builder"
    >
      <WorkflowCanvas
        className="h-full w-full"
        edges={edges}
        interactive={interactive}
        nodes={highlightedNodes}
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
