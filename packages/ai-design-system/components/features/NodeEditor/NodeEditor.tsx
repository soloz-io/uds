"use client";

import { useMemo } from "react";
import { WorkflowToolbar, WorkflowToolbarActions } from "@/components/composites/WorkflowToolbar";
import { WorkflowCanvas } from "@/components/blocks/WorkflowCanvas";
import { AppBreadcrumb } from "@/components/composites/AppBreadcrumb";
import type { WorkflowNode, WorkflowEdge } from "@/components/blocks/WorkflowCanvas";
import type { ToolbarAction, WorkflowVersion } from "@/components/composites/WorkflowToolbar";
import type { Connection, NodeChange, EdgeChange } from "@xyflow/react";
import { cn } from "@/lib/utils";

export type HighlightStatus = "active" | "pending" | "done" | "error";

const GLOW: Record<HighlightStatus, string> = {
  active: "0 0 14px 5px rgba(99, 102, 241, 0.9)",
  pending: "0 0 14px 5px rgba(251, 146, 60, 1)",
  done: "0 0 10px 3px rgba(34, 197, 94, 0.75)",
  error: "0 0 14px 5px rgba(239, 68, 68, 0.9)",
};

export interface NodeStatusEntry {
  nodeId: string;
  status: string;
}

/** One level of a graph hierarchy shown in the breadcrumb. */
export interface NodeEditorBreadcrumb {
  id: string;
  label: string;
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
  /** An explicit open action on a node (double-click), distinct from selecting it */
  onNodeDoubleClick?: (event: React.MouseEvent, node: WorkflowNode) => void;
  onEdgeClick?: (event: React.MouseEvent, edge: WorkflowEdge) => void;

  /**
   * Where the viewer is in a hierarchy of graphs, outermost first. The last
   * entry is the current graph; selecting an earlier one returns to it.
   */
  breadcrumbs?: NodeEditorBreadcrumb[];
  onBreadcrumbSelect?: (index: number) => void;

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
  panOnDrag?: boolean | number[];
  selectionOnDrag?: boolean;
  hideDefaultActions?: boolean;
  hideWorkflowName?: boolean;
  className?: string;

  /** Runtime node statuses from the API. NodeEditor derives highlights internally. */
  nodeStatuses?: NodeStatusEntry[];
  /** Per-node actions */
  nodeActions?: Record<string, ToolbarAction[]>;

  /** Consumer-provided overlay rendered in the canvas top-center (e.g. a device-preview toolbar). */
  topCenter?: React.ReactNode;

  /** Forwarded to WorkflowCanvas — change this value to trigger a fitView(). */
  fitViewSignal?: string | number;
}

function statusToGlow(status: string): HighlightStatus | null {
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
  onNodeDoubleClick,
  onEdgeClick,
  breadcrumbs,
  onBreadcrumbSelect,
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
  panOnDrag = false,
  selectionOnDrag,
  hideDefaultActions = false,
  hideWorkflowName = false,
  className,
  nodeStatuses,
  nodeActions,
  topCenter,
  fitViewSignal,
}: NodeEditorProps) {
  const highlightedNodes = useMemo(
    () => {
      const statusGlows: Record<string, HighlightStatus> = {};
      for (const ns of nodeStatuses ?? []) {
        const g = statusToGlow(ns.status);
        if (g) statusGlows[ns.nodeId] = g;
      }

      return nodes.map((n: WorkflowNode) => {
        const glow: HighlightStatus | undefined =
          statusGlows[n.id] ??
          (nodeActions?.[n.id]?.some((a) => a.switcher) ? 'pending' : undefined) ??
          (statusToGlow(n.data?.status ?? '') || undefined);

        const actions = nodeActions?.[n.id];

        if (!glow && !actions) return n;
        return {
          ...n,
          data: {
            ...n.data,
            actions,
            highlightStatus: glow,
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

  const showTopLeftToolbar = (!hideWorkflowName && workflowName) || (versions && versions.length > 0);
  const hasBreadcrumbs = Boolean(breadcrumbs && breadcrumbs.length > 0);

  return (
    <div
      className={cn("relative h-screen w-full", className)}
      data-testid="workflow-builder"
    >
      <WorkflowCanvas
        className="h-full w-full"
        edges={edges}
        interactive={interactive}
        panOnDrag={panOnDrag}
        selectionOnDrag={selectionOnDrag}
        nodes={highlightedNodes}
        showMinimap={showMinimap}
        fitViewSignal={fitViewSignal}
        topLeft={
          showTopLeftToolbar || hasBreadcrumbs ? (
            <div className="flex flex-col items-start gap-2">
              {hasBreadcrumbs && (
                <AppBreadcrumb
                  data-testid="node-editor-breadcrumb"
                  className="rounded-md border border-border bg-card px-3 py-1.5 text-xs"
                  items={breadcrumbs!.map((crumb, index) => ({
                    label: crumb.label,
                    onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
                      event.preventDefault();
                      onBreadcrumbSelect?.(index);
                    },
                  }))}
                />
              )}
              {showTopLeftToolbar && (
                <WorkflowToolbar
                  currentVersionId={currentVersionId}
                  versions={versions}
                  workflowName={workflowName}
                  hideWorkflowName={hideWorkflowName || hasBreadcrumbs}
                  onVersionSelect={onVersionSelect}
                />
              )}
            </div>
          ) : undefined
        }
        topRight={
          <WorkflowToolbarActions actionGroups={allActionGroups} />
        }
        topCenter={topCenter}
        onConnect={onConnect}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={onNodeDoubleClick}
        onEdgeClick={onEdgeClick}
      />
    </div>
  );
}
