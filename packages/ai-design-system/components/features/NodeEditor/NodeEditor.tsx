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

export interface NodeStatusEntry {
  nodeId: string;
  status: string;
}

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

  /** Runtime node statuses from the API. NodeEditor derives highlights internally. */
  nodeStatuses?: NodeStatusEntry[];
  /** Per-node actions */
  nodeActions?: Record<string, ToolbarAction[]>;
}

function statusToGlow(status: string): string | null {
  switch (status) {
    case 'running': return 'active';
    case 'pending_hitl': return 'pending';
    case 'success':
    case 'completed': return 'done';
    case 'error':
    case 'failed': return 'error';
    default: return null;
  }
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
  nodeStatuses,
  nodeActions,
}: NodeEditorProps) {
  const highlightedNodes = useMemo(
    () => {
      const statusGlows: Record<string, string> = {};
      for (const ns of nodeStatuses ?? []) {
        const g = statusToGlow(ns.status);
        if (g) statusGlows[ns.nodeId] = g;
      }

      return nodes.map((n: WorkflowNode) => {
        const glow =
          statusGlows[n.id] ??
          (nodeActions?.[n.id]?.some((a) => a.switcher) ? 'pending' : undefined) ??
          statusToGlow(n.data?.status ?? '');

        const actions = nodeActions?.[n.id];

        if (!glow && !actions) return n;
        return {
          ...n,
          data: {
            ...n.data,
            actions,
          },
          style: { ...(n.style ?? {}), boxShadow: glow ? GLOW[glow] : undefined },
        };
      });
    },
    [nodes, nodeStatuses, nodeActions],
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
